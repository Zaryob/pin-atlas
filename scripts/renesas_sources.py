"""RA4M1 package contacts from the numbered column of the official pin list."""
import re

import pdfplumber


def pin_list_functions(row, evidence):
    def tokens(cell):
        return re.findall(r'[A-Z][A-Z0-9_]*[+-]?', re.sub(r'_\s*\n\s*', '_', cell))

    functions = {}
    for column, group in [(6, 'SYSTEM'), (7, 'IRQ'), (9, 'TIMER'), (10, 'TIMER'), (11, 'TIMER'),
                          (12, 'CLOCK'), (13, 'SYSTEM'), (14, 'SYSTEM'), (15, 'I2C'), (16, 'SPI'),
                          (17, 'I2S'), (18, 'ADC'), (19, 'SYSTEM'), (20, 'SYSTEM'), (21, 'SYSTEM')]:
        cell = (row[column] or '').replace('AUDIO_CL\nK', 'AUDIO_CLK')
        for signal in tokens(cell):
            label, family = signal, group
            match = re.fullmatch(r'(RXD|TXD)(\d+)', signal)
            if column == 14 and match:
                family, label = 'UART', f'UART{match[2]} {match[1][:2]}'
            elif column == 15:
                match = re.fullmatch(r'(SCL|SDA)([01])', signal)
                if match:
                    label = f'I2C{match[2]} {match[1]}'
            elif column == 16:
                match = re.fullmatch(r'(RSPCK|MISO|MOSI|SSL)([AB])(\d*)', signal)
                if match:
                    role = {'RSPCK': 'SCK', 'SSL': 'CS'}.get(match[1], match[1])
                    label = f'SPI{int(match[2] == "B")} {role}{match[3]}'
            elif signal.startswith('GTIOC'):
                family = 'PWM'
            elif signal.startswith('USB'):
                family = 'USB'
            elif signal in ('CTX0', 'CRX0'):
                family, label = 'CAN', f'CAN0 {signal[1:3]}'
            elif re.fullmatch('DA[0-2]', signal):
                family = 'DAC'
            elif signal in ('SWCLK', 'SWDIO', 'SWO'):
                family = 'SWD'
            elif signal in ('TCK', 'TMS', 'TDI', 'TDO'):
                family = 'JTAG'
            functions[label] = {'name': label, 'signal': signal, 'group': family, 'evidence': evidence}
    return list(functions.values())


def build_ra4m1(cache, docs, ref, verified_on):
    id, document = 'ra4m1-lqfp64', 'ra4m1-datasheet'
    drawing = ref(id + '-drawing', document, 18, 'Figure 1.5 · R7FA4M1AB3CFM · LQFP-64 top view', 'visual-diagram')
    gpio_direction = ref(id + '-gpio-direction', document, 15, 'Table 1.15 · GPIO input-only ports P200, P214 and P215')
    pins = []
    with pdfplumber.open(cache / docs[document]['file']) as pdf:
        assert 'R7FA4M1AB3CFM' in pdf.pages[17].extract_text()
        for page in range(23, 27):
            evidence = ref(f'{id}-table-{page}', document, page, '§1.7 · Pin Lists · LQFP64 column and peripheral functions')
            table, = [t for t in pdf.pages[page - 1].extract_tables() if len(t[0]) == 22]
            assert table[1][1].replace('\n', '')[::-1] == 'LQFP64'
            for row in table[2:]:
                if not row[1].isdecimal():
                    continue
                number = int(row[1])
                name = row[8] or ''.join(row[6].split())
                kind = 'GPIO' if row[8] else 'GND' if 'VSS' in name else 'SYSTEM' if name == 'RES' else 'POWER'
                functions = pin_list_functions(row, evidence) if kind == 'GPIO' else []
                pin = {'number': number, 'name': name, 'type': kind, 'functions': functions,
                       'evidence': [evidence, drawing]}
                if name in ('P200', 'P214', 'P215'):
                    pin['inputOnly'] = True
                    pin['evidence'].append(gpio_direction)
                pins.append(pin)
    assert [p['number'] for p in pins] == list(range(1, 65))
    assert [pins[n-1]['name'] for n in (1, 25, 47, 53, 64)] == ['P400', 'RES', 'P101', 'P014', 'P000']
    url = docs[document]['url']
    return {'id': id, 'name': 'Renesas RA4M1 · LQFP-64', 'shortName': 'RA4M1', 'mcu': 'Renesas RA4M1',
            'searchTerms': 'R7FA4M1AB3CFM',
            'family': 'Renesas', 'processor': 'Arm Cortex-M4F', 'clock': '48 MHz',
            'subtitle': 'R7FA4M1AB3CFM · LQFP-64 · 48 MHz', 'layout': 'lqfp', 'packageName': 'LQFP-64',
            'packagePins': 64, 'gpioCount': 52, 'voltage': '1.6–5.5 V VCC (conditions apply)',
            'verifiedOn': verified_on, 'scopeKey': 'ra4m1PackageScope',
            'source': url + '#page=18', 'datasheet': url, 'pins': pins}


def link_arduino_reference_packages(boards, ref, cache, docs):
    profiles = {b['id']: b for b in boards}
    for id, package_id, document in [
        ('arduino-leonardo', 'atmega32u4-tqfp44', 'arduino-leonardo-schematic'),
        ('arduino-micro', 'atmega32u4-qfn44', 'arduino-micro-schematic'),
        ('arduino-uno-r4-minima', 'ra4m1-lqfp64', 'arduino-uno-r4-minima-datasheet'),
        ('arduino-uno-r4-wifi', 'ra4m1-lqfp64', 'arduino-uno-r4-wifi-datasheet'),
        ('arduino-nano-r4', 'ra4m1-lqfp64', 'nano-r4-datasheet'),
    ]:
        board = profiles[id]
        board['mcuProfile'] = package_id
        pads = {pin['name']: pin for pin in profiles[package_id]['pins']}
        if package_id == 'ra4m1-lqfp64':
            assert 'R7FA4M1AB3CFM' in (cache / docs[document]['file']).read_text()
            package_reference = ref(id + '-part', document, None,
                                    'Board datasheet · fitted R7FA4M1AB3CFM LQFP-64 MCU', 'source-text')
        else:
            locator = 'U2 · ATmega32U4-AU (TQFP-44)' if id == 'arduino-leonardo' else 'U1 · ATmega32U4-MU (QFN-44)'
            package_reference = ref(id + '-part', document, 1, 'Arduino schematic · ' + locator, 'visual-diagram')
        for pin in board['pins']:
            name = pin.get('mcuPort')
            if not name:
                continue
            pad = pads[name]
            pin['mcuPin'] = pad['number']
            for evidence in [package_reference, *pad['evidence']]:
                if evidence and evidence not in pin['evidence']:
                    pin['evidence'].append(evidence)
