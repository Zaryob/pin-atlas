"""Build Adafruit Feather RP2040 from official Adafruit pinout."""
import copy

PINS_CONFIG = [
    # Left header: pins 1 to 16
    # (number, name, board_label, pin_type, net, gpio, adc, mcu_pin, note)
    (1,  'RESET', 'RESET', 'SYSTEM', 'RESET',  None, None, None, 'Reset button and pull-up'),
    (2,  '3V3',   '3.3V',  'POWER',  '3V3',    None, None, None, '3.3 V regulated power output (up to 500 mA)'),
    (3,  'AREF',  'AREF',  'POWER',  'AREF',   None, None, None, 'ADC reference voltage (default 3.3 V)'),
    (4,  'GND',   'GND',   'GND',    'GND',    None, None, None, 'Common ground'),
    (5,  'A0',    'A0',    'GPIO',   'GPIO26', 26,   0,    30,   'Analog input A0 (ADC0)'),
    (6,  'A1',    'A1',    'GPIO',   'GPIO27', 27,   1,    31,   'Analog input A1 (ADC1)'),
    (7,  'A2',    'A2',    'GPIO',   'GPIO28', 28,   2,    32,   'Analog input A2 (ADC2)'),
    (8,  'A3',    'A3',    'GPIO',   'GPIO29', 29,   3,    33,   'Analog input A3 (ADC3)'),
    (9,  'D24',   'D24',   'GPIO',   'GPIO24', 24,   None, 28,   None),
    (10, 'D25',   'D25',   'GPIO',   'GPIO25', 25,   None, 29,   None),
    (11, 'SCK',   'SCK',   'GPIO',   'GPIO18', 18,   None, 21,   'Default hardware SPI0 SCK'),
    (12, 'MOSI',  'MO',    'GPIO',   'GPIO19', 19,   None, 22,   'Default hardware SPI0 MOSI (TX)'),
    (13, 'MISO',  'MI',    'GPIO',   'GPIO20', 20,   None, 23,   'Default hardware SPI0 MISO (RX)'),
    (14, 'RX',    'RX',    'GPIO',   'GPIO1',  1,    None, 3,    'Default hardware UART0 RX'),
    (15, 'TX',    'TX',    'GPIO',   'GPIO0',  0,    None, 2,    'Default hardware UART0 TX'),
    (16, 'D4',    'D4',    'GPIO',   'GPIO6',  6,    None, 8,    None),

    # Right header: pins 17 to 28
    (17, 'SDA',   'SDA',   'GPIO',   'GPIO2',  2,    None, 4,    'Default hardware I2C1 SDA · Shared with STEMMA QT connector'),
    (18, 'SCL',   'SCL',   'GPIO',   'GPIO3',  3,    None, 5,    'Default hardware I2C1 SCL · Shared with STEMMA QT connector'),
    (19, 'D5',    'D5',    'GPIO',   'GPIO7',  7,    None, 9,    None),
    (20, 'D6',    'D6',    'GPIO',   'GPIO8',  8,    None, 10,   None),
    (21, 'D9',    'D9',    'GPIO',   'GPIO9',  9,    None, 11,   None),
    (22, 'D10',   'D10',   'GPIO',   'GPIO10', 10,   None, 12,   None),
    (23, 'D11',   'D11',   'GPIO',   'GPIO11', 11,   None, 13,   None),
    (24, 'D12',   'D12',   'GPIO',   'GPIO12', 12,   None, 14,   None),
    (25, 'D13',   'D13',   'GPIO',   'GPIO13', 13,   None, 15,   'Connected to onboard red user LED'),
    (26, 'VBUS',  'VBUS',  'POWER',  'VBUS',   None, None, None, '5 V power input from USB Type-C connector'),
    (27, 'EN',    'EN',    'SYSTEM', 'EN',     None, None, None, '3.3 V regulator enable pin (pull low to shut down)'),
    (28, 'VBAT',  'VBAT',  'POWER',  'VBAT',   None, None, None, 'Positive battery input from 2-pin JST-PH connector'),
]


def build_feather_rp2040(cache, docs, obs, ref, verified_on, bank2040, rp2040_phys):
    document = 'feather-rp2040-pinout'
    doc = docs[document]
    doc_ref = ref('feather-rp2040-pinout', document, 1, 'Official Adafruit Feather RP2040 pinout diagram')
    drawing_ref = ref('feather-rp2040-top-view', document, 1, 'Adafruit Feather RP2040 top view & dimensions', 'visual-diagram')

    pins = []
    for number, name, board_label, pin_type, net, gpio, adc, mcu_pin, note in PINS_CONFIG:
        left = number <= 16
        if left:
            x, y, side = 277, 110 + (number - 1) * 28, 'left'
            connector = 'LEFT'
            conn_pin = number
        else:
            x, y, side = 543, 222 + (number - 17) * 28, 'right'
            connector = 'RIGHT'
            conn_pin = number - 16

        functions = []
        if gpio is not None:
            functions = copy.deepcopy(bank2040[gpio])
            if adc is not None:
                functions.append({
                    'name': f'ADC{adc}',
                    'group': 'ADC',
                    'signal': f'ADC{adc}',
                    'evidence': rp2040_phys
                })

        pin = {
            'number': number,
            'physicalLabel': f'{connector}.{conn_pin}',
            'connector': connector,
            'connectorPin': conn_pin,
            'name': name,
            'boardLabel': board_label,
            'net': net,
            'type': pin_type,
            'functions': functions,
            'evidence': [doc_ref, drawing_ref],
            'position': {'x': x, 'y': y, 'side': side},
        }
        if mcu_pin:
            pin['mcuPin'] = mcu_pin
            pin['evidence'].append(rp2040_phys)
        if note:
            pin['note'] = note

        pins.append(pin)

    return [{
        'id': 'adafruit-feather-rp2040',
        'name': 'Adafruit Feather RP2040',
        'shortName': 'Feather RP2040',
        'family': 'Adafruit',
        'subtitle': 'Feather form factor · STEMMA QT · LiPo charger · RP2040',
        'layout': 'custom',
        'diagram': {'width': 820, 'height': 640, 'artwork': 'assets/boards/adafruit-feather-rp2040.svg', 'minWidth': 760},
        'packagePins': 28,
        'gpioCount': 21,
        'voltage': '3.3 V I/O · 5 V tolerant VBUS',
        'mcu': 'RP2040',
        'processor': 'Dual ARM Cortex-M0+',
        'clock': '133 MHz',
        'verifiedOn': verified_on,
        'source': doc['viewUrl'],
        'datasheet': 'https://learn.adafruit.com/adafruit-feather-rp2040-pico/downloads',
        'orientation': 'usb',
        'mcuProfile': 'rp2040',
        'pins': pins,
    }]
