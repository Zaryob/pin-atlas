"""Attach sourced safety and usage warnings to generated profiles.

Every warning names the reference it was read from. `noteEvidence` maps a note
key to those references so the interface can show the source beside the text.
Numbers quoted in the note texts are asserted against the locked documents here.
"""
import re
import pdfplumber


def cite(pin, key, *refs):
    pin.setdefault('noteEvidence', {})[key] = list(refs)
    for item in refs:
        if item not in pin['evidence']:
            pin['evidence'].append(item)


def warn(pin, key, *refs):
    """Add an extra pin-specific warning; a pin can carry several."""
    pin.setdefault('warnings', [])
    if key not in pin['warnings']:
        pin['warnings'].append(key)
    cite(pin, key, *refs)


def caution(board, key, *refs):
    board.setdefault('cautions', []).append({'key': key, 'evidence': list(refs)})


def html_text(path):
    text = re.sub(r'<(script|style).*?</\1>', '', path.read_text(), flags=re.S)
    return ' '.join(re.sub(r'<[^>]+>', ' ', text).split())


def html_tables(path):
    clean = lambda cell: re.sub(r'<.*?>', '', cell).strip()
    return [[[clean(c) for c in re.findall(r'<t[hd].*?>(.*?)</t[hd]>', row, re.S)]
             for row in re.findall(r'<tr.*?</tr>', table, re.S)]
            for table in re.findall(r'<table.*?</table>', path.read_text(), re.S)]


def attach_warnings(boards, ref, cache, docs):
    by_id = {board['id']: board for board in boards}
    label = lambda board: {pin.get('physicalLabel', str(pin['number'])): pin for pin in board['pins']}

    # --- BeagleBone Black -------------------------------------------------
    bbb = by_id['beaglebone-black']; contacts = label(bbb)
    ch7 = cache / docs['beaglebone-black-p8-p9']['file']; ch8 = cache / docs['beaglebone-black-cape']['file']
    text7, text8 = html_text(ch7), html_text(ch8)
    header_ref = 'bbb-p8-p9-table'
    notes_ref = ref('bbb-header-notes', 'beaglebone-black-p8-p9', None, 'Chapter 7 · Expansion Connectors · NOTE paragraphs and Connector P9 notes', 'source-text')
    lcd_ref = ref('bbb-cape-lcd-pins', 'beaglebone-black-cape', None, 'Chapter 8 · LCD Pins · Table 15 and usage notes', 'source-table')
    emmc_ref = ref('bbb-cape-emmc-pins', 'beaglebone-black-cape', None, 'Chapter 8 · eMMC Pins · Table 16 and usage notes', 'source-table')
    power_ref = ref('bbb-cape-power', 'beaglebone-black-cape', None, 'Chapter 8 · Expansion Board Power · rail table, current per pin and sequencing rules', 'source-table')
    lcd = emmc = rails = None
    for table in html_tables(ch8):
        head = table[0]
        if head == ['PIN', 'PROC', 'NAME', 'MODE0']: lcd = table[1:]
        elif head == ['PIN', 'PROC', 'SIGNAL', 'MODE']: emmc = table[1:]
        elif head[:3] == ['Current', 'Name', 'P9']: rails = table[1:]
    assert len(lcd) == 20 and len(emmc) == 10 and len(rails) == 3
    assert 'drive the HDMI framer' in text8 and 'SYSBOOT pins' in text8
    assert 'you must boot from the microSD slot' in text8 and 'put the eMMC into reset' in text8
    for rows, key, source in ((lcd, 'bbbHdmiNote', lcd_ref), (emmc, 'bbbEmmcNote', emmc_ref)):
        for row in rows:
            pin = contacts[f'P8.{int(row[0])}']
            assert pin['mcuPin'] == row[1], row
            pin['boardCircuitKey'] = key; cite(pin, key, source)
    assert sorted(int(r[0]) for r in lcd) == list(range(27, 47)) and sorted(int(r[0]) for r in emmc) == [3, 4, 5, 6, 20, 21, 22, 23, 24, 25]
    # Rail table: current | name | pin | pin | name | current.
    assert rails == [['250mA', 'VDD_3V3B', '3', '4', 'VDD_3V3B', '250mA'], ['1000mA', 'VDD_5V', '5', '6', 'VDD_5V', '1000mA'], ['250mA', 'SYS_5V', '7', '8', 'SYS_5V', '250mA']]
    assert 'The current ratings listed are per pin' in text8 and 'VDD_3V3B rail is supplied by the LDO' in text8
    for number in (3, 4, 5, 6, 7, 8):
        pin = contacts[f'P9.{number}']; cite(pin, pin['noteKey'], power_ref)
    assert 'PWR_BUT is a 5V level as pulled up internally by the TPS65217C' in text7 and 'activated by pulling the signal to GND' in text7
    pin = contacts['P9.9']; pin['noteKey'] = 'bbbPwrButNote'; cite(pin, 'bbbPwrButNote', notes_ref)
    assert 'SW should set the unused pin in input mode' in text7 and 'removing R221' in text7 and 'removing R202' in text7
    for number, key in ((41, 'bbbP941Note'), (42, 'bbbP942Note')):
        pin = contacts[f'P9.{number}']; assert pin['alternateBall']
        pin['boardCircuitKey'] = key; cite(pin, key, notes_ref, 'bbb-am335x-pin-attributes')
    assert (contacts['P9.41']['net'], contacts['P9.41']['alternateBall']['net']) == ('gpio0[20]', 'gpio3[20]')
    assert (contacts['P9.42']['net'], contacts['P9.42']['alternateBall']['net']) == ('gpio0[7]', 'gpio3[18]')
    assert 'DO NOT APPLY VOLTAGE TO ANY I/O PIN WHEN POWER IS NOT SUPPLIED' in text7 and 'UNTIL AFTER THE SYS_RESET LINE GOES HIGH' in text7
    assert 'Do not connect 5V logic level signals to these pins' in text7
    assert 'Do not drive any external signals into the I/O pins until after the VDD_3V3B rail is up' in text8
    caution(bbb, 'bbbPowerSequenceCaution', notes_ref, power_ref)
    caution(bbb, 'bbbDefaultUseCaution', lcd_ref, emmc_ref)
    for pin in bbb['pins']:
        if pin.get('noteKey') == 'bbbGpioNote': cite(pin, 'bbbGpioNote', notes_ref)
    bbb['defaultUsedGPIOCount'] = len(lcd) + len(emmc)

    # --- RP2350 erratum E9 ------------------------------------------------
    with pdfplumber.open(cache / docs['rp2350']['file']) as pdf:
        e9 = (pdf.pages[1357].extract_text() or '') + (pdf.pages[1358].extract_text() or '') + (pdf.pages[1359].extract_text() or '')
    e9 = ' '.join(e9.split())
    for phrase in ('D.5.1. RP2350-E9', 'Affects RP2350 A2', 'hold the pad at around 2.2 V', '8.2 kΩ or less', 'The pad pull-up still works', 'For GPIO pads 0 through 47'):
        assert phrase in e9, phrase
    e9_ref = ref('rp2350-e9', 'rp2350', 1359, 'Appendix D.5.1 · RP2350-E9 · increased leakage on Bank 0 GPIO inputs (A2 stepping; pp. 1359–1360)', 'pdf-text')
    for board_id in ('pico2', 'pico2w', 'rp2350a', 'rp2350b'):
        count = 0
        for pin in by_id[board_id]['pins']:
            if pin['type'] == 'GPIO' and re.fullmatch(r'GP(IO)?\d+(_ADC\d)?', pin['name']):
                warn(pin, 'rp2350E9Note', e9_ref); count += 1
        assert count == {'pico2': 26, 'pico2w': 26, 'rp2350a': 30, 'rp2350b': 48}[board_id]
        caution(by_id[board_id], 'rp2350E9Note', e9_ref)

    # --- Raspberry Pi 40-pin header ---------------------------------------
    adoc = (cache / docs['pi-gpio']['file']).read_text()
    for phrase in ("operate at 3.3 V and aren't 5 V tolerant", '`GP2` (SDA) and `GP3` (SCL) have fixed 1.8 k\u2126 resistors',
                   'can supply up to 16 mA to an attached device, and all GPIO pins combined can supply a maximum total current of 50 mA'):
        assert phrase in adoc, phrase
    pi_ref = ref('pi-gpio-electrical', 'pi-gpio', None, 'GPIO pads and voltage · 3.3 V only warning, fixed GP2/GP3 pull-ups, per-pin and total current', 'manufacturer-source-text')
    for board_id in ('raspberry-pi-4', 'raspberry-pi-5', 'raspberry-pi-40', 'raspberry-pi-zero-w', 'raspberry-pi-zero-2-w',
                     'raspberry-pi-3b-plus', 'raspberry-pi-500'):
        board = by_id[board_id]
        # Generic header cautions come first; model-specific ones follow.
        specific = board.pop('cautions', [])
        caution(board, 'piNot5vCaution', pi_ref); caution(board, 'piCurrentCaution', pi_ref)
        board['cautions'].extend(specific)
        for pin in board['pins']:
            if pin['name'] in ('GPIO2', 'GPIO3'):
                assert pin['number'] in (3, 5); warn(pin, 'piI2cPullupNote', pi_ref)
            if pin.get('reserved'):
                pin.pop('note', None); pin['noteKey'] = 'reservedNote'

    # --- Jetson Orin Nano: existing notes gain their reference -------------
    for pin in by_id['jetson-orin-nano']['pins']:
        if pin.get('noteKey'): cite(pin, pin['noteKey'], 'jetson-j12-electrical')

    # --- Nucleo boards: solder-bridge notes cite the bridge table ----------
    for board in boards:
        if not board['id'].startswith('nucleo-'): continue
        for pin in board['pins']:
            bridge = next((item for item in pin['evidence'] if item.endswith('-bridges')), None)
            if pin.get('boardCircuitKey') and bridge: cite(pin, pin['boardCircuitKey'], bridge)

    # --- Teensy 4.1 --------------------------------------------------------
    with pdfplumber.open(cache / docs['teensy41-card11b']['file']) as pdf:
        card = ''.join((pdf.pages[0].extract_text() or '').split())
    assert 'Teensy4.1pinsare' in card and 'not5volttolerant.' in card
    for row in ('47DAT2', '46DAT3', '45CMD', '44CLK', '43DAT0', '42DAT1'): assert row in card, row
    teensy = by_id['teensy-41']
    t_ref = ref('teensy41-voltage', 'teensy41-card11b', 1, 'Card 11b · "Teensy 4.1 pins are not 5 volt tolerant" and SD pad signals 42–47', 'visual-diagram')
    caution(teensy, 'teensyNot5vCaution', t_ref)
    sd = {'42': 'DAT1', '43': 'DAT0', '44': 'CLK', '45': 'CMD', '46': 'DAT3', '47': 'DAT2'}
    for pin in teensy['pins']:
        if pin.get('noteKey') == 'teensyGpioNote': cite(pin, 'teensyGpioNote', t_ref)
        if pin.get('connector') == 'SD' and pin['name'] in sd: warn(pin, 'teensySdPadNote', t_ref)
    assert sum('teensySdPadNote' in pin.get('warnings', []) for pin in teensy['pins']) == 6

    # --- micro:bit V2 current budget ---------------------------------------
    power = (cache / docs['microbit-power-supply']['file']).read_text()
    for phrase in ('on-board regulator capable to source 300 mA', '190mA <span class="v2">V2</span> from the edge connector', '270mA <span class="v2">V2</span>'):
        assert phrase in power, phrase
    mb_ref = ref('microbit-power-budget', 'microbit-power-supply', None, 'Power supply · V2 regulator and current available to the edge connector', 'manufacturer-source-text')
    microbit = by_id['microbit-v2']
    caution(microbit, 'microbitCurrentCaution', mb_ref)
    for pin in microbit['pins']:
        if pin['name'] == '3V': pin['noteKey'] = 'microbit3vNote'; cite(pin, 'microbit3vNote', mb_ref)
