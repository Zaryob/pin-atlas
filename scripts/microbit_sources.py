"""BBC micro:bit V2 edge connector sources and alternate functions."""

def build_microbit(cache, docs, observations, ref, verified_on):
    schematic = cache / docs['microbit-v2-schematic']['file']
    assert schematic.exists()

    physical_ref = ref('microbit-v2-header', 'microbit-v2-schematic', 2,
                       'Sheet 2/3 · connectors RING0–2, 3V, GND and edge contacts P3–P16, P19, P20', 'visual-diagram')
    function_ref = ref('microbit-v2-functions', 'microbit-v2-schematic', 2,
                       'Sheet 2/3 · Edge connector pinmux, alternate SPI/I2C/ADC lines and shared circuit matrix', 'visual-diagram')

    pin_defs = [
        # (number, conn, connPin, name, boardLabel, net, ptype, funcs_spec, circuitKey, x, y, side)
        (1,  'RING', '0',   'P0',  '0',   'P0.02', 'GPIO',  [('AIN0', 'ADC'), ('TOUCH', 'TOUCH'), ('PWM', 'PWM'), ('UART', 'UART')], None, 280, 100, 'left'),
        (2,  'RING', '1',   'P1',  '1',   'P0.03', 'GPIO',  [('AIN1', 'ADC'), ('TOUCH', 'TOUCH'), ('PWM', 'PWM'), ('UART', 'UART')], None, 280, 136, 'left'),
        (3,  'RING', '2',   'P2',  '2',   'P0.04', 'GPIO',  [('AIN2', 'ADC'), ('TOUCH', 'TOUCH'), ('PWM', 'PWM'), ('UART', 'UART')], None, 280, 172, 'left'),
        (4,  'EDGE', 3,     'P3',  'P3',  'P0.31', 'GPIO',  [('AIN7', 'ADC'), ('LED_COL3', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitLedColNote', 280, 208, 'left'),
        (5,  'EDGE', 4,     'P4',  'P4',  'P0.28', 'GPIO',  [('AIN4', 'ADC'), ('LED_COL1', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitLedColNote', 280, 244, 'left'),
        (6,  'EDGE', 5,     'P5',  'P5',  'P0.14', 'GPIO',  [('BUTTON_A', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitButtonANote', 280, 280, 'left'),
        (7,  'EDGE', 6,     'P6',  'P6',  'P1.05', 'GPIO',  [('LED_COL4', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitLedColNote', 280, 316, 'left'),
        (8,  'EDGE', 7,     'P7',  'P7',  'P0.11', 'GPIO',  [('LED_COL2', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitLedColNote', 280, 352, 'left'),
        (9,  'EDGE', 8,     'P8',  'P8',  'P0.10', 'GPIO',  [('NFC2', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], None, 280, 388, 'left'),
        (10, 'EDGE', 9,     'P9',  'P9',  'P0.09', 'GPIO',  [('NFC1', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], None, 280, 424, 'left'),
        (11, 'EDGE', 10,    'P10', 'P10', 'P0.30', 'GPIO',  [('AIN6', 'ADC'), ('LED_COL5', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitLedColNote', 280, 460, 'left'),
        (12, 'RING', '3V',  '3V',  '3V',  '3V',    'POWER', [], None, 540, 118, 'right'),
        (13, 'RING', 'GND', 'GND', 'GND', 'GND',   'GND',   [], None, 540, 154, 'right'),
        (14, 'EDGE', 11,    'P11', 'P11', 'P0.23', 'GPIO',  [('BUTTON_B', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitButtonBNote', 540, 190, 'right'),
        (15, 'EDGE', 12,    'P12', 'P12', 'P0.12', 'GPIO',  [('ACCESSIBILITY', 'SYSTEM'), ('PWM', 'PWM'), ('UART', 'UART')], None, 540, 226, 'right'),
        (16, 'EDGE', 13,    'P13', 'P13', 'P0.17', 'GPIO',  [('SPI_SCK', 'SPI'), ('PWM', 'PWM'), ('UART', 'UART')], None, 540, 262, 'right'),
        (17, 'EDGE', 14,    'P14', 'P14', 'P0.01', 'GPIO',  [('SPI_MISO', 'SPI'), ('PWM', 'PWM'), ('UART', 'UART')], None, 540, 298, 'right'),
        (18, 'EDGE', 15,    'P15', 'P15', 'P0.13', 'GPIO',  [('SPI_MOSI', 'SPI'), ('PWM', 'PWM'), ('UART', 'UART')], None, 540, 334, 'right'),
        (19, 'EDGE', 16,    'P16', 'P16', 'P1.02', 'GPIO',  [('PWM', 'PWM'), ('UART', 'UART')], None, 540, 370, 'right'),
        (20, 'EDGE', 19,    'P19', 'P19', 'P0.26', 'GPIO',  [('I2C_SCL', 'I2C'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitI2cPullupNote', 540, 406, 'right'),
        (21, 'EDGE', 20,    'P20', 'P20', 'P1.00', 'GPIO',  [('I2C_SDA', 'I2C'), ('PWM', 'PWM'), ('UART', 'UART')], 'microbitI2cPullupNote', 540, 442, 'right'),
    ]

    pins = []
    for number, conn, connPin, name, label, net, ptype, fspecs, circuitKey, x, y, side in pin_defs:
        functions = []
        ev = [physical_ref]
        for fname, fgroup in fspecs:
            functions.append({
                'name': fname,
                'group': fgroup,
                'signal': fname,
                'evidence': function_ref
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
        if circuitKey:
            pin['boardCircuitKey'] = circuitKey
        pins.append(pin)

    board_microbit = {
        'id': 'microbit-v2',
        'name': 'BBC micro:bit V2',
        'shortName': 'micro:bit V2',
        'subtitle': 'nRF52833 · Cortex-M4F · 64 MHz · 3.3 V I/O',
        'layout': 'custom',
        'category': 'micro:bit',
        'family': 'micro:bit',
        'packageName': 'Edge Connector (80-way pitch)',
        'packagePins': 21,
        'gpioCount': 19,
        'uniqueGPIOCount': 19,
        'voltage': '3.3 V I/O',
        'mcu': 'nRF52833',
        'processor': 'Cortex-M4F',
        'clock': '64 MHz',
        'diagram': {
            'width': 820,
            'height': 540,
            'artwork': 'assets/boards/microbit-v2.svg'
        },
        'source': 'https://tech.microbit.org/hardware/edgeconnector/',
        'datasheet': docs['microbit-v2-schematic']['url'],
        'verifiedOn': verified_on,
        'pins': pins
    }

    return [board_microbit]
