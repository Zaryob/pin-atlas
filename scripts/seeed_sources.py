"""Seeed Studio XIAO board headers."""
import copy
import re
import pdfplumber

def build_seeed(cache, docs, observations, ref, verified_on, bank2040, rp2040_physical_ref):
    # 1. Seeed Studio XIAO RP2040
    schematic_rp2040 = cache / docs['xiao-rp2040-schematic']['file']
    assert schematic_rp2040.exists()

    physical_rp2040 = ref('xiao-rp2040-header', 'xiao-rp2040-schematic', 1,
                          'Sheet 1/1 · connectors J2 (D0–D6) and J4 (D7–D10, 3V3, GND, 5V)', 'visual-diagram')

    pin_defs_rp2040 = [
        # (number, connector, connPin, name, boardLabel, net, pinType, gpio, adc, x, y, side)
        (1,  'L', 1, 'D0_ADC0', 'D0', 'GPIO26', 'GPIO', 26, 0, 280, 140, 'left'),
        (2,  'L', 2, 'D1_ADC1', 'D1', 'GPIO27', 'GPIO', 27, 1, 280, 175, 'left'),
        (3,  'L', 3, 'D2_ADC2', 'D2', 'GPIO28', 'GPIO', 28, 2, 280, 210, 'left'),
        (4,  'L', 4, 'D3_ADC3', 'D3', 'GPIO29', 'GPIO', 29, 3, 280, 245, 'left'),
        (5,  'L', 5, 'D4',      'D4', 'GPIO6',  'GPIO', 6,  None, 280, 280, 'left'),
        (6,  'L', 6, 'D5',      'D5', 'GPIO7',  'GPIO', 7,  None, 280, 315, 'left'),
        (7,  'L', 7, 'D6',      'D6', 'GPIO0',  'GPIO', 0,  None, 280, 350, 'left'),
        (8,  'R', 1, '5V',      '5V', '5V',     'POWER', None, None, 540, 140, 'right'),
        (9,  'R', 2, 'GND',     'GND','GND',    'GND',   None, None, 540, 175, 'right'),
        (10, 'R', 3, '3V3',     '3V3','3V3',    'POWER', None, None, 540, 210, 'right'),
        (11, 'R', 4, 'D10',     'D10','GPIO3',  'GPIO', 3,  None, 540, 245, 'right'),
        (12, 'R', 5, 'D9',      'D9', 'GPIO4',  'GPIO', 4,  None, 540, 280, 'right'),
        (13, 'R', 6, 'D8',      'D8', 'GPIO2',  'GPIO', 2,  None, 540, 315, 'right'),
        (14, 'R', 7, 'D7',      'D7', 'GPIO1',  'GPIO', 1,  None, 540, 350, 'right'),
    ]

    pins_rp2040 = []
    for number, conn, connPin, name, label, net, ptype, gpio, adc, x, y, side in pin_defs_rp2040:
        functions = []
        ev = [physical_rp2040]
        if gpio is not None:
            functions = copy.deepcopy(bank2040[gpio])
            if adc is not None:
                functions.append({
                    'name': f'ADC{adc}',
                    'group': 'ADC',
                    'signal': f'ADC{adc}',
                    'evidence': rp2040_physical_ref
                })
        pin = {
            'number': number,
            'physicalLabel': f'{conn}.{connPin}',
            'connector': conn,
            'connectorPin': connPin,
            'name': name,
            'boardLabel': label,
            'type': ptype,
            'functions': functions,
            'evidence': ev,
            'net': net,
            'position': {'x': x, 'y': y, 'side': side}
        }
        pins_rp2040.append(pin)

    board_rp2040 = {
        'id': 'xiao-rp2040',
        'name': 'Seeed Studio XIAO RP2040',
        'shortName': 'XIAO RP2040',
        'subtitle': 'RP2040 · dual Cortex-M0+ · 133 MHz · 3.3 V I/O',
        'layout': 'custom',
        'category': 'Seeed Studio',
        'family': 'Seeed Studio',
        'packageName': '14-contact header',
        'packagePins': 14,
        'gpioCount': 11,
        'uniqueGPIOCount': 11,
        'voltage': '3.3 V I/O',
        'mcu': 'RP2040',
        'mcuProfile': 'rp2040',
        'processor': 'Cortex-M0+',
        'clock': '133 MHz',
        'diagram': {
            'width': 820,
            'height': 480,
            'artwork': 'assets/boards/seeed-xiao-rp2040.svg'
        },
        'source': 'https://wiki.seeedstudio.com/XIAO-RP2040/',
        'datasheet': docs['xiao-rp2040-schematic']['url'],
        'verifiedOn': verified_on,
        'pins': pins_rp2040
    }

    # 2. Seeed Studio XIAO ESP32C3
    schematic_c3 = cache / docs['xiao-esp32c3-schematic']['file']
    assert schematic_c3.exists()

    physical_c3 = ref('xiao-esp32c3-header', 'xiao-esp32c3-schematic', 3,
                      'Sheet 3/3 · connectors J2 (D0–D6) and J1 (D7–D10, 3V3, GND, 5V)', 'visual-diagram')
    matrix_c3 = ref('xiao-esp32c3-matrix', 'esp32c3-datasheet', 19,
                    'I/O pins / IO MUX and GPIO Matrix · routable peripheral capabilities', 'pdf-text')
    boot_c3 = ref('xiao-esp32c3-strapping', 'esp32c3-datasheet', 30,
                  'Boot configurations · strapping levels sampled during reset')

    with pdfplumber.open(cache / docs['esp32c3-datasheet']['file']) as pdf:
        adc_text = ''.join((pdf.pages[48].extract_text() or '').split())
    assert 'ADC2ofsomechiprevisionsisnotoperable' in adc_text and 'isnotfactory-calibrated' in adc_text
    adc_c3 = ref('esp32c3-adc2-note', 'esp32c3-datasheet', 49, '§4.2.2.1 SAR ADC · note: ADC2 of some chip revisions is not operable; ADC2 is not factory-calibrated', 'pdf-text')
    with pdfplumber.open(schematic_c3) as pdf:
        sheet_words = {word['text'] for word in pdf.pages[2].extract_words()}
    # Sheet 3 routes USB straight to the SoC (ESP_USB_DP/DM) and puts the BOOT0 switch on net D9.
    assert {'ESP_USB_DP', 'ESP_USB_DM', 'BOOT0', 'D9'} <= sheet_words and not any(re.match(r'CP21|CH34|FT23', word) for word in sheet_words)

    pin_defs_c3 = [
        # (number, connector, connPin, name, boardLabel, net, pinType, gpio, dedicated_list, x, y, side)
        (1,  'L', 1, 'D0',  'D0',  'GPIO2',  'GPIO', 2,  [('ADC1_CH2', 'ADC'), ('FSPIQ', 'SPI')], 280, 140, 'left'),
        (2,  'L', 2, 'D1',  'D1',  'GPIO3',  'GPIO', 3,  [('ADC1_CH3', 'ADC')], 280, 175, 'left'),
        (3,  'L', 3, 'D2',  'D2',  'GPIO4',  'GPIO', 4,  [('ADC1_CH4', 'ADC'), ('FSPIHD', 'SPI'), ('MTMS', 'JTAG')], 280, 210, 'left'),
        (4,  'L', 4, 'D3',  'D3',  'GPIO5',  'GPIO', 5,  [('ADC2_CH0', 'ADC'), ('FSPIWP', 'SPI'), ('MTDI', 'JTAG')], 280, 245, 'left'),
        (5,  'L', 5, 'D4',  'D4',  'GPIO6',  'GPIO', 6,  [('FSPICLK', 'SPI'), ('MTCK', 'JTAG')], 280, 280, 'left'),
        (6,  'L', 6, 'D5',  'D5',  'GPIO7',  'GPIO', 7,  [('FSPID', 'SPI'), ('MTDO', 'JTAG')], 280, 315, 'left'),
        (7,  'L', 7, 'D6',  'D6',  'GPIO21', 'GPIO', 21, [('U0TXD', 'UART')], 280, 350, 'left'),
        (8,  'R', 1, '5V',  '5V',  '5V',     'POWER', None, [], 540, 140, 'right'),
        (9,  'R', 2, 'GND', 'GND', 'GND',    'GND',   None, [], 540, 175, 'right'),
        (10, 'R', 3, '3V3', '3V3', '3V3',    'POWER', None, [], 540, 210, 'right'),
        (11, 'R', 4, 'D10', 'D10', 'GPIO10', 'GPIO', 10, [('FSPICS0', 'SPI')], 540, 245, 'right'),
        (12, 'R', 5, 'D9',  'D9',  'GPIO9',  'GPIO', 9,  [], 540, 280, 'right'),
        (13, 'R', 6, 'D8',  'D8',  'GPIO8',  'GPIO', 8,  [], 540, 315, 'right'),
        (14, 'R', 7, 'D7',  'D7',  'GPIO20', 'GPIO', 20, [('U0RXD', 'UART')], 540, 350, 'right'),
    ]

    c3_straps = {2, 8, 9}
    c3_matrix_routes = [
        ('UART1 RX', 'UART'), ('UART1 TX', 'UART'),
        ('SPI2 MISO', 'SPI'), ('SPI2 MOSI', 'SPI'), ('SPI2 SCK', 'SPI'), ('SPI2 CS', 'SPI'),
        ('I2C0 SDA', 'I2C'), ('I2C0 SCL', 'I2C'),
        ('LEDC PWM', 'PWM')
    ]

    pins_c3 = []
    for number, conn, connPin, name, label, net, ptype, gpio, dedicated, x, y, side in pin_defs_c3:
        functions = []
        ev = [physical_c3]
        pin = {
            'number': number,
            'physicalLabel': f'{conn}.{connPin}',
            'connector': conn,
            'connectorPin': connPin,
            'name': name,
            'boardLabel': label,
            'type': ptype,
            'functions': functions,
            'evidence': ev,
            'net': net,
            'position': {'x': x, 'y': y, 'side': side}
        }
        if gpio is not None:
            pin['noteKey'] = 'espGpioNote'
            for sig, grp in dedicated:
                functions.append({
                    'name': sig,
                    'group': grp,
                    'signal': sig,
                    'evidence': physical_c3
                })
            for sig, grp in c3_matrix_routes:
                functions.append({
                    'name': f'{sig} (matrix)',
                    'group': grp,
                    'signal': sig,
                    'selector': 'GPIO matrix',
                    'evidence': matrix_c3
                })
            functions.append({
                'name': 'GPIO interrupt',
                'group': 'IRQ',
                'signal': net,
                'evidence': matrix_c3
            })
            if gpio in c3_straps:
                pin['strapping'] = True
                pin['evidence'].append(boot_c3)
            notes = pin.setdefault('noteEvidence', {})
            if gpio == 5:
                pin['analogCautionKey'] = 'espC3Adc2Note'
                notes['espC3Adc2Note'] = [adc_c3]; pin['evidence'].append(adc_c3)
            if gpio in {20, 21}:
                # No USB-UART bridge on this board: USB is the SoC's native USB Serial/JTAG.
                pin['boardCircuitKey'] = 'xiaoC3Uart0Note'
                notes['xiaoC3Uart0Note'] = [physical_c3]
            if gpio == 9:
                pin['boardCircuitKey'] = 'xiaoC3BootNote'
                notes['xiaoC3BootNote'] = [physical_c3, boot_c3]
            if not notes:
                del pin['noteEvidence']
        pins_c3.append(pin)

    board_c3 = {
        'id': 'xiao-esp32c3',
        'name': 'Seeed Studio XIAO ESP32C3',
        'shortName': 'XIAO ESP32C3',
        'subtitle': 'ESP32-C3 · RISC-V · 160 MHz · Wi-Fi + BLE · 3.3 V I/O',
        'layout': 'custom',
        'category': 'Seeed Studio',
        'family': 'Seeed Studio',
        'packageName': '14-contact header',
        'packagePins': 14,
        'gpioCount': 11,
        'uniqueGPIOCount': 11,
        'voltage': '3.3 V I/O',
        'mcu': 'ESP32-C3',
        'processor': 'RISC-V',
        'clock': '160 MHz',
        'diagram': {
            'width': 820,
            'height': 480,
            'artwork': 'assets/boards/seeed-xiao-esp32c3.svg'
        },
        'source': 'https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/',
        'datasheet': docs['xiao-esp32c3-schematic']['url'],
        'verifiedOn': verified_on,
        'pins': pins_c3
    }

    # 3. Seeed Studio XIAO SAMD21
    schematic_samd21 = cache / docs['xiao-samd21-schematic']['file']
    assert schematic_samd21.exists()

    physical_samd21 = ref('xiao-samd21-header', 'xiao-samd21-schematic', 1,
                          'Sheet 1/1 · connectors J2 (D0–D6) and J4 (D7–D10, 3V3, GND, 5V)', 'visual-diagram')

    pin_defs_samd21 = [
        # (number, connector, connPin, name, boardLabel, net, pinType, functions, x, y, side)
        (1,  'L', 1, 'D0_A0', 'D0', 'PA02', 'GPIO',
         [('ADC_IN0', 'ADC'), ('DAC_VOUT', 'DAC'), ('GPIO interrupt', 'IRQ')], 280, 140, 'left'),
        (2,  'L', 2, 'D1_A1', 'D1', 'PA04', 'GPIO',
         [('ADC_IN4', 'ADC'), ('TC0_WO0', 'PWM'), ('SERCOM0_PAD0', 'SPI'), ('GPIO interrupt', 'IRQ')], 280, 175, 'left'),
        (3,  'L', 3, 'D2_A2', 'D2', 'PA10', 'GPIO',
         [('ADC_IN18', 'ADC'), ('TC0_WO2', 'PWM'), ('SERCOM0_PAD2', 'SPI'), ('SERCOM2_PAD2', 'I2C'), ('GPIO interrupt', 'IRQ')], 280, 210, 'left'),
        (4,  'L', 4, 'D3_A3', 'D3', 'PA11', 'GPIO',
         [('ADC_IN19', 'ADC'), ('TC0_WO3', 'PWM'), ('SERCOM0_PAD3', 'SPI'), ('SERCOM2_PAD3', 'I2C'), ('GPIO interrupt', 'IRQ')], 280, 245, 'left'),
        (5,  'L', 5, 'D4_A4_SDA', 'D4', 'PA08', 'GPIO',
         [('I2C0 SDA', 'I2C'), ('ADC_IN16', 'ADC'), ('TC1_WO2', 'PWM'), ('SERCOM2_PAD0', 'I2C'), ('GPIO interrupt', 'IRQ')], 280, 280, 'left'),
        (6,  'L', 6, 'D5_A5_SCL', 'D5', 'PA09', 'GPIO',
         [('I2C0 SCL', 'I2C'), ('ADC_IN17', 'ADC'), ('TC1_WO3', 'PWM'), ('SERCOM2_PAD1', 'I2C'), ('GPIO interrupt', 'IRQ')], 280, 315, 'left'),
        (7,  'L', 7, 'D6_A6_TX', 'D6', 'PB08', 'GPIO',
         [('UART0 TX', 'UART'), ('ADC_IN2', 'ADC'), ('TC4_WO0', 'PWM'), ('SERCOM4_PAD0', 'UART'), ('GPIO interrupt', 'IRQ')], 280, 350, 'left'),
        (8,  'R', 1, '5V', '5V', '5V', 'POWER', [], 540, 140, 'right'),
        (9,  'R', 2, 'GND', 'GND', 'GND', 'GND', [], 540, 175, 'right'),
        (10, 'R', 3, '3V3', '3V3', '3V3', 'POWER', [], 540, 210, 'right'),
        (11, 'R', 4, 'D10_A10_MOSI', 'D10', 'PA06', 'GPIO',
         [('SPI0 MOSI', 'SPI'), ('ADC_IN6', 'ADC'), ('TC1_WO0', 'PWM'), ('SERCOM0_PAD2', 'SPI'), ('GPIO interrupt', 'IRQ')], 540, 245, 'right'),
        (12, 'R', 5, 'D9_A9_MISO', 'D9', 'PA05', 'GPIO',
         [('SPI0 MISO', 'SPI'), ('ADC_IN5', 'ADC'), ('TC0_WO1', 'PWM'), ('SERCOM0_PAD1', 'SPI'), ('GPIO interrupt', 'IRQ')], 540, 280, 'right'),
        (13, 'R', 6, 'D8_A8_SCK', 'D8', 'PA07', 'GPIO',
         [('SPI0 SCK', 'SPI'), ('ADC_IN7', 'ADC'), ('TC1_WO1', 'PWM'), ('SERCOM0_PAD3', 'SPI'), ('GPIO interrupt', 'IRQ')], 540, 315, 'right'),
        (14, 'R', 7, 'D7_A7_RX', 'D7', 'PB09', 'GPIO',
         [('UART0 RX', 'UART'), ('ADC_IN3', 'ADC'), ('TC4_WO1', 'PWM'), ('SERCOM4_PAD1', 'UART'), ('GPIO interrupt', 'IRQ')], 540, 350, 'right'),
    ]

    # PWM, interrupt, ADC and SERCOM capabilities come from the SAM D21 multiplexing table (SAMD21G column).
    mux_ref = ref('samd21-port-mux', 'samd21-datasheet', 28, '§7.1 · Table 7-1 PORT Function Multiplexing · SAM D21G rows', 'pdf-table')
    mux = {}
    with pdfplumber.open(cache / docs['samd21-datasheet']['file']) as pdf:
        for table in pdf.pages[27].extract_tables():
            for row in table:
                row = [(cell or '').replace('\n', ' ').replace('/ ', '/') for cell in row]
                if len(row) == 17 and re.fullmatch(r'P[AB]\d\d', row[3]) and row[1]:
                    mux[row[3]] = dict(zip(('eic', 'ref', 'adc', 'ac', 'ptc', 'dac', 'sercom', 'sercom_alt', 'tc', 'tcc'), row[5:15]))
    pins_samd21 = []
    for number, conn, connPin, name, label, net, ptype, fns, x, y, side in pin_defs_samd21:
        functions = []
        ev = [physical_samd21]
        row = mux.get(net)
        if ptype == 'GPIO':
            ev.append(mux_ref)
            kept = []
            for sig, grp in fns:
                if grp == 'PWM' or sig == 'GPIO interrupt':
                    continue  # regenerated from the table below
                if grp == 'ADC':
                    assert row['adc'] == f"AIN[{sig[6:]}]", (net, sig, row['adc'])
                elif grp == 'DAC':
                    assert row['dac'] == 'VOUT'
                elif sig.startswith('SERCOM'):
                    assert f"{sig.split('_')[0]}/PAD[{sig[-1]}]" in (row['sercom'], row['sercom_alt']), (net, sig)
                kept.append((sig, grp, physical_samd21 if not re.match(r'ADC_|DAC_|SERCOM', sig) else mux_ref))
            # TCC3 exists only on other family members; the G18A exposes TCC0–TCC2 and TC3–TC5.
            for timer in (row['tc'], row['tcc']):
                if timer and not timer.startswith('TCC3'):
                    assert re.fullmatch(r'TCC?[0-5]/WO\[\d\]', timer), timer
                    kept.append((timer, 'PWM', mux_ref))
            if row['eic'].startswith('EXTINT'):
                kept.append((row['eic'], 'IRQ', mux_ref))
            else:
                assert row['eic'] == 'NMI' and net == 'PA08'
                kept.append(('NMI', 'SYSTEM', mux_ref))
            fns = kept
        else:
            fns = [(sig, grp, physical_samd21) for sig, grp in fns]
        for sig, grp, evidence in fns:
            functions.append({
                'name': sig,
                'group': grp,
                'signal': sig,
                'evidence': evidence
            })
        pin = {
            'number': number,
            'physicalLabel': f'{conn}.{connPin}',
            'connector': conn,
            'connectorPin': connPin,
            'name': name,
            'boardLabel': label,
            'type': ptype,
            'functions': functions,
            'evidence': ev,
            'net': net,
            'position': {'x': x, 'y': y, 'side': side}
        }
        if net == 'PA08':
            pin['boardCircuitKey'] = 'xiaoSamdNmiNote'; pin['noteEvidence'] = {'xiaoSamdNmiNote': [mux_ref]}
        if ptype == 'GPIO' and row['eic'] == 'EXTINT[9]':
            pin['boardCircuitKey'] = 'xiaoSamdExtint9Note'; pin['noteEvidence'] = {'xiaoSamdExtint9Note': [mux_ref]}
        pins_samd21.append(pin)
    assert sorted(p['name'] for p in pins_samd21 if p.get('boardCircuitKey') == 'xiaoSamdExtint9Note') == ['D5_A5_SCL', 'D7_A7_RX']

    board_samd21 = {
        'id': 'xiao-samd21',
        'name': 'Seeed Studio XIAO SAMD21',
        'shortName': 'XIAO SAMD21',
        'subtitle': 'ATSAMD21G18A · Cortex-M0+ · 48 MHz · 3.3 V I/O',
        'layout': 'custom',
        'category': 'Seeed Studio',
        'family': 'Seeed Studio',
        'packageName': '14-contact header',
        'packagePins': 14,
        'gpioCount': 11,
        'uniqueGPIOCount': 11,
        'voltage': '3.3 V I/O',
        'mcu': 'SAMD21',
        'processor': 'Cortex-M0+',
        'clock': '48 MHz',
        'diagram': {
            'width': 820,
            'height': 480,
            'artwork': 'assets/boards/seeed-xiao-samd21.svg'
        },
        'source': 'https://wiki.seeedstudio.com/Seeeduino-XIAO/',
        'datasheet': docs['xiao-samd21-schematic']['url'],
        'verifiedOn': verified_on,
        'pins': pins_samd21
    }

    # 4. Seeed Studio XIAO nRF52840
    schematic_nrf52840 = cache / docs['xiao-nrf52840-sense-schematic']['file']
    assert schematic_nrf52840.exists()
    variant_file = cache / docs['xiao-nrf52840-variant']['file']
    assert variant_file.exists()
    variant_text = variant_file.read_text()
    assert '2, // D0  is P0.02 (A0)' in variant_text
    assert '43, // D6  is P1.11 (TX)' in variant_text
    assert '44, // D7  is P1.12 (RX)' in variant_text
    assert '45, // D8  is P1.13 (SCK)' in variant_text
    assert '46, // D9  is P1.14 (MISO)' in variant_text
    assert '47, // D10 is P1.15 (MOSI)' in variant_text

    physical_nrf52840 = ref('xiao-nrf52840-header', 'xiao-nrf52840-sense-schematic', 1,
                            'Sheet 1/1 · connectors J2 (D0–D6) and J4 (D7–D10, 3V3, GND, 5V)', 'visual-diagram')
    variant_nrf52840 = ref('xiao-nrf52840-variant-ref', 'xiao-nrf52840-variant', None,
                           'g_ADigitalPinMap · nRF52840 port mappings and peripheral assignments', 'source-code')

    pin_defs_nrf52840 = [
        # (number, connector, connPin, name, boardLabel, net, pinType, functions, x, y, side)
        (1,  'L', 1, 'D0',  'D0',  'P0.02', 'GPIO',
         [('AIN0', 'ADC', 'AIN0'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P0.02')], 280, 140, 'left'),
        (2,  'L', 2, 'D1',  'D1',  'P0.03', 'GPIO',
         [('AIN1', 'ADC', 'AIN1'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P0.03')], 280, 175, 'left'),
        (3,  'L', 3, 'D2',  'D2',  'P0.28', 'GPIO',
         [('AIN4', 'ADC', 'AIN4'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P0.28')], 280, 210, 'left'),
        (4,  'L', 4, 'D3',  'D3',  'P0.29', 'GPIO',
         [('AIN5', 'ADC', 'AIN5'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P0.29')], 280, 245, 'left'),
        (5,  'L', 5, 'D4',  'D4',  'P0.04', 'GPIO',
         [('AIN2', 'ADC', 'AIN2'), ('I2C0 SDA', 'I2C', 'SDA'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P0.04')], 280, 280, 'left'),
        (6,  'L', 6, 'D5',  'D5',  'P0.05', 'GPIO',
         [('AIN3', 'ADC', 'AIN3'), ('I2C0 SCL', 'I2C', 'SCL'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P0.05')], 280, 315, 'left'),
        (7,  'L', 7, 'D6',  'D6',  'P1.11', 'GPIO',
         [('UART0 TX', 'UART', 'TX'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P1.11')], 280, 350, 'left'),
        (8,  'R', 1, '5V',  '5V',  '5V',    'POWER', [], 540, 140, 'right'),
        (9,  'R', 2, 'GND', 'GND', 'GND',   'GND',   [], 540, 175, 'right'),
        (10, 'R', 3, '3V3', '3V3', '3V3',   'POWER', [], 540, 210, 'right'),
        (11, 'R', 4, 'D10', 'D10', 'P1.15', 'GPIO',
         [('SPI0 MOSI', 'SPI', 'MOSI'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P1.15')], 540, 245, 'right'),
        (12, 'R', 5, 'D9',  'D9',  'P1.14', 'GPIO',
         [('SPI0 MISO', 'SPI', 'MISO'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P1.14')], 540, 280, 'right'),
        (13, 'R', 6, 'D8',  'D8',  'P1.13', 'GPIO',
         [('SPI0 SCK', 'SPI', 'SCK'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P1.13')], 540, 315, 'right'),
        (14, 'R', 7, 'D7',  'D7',  'P1.12', 'GPIO',
         [('UART0 RX', 'UART', 'RX'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'P1.12')], 540, 350, 'right'),
    ]

    pins_nrf52840 = []
    for number, conn, connPin, name, label, net, ptype, fns, x, y, side in pin_defs_nrf52840:
        functions = []
        ev = [physical_nrf52840]
        if ptype == 'GPIO':
            ev.append(variant_nrf52840)
            for fname, fgroup, fsignal in fns:
                functions.append({
                    'name': fname,
                    'group': fgroup,
                    'signal': fsignal,
                    'evidence': variant_nrf52840
                })
        pin = {
            'number': number,
            'physicalLabel': f'{conn}.{connPin}',
            'connector': conn,
            'connectorPin': connPin,
            'name': name,
            'boardLabel': label,
            'type': ptype,
            'functions': functions,
            'evidence': ev,
            'net': net,
            'position': {'x': x, 'y': y, 'side': side}
        }
        if ptype == 'GPIO':
            pin['noteKey'] = 'xiaoNrf52GpioNote'
        pins_nrf52840.append(pin)

    board_nrf52840 = {
        'id': 'xiao-nrf52840',
        'name': 'Seeed Studio XIAO nRF52840',
        'shortName': 'XIAO nRF52840',
        'subtitle': 'nRF52840 · Cortex-M4F · 64 MHz · BLE 5.0 · 3.3 V I/O',
        'layout': 'custom',
        'category': 'Seeed Studio',
        'family': 'Seeed Studio',
        'packageName': '14-contact header',
        'packagePins': 14,
        'gpioCount': 11,
        'uniqueGPIOCount': 11,
        'voltage': '3.3 V I/O',
        'mcu': 'nRF52840',
        'processor': 'Cortex-M4F',
        'clock': '64 MHz',
        'diagram': {
            'width': 820,
            'height': 480,
            'artwork': 'assets/boards/seeed-xiao-nrf52840.svg'
        },
        'source': 'https://wiki.seeedstudio.com/XIAO_BLE/',
        'datasheet': docs['xiao-nrf52840-sense-schematic']['url'],
        'verifiedOn': verified_on,
        'pins': pins_nrf52840
    }

    return [board_rp2040, board_c3, board_samd21, board_nrf52840]
