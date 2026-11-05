"""Build MB1136 expansion connectors from ST UM1724."""
import copy
import re
import xml.etree.ElementTree as ET

import pdfplumber
from stm32_sources import SnapshotDocument, verify_snapshot

# Connector navigation belongs to the carrier layout, not the MCU family.
NUCLEO_64_CONNECTOR_GROUPS = [
    {'id': 'arduino', 'label': 'Arduino', 'contacts': ['CN5', 'CN6', 'CN8', 'CN9']},
    {'id': 'CN7', 'label': 'ST Morpho · CN7', 'contacts': ['CN7']},
    {'id': 'CN10', 'label': 'ST Morpho · CN10', 'contacts': ['CN10']},
]
NUCLEO_144_CONNECTOR_GROUPS = [
    {'id': 'CN7', 'label': 'ST Zio · CN7', 'contacts': ['CN7']},
    {'id': 'CN8', 'label': 'ST Zio · CN8', 'contacts': ['CN8']},
    {'id': 'MORPHO', 'label': 'ST Morpho', 'contacts': ['MORPHO']},
]


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
        pin_type = 'GPIO' if port else 'GND' if name.startswith('VSS') else 'POWER' if pad.get('Type') == 'Power' else 'SYSTEM'
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
    name = f'STM32{model.upper()}T6'
    clock = '84 MHz' if model == 'f401re' else '100 MHz'
    return {'id': name.lower(), 'name': name, 'shortName': name, 'mcu': name,
            'family': 'STMicroelectronics', 'processor': 'Arm Cortex-M4',
            'subtitle': f'LQFP-64 · Cortex-M4 · {clock}', 'clock': clock, 'verifiedOn': verified_on,
            'layout': 'lqfp', 'packageName': 'LQFP-64', 'packagePins': len(pins),
            'gpioCount': sum(pin['type'] == 'GPIO' for pin in pins), 'voltage': '1.8–3.6 V (POR/PDR on)',
            'source': package_doc['viewUrl'], 'datasheet': f'https://www.st.com/resource/en/datasheet/stm32{model}.pdf',
            'pins': pins}


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
    drawing_page = 30 if model == 'f103rb' else 32
    drawing_ref = ref(f'{board_id}-top-view', document, drawing_page,
                      'MB1136 top view · connector positions, rows and numbering', 'visual-diagram')
    pins = []
    for header, contacts in connectors.items():
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
            pin['evidence'][:0] = [evidence, drawing_ref]
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
            if header in ('CN7', 'CN10'):
                x = (148 if header == 'CN7' else 724) + 28 * ((number - 1) % 2)
                y = 240 + 24 * ((number - 1) // 2)
                side = 'left' if number % 2 else 'right'
            else:
                x = 310 if header in ('CN6', 'CN8') else 590
                y = {'CN6': 336 + 24 * (number - 1), 'CN8': 552 + 24 * (number - 1),
                     'CN5': 252 + 24 * (10 - number), 'CN9': 504 + 24 * (8 - number)}[header]
                side = 'right' if header in ('CN6', 'CN8') else 'left'
            pin['position'] = {'x': x, 'y': y, 'side': side}
            pins.append(pin)
    for pin in pins:
        if pin['type'] == 'GPIO':
            pin['sharedWith'] = [other['physicalLabel'] for other in pins
                                 if other is not pin and other['net'] == pin['net']]
    return {
        'id': board_id, 'name': board_id.upper(), 'family': 'STM32', 'shortName': board_id.upper(),
        'subtitle': 'Nucleo-64 · MB1136 · Arduino Uno and ST Morpho', 'layout': 'custom',
        'diagram': {'width': 900, 'height': 720, 'artwork': 'assets/boards/nucleo-mb1136.svg', 'minWidth': 760,
                    'connectorGroups': copy.deepcopy(NUCLEO_64_CONNECTOR_GROUPS)},
        'packagePins': len(pins), 'gpioCount': sum(pin['type'] == 'GPIO' for pin in pins),
        'uniqueGPIOCount': len({pin['net'] for pin in pins if pin['type'] == 'GPIO'}),
        'voltage': '3.3 V I/O', 'mcu': chip['mcu'], 'processor': chip['processor'], 'clock': chip['clock'],
        'verifiedOn': chip['verifiedOn'], 'scopeKey': 'nucleoF103Scope', 'source': f'{url}#page={arduino_pages[0]}',
        'datasheet': chip['datasheet'], 'orientation': 'usb', 'pins': pins,
        **({'mcuProfile': chip['id']} if 'id' in chip else {}),
    }


def read_g4_chip(cache, docs, ref, verified_on, category):
    package_id, modes_id = 'g474re-package', 'g474re-modes'
    package_doc, modes_doc = docs[package_id], docs[modes_id]
    package = ET.parse(cache / package_doc['file']).getroot()
    modes = ET.parse(cache / modes_doc['file']).getroot()
    assert package.get('Package') == 'LQFP64'
    pin_ref = ref(package_id, package_id, None, 'LQFP64 package pin numbers and signals', 'manufacturer-xml')
    mode_ref = ref(modes_id, modes_id, None, 'GPIO alternate function selectors', 'manufacturer-xml')
    selectors = {}
    for pad in modes.findall('{*}GPIO_Pin'):
        port = re.match(r'P[A-I]\d+', pad.get('Name'))
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
        port = re.match(r'P[A-I]\d+', name)
        clean_name = port[0] if port else name
        if clean_name == 'VREF+':
            clean_name = 'VDDA'
        pin_type = 'GPIO' if port else 'GND' if clean_name.startswith('VSS') else 'POWER' if pad.get('Type') == 'Power' else 'SYSTEM'
        functions = []
        for signal in pad.findall('{*}Signal'):
            signal = signal.get('Name')
            if signal == 'GPIO':
                continue
            group = category(signal)
            if signal.startswith(('USART', 'LPUART', 'UART')):
                group = 'UART'
            elif signal.startswith('HRTIM'):
                group = 'PWM' if re.search(r'(_CH|_EEV|OUT)', signal) else 'TIMER'
            elif signal.startswith('TIM'):
                group = 'PWM' if re.search(r'_CH[1-4]', signal) else 'TIMER'
            elif signal.startswith(('CAN', 'FDCAN')):
                group = 'CAN'
            elif signal.startswith(('COMP', 'OPAMP')):
                group = 'ADC'
            elif signal.startswith('DAC'):
                group = 'DAC'
            elif signal.startswith(('QUADSPI', 'OCTOSPI')):
                group = 'SPI'
            elif signal.startswith('SAI'):
                group = 'I2S'
            elif signal.startswith(('UCPD', 'USB')):
                group = 'USB'
            selector = selectors.get((clean_name, signal))
            function = {'name': signal, 'signal': signal, 'group': group, 'evidence': pin_ref}
            if selector:
                function.update(selector=selector, configurationEvidence=mode_ref)
            functions.append(function)
        pins.append({'number': int(pad.get('Position')), 'name': clean_name, 'type': pin_type,
                     'functions': functions, 'evidence': [pin_ref]})
    assert sorted(pin['number'] for pin in pins) == list(range(1, 65))
    name = 'STM32G474RET6'
    clock = '170 MHz'
    return {'id': name.lower(), 'name': name, 'shortName': name, 'mcu': name,
            'family': 'STMicroelectronics', 'processor': 'Arm Cortex-M4',
            'subtitle': f'LQFP-64 · Cortex-M4 · {clock}', 'clock': clock, 'verifiedOn': verified_on,
            'layout': 'lqfp', 'packageName': 'LQFP-64', 'packagePins': len(pins),
            'gpioCount': sum(pin['type'] == 'GPIO' for pin in pins), 'voltage': '1.71–3.6 V',
            'source': package_doc['viewUrl'], 'datasheet': 'https://www.st.com/resource/en/datasheet/stm32g474re.pdf',
            'pins': pins}


def build_nucleo_g474(cache, docs, ref, chip, use_snapshots=False):
    document = 'nucleo-g4-um2505'
    board_id = 'nucleo-g474re'
    url = docs[document]['viewUrl']
    connectors = {name: {} for name in ('CN7', 'CN6', 'CN8', 'CN10', 'CN5', 'CN9')}
    bridges_ref = ref('nucleo-g474-bridges', document, 27, 'Table 13 · Solder bridge control (p. 27)')
    def open_source():
        if use_snapshots and docs[document].get('tableSnapshot'):
            return SnapshotDocument(verify_snapshot(docs[document], cache.parents[1]))
        return pdfplumber.open(cache / docs[document]['file'])

    with open_source() as pdf:
        for page in (30, 31):
            evidence = ref(f'{board_id}-arduino-{page}', document, page, 'Table 15 · Arduino connectors pinout')
            table = pdf.pages[page - 1].extract_tables()[0]
            cur_conn = None
            for row in table[1:]:
                cname, pnum, label, sig, stm_pin, func = row[:6]
                if cname and cname.startswith('CN'):
                    cur_conn = cname
                if pnum and pnum.isdigit():
                    clean_stm = stm_pin.replace('\n', ' ').strip() if stm_pin else None
                    connectors[cur_conn][int(pnum)] = (label, clean_stm or label, evidence)
        for page in (32, 33):
            evidence = ref(f'{board_id}-morpho-{page}', document, page, 'Table 16 · ST morpho connectors')
            table = pdf.pages[page - 1].extract_tables()[0]
            for row in table[2:]:
                p1, n1, p2, n2, p3, n3, p4, n4 = row[:8]
                if p1 and p1.isdigit():
                    connectors['CN7'][int(p1)] = (None, n1, evidence)
                if p2 and p2.isdigit():
                    connectors['CN7'][int(p2)] = (None, n2, evidence)
                if p3 and p3.isdigit():
                    connectors['CN10'][int(p3)] = (None, n3, evidence)
                if p4 and p4.isdigit():
                    connectors['CN10'][int(p4)] = (None, n4, evidence)

    sizes = [38, 8, 6, 38, 10, 8]
    assert all(sorted(pins) == list(range(1, count + 1)) for pins, count in zip(connectors.values(), sizes))
    by_name = {pin['name']: pin for pin in chip['pins']}
    aliases = {
        'RESET': 'PG10', 'NRST': 'PG10', 'PG10-NRST': 'PG10',
        'AVDD': 'VDDA', 'VREFP': 'VDDA', 'VREF+': 'VDDA',
        'BOOT0': 'PB8', 'BOOT0(2)': 'PB8',
        '3V3': '+3.3V', '5V': '+5V', '5V_USB_CHGR': 'U5V',
    }
    notes = {
        'PA2': 'nucleoUsart', 'PA3': 'nucleoUsart', 'PA5': 'nucleoLed',
        'PC14': 'nucleoLse', 'PC15': 'nucleoLse',
        'PF0': 'nucleoHse', 'PF1': 'nucleoHse',
    }
    drawing_ref = ref(f'{board_id}-top-view', document, 24,
                      'MB1367 top view · connector positions, rows and numbering', 'visual-diagram')
    pins = []
    for header, contacts in connectors.items():
        for number, (label, raw, evidence) in sorted(contacts.items()):
            raw = ' '.join(raw.split())
            signal = re.sub(r'\(\d+\)', '', raw).split(' or ')[0].strip()
            signal = signal.split('/')[0].strip()
            if signal == '-':
                signal = label or 'NC'
            mapped = aliases.get(signal, signal)
            source = by_name.get(mapped)
            pin = copy.deepcopy(source) if source else {
                'type': 'GND' if mapped in ('GND', 'AGND') else 'SYSTEM' if mapped == 'NC' else 'POWER',
                'functions': [], 'evidence': [],
            }
            display_name = signal if signal in ('NRST', 'BOOT0', 'VREF+') else mapped
            pin.update(number=len(pins) + 1, name=display_name, net=mapped, connector=header,
                       connectorPin=number, physicalLabel=f'{header}.{number}')
            pin['evidence'][:0] = [evidence, drawing_ref]
            if label:
                pin['boardLabel'] = label
            if source:
                pin['mcuPin'] = source['number']
            elif mapped == 'NC':
                pin['reserved'] = True
            else:
                assert mapped in {'VDD', 'E5V', 'GND', 'AGND', 'IOREF', '+3.3V', '+5V', 'VIN', 'U5V', 'VBAT'}, mapped
            note = 'nucleoA45' if '/' in raw else notes.get(mapped)
            if note:
                pin['boardCircuitKey'] = note
                pin['evidence'].append(bridges_ref)
            if header in ('CN7', 'CN10'):
                x = (148 if header == 'CN7' else 724) + 28 * ((number - 1) % 2)
                y = 240 + 24 * ((number - 1) // 2)
                side = 'left' if number % 2 else 'right'
            else:
                x = 310 if header in ('CN6', 'CN8') else 590
                y = {'CN6': 336 + 24 * (number - 1), 'CN8': 552 + 24 * (number - 1),
                     'CN5': 252 + 24 * (10 - number), 'CN9': 504 + 24 * (8 - number)}[header]
                side = 'right' if header in ('CN6', 'CN8') else 'left'
            pin['position'] = {'x': x, 'y': y, 'side': side}
            pins.append(pin)
    for pin in pins:
        if pin['type'] == 'GPIO':
            pin['sharedWith'] = [other['physicalLabel'] for other in pins
                                 if other is not pin and other['net'] == pin['net']]
    return {
        'id': board_id, 'name': 'NUCLEO-G474RE', 'family': 'STM32', 'shortName': 'NUCLEO-G474RE',
        'subtitle': 'Nucleo-64 · MB1367 · Arduino Uno and ST Morpho', 'layout': 'custom',
        'diagram': {'width': 900, 'height': 720, 'artwork': 'assets/boards/nucleo-mb1136.svg', 'minWidth': 760,
                    'connectorGroups': copy.deepcopy(NUCLEO_64_CONNECTOR_GROUPS)},
        'packagePins': len(pins), 'gpioCount': sum(pin['type'] == 'GPIO' for pin in pins),
        'uniqueGPIOCount': len({pin['net'] for pin in pins if pin['type'] == 'GPIO'}),
        'voltage': '3.3 V I/O', 'mcu': chip['mcu'], 'processor': chip['processor'], 'clock': chip['clock'],
        'verifiedOn': chip['verifiedOn'], 'source': f'{url}#page=30',
        'datasheet': chip['datasheet'], 'orientation': 'usb', 'pins': pins,
        'mcuProfile': chip['id'],
    }


def read_h7_chip(cache, docs, ref, verified_on, category):
    package_id, modes_id = 'h723zg-package', 'h723zg-modes'
    package_doc, modes_doc = docs[package_id], docs[modes_id]
    package = ET.parse(cache / package_doc['file']).getroot()
    modes = ET.parse(cache / modes_doc['file']).getroot()
    assert package.get('Package') == 'LQFP144'
    pin_ref = ref(package_id, package_id, None, 'LQFP144 package pin numbers and signals', 'manufacturer-xml')
    mode_ref = ref(modes_id, modes_id, None, 'GPIO alternate function selectors', 'manufacturer-xml')
    selectors = {}
    for pad in modes.findall('{*}GPIO_Pin'):
        port = re.match(r'P[A-H]\d+(?:_C)?', pad.get('Name'))
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
        port = re.match(r'P[A-H]\d+(?:_C)?', name)
        clean_name = port[0] if port else name
        pad_type = pad.get('Type')
        if port:
            pin_type = 'GPIO'
        elif clean_name.startswith('VSS'):
            pin_type = 'GND'
        elif pad_type == 'Power' or clean_name in ('VDD', 'VDDA', 'VBAT', 'VCAP', 'VDD33USB', 'PDR_ON', 'VREF+'):
            pin_type = 'POWER'
        else:
            pin_type = 'SYSTEM'
        functions = []
        for signal in pad.findall('{*}Signal'):
            signal = signal.get('Name')
            if signal == 'GPIO':
                continue
            group = category(signal)
            if signal.startswith('USART') or signal.startswith('UART'):
                group = 'UART'
            elif signal.startswith('TIM'):
                group = 'PWM' if re.search(r'_CH[1-4]', signal) else 'TIMER'
            selector = selectors.get((clean_name, signal))
            function = {'name': signal, 'signal': signal, 'group': group, 'evidence': pin_ref}
            if selector:
                function.update(selector=selector, configurationEvidence=mode_ref)
            functions.append(function)
        pins.append({'number': int(pad.get('Position')), 'name': clean_name, 'type': pin_type,
                     'functions': functions, 'evidence': [pin_ref]})
    assert sorted(pin['number'] for pin in pins) == list(range(1, 145))
    name = 'STM32H723ZGT6'
    clock = '550 MHz'
    return {'id': name.lower(), 'name': name, 'shortName': name, 'mcu': name,
            'family': 'STMicroelectronics', 'processor': 'Arm Cortex-M7',
            'subtitle': f'LQFP-144 · Cortex-M7 · {clock}', 'clock': clock, 'verifiedOn': verified_on,
            'layout': 'lqfp', 'packageName': 'LQFP-144', 'packagePins': len(pins),
            'gpioCount': sum(pin['type'] == 'GPIO' for pin in pins), 'voltage': '1.62–3.6 V',
            'source': package_doc['viewUrl'], 'datasheet': 'https://www.st.com/resource/en/datasheet/stm32h723zg.pdf',
            'pins': pins}


def build_nucleo_h723(cache, docs, ref, chip):
    board_id = 'nucleo-h723zg'
    h_doc = docs['nucleo-h723zg-variant-h']
    cpp_doc = docs['nucleo-h723zg-variant-cpp']
    ioc_doc = docs['nucleo-h723zg-ioc']
    h_ref = ref('nucleo-h723zg-variant-h', 'nucleo-h723zg-variant-h', None,
                'STMicroelectronics official NUCLEO-H723ZG pin mappings', 'code-variant')
    cpp_ref = ref('nucleo-h723zg-variant-cpp', 'nucleo-h723zg-variant-cpp', None,
                  'STMicroelectronics official digitalPin table', 'code-variant')
    ioc_ref = ref('nucleo-h723zg-ioc', 'nucleo-h723zg-ioc', None,
                  'STMicroelectronics official board configuration', 'hardware-spec')
    drawing_ref = ref(f'{board_id}-top-view', 'nucleo-h723zg-ioc', None,
                      'MB1364 top view · ST Zio and Morpho connector layout', 'visual-diagram')

    circuit_notes = {
        'PB0': 'nucleoH7LedGreen',
        'PE1': 'nucleoH7LedYellow',
        'PB14': 'nucleoH7LedRed',
        'PC13': 'nucleoH7Button',
        'PD8': 'nucleoH7VcpTx',
        'PD9': 'nucleoH7VcpRx',
        'PA1': 'nucleoH7Rmii', 'PA2': 'nucleoH7Rmii', 'PA7': 'nucleoH7Rmii',
        'PC1': 'nucleoH7Rmii', 'PC4': 'nucleoH7Rmii', 'PC5': 'nucleoH7Rmii',
        'PB13': 'nucleoH7Rmii', 'PG11': 'nucleoH7Rmii', 'PG13': 'nucleoH7Rmii',
        'PA9': 'nucleoH7Usb', 'PA10': 'nucleoH7Usb', 'PA11': 'nucleoH7Usb', 'PA12': 'nucleoH7Usb',
        'PD10': 'nucleoH7Usb', 'PG7': 'nucleoH7Usb',
    }

    by_name = {pin['name']: pin for pin in chip['pins']}
    sections = {
        '// CN7 right Arduino Uno connector': ('CN7', 1),
        '// CN7 left': ('CN7', 0),
        '// CN7 right': ('CN7', 1),
        '// CN8 right': ('CN8', 1),
        '// CN8 left': ('CN8', 0),
        '// CN7 left (analog part)': ('CN7', 0),
        '// ST morpho': ('MORPHO', 0),
    }

    raw_items = []
    power_pins_cn7 = [
        ('NC', 'SYSTEM', 'NC', True),
        ('IOREF', 'POWER', 'IOREF', False),
        ('NRST', 'SYSTEM', 'RESET', False),
        ('+3.3V', 'POWER', '3V3', False),
        ('+5V', 'POWER', '5V', False),
        ('GND', 'GND', 'GND', False),
        ('GND', 'GND', 'GND', False),
        ('VIN', 'POWER', 'VIN', False),
        ('VREF+', 'POWER', 'VREF+', False),
    ]
    for name, ptype, blabel, res in power_pins_cn7:
        raw_items.append({'header': 'CN7', 'name': name, 'type': ptype, 'boardLabel': blabel,
                          'reserved': res, 'functions': [], 'mcuPin': None, 'col': 0})

    with open(cache / h_doc['file']) as f:
        lines = f.readlines()

    cur_hdr, cur_col = None, 0
    morpho_count = 0
    for line in lines:
        sline = line.strip()
        if sline in sections:
            cur_hdr, cur_col = sections[sline]
        elif cur_hdr and sline.startswith('#define P'):
            m = re.match(r'#define\s+(P[A-H]\d+(?:_C)?)\s+([A-Za-z0-9_]+)(?:\s*//\s*(.*))?', sline)
            if m:
                port, aid, comm = m.groups()
                blabel = f'D{aid}' if aid.isdigit() else f'A{aid[5:]}' if aid.startswith('PIN_A') else aid
                mcu_p = by_name[port]
                col = cur_col
                if cur_hdr == 'MORPHO':
                    col = 0 if morpho_count < 21 else 1
                    morpho_count += 1
                raw_items.append({
                    'header': cur_hdr, 'name': port, 'type': 'GPIO',
                    'boardLabel': blabel, 'functions': copy.deepcopy(mcu_p['functions']),
                    'mcuPin': mcu_p['number'], 'col': col, 'comment': comm or ''
                })

    power_pins_cn8 = [
        ('AGND', 'GND', 'AGND', False),
        ('AVDD', 'POWER', 'AVDD', False),
        ('GND', 'GND', 'GND', False),
    ]
    for name, ptype, blabel, res in power_pins_cn8:
        raw_items.append({'header': 'CN8', 'name': name, 'type': ptype, 'boardLabel': blabel,
                          'reserved': res, 'functions': [], 'mcuPin': None, 'col': 1})

    power_pins_morpho = [
        ('+3.3V', 'POWER', '+3.3V', False),
        ('+5V', 'POWER', '+5V', False),
        ('VDD', 'POWER', 'VDD', False),
        ('GND', 'GND', 'GND', False),
        ('GND', 'GND', 'GND', False),
    ]
    for name, ptype, blabel, res in power_pins_morpho:
        raw_items.append({'header': 'MORPHO', 'name': name, 'type': ptype, 'boardLabel': blabel,
                          'reserved': res, 'functions': [], 'mcuPin': None, 'col': 1})

    header_counts = {}
    col_row_counts = {}
    pins = []
    for idx, item in enumerate(raw_items):
        hdr = item['header']
        header_counts[hdr] = header_counts.get(hdr, 0) + 1
        pnum = header_counts[hdr]
        col = item['col']
        row = col_row_counts.get((hdr, col), 0)
        col_row_counts[(hdr, col)] = row + 1

        if hdr == 'CN7':
            x = 240 if col == 0 else 268
            y = 220 + 19 * row
            side = 'left' if col == 0 else 'right'
        elif hdr == 'CN8':
            x = 692 if col == 0 else 720
            y = 220 + 19 * row
            side = 'left' if col == 0 else 'right'
        else:
            x = 110 if col == 0 else 850
            y = 220 + 23 * row
            side = 'left' if col == 0 else 'right'

        pin = {
            'number': idx + 1,
            'name': item['name'],
            'type': item['type'],
            'connector': hdr,
            'connectorPin': pnum,
            'physicalLabel': f'{hdr}.{pnum}',
            'boardLabel': item['boardLabel'],
            'functions': item['functions'],
            'evidence': [h_ref, cpp_ref, ioc_ref, drawing_ref],
            'position': {'x': x, 'y': y, 'side': side}
        }
        if item.get('reserved'):
            pin['reserved'] = True
        if item.get('mcuPin'):
            pin['mcuPin'] = item['mcuPin']
            note = circuit_notes.get(item['name'])
            if note:
                pin['boardCircuitKey'] = note
        pins.append(pin)

    for pin in pins:
        if pin.get('mcuPin'):
            pin['sharedWith'] = [other['physicalLabel'] for other in pins
                                 if other is not pin and other.get('mcuPin') == pin['mcuPin']]

    return {
        'id': board_id, 'name': 'NUCLEO-H723ZG', 'family': 'STM32', 'shortName': 'NUCLEO-H723ZG',
        'subtitle': 'Nucleo-144 · MB1364 · ST Zio and ST Morpho', 'layout': 'custom',
        'diagram': {'width': 960, 'height': 840, 'artwork': 'assets/boards/nucleo-h723zg.svg', 'minWidth': 800,
                    'connectorGroups': copy.deepcopy(NUCLEO_144_CONNECTOR_GROUPS)},
        'packagePins': len(pins), 'gpioCount': sum(pin['type'] == 'GPIO' for pin in pins),
        'uniqueGPIOCount': len({pin['name'] for pin in pins if pin['type'] == 'GPIO'}),
        'voltage': '3.3 V I/O', 'mcu': chip['mcu'], 'processor': chip['processor'], 'clock': chip['clock'],
        'verifiedOn': chip['verifiedOn'], 'source': h_doc['viewUrl'],
        'datasheet': chip['datasheet'], 'orientation': 'usb', 'pins': pins,
        'mcuProfile': chip['id'],
    }
