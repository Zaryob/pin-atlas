"""Build Adafruit Feather RP2040 from official Adafruit pinout."""
import copy

PINS_CONFIG = [
    # Board position, label, kind, net and GPIO; MCU pads come from the verified package.
    (1, 'RESET', 'RESET', 'SYSTEM', 'RESET', None, None, 'Reset button and pull-up'),
    (2, '3V3', '3.3V', 'POWER', '3V3', None, None, '3.3 V regulated power output (500 mA peak)'),
    (3, '3V3', '3.3V', 'POWER', '3V3', None, None, 'Second 3.3 V regulator output pin (not an ADC reference input)'),
    (4, 'GND', 'GND', 'GND', 'GND', None, None, 'Common ground'),
    (5, 'A0', 'A0', 'GPIO', 'GPIO26', 26, 0, 'Analog input A0 (ADC0)'),
    (6, 'A1', 'A1', 'GPIO', 'GPIO27', 27, 1, 'Analog input A1 (ADC1)'),
    (7, 'A2', 'A2', 'GPIO', 'GPIO28', 28, 2, 'Analog input A2 (ADC2)'),
    (8, 'A3', 'A3', 'GPIO', 'GPIO29', 29, 3, 'Analog input A3 (ADC3)'),
    (9, 'D24', 'D24', 'GPIO', 'GPIO24', 24, None, None),
    (10, 'D25', 'D25', 'GPIO', 'GPIO25', 25, None, None),
    (11, 'SCK', 'SCK', 'GPIO', 'GPIO18', 18, None, 'Default hardware SPI0 SCK'),
    (12, 'MOSI', 'MO', 'GPIO', 'GPIO19', 19, None, 'Default hardware SPI0 MOSI (TX)'),
    (13, 'MISO', 'MI', 'GPIO', 'GPIO20', 20, None, 'Default hardware SPI0 MISO (RX)'),
    (14, 'RX', 'RX', 'GPIO', 'GPIO1', 1, None, 'Default hardware UART0 RX'),
    (15, 'TX', 'TX', 'GPIO', 'GPIO0', 0, None, 'Default hardware UART0 TX'),
    (16, 'D4', 'D4', 'GPIO', 'GPIO6', 6, None, None),
    # Right header, counted from the USB end as printed on the Adafruit pinout (VBAT is opposite A0, SDA opposite D4).
    (17, 'VBAT', 'VBAT', 'POWER', 'VBAT', None, None, 'Positive battery input from 2-pin JST-PH connector'),
    (18, 'EN', 'EN', 'SYSTEM', 'EN', None, None, '3.3 V regulator enable pin (pull low to shut down)'),
    (19, 'VBUS', 'VBUS', 'POWER', 'VBUS', None, None, '5 V power to/from the USB Type-C connector'),
    (20, 'D13', 'D13', 'GPIO', 'GPIO13', 13, None, 'Connected to onboard red user LED'),
    (21, 'D12', 'D12', 'GPIO', 'GPIO12', 12, None, None),
    (22, 'D11', 'D11', 'GPIO', 'GPIO11', 11, None, None),
    (23, 'D10', 'D10', 'GPIO', 'GPIO10', 10, None, None),
    (24, 'D9', 'D9', 'GPIO', 'GPIO9', 9, None, None),
    (25, 'D6', 'D6', 'GPIO', 'GPIO8', 8, None, None),
    (26, 'D5', 'D5', 'GPIO', 'GPIO7', 7, None, None),
    (27, 'SCL', 'SCL', 'GPIO', 'GPIO3', 3, None, 'Default hardware I2C1 SCL · Shared with STEMMA QT connector'),
    (28, 'SDA', 'SDA', 'GPIO', 'GPIO2', 2, None, 'Default hardware I2C1 SDA · Shared with STEMMA QT connector'),
]


def build_feather_rp2040(cache, docs, obs, ref, verified_on, bank2040, rp2040_phys, package):
    document = 'feather-rp2040-pinout'
    doc = docs[document]
    doc_ref = ref('feather-rp2040-pinout', document, 1, 'Official Adafruit Feather RP2040 pinout diagram')
    drawing_ref = ref('feather-rp2040-top-view', document, 1, 'Adafruit Feather RP2040 top view & dimensions', 'visual-diagram')

    package_pads = {p['name'].split('_ADC')[0]:p['number'] for p in package['pins']}
    pins = []
    for number, name, board_label, pin_type, net, gpio, adc, note in PINS_CONFIG:
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
        if gpio is not None:
            pin['mcuPin'] = package_pads[f'GPIO{gpio}']
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
        'voltage': '3.3 V I/O · 5 V USB VBUS',
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
