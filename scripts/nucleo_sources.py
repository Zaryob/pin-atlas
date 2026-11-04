"""Build the MB1136 NUCLEO-F103RB expansion connectors from ST UM1724."""
import copy
import re

import pdfplumber


def build_nucleo_f103rb(cache, docs, ref, chip):
    document = 'nucleo-um1724-r14'
    url = docs[document]['viewUrl']
    with pdfplumber.open(cache / docs[document]['file']) as pdf:
        arduino_page, morpho_start, morpho_end = (pdf.pages[n - 1] for n in (39, 55, 56))
        assert 'Table 12.' in arduino_page.extract_text()
        assert 'Table 27.' in morpho_end.extract_text()
        arduino = arduino_page.extract_tables()[0][1:]
        morpho = morpho_start.extract_tables()[-1][2:] + morpho_end.extract_tables()[0][2:]

    connectors = {name: {} for name in ('CN7', 'CN6', 'CN8', 'CN10', 'CN5', 'CN9')}
    arduino_ref = ref('nucleo-f103rb-arduino', document, 39, 'Table 12 · Arduino headers')
    bridges_ref = ref('nucleo-f103rb-bridges', document, 26, 'Table 10 · solder bridges and alternate connections (pp. 26–27)')
    for heading, number, label, signal, _ in arduino:
        if heading and heading.startswith('CN'):
            connector = heading.split()[0]
        if number and number.isdigit():
            connectors[connector][int(number)] = (label, signal or label, arduino_ref)
    for row in morpho:
        page = 55 if int(row[0]) <= 5 else 56
        evidence = ref(f'nucleo-f103rb-morpho-{page}', document, page, 'Table 27 · ST Morpho headers')
        for header, number, signal in (('CN7', row[0], row[1]), ('CN7', row[3], row[2]),
                                        ('CN10', row[4], row[5]), ('CN10', row[7], row[6])):
            connectors[header][int(number)] = (None, signal, evidence)

    sizes = [38, 8, 6, 38, 10, 8]
    assert all(sorted(pins) == list(range(1, count + 1)) for pins, count in zip(connectors.values(), sizes))
    by_name = {pin['name']: pin for pin in chip['pins']}
    aliases = {'RESET': 'NRST', 'AVDD': 'VDDA', 'PD0': 'OSC_IN', 'PD1': 'OSC_OUT'}
    notes = {
        'PA2': 'nucleoUsart', 'PA3': 'nucleoUsart', 'PA5': 'nucleoLed',
        'PC14': 'nucleoLse', 'PC15': 'nucleoLse',
        'PD0': 'nucleoHse', 'PD1': 'nucleoHse',
    }
    pins = []
    for index, (header, contacts) in enumerate(connectors.items()):
        for number, (label, raw, evidence) in sorted(contacts.items()):
            raw = ' '.join(raw.split())
            signal = re.sub(r'\(\d+\)', '', raw).split(' or ')[0].strip()
            if signal == '-':
                signal = label or 'NC'
            if signal == 'AREF':
                signal = 'AVDD'
            source = by_name.get(aliases.get(signal, signal))
            pin = copy.deepcopy(source) if source else {
                'type': 'GND' if signal in ('GND', 'AGND') else 'SYSTEM' if signal == 'NC' else 'POWER',
                'functions': [], 'evidence': [],
            }
            # Board labels identify connector signals; package names identify the silicon pads.
            pin.update(number=len(pins) + 1, name=signal, net=signal, connector=header,
                       connectorPin=number, physicalLabel=f'{header}.{number}')
            pin['evidence'].insert(0, evidence)
            if label:
                pin['boardLabel'] = label
            if source:
                pin['mcuPin'] = source['number']
            elif signal == 'NC':
                pin['reserved'] = True
            else:
                assert signal in {'VDD', 'E5V', 'GND', 'AGND', 'IOREF', '+3.3V', '+5V', 'VIN', 'U5V'}, signal
            note = 'nucleoA45' if ' or ' in raw else notes.get(signal)
            if signal in ('PD0', 'PD1'):
                pin.pop('noteKey', None)
            if note:
                pin['boardCircuitKey'] = note
                pin['evidence'].append(bridges_ref)
            pin['position'] = {'x': 260 + (index // 3) * 300, 'y': 60 + (number - 1 + (0, 40, 52)[index % 3]) * 24,
                               'side': 'left' if index < 3 else 'right'}
            pins.append(pin)
    for pin in pins:
        if pin['type'] == 'GPIO':
            pin['sharedWith'] = [other['physicalLabel'] for other in pins
                                 if other is not pin and other['net'] == pin['net']]
    return {
        'id': 'nucleo-f103rb', 'name': 'NUCLEO-F103RB', 'family': 'STM32', 'shortName': 'NUCLEO-F103RB',
        'subtitle': 'Nucleo-64 · MB1136 · Arduino Uno and ST Morpho', 'layout': 'custom',
        'diagram': {'width': 820, 'height': 1550, 'artwork': 'assets/boards/nucleo-f103rb.svg', 'minWidth': 640},
        'packagePins': len(pins), 'gpioCount': sum(pin['type'] == 'GPIO' for pin in pins),
        'uniqueGPIOCount': len({pin['net'] for pin in pins if pin['type'] == 'GPIO'}),
        'voltage': '3.3 V I/O', 'mcu': chip['mcu'], 'processor': chip['processor'], 'clock': chip['clock'],
        'verifiedOn': chip['verifiedOn'], 'scopeKey': 'nucleoF103Scope', 'source': url + '#page=39',
        'datasheet': chip['datasheet'], 'pins': pins,
    }
