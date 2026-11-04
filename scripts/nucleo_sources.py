"""Build MB1136 expansion connectors from ST UM1724."""
import copy
import re
import xml.etree.ElementTree as ET

import pdfplumber


def read_f4_chip(cache, docs, ref, model, verified_on, category):
    package_id, modes_id = f'{model}-package', f'{model}-modes'
    package_doc, modes_doc = docs[package_id], docs[modes_id]
    package = ET.parse(cache / package_doc['file']).getroot()
    modes = ET.parse(cache / modes_doc['file']).getroot()
    assert package.get('Package') == 'LQFP64'
    pin_ref = ref(package_id, package_id, None, 'LQFP64 package pin numbers and signals', 'manufacturer-xml')
    mode_ref = ref(modes_id, modes_id, None, 'GPIO alternate function selectors', 'manufacturer-xml')
    selectors = {}
    for pad in modes.findall('{*}GPIO_Pin'):
        port = re.match(r'P[A-H]\d+', pad.get('Name'))
        if not port:
            continue
        for signal in pad.findall('{*}PinSignal'):
            value = signal.findtext("{*}SpecificParameter[@Name='GPIO_AF']/{*}PossibleValue", '')
            match = re.match(r'GPIO_(AF\d+)_', value)
            if match:
                selectors[port[0], signal.get('Name')] = match[1]
    pins = []
    for pad in package.findall('{*}Pin'):
        name = pad.get('Name')
        port = re.match(r'P[A-H]\d+', name)
        if port:
            name = port[0]
        if name == 'VREF+':
            name = 'VDDA'
        pin_type = 'GPIO' if port else 'POWER' if pad.get('Type') == 'Power' else 'SYSTEM'
        functions = []
        for signal in pad.findall('{*}Signal'):
            signal = signal.get('Name')
            if signal == 'GPIO':
                continue
            group = category(signal)
            if signal.startswith('USART'):
                group = 'UART'
            elif signal.startswith('TIM'):
                group = 'PWM' if re.search(r'_CH[1-4]', signal) else 'TIMER'
            selector = selectors.get((name, signal))
            function = {'name': signal, 'signal': signal, 'group': group, 'evidence': pin_ref}
            if selector:
                function.update(selector=selector, configurationEvidence=mode_ref)
            functions.append(function)
        pins.append({'number': int(pad.get('Position')), 'name': name, 'type': pin_type,
                     'functions': functions, 'evidence': [pin_ref]})
    assert sorted(pin['number'] for pin in pins) == list(range(1, 65))
    return {'mcu': f'STM32{model.upper()}T6', 'processor': 'Arm Cortex-M4',
            'clock': '84 MHz' if model == 'f401re' else '100 MHz', 'verifiedOn': verified_on,
            'datasheet': f'https://www.st.com/resource/en/datasheet/stm32{model}.pdf', 'pins': pins}


def build_nucleo(cache, docs, ref, chip, model):
    document = 'nucleo-um1724-r14'
    board_id = f'nucleo-{model}'
    url = docs[document]['viewUrl']
    arduino_pages = (39,) if model == 'f103rb' else (43, 44)
    morpho_pages = (55, 56) if model == 'f103rb' else (58,)
    arduino_table = 12 if model == 'f103rb' else 16
    morpho_table = 27 if model == 'f103rb' else 29
    connectors = {name: {} for name in ('CN7', 'CN6', 'CN8', 'CN10', 'CN5', 'CN9')}
    bridges_ref = ref('nucleo-mb1136-bridges', document, 26, 'Table 10 · solder bridges and alternate connections (pp. 26–27)')
    with pdfplumber.open(cache / docs[document]['file']) as pdf:
        for page in arduino_pages:
            evidence = ref(f'{board_id}-arduino-{page}', document, page, f'Table {arduino_table} · Arduino headers')
            tables = pdf.pages[page - 1].extract_tables()
            # Page 43 has the preceding model’s continuation above this table.
            for heading, number, label, signal, _ in tables[-1][1:]:
                if heading and heading.startswith('CN'):
                    connector = heading.split()[0]
                if number and number.isdigit():
                    connectors[connector][int(number)] = (label, signal or label, evidence)
        for page in morpho_pages:
            evidence = ref(f'{board_id}-morpho-{page}', document, page, f'Table {morpho_table} · ST Morpho headers')
            rows = pdf.pages[page - 1].extract_tables()[-1][2:]
            for row in rows:
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
        'PD0': 'nucleoHse', 'PD1': 'nucleoHse', 'PH0': 'nucleoF4Hse', 'PH1': 'nucleoF4Hse',
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
        'id': board_id, 'name': board_id.upper(), 'family': 'STM32', 'shortName': board_id.upper(),
        'subtitle': 'Nucleo-64 · MB1136 · Arduino Uno and ST Morpho', 'layout': 'custom',
        'diagram': {'width': 820, 'height': 1550, 'artwork': 'assets/boards/nucleo-mb1136.svg', 'minWidth': 640},
        'packagePins': len(pins), 'gpioCount': sum(pin['type'] == 'GPIO' for pin in pins),
        'uniqueGPIOCount': len({pin['net'] for pin in pins if pin['type'] == 'GPIO'}),
        'voltage': '3.3 V I/O', 'mcu': chip['mcu'], 'processor': chip['processor'], 'clock': chip['clock'],
        'verifiedOn': chip['verifiedOn'], 'scopeKey': 'nucleoF103Scope', 'source': f'{url}#page={arduino_pages[0]}',
        'datasheet': chip['datasheet'], 'pins': pins,
    }
