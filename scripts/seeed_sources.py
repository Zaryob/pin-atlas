"""Seeed Studio XIAO board headers."""
import copy

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
            if gpio == 5:
                pin['analogCautionKey'] = 'espAdc2Note'
            if gpio in {20, 21}:
                pin['boardCircuitKey'] = 'espUartBridgeNote'
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

    return [board_rp2040, board_c3]
