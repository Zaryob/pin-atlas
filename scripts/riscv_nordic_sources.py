"""Build the WCH CH32V003, ESP32-C6 QFN-32 and Nordic nRF52840 DK profiles.

The tables below are hand-recorded from the cited documents. Where a locked copy
exists the builder opens it and checks the table against it:

- CH32V003F4P6: every pin number, name and function is looked up in Table 2-1
  of the locked datasheet (TSSOP20 column).
- ESP32-C6 QFN-32: every pin number, name and IO MUX, LP and analog function is
  looked up in Tables 2-2, 2-5, 2-7 and 2-9 of the locked datasheet. The
  GPIO-matrix signals offered on every GPIO are a fixed list, not checked.
- CH32V003-EVT: the board description is checked on the locked page; the header
  order is read from its drawing by eye.
- nRF52840 DK: nothing is checked. Nordic publishes the guide as HTML only, so
  the manifest records the document without a locked copy.
"""
import copy
import re

import pdfplumber

CH32V003_TSSOP20 = [
    # TSSOP-20 pin, name, type, functions as (name, group).
    (1, 'PD4', 'GPIO', [('A7', 'ADC'), ('UCK', 'USART'), ('T2CH1ETR', 'TIMER'), ('OPO', 'SYSTEM'), ('T1ETR', 'TIMER'), ('T1CH4', 'PWM')]),
    (2, 'PD5', 'GPIO', [('UTX', 'USART'), ('A5', 'ADC'), ('T2CH4', 'PWM'), ('URX', 'USART')]),
    (3, 'PD6', 'GPIO', [('URX', 'USART'), ('A6', 'ADC'), ('T2CH3', 'PWM'), ('UTX', 'USART')]),
    (4, 'PD7', 'GPIO', [('NRST', 'SYSTEM'), ('T2CH4', 'PWM'), ('OPP1', 'ANALOG'), ('UCK', 'USART')]),
    (5, 'PA1', 'GPIO', [('OSCI', 'CLOCK'), ('A1', 'ADC'), ('T1CH2', 'PWM'), ('OPN0', 'ANALOG')]),
    (6, 'PA2', 'GPIO', [('OSCO', 'CLOCK'), ('A0', 'ADC'), ('T1CH2N', 'PWM'), ('OPP0', 'ANALOG'), ('AETR2', 'TIMER')]),
    (7, 'VSS', 'GND', []),
    (8, 'PD0', 'GPIO', [('T1CH1N', 'PWM'), ('OPN1', 'ANALOG'), ('SDA', 'I2C'), ('UTX', 'USART')]),
    (9, 'VDD', 'POWER', []),
    (10, 'PC0', 'GPIO', [('T2CH3', 'PWM'), ('UTX', 'USART'), ('NSS', 'SPI'), ('T1CH3', 'PWM')]),
    (11, 'PC1', 'GPIO', [('SDA', 'I2C'), ('NSS', 'SPI'), ('T2CH4', 'PWM'), ('T2CH1ETR', 'TIMER'), ('T1BKIN', 'TIMER'), ('URX', 'USART')]),
    (12, 'PC2', 'GPIO', [('SCL', 'I2C'), ('URTS', 'USART'), ('T1BKIN', 'TIMER'), ('AETR', 'TIMER'), ('T2CH2', 'PWM'), ('T1ETR', 'TIMER')]),
    (13, 'PC3', 'GPIO', [('T1CH3', 'PWM'), ('T1CH1N', 'PWM'), ('UCTS', 'USART')]),
    (14, 'PC4', 'GPIO', [('A2', 'ADC'), ('T1CH4', 'PWM'), ('MCO', 'CLOCK'), ('T1CH2N', 'PWM'), ('T1CH1', 'PWM')]),
    (15, 'PC5', 'GPIO', [('SCK', 'SPI'), ('T1ETR', 'TIMER'), ('T2CH1ETR', 'TIMER'), ('SCL', 'I2C'), ('UCK', 'USART'), ('T1CH3', 'PWM')]),
    (16, 'PC6', 'GPIO', [('MOSI', 'SPI'), ('T1CH1', 'PWM'), ('T1CH3N', 'PWM'), ('UCTS', 'USART'), ('SDA', 'I2C')]),
    (17, 'PC7', 'GPIO', [('MISO', 'SPI'), ('T1CH2', 'PWM'), ('T2CH2', 'PWM'), ('URTS', 'USART')]),
    (18, 'PD1', 'GPIO', [('SWIO', 'SWD'), ('AETR2', 'TIMER'), ('T1CH3N', 'PWM'), ('SCL', 'I2C'), ('URX', 'USART')]),
    (19, 'PD2', 'GPIO', [('A3', 'ADC'), ('T1CH1', 'PWM'), ('T2CH3', 'PWM'), ('T1CH2N', 'PWM')]),
    (20, 'PD3', 'GPIO', [('A4', 'ADC'), ('T2CH2', 'PWM'), ('AETR', 'TIMER'), ('UCTS', 'USART'), ('T1CH4', 'PWM')]),
]

CH32V003_EVT_HEADERS = [
    # Connector, connector pin, CH32V003F4P6 package pin, diagram x, y, side.
    ('P1', 1, 1, 280, 140, 'left'),
    ('P1', 2, 2, 280, 175, 'left'),
    ('P1', 3, 3, 280, 210, 'left'),
    ('P1', 4, 4, 280, 245, 'left'),
    ('P1', 5, 5, 280, 280, 'left'),
    ('P1', 6, 6, 280, 315, 'left'),
    ('P1', 7, 7, 280, 350, 'left'),
    ('P1', 8, 8, 280, 385, 'left'),
    ('P1', 9, 9, 280, 420, 'left'),
    ('P1', 10, 10, 280, 455, 'left'),
    ('P2', 1, 11, 540, 140, 'right'),
    ('P2', 2, 12, 540, 175, 'right'),
    ('P2', 3, 13, 540, 210, 'right'),
    ('P2', 4, 14, 540, 245, 'right'),
    ('P2', 5, 15, 540, 280, 'right'),
    ('P2', 6, 16, 540, 315, 'right'),
    ('P2', 7, 17, 540, 350, 'right'),
    ('P2', 8, 18, 540, 385, 'right'),
    ('P2', 9, 19, 540, 420, 'right'),
    ('P2', 10, 20, 540, 455, 'right'),
]

ESP32_C6_MATRIX = [('UART1 RX', 'UART'), ('SPI2 MISO', 'SPI'), ('UART1 TX', 'UART'), ('SPI2 MOSI', 'SPI'), ('SPI2 SCK', 'SPI'), ('SPI2 CS', 'SPI'), ('I2C0 SDA', 'I2C'), ('I2C0 SCL', 'I2C'), ('LEDC PWM', 'PWM')]

ESP32_C6_QFN32 = [
    # QFN-32 pin, name, type, IO MUX and analog functions as (name, group).
    (1, 'ANT', 'SYSTEM', []),
    (2, 'VDDA3P3', 'POWER', []),
    (3, 'VDDA3P3', 'POWER', []),
    (4, 'CHIP_PU', 'SYSTEM', []),
    (5, 'VDDPST1', 'POWER', []),
    (6, 'GPIO0', 'GPIO', [('XTAL_32K_P', 'CLOCK'), ('LP_UART_DTRN', 'UART'), ('ADC1_CH0', 'ADC')]),
    (7, 'GPIO1', 'GPIO', [('XTAL_32K_N', 'CLOCK'), ('LP_UART_DSRN', 'UART'), ('ADC1_CH1', 'ADC')]),
    (8, 'GPIO2', 'GPIO', [('LP_UART_RTSN', 'UART'), ('ADC1_CH2', 'ADC'), ('FSPIQ', 'SPI')]),
    (9, 'GPIO3', 'GPIO', [('LP_UART_CTSN', 'UART'), ('ADC1_CH3', 'ADC')]),
    (10, 'GPIO4', 'GPIO', [('MTMS', 'JTAG'), ('LP_UART_RXD', 'UART'), ('ADC1_CH4', 'ADC'), ('FSPIHD', 'SPI')]),
    (11, 'GPIO5', 'GPIO', [('MTDI', 'JTAG'), ('LP_UART_TXD', 'UART'), ('ADC1_CH5', 'ADC'), ('FSPIWP', 'SPI')]),
    (12, 'GPIO6', 'GPIO', [('MTCK', 'JTAG'), ('LP_I2C_SDA', 'I2C'), ('ADC1_CH6', 'ADC'), ('FSPICLK', 'SPI')]),
    (13, 'GPIO7', 'GPIO', [('MTDO', 'JTAG'), ('LP_I2C_SCL', 'I2C'), ('FSPID', 'SPI')]),
    (14, 'GPIO8', 'GPIO', []),
    (15, 'GPIO9', 'GPIO', []),
    (16, 'GPIO12', 'GPIO', [('USB_D-', 'USB')]),
    (17, 'GPIO13', 'GPIO', [('USB_D+', 'USB')]),
    (18, 'GPIO14', 'GPIO', []),
    (19, 'GPIO15', 'GPIO', []),
    (20, 'VDDPST2', 'POWER', []),
    (21, 'GPIO16', 'GPIO', [('U0TXD', 'UART'), ('FSPICS0', 'SPI')]),
    (22, 'GPIO17', 'GPIO', [('U0RXD', 'UART'), ('FSPICS1', 'SPI')]),
    (23, 'GPIO18', 'GPIO', [('SDIO_CMD', 'SDIO'), ('FSPICS2', 'SPI')]),
    (24, 'GPIO19', 'GPIO', [('SDIO_CLK', 'SDIO'), ('FSPICS3', 'SPI')]),
    (25, 'GPIO20', 'GPIO', [('SDIO_DATA0', 'SDIO'), ('FSPICS4', 'SPI')]),
    (26, 'GPIO21', 'GPIO', [('SDIO_DATA1', 'SDIO'), ('FSPICS5', 'SPI')]),
    (27, 'GPIO22', 'GPIO', [('SDIO_DATA2', 'SDIO')]),
    (28, 'GPIO23', 'GPIO', [('SDIO_DATA3', 'SDIO')]),
    (29, 'VDDA1', 'POWER', []),
    (30, 'XTAL_N', 'SYSTEM', []),
    (31, 'XTAL_P', 'SYSTEM', []),
    (32, 'VDDA2', 'POWER', []),
]

NRF52840_DK_HEADERS = [
    # Connector, connector pin, label, type, nRF52840 port, functions as (name, group), diagram x, y, side.
    ('PWR', 1, 'NC', 'SYSTEM', None, [], 300, 220, 'left'),
    ('PWR', 2, 'IOREF', 'POWER', None, [], 300, 246, 'left'),
    ('PWR', 3, 'RESET', 'SYSTEM', 'P0.18', [('RESET', 'SYSTEM'), ('P0.18', 'GPIO')], 300, 272, 'left'),
    ('PWR', 4, '3V3', 'POWER', None, [], 300, 298, 'left'),
    ('PWR', 5, '5V', 'POWER', None, [], 300, 324, 'left'),
    ('PWR', 6, 'GND', 'GND', None, [], 300, 350, 'left'),
    ('PWR', 7, 'GND', 'GND', None, [], 300, 376, 'left'),
    ('PWR', 8, 'VIN', 'POWER', None, [], 300, 402, 'left'),
    ('ANALOG', 1, 'A0', 'GPIO', 'P0.03', [('AIN1', 'ADC'), ('PWM', 'PWM'), ('P0.03', 'GPIO')], 300, 480, 'left'),
    ('ANALOG', 2, 'A1', 'GPIO', 'P0.04', [('AIN2', 'ADC'), ('PWM', 'PWM'), ('P0.04', 'GPIO')], 300, 506, 'left'),
    ('ANALOG', 3, 'A2', 'GPIO', 'P0.28', [('AIN4', 'ADC'), ('PWM', 'PWM'), ('P0.28', 'GPIO')], 300, 532, 'left'),
    ('ANALOG', 4, 'A3', 'GPIO', 'P0.29', [('AIN5', 'ADC'), ('PWM', 'PWM'), ('P0.29', 'GPIO')], 300, 558, 'left'),
    ('ANALOG', 5, 'A4', 'GPIO', 'P0.30', [('AIN6', 'ADC'), ('PWM', 'PWM'), ('P0.30', 'GPIO')], 300, 584, 'left'),
    ('ANALOG', 6, 'A5', 'GPIO', 'P0.31', [('AIN7', 'ADC'), ('PWM', 'PWM'), ('P0.31', 'GPIO')], 300, 610, 'left'),
    ('DIGITAL', 1, 'D0', 'GPIO', 'P0.13', [('RX', 'UART'), ('PWM', 'PWM'), ('P0.13', 'GPIO')], 600, 612, 'right'),
    ('DIGITAL', 2, 'D1', 'GPIO', 'P0.14', [('TX', 'UART'), ('PWM', 'PWM'), ('P0.14', 'GPIO')], 600, 586, 'right'),
    ('DIGITAL', 3, 'D2', 'GPIO', 'P0.25', [('PWM', 'PWM'), ('P0.25', 'GPIO')], 600, 560, 'right'),
    ('DIGITAL', 4, 'D3', 'GPIO', 'P0.09', [('NFC1', 'SYSTEM'), ('PWM', 'PWM'), ('P0.09', 'GPIO')], 600, 534, 'right'),
    ('DIGITAL', 5, 'D4', 'GPIO', 'P0.10', [('NFC2', 'SYSTEM'), ('PWM', 'PWM'), ('P0.10', 'GPIO')], 600, 508, 'right'),
    ('DIGITAL', 6, 'D5', 'GPIO', 'P1.06', [('PWM', 'PWM'), ('P1.06', 'GPIO')], 600, 482, 'right'),
    ('DIGITAL', 7, 'D6', 'GPIO', 'P1.07', [('PWM', 'PWM'), ('P1.07', 'GPIO')], 600, 456, 'right'),
    ('DIGITAL', 8, 'D7', 'GPIO', 'P1.02', [('PWM', 'PWM'), ('P1.02', 'GPIO')], 600, 430, 'right'),
    ('DIGITAL', 9, 'D8', 'GPIO', 'P1.08', [('PWM', 'PWM'), ('P1.08', 'GPIO')], 600, 384, 'right'),
    ('DIGITAL', 10, 'D9', 'GPIO', 'P1.09', [('PWM', 'PWM'), ('P1.09', 'GPIO')], 600, 358, 'right'),
    ('DIGITAL', 11, 'D10', 'GPIO', 'P1.10', [('CS', 'SPI'), ('PWM', 'PWM'), ('P1.10', 'GPIO')], 600, 332, 'right'),
    ('DIGITAL', 12, 'D11', 'GPIO', 'P1.12', [('MOSI', 'SPI'), ('PWM', 'PWM'), ('P1.12', 'GPIO')], 600, 306, 'right'),
    ('DIGITAL', 13, 'D12', 'GPIO', 'P1.13', [('MISO', 'SPI'), ('PWM', 'PWM'), ('P1.13', 'GPIO')], 600, 280, 'right'),
    ('DIGITAL', 14, 'D13', 'GPIO', 'P1.15', [('SCK', 'SPI'), ('PWM', 'PWM'), ('P1.15', 'GPIO')], 600, 254, 'right'),
    ('DIGITAL', 15, 'GND', 'GND', None, [], 600, 228, 'right'),
    ('DIGITAL', 16, 'AREF', 'SYSTEM', None, [], 600, 202, 'right'),
    ('DIGITAL', 17, 'SDA', 'GPIO', 'P0.26', [('SDA', 'I2C'), ('PWM', 'PWM'), ('P0.26', 'GPIO')], 600, 176, 'right'),
    ('DIGITAL', 18, 'SCL', 'GPIO', 'P0.27', [('SCL', 'I2C'), ('PWM', 'PWM'), ('P0.27', 'GPIO')], 600, 150, 'right'),
]


def _functions(entries, evidence):
    # (name, group) or (name, group, signal)
    return [{'name': entry[0], 'signal': entry[2] if len(entry) > 2 else entry[0], 'group': entry[1], 'evidence': evidence}
            for entry in entries]


def _cells(row):
    return [(cell or '').replace('\n', '') for cell in row]


def _check_ch32v003(pdf_path):
    """Find each recorded pin and function in the datasheet's pin definition table."""
    rows = {}
    with pdfplumber.open(pdf_path) as pdf:
        assert '2.1 Pinouts' in (pdf.pages[11].extract_text() or ''), 'CH32V003 datasheet: pinout figure moved'
        assert '2.2 Pin Description' in (pdf.pages[12].extract_text() or ''), 'CH32V003 datasheet: pin table moved'
        for page in pdf.pages[12:14]:
            for table in page.extract_tables():
                for row in map(_cells, table):
                    # Columns: SOP16, TSSOP20, QFN20, SOP8, name, type, main function, default alternate, remap.
                    if len(row) == 9 and row[1].isdigit():
                        assert int(row[1]) not in rows, row
                        rows[int(row[1])] = row
    assert sorted(rows) == list(range(1, 21)), sorted(rows)
    for number, name, kind, functions in CH32V003_TSSOP20:
        row = rows[number]
        assert row[4] == name, (number, name, row)
        assert ('P' in row[5].split('/')) == (kind in {'POWER', 'GND'}), (number, kind, row)
        # The table marks a footnote as (1) and prints T1ETR once as TIETR.
        text = '/'.join(row[7:]).replace('(1)', '').replace('TIETR', 'T1ETR')
        for function, _group in functions:
            assert re.search(re.escape(function) + r'(?![A-Za-z0-9])', text), f'CH32V003 pin {number} {name}: {function} is not in the datasheet row {row[7:]}'


def _check_esp32_c6(pdf_path):
    """Find each recorded pin and IO MUX, LP and analog function in the datasheet's QFN32 tables."""
    with pdfplumber.open(pdf_path) as pdf:
        text = lambda index: (pdf.pages[index].extract_text() or '').replace(' ', '')
        assert 'QFN32,TopView' in text(14), 'ESP32-C6 datasheet: QFN32 figure moved'
        assert 'Table2-2.QFN32PinOverview' in text(16), 'ESP32-C6 datasheet: Table 2-2 moved'
        assert 'Table2-5.QFN32IOMUXPinFunctions' in text(20), 'ESP32-C6 datasheet: Table 2-5 moved'
        assert 'Table2-7.LPIOMUXFunctions' in text(21) and 'Table2-9.AnalogFunctions' in text(22), 'ESP32-C6 datasheet: LP or analog table moved'
        table = lambda index, position: [_cells(row) for row in pdf.pages[index].extract_tables()[position]]
        # Table 2-2 starts below the end of the QFN40 table and continues on the next page.
        overview = {int(row[0]): row for row in table(16, 1) + table(17, 0) if row[0].isdigit()}
        io_mux = {int(row[0]): row for row in table(20, 0) if row[0].isdigit()}
        low_power = {int(row[0]): row for row in table(21, 1) if row[0].isdigit()}
        # Table 2-9 lists the QFN40 number first and the QFN32 number second.
        analog = {int(row[1]): row for row in table(22, 1) if row[1].isdigit()}
    assert sorted(overview) == list(range(1, 34)) and overview[33][1] == 'GND', sorted(overview)
    assert len(io_mux) == 22, sorted(io_mux)
    for number, name, kind, native in ESP32_C6_QFN32:
        if kind != 'GPIO':
            assert overview[number][1] == name and number not in io_mux, f'ESP32-C6 QFN32 pin {number}: recorded {name}, datasheet {overview[number][1]}'
            continue
        assert io_mux[number][1] == name, f'ESP32-C6 QFN32 pin {number}: recorded {name}, datasheet {io_mux[number][1]}'
        row = '/'.join(overview[number][1:2] + io_mux[number][2:] + low_power.get(number, [])[1:] + analog.get(number, [])[2:])
        for function, _group in native:
            assert re.search(re.escape(function) + r'(?![A-Za-z0-9])', row), f'ESP32-C6 QFN32 pin {number} {name}: {function} is not in the datasheet tables'


def build_riscv_nordic(cache, docs, ref, verified_on):
    ch32_sheet = docs['ch32v003-datasheet']
    ch32_view = ch32_sheet.get('viewUrl', ch32_sheet['url'])
    evt_guide = docs['ch32v00x-eval-ref']
    c6_sheet = docs['esp32c6-datasheet']
    nordic_guide = docs['nrf52840-dk-ug']
    assert 'unlocked' in nordic_guide, 'nRF52840 DK guide gained a locked copy: check NRF52840_DK_HEADERS against it'

    _check_ch32v003(cache / ch32_sheet['file'])
    _check_esp32_c6(cache / c6_sheet['file'])
    with pdfplumber.open(cache / evt_guide['file']) as pdf:
        assert 'Master control MCU: CH32V003F4P6' in (pdf.pages[1].extract_text() or ''), 'CH32V00x evaluation board reference: board description moved'

    c6_drawing = ref('esp32c6-qfn32-drawing', 'esp32c6-datasheet', 15, 'Figure 2-2 · ESP32-C6 Pin Layout (QFN32, Top View)', 'visual-diagram')
    c6_table = ref('esp32c6-qfn32-pinout', 'esp32c6-datasheet', 17, 'Tables 2-2, 2-5, 2-7 and 2-9 · QFN32 pin overview, IO MUX, LP IO MUX and analog functions', 'pdf-table')
    ch32_drawing = ref('ch32v003-tssop20-drawing', 'ch32v003-datasheet', 12, '2.1 Pinouts · CH32V003F4P6 TSSOP-20 pin layout', 'visual-diagram')
    ch32_table = ref('ch32v003-pin-table', 'ch32v003-datasheet', 13, 'Table 2-1 · Pin definitions and alternate functions, TSSOP20 column', 'pdf-table')
    evt_board = ref('ch32v003-evt-board', 'ch32v00x-eval-ref', 2, 'Motherboard CH32V003EVT resource overview', 'pdf-text')
    evt_headers = ref('ch32v003-evt-headers', 'ch32v00x-eval-ref', 2, 'MCU I/O port pinout headers', 'visual-diagram')
    dk_layout = ref('nrf52840-dk-layout', 'nrf52840-dk-ug', None, 'Development kit pin layout and connector mapping', 'visual-diagram')
    dk_headers = ref('nrf52840-dk-headers', 'nrf52840-dk-ug', None, 'Arduino Uno Rev3 compatible headers P3, P4, P5, P6', 'source-table')

    c6_pins = []
    for number, name, kind, native in ESP32_C6_QFN32:
        pin = {'number': number, 'name': name, 'type': kind, 'functions': [], 'evidence': [c6_drawing, c6_table]}
        if kind == 'GPIO':
            # Any GPIO can carry the matrix-routed signals and raise an interrupt.
            entries = native + [(f'{signal} (matrix)', group, signal) for signal, group in ESP32_C6_MATRIX] + [('GPIO interrupt', 'IRQ', name)]
            pin['functions'] = _functions(entries, c6_table)
            pin['noteKey'] = 'espGpioNote'
        c6_pins.append(pin)
    c6 = {
        'id': 'esp32-c6-qfn32', 'name': 'ESP32-C6 · QFN-32', 'shortName': 'ESP32-C6', 'mcu': 'ESP32-C6', 'family': 'Espressif',
        'processor': 'RISC-V', 'clock': '160 MHz', 'subtitle': 'QFN-32 · bare MCU · 160 MHz', 'layout': 'qfn', 'packageName': 'QFN-32',
        'packagePins': 32, 'gpioCount': 22, 'uniqueGPIOCount': 22, 'voltage': '3.0–3.6 V VDD',
        'source': c6_sheet['url'] + '#page=17', 'datasheet': c6_sheet['url'], 'verifiedOn': verified_on,
        'scopeKey': 'esp32c6PackageScope', 'pins': c6_pins,
    }

    ch32_pins = [{'number': number, 'name': name, 'type': kind, 'functions': _functions(functions, ch32_table),
                  'evidence': [ch32_drawing, ch32_table]} for number, name, kind, functions in CH32V003_TSSOP20]
    ch32 = {
        'id': 'ch32v003f4p6-tssop20', 'name': 'CH32V003F4P6 · TSSOP-20', 'shortName': 'CH32V003F4P6', 'mcu': 'CH32V003F4P6',
        'family': 'WCH', 'processor': 'QingKe 32-bit RISC-V2A', 'clock': '48 MHz', 'subtitle': 'TSSOP-20 · bare MCU · 48 MHz',
        'layout': 'dip', 'packageName': 'TSSOP-20', 'packagePins': 20, 'gpioCount': 18, 'uniqueGPIOCount': 18,
        'voltage': '2.7–5.5 V VDD', 'source': ch32_view, 'datasheet': ch32_view, 'verifiedOn': verified_on,
        'scopeKey': 'ch32v003PackageScope', 'pins': ch32_pins,
    }

    pads = {pin['number']: pin for pin in ch32_pins}
    evt_pins = []
    for number, (connector, connector_pin, mcu_pin, x, y, side) in enumerate(CH32V003_EVT_HEADERS, 1):
        pad = pads[mcu_pin]
        evt_pins.append({'number': number, 'physicalLabel': f'{connector}.{connector_pin}', 'connector': connector,
                         'connectorPin': connector_pin, 'name': pad['name'], 'type': pad['type'],
                         'functions': copy.deepcopy(pad['functions']), 'evidence': [evt_board, evt_headers, ch32_table],
                         'position': {'x': x, 'y': y, 'side': side}, 'mcuPin': mcu_pin})
    assert sorted(pin['mcuPin'] for pin in evt_pins) == list(range(1, 21))
    evt = {
        'id': 'ch32v003-evt', 'name': 'WCH CH32V003-EVT', 'shortName': 'CH32V003-EVT',
        'subtitle': 'CH32V003F4P6 · TSSOP-20 · RISC-V · 48 MHz', 'layout': 'custom', 'family': 'WCH', 'packagePins': 20,
        'gpioCount': 18, 'uniqueGPIOCount': 18, 'voltage': '3.3 V / 5 V VDD', 'mcu': 'CH32V003F4P6',
        'processor': 'QingKe 32-bit RISC-V2A', 'clock': '48 MHz',
        'diagram': {'width': 820, 'height': 600, 'artwork': 'assets/boards/ch32v003-evt.svg'}, 'orientation': 'usb',
        'mcuProfile': 'ch32v003f4p6-tssop20', 'scopeKey': 'ch32v003EvtScope', 'source': evt_guide['url'], 'datasheet': ch32_view,
        'verifiedOn': verified_on, 'pins': evt_pins,
    }

    dk_pins = []
    for number, (connector, connector_pin, name, kind, port, functions, x, y, side) in enumerate(NRF52840_DK_HEADERS, 1):
        pin = {'number': number, 'physicalLabel': f'{connector}.{connector_pin}', 'connector': connector, 'connectorPin': connector_pin,
               'name': name, 'type': kind, 'functions': _functions(functions, dk_headers), 'evidence': [dk_layout, dk_headers],
               'position': {'x': x, 'y': y, 'side': side}}
        if port:
            pin.update(net=port, mcuPort=port)
        dk_pins.append(pin)
    dk = {
        'id': 'nrf52840-dk', 'name': 'Nordic nRF52840 DK', 'shortName': 'nRF52840 DK',
        'subtitle': 'PCA10056 · nRF52840 · Cortex-M4F · 64 MHz · 32 contacts', 'layout': 'custom', 'family': 'Nordic Semiconductor',
        'packageName': '32-contact Arduino Uno Rev3 shield', 'packagePins': 32, 'gpioCount': 22, 'uniqueGPIOCount': 22,
        'voltage': '1.8–3.6 V VDD', 'mcu': 'nRF52840', 'processor': 'Arm Cortex-M4F', 'clock': '64 MHz',
        'diagram': {'width': 900, 'height': 860, 'artwork': 'assets/boards/nrf52840-dk.svg'}, 'orientation': 'usb', 'wireless': True,
        'scopeKey': 'nrf52840DkScope', 'source': nordic_guide['url'],
        'datasheet': 'https://docs.nordicsemi.com/bundle/ps_nrf52840/page/intro_front.html', 'verifiedOn': verified_on, 'pins': dk_pins,
    }
    for board in (c6, ch32, evt, dk):
        assert len(board['pins']) == board['packagePins'], board['id']
        assert sum(pin['type'] == 'GPIO' for pin in board['pins']) == board['gpioCount'], board['id']
    return [c6, ch32, evt, dk]


def link_esp32_c6_boards(boards):
    """Point the ESP32-C6 boards at the QFN-32 pads that carry the same GPIO."""
    by_id = {board['id']: board for board in boards}
    pads = {pin['name']: pin['number'] for pin in by_id['esp32-c6-qfn32']['pins'] if pin['type'] == 'GPIO'}
    for pin in by_id['esp32-c6-devkitc-1']['pins']:
        # GPIO10 and GPIO11 exist on the module's chip but not in the QFN-32 package.
        if pin['type'] == 'GPIO' and pin['name'] in pads:
            pin['mcuPin'] = pads[pin['name']]
    by_id['esp32-c6-devkitc-1']['mcuProfile'] = 'esp32-c6-qfn32'
    for pin in by_id['xiao-esp32c6']['pins']:
        if pin['type'] == 'GPIO':
            pin.update(mcuPin=pads[pin['net']], mcuPort=pin['net'])
    by_id['xiao-esp32c6']['mcuProfile'] = 'esp32-c6-qfn32'
