"""Raspberry Pi Zero W, Zero 2 W, 3 Model B+ and 500 40-pin header profiles.

Physical pin names come from the pinned GPIO documentation table (the same
rows as the common header). GPIO net labels are cross-checked against each
board's own J8 schematic where Raspberry Pi publishes one.

Alternate functions:
* BCM2835 (Zero W), BCM2837B0 (3 Model B+) and RP3A0 / BCM2710A1 (Zero 2 W)
  use the BCM2835 ARM Peripherals GPIO table (§6.2). Raspberry Pi's processor
  documentation states that BCM2710A1 is the BCM2837 die, that BCM2837B0 and
  BCM2837 share one architecture, and that BCM2837 and BCM2836 are BCM2835
  with a different Arm cluster. Only the ALT0-ALT5 cells printed for GPIO0-27
  are used: BCM2711-only UART2-5, SPI3-6, I2C3-6 and DPI selectors are not.
* Raspberry Pi 500 reuses the RP1 table already extracted for Raspberry Pi 5;
  its product brief states it has the same processor and RP1 I/O controller.
"""
import copy
import re
import pdfplumber

# GPIO net names expected on each J8 position (ID_SD/ID_SC are GPIO0/GPIO1).
SCHEMATIC_ALIASES = {'ID_SD': 'GPIO0', 'ID_SC': 'GPIO1'}


def bcm2835_alt_functions(cache, docs, clean):
    """Return {gpio: [(alt, signal), ...]} for GPIO0-27 from §6.2."""
    with pdfplumber.open(cache / docs['bcm2835-peripherals']['file']) as pdf:
        page = pdf.pages[101]
        text = page.extract_text() or ''
        assert '6.2 Alternative Function Assignments' in text
        rows = {}
        last = None
        for table in page.extract_tables():
            for row in table:
                name = clean(row[0])
                match = re.fullmatch(r'GPIO(\d+)', name)
                if match:
                    last = int(match[1])
                    # ALT0..ALT5 sit at columns 5, 8, 11, 14, 17 and 20.
                    rows[last] = [clean(row[i]) if i < len(row) else '' for i in (5, 8, 11, 14, 17, 20)]
                elif not name and last is not None and any(row):
                    # Wrapped cell text continues on the following table row.
                    for slot, i in enumerate((5, 8, 11, 14, 17, 20)):
                        extra = clean(row[i]) if i < len(row) else ''
                        if extra:
                            rows[last][slot] = (rows[last][slot] + ' ' + extra).strip()
                elif name == '':
                    last = None
    assert set(range(28)) <= set(rows), sorted(rows)
    functions = {gp: [(alt, value) for alt, value in enumerate(rows[gp]) if value and not value.startswith('<')]
                 for gp in range(28)}
    # Independent spot checks against the printed table.
    assert functions[0] == [(0, 'SDA0'), (1, 'SA5')]
    assert functions[2] == [(0, 'SDA1'), (1, 'SA3')]
    assert functions[7] == [(0, 'SPI0_CE1_N'), (1, 'SWE_N / SRW_N')]
    assert functions[14] == [(0, 'TXD0'), (1, 'SD6'), (5, 'TXD1')]
    assert functions[18] == [(0, 'PCM_CLK'), (1, 'SD10'), (3, 'BSCSL SDA / MOSI'), (4, 'SPI1_CE0_N'), (5, 'PWM0')]
    assert functions[21] == [(0, 'PCM_DOUT'), (1, 'SD13'), (3, 'BSCSL / CE_N'), (4, 'SPI1_SCLK'), (5, 'GPCLK1')]
    assert functions[27] == [(3, 'SD1_DAT3'), (4, 'ARM_TMS')]
    signals = {s for fs in functions.values() for _, s in fs}
    # BCM2711 adds these instances; they are not in the BCM2835 table for GPIO0-27.
    assert not any(re.fullmatch(r'(TXD|RXD|CTS|RTS)[2-5]|(SDA|SCL)[3-6]|SPI[3-6]_\w+|DPI_\w+|PCLK|DE|LCD_\w+', s) for s in signals)
    assert sum(len(fs) for fs in functions.values()) == 83, sum(len(fs) for fs in functions.values())
    return functions


def check_j8(cache, doc, header_pins, unpopulated):
    """Match every GPIO net label to its J8 contact number by coordinates."""
    with pdfplumber.open(cache / doc['file']) as pdf:
        page = pdf.pages[0]
        words = page.extract_words(x_tolerance=1, y_tolerance=1)
        anchor = [w for w in words if w['text'] == 'J8']
        assert len(anchor) == 1, doc['id']
        x, top = anchor[0]['x0'], anchor[0]['top']
        area = page.crop((x - 55, top - 2, x + 75, top + 122)).extract_words(x_tolerance=1, y_tolerance=1)
    numbers = [w for w in area if w['text'].isdigit() and x - 15 < w['x0'] < x + 20 and 1 <= int(w['text']) <= 40]
    assert sorted(int(w['text']) for w in numbers) == list(range(1, 41)), doc['id']
    checked = 0
    for w in area:
        if not (w['text'].startswith('GPIO') or w['text'] in SCHEMATIC_ALIASES):
            continue
        left = w['x0'] < x
        number = min((z for z in numbers if (int(z['text']) % 2 == 1) == left), key=lambda z: abs(z['top'] - w['top']))
        name = SCHEMATIC_ALIASES.get(w['text'], w['text'])
        assert header_pins[int(number['text'])]['name'] == name, (doc['id'], number['text'], name)
        checked += 1
    assert checked == 28, (doc['id'], checked)
    # Zero schematics mark the J8 footprint "DNF" (do not fit).
    assert any(w['text'] == 'DNF' for w in area) == unpopulated, doc['id']


def build_pi_header_boards(cache, docs, ref, function, clean, verified_on, pi4_pins, pi5_pins):
    by_number = {p['number']: p for p in pi4_pins}
    adoc = (cache / docs['pi-gpio']['file']).read_text()
    flat = ' '.join(adoc.split())
    text = lambda doc_id: ' '.join((cache / docs[doc_id]['file']).read_text().split())

    # --- Processor lineage statements (Raspberry Pi documentation) -----------
    lineage = {
        'pi-processor-bcm2835': ('used in the Raspberry Pi 1 Models A, A+, B, B+, the Raspberry Pi Zero, the Raspberry Pi Zero W',
                                 'NOTE: The peripheral specification document contains a number of errors'),
        'pi-processor-bcm2836': ('The underlying architecture in BCM2836 is identical to BCM2835',),
        'pi-processor-bcm2837': ('The underlying architecture of the BCM2837 is identical to the BCM2836',),
        'pi-processor-bcm2837b0': ('Raspberry Pi 3 Models A+, B+', 'The underlying architecture of the BCM2837B0 is identical to the BCM2837 chip'),
        'pi-processor-rp3a0': ('BCM2710A1 is the silicon die packaged inside the Broadcom xref:processors.adoc#bcm2837[BCM2837] chip',
                               'Raspberry Pi Zero 2 W'),
    }
    for doc_id, phrases in lineage.items():
        body = text(doc_id)
        for phrase in phrases:
            assert phrase in body, (doc_id, phrase)
    r_bcm2835 = ref('pi-proc-bcm2835', 'pi-processor-bcm2835', None, 'BCM2835 · used in Raspberry Pi Zero W; peripheral specification and its known-errors note', 'manufacturer-source-text')
    r_bcm2836 = ref('pi-proc-bcm2836', 'pi-processor-bcm2836', None, 'BCM2836 · underlying architecture identical to BCM2835', 'manufacturer-source-text')
    r_bcm2837 = ref('pi-proc-bcm2837', 'pi-processor-bcm2837', None, 'BCM2837 · underlying architecture identical to BCM2836', 'manufacturer-source-text')
    r_bcm2837b0 = ref('pi-proc-bcm2837b0', 'pi-processor-bcm2837b0', None, 'BCM2837B0 · used in Raspberry Pi 3 Model B+; architecture identical to BCM2837', 'manufacturer-source-text')
    r_rp3a0 = ref('pi-proc-rp3a0', 'pi-processor-rp3a0', None, 'RP3A0 · BCM2710A1 is the die inside BCM2837; used by Raspberry Pi Zero 2 W', 'manufacturer-source-text')
    assert 'earlier Raspberry Pi families of devices and Raspberry Pi Zero models, see *Alternative Function Assignments* in the https://pip.raspberrypi.com/documents/RP-008249-DS[BCM2835 peripherals datasheet]' in flat
    r_alt_docs = ref('pi-gpio-alt-references', 'pi-gpio', None, 'Pin functions · BCM2835 peripherals datasheet named for earlier families and Zero models', 'manufacturer-source-text')

    # --- BCM2835 §6.2 alternate functions -------------------------------------
    table = bcm2835_alt_functions(cache, docs, clean)
    r_alt_2835 = ref('bcm2835-alt-p102', 'bcm2835-peripherals', 102, '§6.2 · Alternative Function Assignments · GPIO0–27 ALT0–ALT5')
    r_alt_2837 = ref('bcm2835-alt-p102-bcm2837', 'bcm2835-peripherals', 102,
                     '§6.2 · Alternative Function Assignments · GPIO0–27 ALT0–ALT5, applied to BCM2837B0 / RP3A0 (BCM2710A1) because Raspberry Pi documents them as BCM2835-architecture devices')

    # --- Electrical statements that name these SoCs ---------------------------
    levels = flat.split('==== BCM2835, BCM2836, BCM2837, and RP3A0', 1)[1].split('==== BCM2711 products', 1)[0]
    assert 'for example, Raspberry Pi Zero or Raspberry Pi 3B+' in levels
    for row in ('| V~IL~ | Input low voltage | - | - | - | 0.9 | V', '| V~IH~ | Input high voltage^a^ | - | 1.6 | - | - | V',
                '| R~PU~ | Pullup resistor | - | 50 | - | 65 |', '| R~PD~ | Pulldown resistor | - | 50 | - | 65 |',
                '^b^ Default drive strength (8 mA)', '^c^ Maximum drive strength (16 mA)'):
        assert row in levels, row
    r_levels = ref('pi-gpio-bcm283x-levels', 'pi-gpio', None, 'Voltage specifications · BCM2835, BCM2836, BCM2837 and RP3A0 table (V_IL, V_IH, pulls, drive strength)', 'manufacturer-source-table')
    rp1_levels = flat.split('==== RP1 products', 1)[1]
    assert 'RP1-based products (Raspberry Pi 5, 500, and 500+)' in rp1_levels
    for row in ('| V~IL~ | Input low voltage | - | 0 | - | 0.8 | V', '| V~IH~ | Input high voltage | - | 2.0 | - | 3.3 | V',
                '| V~OL~ | Output low voltage | - | - | - | 0.4 | V', '| V~OH~ | Output high voltage | - | 2.9 | - | - | V',
                'Drive strength = 2 mA', 'Drive strength = 12 mA'):
        assert row in rp1_levels, row
    r_rp1_levels = ref('pi-gpio-rp1-levels', 'pi-gpio', None, 'Voltage specifications · RP1 products table (Raspberry Pi 5, 500, 500+)', 'manufacturer-source-table')
    assert 'The GPIO header on *keyboard computers* has an inverted orientation; the header is rotated 180 degrees compared to a standard board layout, but pins 1 and 40 are labelled' in flat
    assert 'on the rear of keyboard-integrated models (keyboard computers)' in flat
    r_orientation = ref('pi-gpio-keyboard-orientation', 'pi-gpio', None, 'Pin layout · header on the rear of keyboard computers, rotated 180°, pins 1 and 40 labelled', 'manufacturer-source-text')

    # --- Zero model documentation ----------------------------------------------
    zero = text('pi-zero-models')
    for phrase in ('A mini HDMI port.', 'Two micro-USB ports, one for input power and one for external devices.',
                   'Models without the suffix or label come with unpopulated holes; if you want GPIO access, you need to manually solder the header',
                   '| Raspberry Pi Zero 2 W (2021) | Raspberry Pi xref:../computers/processors.adoc#rp3a0[RP3A0] | 512 MB of RAM | Unpopulated 40-pin GPIO header',
                   '| Raspberry Pi Zero W (2017) | Broadcom xref:../computers/processors.adoc#bcm2835[BCM2835] | 512 MB of RAM | Unpopulated 40-pin GPIO header'):
        assert phrase in zero, phrase
    r_zero = ref('pi-zero-model-list', 'pi-zero-models', None, 'Zero models · common ports (mini HDMI, 2 × micro USB), unpopulated header on models without H / "with headers", model list table', 'manufacturer-source-table')

    # --- Product briefs ---------------------------------------------------------
    def pdf_text(doc_id, pages):
        with pdfplumber.open(cache / docs[doc_id]['file']) as pdf:
            return ' '.join(' '.join((pdf.pages[i].extract_text() or '') for i in pages).split())
    z2 = pdf_text('pi-zero-2-w-brief', (1, 2))
    for phrase in ('Raspberry Pi RP3A0 system-in-package (SiP), integrating a Broadcom BCM2710A1 die', 'an unpopulated footprint for a HAT-compatible 40-pin GPIO header',
                   'HAT-compatible 40-pin I/O header footprint', 'Arm Cortex-A53 @ 1GHz'):
        assert phrase in z2, phrase
    r_z2_brief = ref('pi-zero-2-w-brief-spec', 'pi-zero-2-w-brief', 2, 'Overview and Specification · RP3A0 / BCM2710A1, unpopulated HAT-compatible 40-pin header footprint', 'pdf-text')
    b3 = pdf_text('pi-3b-plus-brief', (2,))
    for phrase in ('Broadcom BCM2837B0, Cortex-A53 64-bit SoC @ 1.4GHz', '5V DC via GPIO header'):
        assert phrase in b3, phrase
    r_3b_brief = ref('pi-3b-plus-brief-spec', 'pi-3b-plus-brief', 3, 'Specification · BCM2837B0 @ 1.4 GHz; 5 V DC input via GPIO header', 'pdf-text')
    b500 = pdf_text('pi-500-brief', (1, 2))
    for phrase in ('Raspberry Pi 500 features the same quad-core 64-bit Arm processor and RP1 I/O controller found in Raspberry Pi 5',
                   'GPIO: Horizontal 40-pin GPIO header'):
        assert phrase in b500, phrase
    r_500_brief = ref('pi-500-brief-spec', 'pi-500-brief', 2, 'Overview · same processor and RP1 I/O controller as Raspberry Pi 5; Specification · horizontal 40-pin GPIO header', 'pdf-text')
    keyboard = text('pi-keyboard-computers')
    for phrase in ('| *GPIO* | Horizontal 40-pin GPIO header | Horizontal 40-pin GPIO header | Horizontal 40-pin GPIO header',
                   'xref:../computers/processors.adoc#bcm2712[BCM2712] SoC and xref:../computers/io-controllers.adoc[[RP1 I/O controller]',
                   'The Raspberry Pi 500 keyboard computer, released 2024, is based on Raspberry Pi 5 (8 GB).'):
        assert phrase in keyboard, phrase
    r_keyboard = ref('pi-keyboard-spec', 'pi-keyboard-computers', None, 'Specifications table · SoC and I/O controller (BCM2712 + RP1) and GPIO (horizontal 40-pin header) rows', 'manufacturer-source-table')

    # --- Board schematics: J8 nets ----------------------------------------------
    j8 = {}
    for board_id, doc_id, unpopulated in (('raspberry-pi-zero-w', 'pi-zero-w-schematic', True),
                                          ('raspberry-pi-zero-2-w', 'pi-zero-2-w-schematic', True),
                                          ('raspberry-pi-3b-plus', 'pi-3b-plus-schematic', False)):
        check_j8(cache, docs[doc_id], by_number, unpopulated)
        locator = 'J8 · GPIO net labels matched to contacts' + (' · footprint marked DNF (not fitted)' if unpopulated else '') + '; power and ground visually checked'
        j8[board_id] = ref(board_id.replace('raspberry-pi-', 'pi-') + '-j8', doc_id, 1, locator, 'schematic-net-labels+visual-power')

    def header(extra_evidence, alt_source, alt_ref):
        pins = []
        for source in sorted(pi4_pins, key=lambda p: p['number']):
            pin = {'number': source['number'], 'name': source['name'], 'type': source['type'], 'functions': [],
                   'evidence': ['pi-header-doc', *extra_evidence]}
            if source.get('reserved'):
                pin['noteKey'] = 'reservedNote'; pin['reserved'] = True
            match = re.fullmatch(r'GPIO(\d+)', source['name'])
            if match and alt_source is not None:
                pin['functions'] = [function(signal, alt, alt_ref, True) for alt, signal in alt_source[int(match[1])]]
            pins.append(pin)
        return pins

    base = {'family': 'Raspberry Pi', 'voltage': '3.3 V I/O', 'verifiedOn': verified_on, 'layout': 'header',
            'packagePins': 40, 'gpioCount': 28, 'reservedGPIOCount': 2}
    boards = []
    boards.append({**base, 'id': 'raspberry-pi-zero-w', 'scopeKey': 'piZeroWScope', 'name': 'Raspberry Pi Zero W', 'shortName': 'Zero W',
                   'subtitle': 'J8 · 40-pin footprint (unpopulated) · BCM2835 alternate functions', 'mcu': 'BCM2835',
                   'processor': '1 × ARM1176JZF-S', 'clock': '1 GHz', 'wireless': True,
                   'searchTerms': 'Zero W WH BCM2835 ARM11', 'source': docs['pi-zero-w-schematic']['url'],
                   'datasheet': docs['bcm2835-peripherals']['url'],
                   'cautions': [{'key': 'piZeroHeaderCaution', 'evidence': [r_zero, j8['raspberry-pi-zero-w']]},
                                {'key': 'piBcm2835FunctionsCaution', 'evidence': [r_alt_2835, r_bcm2835, r_alt_docs]},
                                {'key': 'piBcm283xLevelsCaution', 'evidence': [r_levels]}],
                   'pins': header([j8['raspberry-pi-zero-w']], table, r_alt_2835)})
    boards.append({**base, 'id': 'raspberry-pi-zero-2-w', 'scopeKey': 'piZero2WScope', 'name': 'Raspberry Pi Zero 2 W', 'shortName': 'Zero 2 W',
                   'subtitle': 'J8 · 40-pin footprint (unpopulated) · RP3A0 (BCM2710A1) alternate functions', 'mcu': 'RP3A0 (BCM2710A1)',
                   'processor': '4 × Arm Cortex-A53', 'clock': '1 GHz', 'wireless': True,
                   'searchTerms': 'Zero 2 W WH RP3A0 BCM2710A1 BCM2837 Cortex-A53', 'source': docs['pi-zero-2-w-schematic']['url'],
                   'datasheet': docs['bcm2835-peripherals']['url'],
                   'cautions': [{'key': 'piZeroHeaderCaution', 'evidence': [r_zero, r_z2_brief, j8['raspberry-pi-zero-2-w']]},
                                {'key': 'piBcm2837FunctionsCaution', 'evidence': [r_alt_2837, r_rp3a0, r_bcm2837, r_bcm2836, r_bcm2835, r_alt_docs]},
                                {'key': 'piBcm283xLevelsCaution', 'evidence': [r_levels]}],
                   'pins': header([j8['raspberry-pi-zero-2-w']], table, r_alt_2837)})
    boards.append({**base, 'id': 'raspberry-pi-3b-plus', 'scopeKey': 'pi3bPlusScope', 'name': 'Raspberry Pi 3 Model B+', 'shortName': 'Pi 3 Model B+',
                   'subtitle': 'J8 · 40 pins · BCM2837B0 alternate functions', 'mcu': 'BCM2837B0',
                   'processor': '4 × Arm Cortex-A53', 'clock': '1.4 GHz', 'wireless': True,
                   'searchTerms': 'Pi 3 B+ 3B+ Model B Plus BCM2837B0 BCM2837 Cortex-A53', 'source': docs['pi-3b-plus-schematic']['url'],
                   'datasheet': docs['bcm2835-peripherals']['url'],
                   'cautions': [{'key': 'piBcm2837FunctionsCaution', 'evidence': [r_alt_2837, r_bcm2837b0, r_bcm2837, r_bcm2836, r_bcm2835, r_alt_docs]},
                                {'key': 'piBcm283xLevelsCaution', 'evidence': [r_levels]},
                                {'key': 'pi3bPlusPowerCaution', 'evidence': [r_3b_brief]}],
                   'pins': header([j8['raspberry-pi-3b-plus']], table, r_alt_2837)})
    pi500 = header([r_keyboard, r_500_brief], None, None)
    rp1 = {p['name']: p['functions'] for p in pi5_pins}
    for pin in pi500:
        if pin['type'] == 'GPIO':
            pin['functions'] = copy.deepcopy(rp1[pin['name']])
            assert pin['functions'] and all(f['evidence'].startswith('rp1-alt-') for f in pin['functions'])
    boards.append({**base, 'id': 'raspberry-pi-500', 'scopeKey': 'pi500Scope', 'name': 'Raspberry Pi 500', 'shortName': 'Pi 500',
                   'subtitle': 'Rear 40-pin GPIO header · RP1 alternate functions', 'mcu': 'BCM2712 / RP1',
                   'processor': '4 × Arm Cortex-A76 / RP1 I/O', 'clock': '2.4 GHz', 'wireless': True,
                   'searchTerms': 'Pi 500 keyboard computer BCM2712 RP1 Cortex-A76', 'source': docs['pi-500-brief']['url'],
                   'datasheet': docs['rp1-peripherals']['url'],
                   'cautions': [{'key': 'piKeyboardHeaderCaution', 'evidence': [r_orientation, r_keyboard]},
                                {'key': 'pi500Rp1Caution', 'evidence': [r_500_brief, r_keyboard, 'rp1-alt-p16']},
                                {'key': 'piRp1LevelsCaution', 'evidence': [r_rp1_levels]}],
                   'pins': pi500})
    for board in boards:
        assert [p['name'] for p in board['pins']] == [by_number[n]['name'] for n in range(1, 41)]
        assert sum(p['type'] == 'GPIO' for p in board['pins']) == 28
    return boards
