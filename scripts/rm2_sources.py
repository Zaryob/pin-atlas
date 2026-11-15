"""Raspberry Pi Radio Module 2 (RM2) profile and pinout."""
import pdfplumber

def build_rm2(cache, docs, obs, ref, verified_on):
    datasheet = cache / docs['rm2-datasheet']['file']
    assert datasheet.exists()

    with pdfplumber.open(datasheet) as pdf:
        p6_text = pdf.pages[5].extract_text() or ''
        p11_text = pdf.pages[10].extract_text() or ''
        assert 'CYW43_DEFAULT_PIN_WL_DATA_OUT' in p6_text and 'CYW43_DEFAULT_PIN_WL_REG_ON' in p6_text
        assert 'Table 2' in p11_text and 'gSPI SCLK' in p11_text and 'GPIO29' in p11_text

    phys = ref('rm2-pinout', 'rm2-datasheet', 11,
               'Table 2 · The function of each pin on a Raspberry Pi Radio Module 2', 'table')
    host_int = ref('rm2-host-integration', 'rm2-datasheet', 6,
                   'Table 1 · GPIO connections needed to communicate with Raspberry Pi Radio Module 2', 'table')
    elec = ref('rm2-electrical', 'rm2-datasheet', 12,
               '§2.6 · Electrical specifications · Vin 3.0 V to 4.8 V, VDDIO 1.8 V / 3.3 V', 'pdf-text')

    raw_defs = [
        # (pinNum, conn, connPin, name, label, net, ptype, fns, strap, noteKey, boardCircuitKey, x, y, side[, angle])
        (1,  'LEFT', 1, 'GND', 'GND', 'GND', 'GND', [], False, None, None, 270, 160, 'left'),
        (2,  'LEFT', 2, 'NC', 'NC', 'NC', 'SYSTEM', [], False, 'rm2NcNote', None, 270, 200, 'left'),
        (3,  'LEFT', 3, 'gSPI_SCLK', 'SCLK', 'SPI_CLK', 'SYSTEM', [('gSPI CLK', 'SPI', 'SCLK')], False, 'rm2SclkNote', None, 270, 240, 'left'),
        (4,  'LEFT', 4, 'GND', 'GND', 'GND', 'GND', [], False, None, None, 270, 280, 'left'),
        (5,  'LEFT', 5, 'gSPI_MOSI', 'DIN', 'SPI_DIN', 'SYSTEM', [('gSPI DIN', 'SPI', 'MOSI')], False, 'rm2DinNote', None, 270, 320, 'left'),
        (6,  'LEFT', 6, 'gSPI_MISO', 'DOUT', 'SPI_DOUT', 'SYSTEM', [('gSPI DOUT', 'SPI', 'MISO')], False, 'rm2DoutNote', 'rm2DoutCircuit', 270, 360, 'left'),
        (7,  'LEFT', 7, 'GND', 'GND', 'GND', 'GND', [], False, None, None, 270, 400, 'left'),

        (8,  'BOTTOM', 1, 'GPIO0', 'GPIO0', 'CYW_GPIO0', 'GPIO', [('GPIO0', 'GPIO', 'GPIO0')], False, 'rm2Gpio0Note', None, 305, 452, 'right', 90),
        (9,  'BOTTOM', 2, 'gSPI_CS', 'CS', 'SPI_CS', 'SYSTEM', [('gSPI CS', 'SPI', 'CS')], False, 'rm2CsNote', None, 345, 452, 'right', 90),
        (10, 'BOTTOM', 3, 'nIRQ', 'nIRQ', 'CYW_nIRQ', 'SYSTEM', [('nIRQ', 'IRQ', 'nIRQ')], False, 'rm2IrqNote', 'rm2IrqCircuit', 385, 452, 'right', 90),
        (11, 'BOTTOM', 4, 'GND', 'GND', 'GND', 'GND', [], False, None, None, 425, 452, 'right', 90),
        (12, 'BOTTOM', 5, 'WL_REG_ON', 'WL_ON', 'WL_REG_ON', 'SYSTEM', [('WL_REG_ON', 'SYSTEM', 'REG_ON')], False, 'rm2WlOnNote', None, 465, 452, 'right', 90),
        (13, 'BOTTOM', 6, 'BT_REG_ON', 'BT_ON', 'BT_REG_ON', 'SYSTEM', [('BT_REG_ON', 'SYSTEM', 'REG_ON')], False, 'rm2BtOnNote', None, 505, 452, 'right', 90),
        (14, 'BOTTOM', 7, 'VDDIO', 'VDDIO', 'VDDIO', 'POWER', [], False, 'rm2VddioNote', None, 545, 452, 'right', 90),

        (15, 'RIGHT', 1, 'GND', 'GND', 'GND', 'GND', [], False, None, None, 550, 400, 'right'),
        (16, 'RIGHT', 2, 'VIN', 'VIN', 'VBAT', 'POWER', [], False, 'rm2VinNote', None, 550, 360, 'right'),
        (17, 'RIGHT', 3, 'GPIO2', 'GPIO2', 'CYW_GPIO2', 'GPIO', [('GPIO2', 'GPIO', 'GPIO2')], False, 'rm2Gpio2Note', None, 550, 320, 'right'),
        (18, 'RIGHT', 4, 'GPIO1', 'GPIO1', 'CYW_GPIO1', 'GPIO', [('GPIO1', 'GPIO', 'GPIO1')], False, 'rm2Gpio1Note', None, 550, 280, 'right'),
        (19, 'RIGHT', 5, 'NC', 'NC', 'NC', 'SYSTEM', [], False, 'rm2NcNote', None, 550, 240, 'right'),
        (20, 'RIGHT', 6, 'NC', 'NC', 'NC', 'SYSTEM', [], False, 'rm2NcNote', None, 550, 200, 'right'),
        (21, 'RIGHT', 7, 'GND', 'GND', 'GND', 'GND', [], False, None, None, 550, 160, 'right'),
    ]

    pins = []
    for num, conn, connPin, name, label, net, ptype, fns, strap, noteKey, circuitKey, x, y, side, *rest in raw_defs:
        angle = rest[0] if rest else 0
        functions = []
        for fname, fgroup, fsignal in fns:
            functions.append({
                'name': fname,
                'group': fgroup,
                'signal': fsignal,
                'evidence': host_int if ptype in ('SPI', 'IRQ') else phys
            })
        pin = {
            'number': num,
            'physicalLabel': f'Pin {num}',
            'connector': conn,
            # The datasheet numbers the pads 1-21 around the module; show that number.
            'connectorPin': num,
            'name': name,
            'boardLabel': label,
            'type': ptype,
            'functions': functions,
            'evidence': [phys],
            'net': net,
            'position': {'x': x, 'y': y, 'side': side, **({'angle': angle} if angle else {})}
        }
        if noteKey:
            pin['noteKey'] = noteKey
        if circuitKey:
            pin['boardCircuitKey'] = circuitKey
        pins.append(pin)

    board = {
        'id': 'raspberry-pi-rm2',
        'name': 'Raspberry Pi RM2',
        'shortName': 'RM2',
        'subtitle': 'CYW43439 · Wi-Fi 4 + Bluetooth 5.2 · 21-pad SMT module',
        'layout': 'custom',
        'scopeKey': 'rm2Scope',
        'category': 'Raspberry Pi',
        'family': 'Raspberry Pi',
        'packageName': '21-pad castellated SMT module',
        'packagePins': 21,
        'gpioCount': 3,
        'uniqueGPIOCount': 3,
        'voltage': '1.8 V / 3.3 V I/O',
        'mcu': 'CYW43439',
        'processor': 'Infineon CYW43439 (Arm Cortex-M3 WLAN/BT subsystem)',
        'clock': '37.4 MHz',
        'wireless': True,
        'diagram': {
            'width': 820,
            'height': 720,
            'artwork': 'assets/boards/raspberry-pi-rm2.svg'
        },
        'orientation': 'usb-bottom',
        'source': docs['rm2-datasheet']['viewUrl'],
        'datasheet': docs['rm2-datasheet']['url'],
        'verifiedOn': verified_on,
        'pins': pins
    }

    return [board]
