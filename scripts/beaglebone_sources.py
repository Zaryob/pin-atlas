"""BeagleBone Black P8/P9 expansion headers from official BeagleBoard System Reference Manual."""
import re
import pdfplumber

def get_group(token):
    t = token.lower()
    if 'uart' in t: return 'UART'
    if 'spi' in t: return 'SPI'
    if 'i2c' in t: return 'I2C'
    if any(k in t for k in ['pwm', 'ecap', 'eqep']): return 'PWM'
    if any(k in t for k in ['can', 'dcan']): return 'CAN'
    if 'timer' in t: return 'TIMER'
    if 'pru' in t: return 'PRU'
    if 'mcasp' in t: return 'AUDIO'
    if 'mmc' in t: return 'MMC'
    if 'lcd' in t: return 'LCD'
    if 'gpmc' in t: return 'GPMC'
    return 'SYSTEM'

def clean(cell):
    return re.sub(r'<.*?>', '', cell).strip()

# Signal names the SRM tables abbreviate or misspell; each is checked against the
# SRM spelling and replaced with the AM335x data sheet name (SPRS717L Table 4-2).
SIGNAL_CORRECTIONS = {
    ('P8', 14, 4): ('ehrpwm2_tripzone_in', 'ehrpwm2_tripzone_input'),
    ('P8', 37, 2): ('ehrpwm1_tripzone_in', 'ehrpwm1_tripzone_input'),
    ('P8', 43, 3): ('ehrpwm2_tripzone_in', 'ehrpwm2_tripzone_input'),
    ('P9', 11, 1): ('mii2_crs', 'gmii2_crs'),
    ('P9', 12, 1): ('mii2_col', 'gmii2_col'),
    ('P9', 13, 1): ('mii_rxerr', 'gmii2_rxerr'),
    ('P9', 14, 1): ('mii2_txd3', 'gmii2_txd3'),
    ('P9', 15, 2): ('rmii2_tctl', 'rgmii2_tctl'),
    ('P9', 15, 3): ('mii2_txen', 'rmii2_txen'),
    ('P9', 16, 1): ('mii2_txd2', 'gmii2_txd2'),
    ('P9', 18, 3): ('ehrpwm0_tripzone', 'ehrpwm0_tripzone_input'),
    ('P9', 23, 2): ('rgmii2_rxdv', 'rgmii2_rctl'),
    ('P9', 30, 1): ('ehrpwm0_tripzone', 'ehrpwm0_tripzone_input'),
}

def build_beaglebone(cache, docs, obs, ref, verified_on):
    docid = 'beaglebone-black-p8-p9'
    ti_ref = ref('bbb-am335x-pin-attributes', 'am335x-datasheet', 19, '§4.2 · Table 4-2 Pin Attributes (ZCZ package) · ball signal names and GPIO numbers (pp. 19–47)')
    with pdfplumber.open(cache / docs['am335x-datasheet']['file']) as pdf:
        ti_text = '\n'.join(pdf.pages[i].extract_text() or '' for i in range(18, 47))
    for _, name in SIGNAL_CORRECTIONS.values():
        assert name in ti_text, name
    assert 'gpio0_20' in ti_text and 'gpio0_7' in ti_text and 'gpio3_20' in ti_text and 'gpio3_18' in ti_text
    used = set()
    def corrected(header, pin, mode, signal):
        fix = SIGNAL_CORRECTIONS.get((header, pin, mode))
        if not fix:
            return signal, False
        assert signal == fix[0], (header, pin, mode, signal)
        used.add((header, pin, mode))
        return fix[1], True
    html = (cache / docs[docid]['file']).read_text()
    tables = re.findall(r'<table.*?>.*?</table>', html, re.S)

    ref_headers = ref('bbb-p8-p9-table', docid, None, 'BeagleBone Black SRM Chapter 7 · Expansion Headers P8 and P9 Pinout and Mode Muxing', 'source-table')

    # Parse P8
    p8_raw = {}
    for r in re.findall(r'<tr.*?>.*?</tr>', tables[0], re.S)[1:]:
        cells = [clean(c) for c in re.findall(r'<t[hd].*?>.*?</t[hd]>', r, re.S)]
        if not cells or not cells[0]: continue
        nums = [int(x.strip()) for x in cells[0].split(',') if x.strip()]
        for n in nums:
            p8_raw[n] = {'proc': cells[1], 'name': cells[2], 'modes': cells[3:]}

    # Parse P9
    p9_raw = {}
    current_pin = None
    for r in re.findall(r'<tr.*?>.*?</tr>', tables[1], re.S)[1:]:
        cells = [clean(c) for c in re.findall(r'<t[hd].*?>.*?</t[hd]>', r, re.S)]
        if not cells: continue
        col0 = cells[0]
        if '-' in col0:
            s, e = [int(x.strip()) for x in col0.split('-')]
            for n in range(s, e + 1):
                p9_raw[n] = {'proc': '', 'name': cells[1] or 'GND', 'modes': []}
        elif ',' in col0:
            nums = [int(x.strip()) for x in col0.split(',')]
            for n in nums:
                p9_raw[n] = {'proc': '', 'name': cells[1], 'modes': []}
        elif col0:
            current_pin = int(col0)
            p9_raw[current_pin] = {'proc': cells[1], 'name': cells[2], 'modes': cells[3:]}
        else:
            # P9.41 and P9.42 each tie two processor balls to one header contact.
            assert 'alt' not in p9_raw[current_pin] and current_pin in (41, 42)
            p9_raw[current_pin]['alt'] = {'proc': cells[1], 'name': cells[2], 'modes': cells[3:]}

    pins = []
    pin_number = 1

    # P8: 46 pins (2x23 header on left)
    for pin_idx in range(1, 47):
        data = p8_raw[pin_idx]
        name = data['name'] or 'GND'
        proc = data['proc']
        modes = data['modes']

        row = (pin_idx - 1) // 2
        is_odd = (pin_idx % 2 == 1)
        pos = {
            'x': 148 if is_odd else 176,
            'y': 110 + row * 26,
            'side': 'left' if is_odd else 'right'
        }

        ptype = 'GND' if name == 'GND' else 'GPIO'
        net = name if name == 'GND' else (modes[-1] if (modes and 'gpio' in modes[-1]) else name)

        pin = {
            'number': pin_number,
            'physicalLabel': f'P8.{pin_idx}',
            'connector': 'P8',
            'connectorPin': pin_idx,
            'name': name,
            'boardLabel': name,
            'type': ptype,
            'functions': [],
            'evidence': [ref_headers],
            'net': net,
            'position': pos
        }
        if proc and re.fullmatch(r'[A-Z]{1,3}[1-9][0-9]*',proc): pin['mcuPin'] = proc

        if ptype == 'GPIO':
            pin['noteKey'] = 'bbbGpioNote'
            for mode_idx, mode_signal in enumerate(modes):
                if mode_signal:
                    mode_signal, fixed = corrected('P8', pin_idx, mode_idx, mode_signal)
                    grp = get_group(mode_signal)
                    pin['functions'].append({
                        'name': f'{mode_signal} (Mode {mode_idx})',
                        'group': grp,
                        'signal': mode_signal,
                        'selector': f'Mode {mode_idx}',
                        'evidence': ti_ref if fixed else ref_headers
                    })
                    if fixed and ti_ref not in pin['evidence']: pin['evidence'].append(ti_ref)
            pin['functions'].append({'name': 'GPIO interrupt', 'group': 'IRQ', 'signal': net, 'evidence': ref_headers})

        pin_number += 1
        pins.append(pin)

    # P9: 46 pins (2x23 header on right)
    for pin_idx in range(1, 47):
        data = p9_raw[pin_idx]
        name = data['name']
        proc = data['proc']
        modes = data['modes']

        if not name:
            if proc in ('VADC', 'AGND', 'PWR_BUT'): name = proc
            elif 'GND' in data.get('proc', ''): name = 'GND'

        row = (pin_idx - 1) // 2
        is_odd = (pin_idx % 2 == 1)
        pos = {
            'x': 644 if is_odd else 672,
            'y': 110 + row * 26,
            'side': 'left' if is_odd else 'right'
        }

        if name in ('GND', 'AGND'):
            ptype = 'GND'
        elif any(k in name for k in ['5V', '3.3V', 'VADC']):
            ptype = 'POWER'
        elif name.startswith('AIN'):
            ptype = 'ADC'
        elif name in ('PWR_BUT', 'SYS_RESETn'):
            ptype = 'SYSTEM'
        else:
            ptype = 'GPIO'

        net = name if ptype != 'GPIO' else (modes[-1] if (modes and 'gpio' in modes[-1]) else name)

        pin = {
            'number': pin_number,
            'physicalLabel': f'P9.{pin_idx}',
            'connector': 'P9',
            'connectorPin': pin_idx,
            'name': name,
            'boardLabel': name,
            'type': ptype,
            'functions': [],
            'evidence': [ref_headers],
            'net': net,
            'position': pos
        }
        if proc and re.fullmatch(r'[A-Z]{1,3}[1-9][0-9]*',proc): pin['mcuPin'] = proc

        if ptype == 'GPIO':
            pin['noteKey'] = 'bbbGpioNote'
            assert len(modes) == 8
            for mode_idx, mode_signal in enumerate(modes):
                if mode_signal:
                    mode_signal, fixed = corrected('P9', pin_idx, mode_idx, mode_signal)
                    grp = get_group(mode_signal)
                    pin['functions'].append({
                        'name': f'{mode_signal} (Mode {mode_idx})',
                        'group': grp,
                        'signal': mode_signal,
                        'selector': f'Mode {mode_idx}',
                        'evidence': ti_ref if fixed else ref_headers
                    })
                    if fixed and ti_ref not in pin['evidence']: pin['evidence'].append(ti_ref)
            pin['functions'].append({'name': 'GPIO interrupt', 'group': 'IRQ', 'signal': net, 'evidence': ref_headers})
            alt = data.get('alt')
            if alt:
                # The contact's net is the first-listed ball; the second ball is a
                # separate SoC pad on the same contact and keeps its own selectors.
                ball = alt['proc']
                assert re.fullmatch(r'[A-Z]\d+', ball) and len(alt['modes']) == 8 and 'gpio' in alt['modes'][-1]
                pin['alternateBall'] = {'ball': ball, 'name': alt['name'], 'net': alt['modes'][-1]}
                pin['evidence'].append(ti_ref)
                for mode_idx, mode_signal in enumerate(alt['modes']):
                    if mode_signal:
                        pin['functions'].append({
                            'name': f'{mode_signal} ({ball} · Mode {mode_idx})',
                            'group': get_group(mode_signal),
                            'signal': mode_signal,
                            'selector': f'{ball} · Mode {mode_idx}',
                            'evidence': ref_headers
                        })
                pin['functions'].append({'name': f'GPIO interrupt ({ball})', 'group': 'IRQ', 'signal': alt['modes'][-1], 'evidence': ref_headers})
        elif ptype == 'ADC':
            pin['noteKey'] = 'bbbAdcNote'
            pin['functions'].append({'name': f'ADC {name}', 'group': 'ADC', 'signal': name, 'evidence': ref_headers})
        elif name == 'SYS_5V':
            pin['noteKey'] = 'bbbSys5vNote'
        elif name == 'VDD_5V':
            pin['noteKey'] = 'bbbVdd5vNote'
        elif name == 'DC_3.3V':
            pin['noteKey'] = 'bbb3v3Note'

        pin_number += 1
        pins.append(pin)

    # Set sharedWith nets
    for pin in pins:
        same = [p['physicalLabel'] for p in pins if p is not pin and p['net'] == pin['net']]
        if same and pin['type'] in ('GPIO', 'ADC', 'SYSTEM'):
            pin['sharedWith'] = same

    assert used == set(SIGNAL_CORRECTIONS)
    gpio_count = sum(p['type'] == 'GPIO' for p in pins)
    unique_gpio = len({p['net'] for p in pins if p['type'] == 'GPIO'})

    board = {
        'id': 'beaglebone-black',
        'name': 'BeagleBone Black',
        'shortName': 'BeagleBone Black',
        'family': 'BeagleBoard',
        'subtitle': 'TI AM3358 · 1 GHz · 3.3 V I/O',
        'layout': 'custom',
        'diagram': {
            'width': 820,
            'height': 820,
            'artwork': 'assets/boards/beaglebone-black.svg'
        },
        'orientation': 'usb-bottom',
        'packagePins': len(pins),
        'gpioCount': gpio_count,
        'uniqueGPIOCount': unique_gpio,
        'voltage': '3.3 V I/O',
        'mcu': 'AM3358',
        'processor': 'Arm Cortex-A8',
        'clock': '1 GHz',
        'scopeKey': 'beagleboneBlackScope',
        'compatibleKey': 'beagleboneBlackCompatible',
        'source': docs[docid]['url'],
        'datasheet': docs[docid]['url'],
        'verifiedOn': verified_on,
        'pins': pins
    }
    return [board]
