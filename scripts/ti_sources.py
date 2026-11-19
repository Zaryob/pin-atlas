"""Texas Instruments package pins and pin mux from the manufacturer pin tables."""
import re

import pdfplumber

from warning_sources import warn


def classify(signal):
    if re.fullmatch(r'A[01]_\d+', signal):
        return 'ADC'
    if signal == 'DAC_OUT':
        return 'DAC'
    if re.fullmatch(r'TIM[AG]\d+_C\d+N?', signal):
        return 'PWM'
    if signal.startswith(('TIMG', 'TIMA')):
        return 'TIMER'
    if signal in {'SWDIO', 'SWCLK'}:
        return 'SWD'
    if signal in {'CLK_OUT', 'RTC_OUT', 'HFCLK_IN', 'LFCLK_IN', 'HFXIN', 'HFXOUT', 'LFXIN', 'LFXOUT', 'ROSC'}:
        return 'CLOCK'
    return next((group for group in ('UART', 'SPI', 'I2C', 'CAN') if signal.startswith(group)), 'SYSTEM')


def build_mspm0g3507(cache, docs, ref, date):
    id, document = 'mspm0g3507spt', 'mspm0g3507-datasheet'
    pins = {}
    with pdfplumber.open(cache / docs[document]['file']) as pdf:
        assert 'LQFP48' in (pdf.pages[7].extract_text() or '')
        for page in range(11, 15):
            reference = ref(f'{id}-table-{page}', document, page,
                            'SLASEX6C · Table 6-2 · LQFP-48 pin numbers, analog functions and PINCM.PF selectors')
            table, = [t for t in pdf.pages[page - 1].extract_tables() if t[1][0] == 'PINCMx']
            for pincm, name, analog, digital, _, number, _, _, structure in table[2:]:
                if not number.isdecimal():
                    continue
                number = int(number)
                label = name or analog
                kind = 'GPIO' if name else {'VSS': 'GND', 'NRST': 'SYSTEM'}.get(label, 'POWER')
                pin = {'number': number, 'name': label, 'type': kind, 'functions': [], 'evidence': [reference]}
                if name:
                    functions = [{'name': signal, 'signal': signal, 'group': classify(signal), 'evidence': reference}
                                 for signal in re.split(r'\s*/\s*', analog) if signal]
                    previous = -1
                    for signal, value in re.findall(r'([A-Z][A-Z0-9_]*)\s*\[\s*(\d+)\s*\]', digital):
                        selector = int(value)
                        assert selector > previous, (name, digital)
                        previous = selector
                        functions.append({'name': signal, 'signal': signal, 'group': classify(signal),
                                          'selector': f'PINCM{pincm}.PF={selector}', 'evidence': reference})
                    assert len(functions) >= 1, name
                    pin['functions'] = functions
                    if 'Open-Drain' in structure:
                        warn(pin, 'mspm0OpenDrain', reference)
                assert number not in pins, number
                pins[number] = pin
    assert set(pins) == set(range(1, 49))
    assert [pins[n]['name'] for n in (1, 6, 7, 34, 48)] == ['PA0', 'VDD', 'VSS', 'PA19', 'VCORE']
    return {
        'id': id, 'name': 'MSPM0G3507SPT', 'shortName': 'MSPM0G3507SPT', 'mcu': 'MSPM0G3507SPT',
        'family': 'Texas Instruments', 'processor': 'Arm Cortex-M0+', 'clock': '80 MHz',
        'subtitle': 'LQFP-48 · Arm Cortex-M0+ · 80 MHz',
        'layout': 'lqfp', 'packageName': 'LQFP-48', 'packagePins': 48, 'gpioCount': 44,
        'voltage': '1.62–3.6 V VDD', 'source': docs[document]['url'] + '#page=8',
        'datasheet': docs[document]['url'], 'verifiedOn': date, 'scopeKey': 'mspm0g3507Scope',
        'pins': [pins[number] for number in sorted(pins)],
    }


def package(id, name, mcu, size, footprint, processor, clock, voltage, docs, document, page, date, pins, scope):
    url = docs[document]['url']
    assert set(pins) == set(range(1, size + 1))
    return {
        'id': id, 'name': name, 'shortName': mcu, 'mcu': mcu, 'family': 'Texas Instruments',
        'processor': processor, 'clock': clock, 'subtitle': f'{footprint} · {processor} · {clock}',
        'layout': 'qfn' if footprint.startswith('VQFN') else 'lqfp',
        'packageName': footprint, 'packagePins': size, 'gpioCount': sum(p['type'] == 'GPIO' for p in pins.values()),
        'voltage': voltage, 'source': f'{url}#page={page}', 'datasheet': url, 'verifiedOn': date,
        'scopeKey': scope, 'pins': [pins[n] for n in sorted(pins)],
    }


def mspm0_alternate_package(cache, docs, ref, date, *, id, device, document, pages, col, figure, size, clock):
    pins = {}
    footprint = f'VQFN-{size}'
    with pdfplumber.open(cache / docs[document]['file']) as pdf:
        for page in pages:
            evidence = ref(f'{id}-table-{page}', document, page,
                           f'Pin Attributes · {footprint} column, analog routes and PINCM.PF values')
            table, = [t for t in pdf.pages[page-1].extract_tables()
                      if len(t) > 2 and (t[1][0] or '').replace('\n', '') == 'PINCMx']
            for row in table[2:]:
                if not (row[col] or '').isdecimal():
                    continue
                pincm, name, analog, digital = row[:4]
                number = int(row[col])
                is_gpio = bool(re.fullmatch(r'P[AB]\d+', name or ''))
                label = name if is_gpio else analog
                kind = 'GPIO' if is_gpio else 'GND' if label == 'VSS' else 'SYSTEM' if label == 'NRST' else 'POWER'
                pin = {'number': number, 'name': label, 'type': kind, 'functions': [], 'evidence': [evidence]}
                if is_gpio:
                    pin['functions'].extend({'name': s, 'signal': s, 'group': 'ADC' if re.fullmatch(r'A\d+', s) else classify(s),
                                             'evidence': evidence} for s in re.split(r'\s*/\s*', analog) if s)
                    fields = re.findall(r'([A-Z][A-Z0-9_]*)\s*\[\s*(\d+)\s*\]', digital or '')
                    assert not fields or sorted({int(f) for _, f in fields}) == [int(f) for _, f in fields]
                    pin['functions'].extend({'name': s, 'signal': s, 'group': classify(s),
                                             'selector': f'PINCM{pincm}.PF={f}', 'evidence': evidence} for s, f in fields)
                    if 'Open-Drain' in ''.join((row[-1] or '').split()):
                        warn(pin, 'mspm0OpenDrain', evidence)
                assert number not in pins
                pins[number] = pin
    return package(id, f'{device} · {footprint}', device, size, footprint, 'Arm Cortex-M0+', clock, '1.62–3.6 V VDD',
                   docs, document, figure, date, pins, 'mspm0PackageScope')


def mspm33_function(signal):
    if signal.startswith('ADC'):
        return signal, 'ADC'
    if signal.startswith('I2S'):
        return signal, 'I2S'
    if signal.startswith('QSPI'):
        return signal, 'QMI'
    match = re.fullmatch(r'CANFD(\d+)_CAN(TX|RX)', signal)
    if match:
        return f'CAN{match[1]} {match[2]}', 'CAN'
    if re.fullmatch(r'TIM[AG]\d+_\d+_C\d+N?', signal):
        return signal, 'PWM'
    # UC routes can belong to UART or I²C based on the universal communications mode.
    # Preserve their combined signal names without implying an active protocol.
    return signal, classify(signal)


def build_mspm33(cache, docs, ref, date):
    id, document = 'mspm33c321a-lqfp64', 'mspm33c321a-datasheet'
    pins = {}
    current = []
    with pdfplumber.open(cache / docs[document]['file']) as pdf:
        for page in range(13, 28):
            evidence = ref(f'{id}-table-{page}', document, page, 'SLASFB6A · Table 6-2 · PM package, IOMUX function and signal')
            table, = [t for t in pdf.pages[page-1].extract_tables() if len(t[0]) == 12 and t[0][3] == 'PM\nPIN']
            for row in table[1:]:
                numbers, register, signal, mux, _, _ = row[3:4] + row[7:12]
                if register is not None:
                    current = []
                    name, *location = register.split()
                    for n in re.findall(r'\d+', numbers or ''):
                        number = int(n)
                        kind = 'GPIO' if location else 'GND' if name == 'VSS' else 'SYSTEM' if name == 'NRST' else 'POWER'
                        pin = {'number': number, 'name': name, 'type': kind, 'functions': [], 'evidence': [evidence]}
                        assert number not in pins
                        pins[number] = pin
                        current.append((pin, location[0] if location else None))
                for pin, pincm in current:
                    if not signal or signal == pin['name']:
                        continue
                    name, group = mspm33_function(signal)
                    function = {'name': name, 'signal': signal, 'group': group, 'evidence': evidence}
                    if pincm and (mux or '').isdecimal():
                        function['selector'] = f'{pincm}.PF={mux}'
                    pin['functions'].append(function)
    return package(id, 'MSPM33C321A · LQFP-64', 'MSPM33C321A', 64, 'LQFP-64', 'Arm Cortex-M33', '160 MHz',
                   '1.62–3.6 V VDD', docs, document, 10, date, pins, 'mspm33PackageScope')


def msp430_function(signal):
    for pattern, group, template in [
        (r'A(\d+)', 'ADC', 'ADC A{}'), (r'TB(\d+)\.([1-6])', 'PWM', 'TB{}.{}'),
        (r'UCA(\d+)(TXD|RXD)', 'UART', 'UART{} {}'),
        (r'UCB(\d+)(SDA|SCL)', 'I2C', 'I2C{} {}'),
        (r'UC([AB]\d+)(SIMO|SOMI|CLK|STE)', 'SPI', 'SPI{} {}'),
    ]:
        match = re.fullmatch(pattern, signal)
        if match:
            aliases = {'TXD':'TX','RXD':'RX','SIMO':'MOSI','SOMI':'MISO','CLK':'SCK','STE':'CS'}
            return template.format(*(aliases.get(s,s) for s in match.groups())), group
    return signal, 'CLOCK' if re.fullmatch(r'(ACLK|SMCLK|MCLK|XIN|XOUT)', signal) else 'SYSTEM'


def build_msp430(cache, docs, ref, date):
    id, document = 'msp430fr2355tpt', 'msp430fr2355-datasheet'
    pins = {}
    current = None
    with pdfplumber.open(cache / docs[document]['file']) as pdf:
        for page in range(18, 22):
            evidence = ref(f'{id}-table-{page}', document, page, 'SLASEC4D · Table 4-1 · PT package pin attributes')
            table, = [t for t in pdf.pages[page-1].extract_tables() if len(t[0]) == 9 and t[1][0] == 'PT']
            for row in table[2:]:
                signal = re.sub(r'\(\d+\)', '', row[4] or '').strip()
                if row[0] is not None:
                    current = None
                    if not row[0].isdecimal():
                        continue
                    number = int(row[0])
                    label = signal.removesuffix('(RD)')
                    kind = 'GPIO' if re.fullmatch(r'P[1-6]\.\d', label) else 'GND' if label.endswith('VSS') else 'POWER' if label.endswith('VCC') else 'SYSTEM'
                    current = {'number': number, 'name': label, 'type': kind, 'functions': [], 'evidence': [evidence]}
                    assert number not in pins
                    pins[number] = current
                elif current and signal:
                    name, group = msp430_function(signal)
                    current['functions'].append({'name': name, 'signal': signal, 'group': group, 'evidence': evidence})
    return package(id, 'MSP430FR2355TPT · LQFP-48', 'MSP430FR2355TPT', 48, 'LQFP-48', '16-bit MSP430', '24 MHz',
                   '1.8–3.6 V DVCC', docs, document, 10, date, pins, 'msp430PackageScope')


def build_ti_packages(cache, docs, ref, date):
    return [
        mspm0_alternate_package(cache, docs, ref, date, id='mspm0g3507spm', device='MSPM0G3507SPM',
                               document='mspm0g3507-datasheet', pages=range(11,15), col=4, figure=7, size=64, clock='80 MHz'),
        mspm0_alternate_package(cache, docs, ref, date, id='mspm0l1306-vqfn32', device='MSPM0L1306',
                               document='mspm0l1306-datasheet', pages=range(7,10), col=4, figure=6, size=32, clock='32 MHz'),
        build_mspm33(cache, docs, ref, date),
        build_msp430(cache, docs, ref, date),
    ]


def build_launchpad(cache, docs, ref, date, chip):
    import copy
    from additional_board_sources import board, contact, diagram, rail_kind

    id, document = 'lp-mspm0g3507', 'lp-mspm0g3507-guide'
    physical = ref(id + '-boosterpack', document, 16, 'SLAU873E · Figure 2-10 · 40 BoosterPack contacts', 'visual-diagram')
    defaults = ref(id + '-jumpers', document, 6, 'SLAU873E · Table 2-1 · J14 and J15 jumper defaults')
    circuit = ref(id + '-schematic', document, 20, 'SLAU873E · BoosterPack connector schematic and routing jumpers', 'visual-diagram')
    with pdfplumber.open(cache / docs[document]['file']) as pdf:
        assert 'MSPM0G3507SPM' in pdf.pages[18].extract_text()
        text = pdf.pages[5].extract_text()
        assert 'PB23 to J1.3' in text and 'PA16 to J3.29' in text
        drawing = pdf.pages[15].extract_text()
        rows = [s.split()[0] for s in drawing.splitlines() if re.match(r'^\d+ ', s)]
        assert rows[:20] == [str(n) for n in (*range(1,11), *range(21,31))]
    pads = {p['name']: p for p in chip['pins']}
    definitions = {
        'J1': '3V3 PA25 PB23 PA8 PA26 PB24 PB9 PA27 PB2 PB3',
        'J2': 'GND PB12 PB17 PB15 NRST PB8 PB7 PB6 PB0 PB16',
        'J3': '5V GND PB19 PA22 PB18 PA18 PA24 PA17 PA16 PA15',
        'J4': 'PB4 PB1 PA28 PA31 PB20 PB13 PA10 PA11 PA12 PA13',
    }
    pins = []
    for connector, x, y, side, start, step in [('J1',245,125,'left',1,1), ('J2',575,125,'right',20,-1),
                                               ('J3',245,463,'left',21,1), ('J4',575,463,'right',40,-1)]:
        for i, name in enumerate(definitions[connector].split()):
            number = start + i * step
            pad = pads.get(name)
            pin = contact(connector, number, name, name, pad['type'] if pad else rail_kind(name), physical, x, y+i*30, side)
            pin['evidence'].append(circuit)
            if pad:
                pin['mcuPin'] = pad['number']
                pin['functions'] = copy.deepcopy(pad['functions'])
                pin['evidence'].extend(pad['evidence'])
            if number in (3, 29):
                warn(pin, 'tiLaunchpadJ14' if number == 3 else 'tiLaunchpadJ15', defaults, circuit)
            pins.append(pin)
    url = docs[document]['url']
    return board(id, 'TI LP-MSPM0G3507 LaunchPad', 'LP-MSPM0G3507', 'Texas Instruments', chip['mcu'],
                 chip['processor'], chip['clock'], '3.3 V I/O', url + '#page=16', chip['datasheet'], date,
                 diagram(id, 825, [(name, name) for name in definitions]), pins,
                 orientation='usb', scopeKey='tiLaunchpadScope', mcuProfile=chip['id'])
