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

    # Physical strip order comes from the manufacturer's V2 edge-connector table.
    edge_doc = (cache / docs['microbit-edge-connector']['file']).read_text()
    assert 'There are 25 strips/pins including 5 rings' in edge_doc
    edge_ref = ref('microbit-v2-edge-table', 'microbit-edge-connector', None,
                   'Pins and signals · V2 table · physical strip order, MCU pins and pull resistors', 'manufacturer-source-table')
    i2c_doc = (cache / docs['microbit-i2c']['file']).read_text()
    assert 'separates the I2C signals into Internal and External use' in i2c_doc
    assert 'The internal signals run to the target Nordic chip and communicate with the motion sensor and interface chip' in i2c_doc
    i2c_ref = ref('microbit-v2-i2c-buses', 'microbit-i2c', None, 'I2C bus · V2 separates internal (sensor) and external (edge connector) buses', 'manufacturer-source-text')
    v2 = edge_doc.split('<TabItem value="v2"', 1)[1].split('</TabItem>', 1)[0]
    rows = [[cell.strip() for cell in line.strip().strip('|').split('|')] for line in v2.splitlines() if line.startswith('|')][2:]
    strips = []
    for ring, mod, schem, mcu, sw, functions, direction, pull in rows:
        grouped = functions.startswith('}')
        if grouped and strips and strips[-1]['ring'] and strips[-1]['schem'] == schem:
            strips[-1]['mcu'] = strips[-1]['mcu'] or mcu
            strips[-1]['pull'] = strips[-1]['pull'] if strips[-1]['pull'] not in ('', '--') else pull
        else:
            strips.append({'ring': grouped, 'schem': schem, 'mcu': mcu, 'sw': sw, 'pull': pull})
    assert len(strips) == 25 and sum(strip['ring'] for strip in strips) == 5
    by_name = {definition[3]: definition for definition in pin_defs}
    extra = {'3V': [22, 23], 'GND': [24, 25]}
    pins = []
    for position, strip in enumerate(strips, 1):
        name = strip['sw'] or {'+V_TGT': '3V', 'GND': 'GND'}[strip['schem']]
        if name in extra and not strip['ring']:
            number = extra[name].pop(0)
            conn, connPin, label, net, ptype, fspecs, circuitKey = 'EDGE', f"{name}.{'A' if number % 2 == 0 else 'B'}", name, name, 'POWER' if name == '3V' else 'GND', [], None
        else:
            number, conn, connPin, _, label, net, ptype, fspecs, circuitKey, _, _, _ = by_name[name]
            assert strip['ring'] == (conn == 'RING'), name
            if ptype == 'GPIO':
                assert strip['mcu'].split('/')[0] == net, (name, strip['mcu'])
        left = position <= 13
        functions = [{'name': fname, 'group': fgroup, 'signal': fname, 'evidence': function_ref} for fname, fgroup in fspecs]
        pin = {
            'number': number,
            'physicalLabel': f'{conn}.{connPin}',
            'connector': conn,
            'connectorPin': connPin,
            'edgePosition': position,
            'name': name,
            'boardLabel': label,
            'type': ptype,
            'functions': functions,
            'evidence': [physical_ref, edge_ref],
            'net': net,
            'position': {'x': 280 if left else 540, 'y': 100 + ((position - 1) if left else (position - 14)) * 30, 'side': 'left' if left else 'right'}
        }
        if circuitKey:
            pin['boardCircuitKey'] = circuitKey
        if circuitKey == 'microbitI2cPullupNote':
            assert strip['pull'] == 'e4k7u' and strip['schem'].startswith('I2C EXT')
            pin['noteEvidence'] = {circuitKey: [edge_ref, i2c_ref]}
            pin['evidence'].append(i2c_ref)
        pins.append(pin)
    assert not extra['3V'] and not extra['GND']
    assert [pin['name'] for pin in pins] == ['P3', 'P0', 'P4', 'P5', 'P6', 'P7', 'P1', 'P8', 'P9', 'P10', 'P11', 'P12', 'P2',
                                           'P13', 'P14', 'P15', 'P16', '3V', '3V', '3V', 'P19', 'P20', 'GND', 'GND', 'GND']
    pins.sort(key=lambda pin: pin['number'])

    board_microbit = {
        'id': 'microbit-v2',
        'name': 'BBC micro:bit V2',
        'shortName': 'micro:bit V2',
        'scopeKey': 'microbitV2Scope',
        'subtitle': 'nRF52833 · Cortex-M4F · 64 MHz · 3.3 V I/O',
        'layout': 'custom',
        'category': 'micro:bit',
        'family': 'micro:bit',
        'packageName': 'Edge connector · 25 front strips',
        'packagePins': 25,
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
        'datasheet': docs['microbit-v2-schematic'].get('viewUrl', docs['microbit-v2-schematic']['url']),
        'verifiedOn': verified_on,
        'pins': pins
    }

    return [board_microbit]
