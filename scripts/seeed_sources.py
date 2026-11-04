"""Seeed Studio XIAO board headers."""
import copy

def build_seeed(cache, docs, observations, ref, verified_on, bank2040, rp2040_physical_ref):
    schematic_path = cache / docs['xiao-rp2040-schematic']['file']
    assert schematic_path.exists()

    physical = ref('xiao-rp2040-header', 'xiao-rp2040-schematic', 1,
                   'Sheet 1/1 · connectors J2 (D0–D6) and J4 (D7–D10, 3V3, GND, 5V)', 'visual-diagram')

    pin_defs = [
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

    pins = []
    for number, conn, connPin, name, label, net, ptype, gpio, adc, x, y, side in pin_defs:
        functions = []
        ev = [physical]
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
        pins.append(pin)

    board = {
        'id': 'xiao-rp2040',
        'name': 'Seeed Studio XIAO RP2040',
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
        'pins': pins
    }
    return [board]
