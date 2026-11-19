"""Board contacts and alternate functions from the newly supported manufacturer sources."""
import copy
import re
import xml.etree.ElementTree as ET

import pdfplumber

from expanded_arduino_sources import finish
from warning_sources import caution, warn


def pin_function(name, group, source, signal=None):
    return {'name': name, 'signal': signal or name, 'group': group, 'evidence': source}


def contact(connector, number, label, net, kind, reference, x, y, side, **metadata):
    return {
        'connector': connector, 'connectorPin': number, 'physicalLabel': f'{connector}.{number}',
        'name': label, 'boardLabel': label, 'net': net, 'type': kind,
        'position': {'x': x, 'y': y, 'side': side},
        'functions': [], 'evidence': [reference], **metadata,
    }


def rail_kind(label):
    if label in {'GND', 'AGND', 'DGND'}:
        return 'GND'
    if label in {'3V3', '5V', 'VBUS', 'VIN', 'VBAT', 'VBATT', 'DOVDD', 'DVDD', 'AVDD'}:
        return 'POWER'
    return 'SYSTEM'


def board(id, name, short_name, family, mcu, processor, clock, voltage, source, datasheet, date, diagram, pins, **metadata):
    return finish({
        'id': id, 'name': name, 'shortName': short_name, 'family': family,
        'mcu': mcu, 'processor': processor, 'clock': clock, 'voltage': voltage,
        'layout': 'custom', 'diagram': diagram, 'source': source, 'datasheet': datasheet,
        'verifiedOn': date, 'subtitle': f'{mcu} · {len(pins)} contacts', **metadata,
    }, pins)


def diagram(id, height, connectors, width=820):
    return {
        'width': width, 'height': height, 'artwork': f'assets/boards/{id}.svg',
        'connectorGroups': [{'id': key, 'label': label, 'contacts': [key]} for key, label in connectors],
    }


def from_rp2350(pin, pads):
    pad = pads[pin['net']]
    pin.update(mcuPin=pad['number'], functions=copy.deepcopy(pad['functions']))
    pin['evidence'].extend(pad['evidence'])
    if 'inputTolerance' in pad:
        pin['inputTolerance'] = copy.deepcopy(pad['inputTolerance'])


def xiao_boards(cache, docs, ref, date, template, pads, c6):
    profiles = []
    matrix = {p['net']: p for p in c6['pins'] if p['type'] == 'GPIO'}
    rp_doc, c6_doc = 'xiao-rp2350-sch', 'xiao-esp32c6-sch'
    for model, document, page, gpio, mcu, clock in [
        ('esp32c6', c6_doc, 5, (0, 1, 2, 21, 22, 23, 16, 17, 19, 20, 18), 'ESP32-C6', '160 MHz'),
        ('rp2350', rp_doc, 5, (26, 27, 28, 5, 6, 7, 0, 1, 2, 4, 3), 'RP2350A', '150 MHz'),
    ]:
        id = 'xiao-' + model
        rp = model == 'rp2350'
        with pdfplumber.open(cache / docs[document]['file']) as pdf:
            assert len(pdf.pages) == 5
            if not rp:
                assert 'ESP32-C6FH4' in (pdf.pages[4].extract_text() or '')
        wiring = ref(id + '-headers', document, page,
                     'XIAO side headers · D0–D10 and power · RP2350 expansion pads when fitted to this design' if rp
                     else 'ESP32-C6FH4 and XIAO side-header nets (also see connector sheet on p. 4)',
                     'visual-diagram')
        pins = []
        for old in template['pins']:
            label = old['boardLabel']
            is_signal = re.fullmatch(r'D(\d+)', label)
            net = f'GPIO{gpio[int(is_signal[1])]}' if is_signal else label
            pin = contact(old['connector'], old['connectorPin'], label, net, old['type'], wiring,
                          old['position']['x'], old['position']['y'], old['position']['side'])
            if is_signal:
                if rp:
                    from_rp2350(pin, pads)
                else:
                    pin['functions'] = copy.deepcopy(matrix[net]['functions'])
            pins.append(pin)
        groups = [('L', 'L'), ('R', 'R')]
        if rp:
            # Seeed schematic page 5, Expand Pin, corroborated by the board's back view.
            rear = ref(id + '-back', 'xiao-rp2350-back', None, 'Rear view · D11–D18 pad positions', 'visual-diagram')
            for index, (label, test_point, gpio_number) in enumerate([
                ('D11', 16, 21), ('D12', 15, 20), ('D13', 14, 17), ('D14', 13, 16),
                ('D18', 12, 9), ('D17', 11, 10), ('D16', 8, 12), ('D15', 7, 11),
            ]):
                pin = contact('TP', test_point, label, f'GPIO{gpio_number}', 'GPIO', rear,
                              280 if index < 4 else 540, 505 + 34 * (index % 4),
                              'left' if index < 4 else 'right')
                pin['evidence'].append(wiring)
                from_rp2350(pin, pads)
                pins.append(pin)
            groups.append(('TP', 'D11–D18'))
        label = 'RP2350' if rp else 'ESP32C6'
        profile = board(id, f'Seeed Studio XIAO {label}', f'XIAO {label}', 'Seeed Studio', mcu,
                        'Cortex-M33 / Hazard3' if rp else 'RISC-V', clock, '3.3 V I/O',
                        docs[document]['url'], docs['rp2350' if rp else 'esp32c6-datasheet']['url'], date,
                        diagram('seeed-' + id, 670 if rp else 480, groups), pins,
                        orientation='usb', wireless=not rp, **({'mcuProfile': 'rp2350a'} if rp else {}))
        if rp:
            caution(profile, 'xiaoRp2350BackPads', wiring)
        profiles.append(profile)
    return profiles


def read_eagle_headers(path, connectors):
    nets = {part: {} for part in connectors}
    for net in ET.parse(path).findall('.//sheets/sheet/nets/net'):
        refs = list(net.iter('pinref'))
        gpio = {m[1] for r in refs if r.get('part') == 'X2'
                for m in re.finditer(r'GPIO(\d+)', r.get('pin'))}
        assert len(gpio) <= 1, net.get('name')
        signal = 'GPIO' + gpio.pop() if gpio else net.get('name')
        for r in refs:
            part, pin = r.get('part'), r.get('pin')
            if part in nets and pin != 'MT':
                assert pin not in nets[part]
                nets[part][pin] = (net.get('name'), signal)
    return nets


def feather_rp2350(cache, docs, ref, date, pads):
    schematic, pinout = 'feather-rp2350-cad', 'feather-rp2350-pinout'
    electrical = ref('feather-rp2350-connectors', schematic, None, 'Eagle schematic · JP1, JP3, CN2 and CONN1 nets',
                     'manufacturer-xml')
    drawing = ref('feather-rp2350-top', pinout, 1, 'Top-view header orientation and factory silkscreen',
                  'visual-diagram')
    nets = read_eagle_headers(cache / docs[schematic]['file'], ('JP1', 'JP3', 'CN2', 'CONN1'))
    assert set(nets['CN2']) == set(map(str, range(1, 23))) - {'8', '9'}
    aliases = {'!RESET': 'RESET', 'VBUS': 'USB', 'VBAT': 'BAT', '3.3V': '3V3', 'PSRAM_CS': 'PCS',
               'HSTX12': 'D2P', 'HSTX13': 'D2N', 'HSTX14': 'CKP', 'HSTX15': 'CKN',
               'HSTX16': 'D1P', 'HSTX17': 'D1N', 'HSTX18': 'D0P', 'HSTX19': 'D0N'}
    pins = []
    for connector, numbers, x, y, step, side in [
        ('JP1', range(16, 0, -1), 277, 110, 28, 'left'),
        ('JP3', range(1, 13), 543, 222, 28, 'right'),
        ('CN2', range(1, 12), 277, 650, 29, 'left'),
        ('CN2', range(12, 23), 543, 650, 29, 'right'),
        ('CONN1', ('GND', 'V+', 'SDA', 'SCL'), 543, 1030, 29, 'right'),
    ]:
        for row, number in enumerate(numbers, 1):
            name, net = nets[connector].get(str(number), ('NC', 'NC'))
            pin = contact(connector, row if connector == 'CONN1' else number, aliases.get(name, name),
                          net, 'GPIO' if net.startswith('GPIO') else rail_kind({'3.3V': '3V3'}.get(net, net)),
                          electrical, x, y + step * (row - 1), side)
            if connector in ('JP1', 'JP3'):
                pin['evidence'].append(drawing)
            if name == 'NC':
                pin['reserved'] = True
            if net.startswith('GPIO'):
                from_rp2350(pin, pads)
            pins.append(pin)
    groups = [('JP1', 'JP1'), ('JP3', 'JP3'), ('CN2', 'HSTX · CN2'), ('CONN1', 'STEMMA QT')]
    variants = []
    for suffix, name in [('', 'Adafruit Feather RP2350 with HSTX'), ('-psram', 'Adafruit Feather RP2350 with HSTX + PSRAM')]:
        variant = board('adafruit-feather-rp2350' + suffix, name, 'Feather RP2350', 'Adafruit',
                        'RP2350A', 'Cortex-M33 / Hazard3', '150 MHz', '3.3 V I/O', docs[pinout]['viewUrl'],
                        docs['rp2350']['url'], date, diagram('adafruit-feather-rp2350', 1170, groups),
                        copy.deepcopy(pins), mcuProfile='rp2350a', orientation='usb')
        if suffix:
            for pin in variant['pins']:
                if pin['net'] == 'GPIO8':
                    pin['reserved'] = True
                    warn(pin, 'featherRp2350Psram', electrical, drawing)
        variants.append(variant)
    return variants


def nano_r4(cache, docs, ref, date, template):
    id = 'arduino-nano-r4'
    physical = ref(id + '-headers', 'nano-r4-pinout', 1, 'ABX00142 top view · side headers, Qwiic and VBATT',
                   'visual-diagram')
    circuit = ref(id + '-circuit', 'nano-r4-schematic', 1, 'ABX00142 electrical design and RA4M1 signal names',
                  'visual-diagram')
    core = ref(id + '-variant', 'nano-r4-variant', None, 'g_pin_cfg · Arduino labels and RA4M1 port indices', 'source-code')
    defaults = ref(id + '-defaults', 'nano-r4-variant-h', None, 'UART, Wire, SPI and CAN Arduino default pin constants',
                   'source-code')
    mux = ref(id + '-pinmux', 'nano-r4-pinmux', None, 'RA4M1 ADC channel and native SPI/I²C instance declarations',
              'source-code')
    get_text = lambda source: (cache / docs[source]['file']).read_text()
    variant, header = get_text('nano-r4-variant'), get_text('nano-r4-variant-h')
    arrays = dict(re.findall(r'const uint16_t (P\d{3})(?:_b)?\[\]\s*=\s*\{([^}]+)\}', get_text('nano-r4-pinmux') + variant))
    ports = {int(n): 'P' + str(int(port)) + pad for port, pad, n in re.findall(
        r'\{\s*BSP_IO_PORT_(\d+)_PIN_(\d+),[^}]+\},?\s*/\*\s*\((\d+)\)', variant)}
    assert set(ports) == set(range(29))
    defines = {key: int(n) for key, n in re.findall(r'^#define\s+(\w+)[ \t]+\(?(\d+)u?\)?', header, re.M)}
    interfaces = {
        'WIRE_SDA_PIN': ('I2C1 SDA', 'I2C', 'SDA1'), 'WIRE_SCL_PIN': ('I2C1 SCL', 'I2C', 'SCL1'),
        'WIRE1_SDA_PIN': ('I2C0 SDA', 'I2C', 'SDA0'), 'WIRE1_SCL_PIN': ('I2C0 SCL', 'I2C', 'SCL0'),
        'PIN_SPI_MOSI': ('SPI1 MOSI', 'SPI', 'MOSI1'), 'PIN_SPI_MISO': ('SPI1 MISO', 'SPI', 'MISO1'),
        'PIN_SPI_SCK': ('SPI1 SCK', 'SPI', 'SCK1'), 'PIN_SPI_CS': ('Chip select (Arduino)', 'SYSTEM', 'SS'),
        'PIN_CAN0_TX': ('CAN0 TX', 'CAN', 'CTX0'), 'PIN_CAN0_RX': ('CAN0 RX', 'CAN', 'CRX0'),
    }
    # Core header calls the wiring API UART1. Derive the actual SCI instance from pinmux.
    for key, direction, signal in [('UART1_TX_PIN', 'TX', 'TX_MOSI_SDA'), ('UART1_RX_PIN', 'RX', 'RX_MISO_SCL')]:
        entries = re.findall(r'SCI_CHANNEL\|PIN_' + signal + r'\|CHANNEL_(\d+)', arrays[ports[defines[key]]])
        assert len(entries) == 1, (key, entries)
        interfaces[key] = (f'UART{entries[0]} {direction}', 'UART', direction + 'D' + entries[0])

    with pdfplumber.open(cache / docs['nano-r4-pinout']['file']) as pdf:
        printed = pdf.pages[0].extract_text() or ''
    assert all(word in printed for word in ('ABX00142', 'VBATT', 'QWIIC'))
    pins = []
    pwm_pins = {int(n) for n in re.findall(r'set_initial_timer_channel_as_pwm\(.*?getPinCfgs\((\d+),', variant)}

    def add(connector, index, label, x, y, side, alias=None):
        pin = contact(connector, index, label, ports[alias] if alias is not None else label,
                      'GPIO' if alias is not None else rail_kind(label), physical, x, y, side)
        if alias is not None:
            port = ports[alias]
            pin.update(mcuPort=port, arduinoPin=alias)
            pin['evidence'].append(core)
            entries = arrays[port]
            for group, pattern, format_name in [
                ('ADC', r'PIN_ANALOG\|CHANNEL_(\d+)', 'ADC0_AN{}'),
                ('DAC', r'PIN_DAC\|CHANNEL_(\d+)', 'DAC{}'),
                ('IRQ', r'PIN_INTERRUPT\|CHANNEL_(\d+)', 'IRQ{}'),
            ]:
                for hit in re.findall(pattern, entries):
                    pin['functions'].append(pin_function(format_name.format(hit), group, mux))
            if alias in pwm_pins:
                channel, output = re.search(r'PIN_PWM\|CHANNEL_(\d+)\|PWM_CHANNEL_([AB])', entries).groups()
                pin['functions'].append(pin_function(f'GPT{channel}_GTIOC{output}', 'PWM', mux))
            for key, (name, group, signal) in interfaces.items():
                if defines[key] == alias:
                    pin['functions'].append(pin_function(name, group, defaults, signal))
        pins.append(pin)

    for old in template['pins']:
        label = 'BOOT' if old['physicalLabel'] == 'L.13' else old['name']
        match = re.fullmatch(r'([DA])(\d+)', label)
        alias = defines[f'PIN_{label}'] if match else None
        p = old['position']
        add(old['connector'], old['connectorPin'], label, p['x'], p['y'], p['side'], alias)
    assert pins[12]['name'] == 'BOOT' and pins[-1]['name'] == 'D1'
    for number, (label, alias) in enumerate([('GND', None), ('3V3', None), ('SDA', 27), ('SCL', 26)], 1):
        add('QWIIC', number, label, 540, 600 + (number - 1) * 29, 'right', alias)
        if alias is not None:
            pins[-1]['voltage'] = '3.3 V I/O'
    add('VBATT', 1, 'VBATT', 280, 600, 'left')
    profile = board(id, 'Arduino Nano R4', 'Nano R4', 'Arduino', 'Renesas RA4M1', 'Cortex-M4',
                    '48 MHz', '5 V I/O', docs['nano-r4-pinout']['viewUrl'], 'https://docs.arduino.cc/hardware/nano-r4/', date,
                    diagram(id, 780, [('L', 'L'), ('R', 'R'), ('QWIIC', 'Qwiic'), ('VBATT', 'VBATT')]), pins,
                    orientation='usb', scopeKey='nanoR4Scope')
    caution(profile, 'nanoR4PowerDomains', physical, circuit)
    return profile


def add_esp_signal(pin, source_pin):
    # Functions here describe the silicon. Board sharing and circuit notes belong
    # to the exact schematic, not to the donor development board.
    for key in ('functions', 'strapping', 'inputOnly'):
        if key in source_pin:
            pin[key] = copy.deepcopy(source_pin[key])


def d1_mini(cache, docs, ref, date, esp8266):
    id = 'lolin-d1-mini-v4'
    drawing = ref(id + '-pinout', 'd1-mini-v4-pinout', None, 'WEMOS v4.0.0 top view · USB at the bottom and P1 at right',
                  'visual-diagram')
    evidence = ref(id + '-connectors', 'd1-mini-v4-schematic', 1, 'LOLIN D1 mini v4.0.0 · J2/J3/P1, A0 divider, LED and boot resistors',
                   'visual-diagram')
    with pdfplumber.open(cache / docs['d1-mini-v4-schematic']['file']) as pdf:
        text = pdf.pages[0].extract_text() or ''
        assert all(word in text for word in ('J2', 'J3', 'IO16', '220k', '100k', 'CH340C'))
    silicon = {p['net']: p for p in esp8266['pins']}
    rows = {
        'J2': [('RST', 'EXT_RSTB'), ('A0', 'TOUT'), ('D0', 'GPIO16'), ('D5', 'GPIO14'),
               ('D6', 'GPIO12'), ('D7', 'GPIO13'), ('D8', 'GPIO15'), ('3V3', '3V3')],
        'J3': [('TX', 'GPIO1'), ('RX', 'GPIO3'), ('D1', 'GPIO5'), ('D2', 'GPIO4'),
               ('D3', 'GPIO0'), ('D4', 'GPIO2'), ('GND', 'GND'), ('5V', 'VBUS')],
        'P1': [('GND', 'GND'), ('SDA', 'GPIO4'), ('SCL', 'GPIO5'), ('3V3', '3V3')],
    }
    pins = []
    for connector, pairs in rows.items():
        for number, (label, net) in enumerate(pairs, 1):
            side = 'left' if connector == 'J2' else 'right'
            kind = 'GPIO' if net.startswith('GPIO') else 'ADC' if net == 'TOUT' else rail_kind(label)
            pin = contact(connector, number, label, net, kind, evidence,
                          280 if side == 'left' else 540, (480 if connector == 'P1' else 140) + 32 * (number - 1), side)
            pin['evidence'].append(drawing)
            if net in silicon:
                add_esp_signal(pin, silicon[net])
            if label == 'A0':
                warn(pin, 'd1MiniAnalog', evidence)
            elif net == 'GPIO2':
                warn(pin, 'd1MiniLed', evidence)
            elif net in ('GPIO0', 'GPIO15'):
                warn(pin, 'd1MiniBoot', evidence)
            pins.append(pin)
    return board(id, 'LOLIN D1 mini v4.0.0', 'D1 mini v4', 'WEMOS', 'ESP8266EX', 'Tensilica L106', '80/160 MHz',
                 '3.3 V I/O', docs['d1-mini-v4-schematic']['url'], docs['esp8266ex-datasheet']['url'], date,
                 diagram(id, 620, [('J2', 'J2'), ('J3', 'J3'), ('P1', 'I²C · P1')]), pins,
                 orientation='usb-bottom', wireless=True)


def esp32_cam(cache, docs, ref, date, esp32):
    id = 'ai-thinker-esp32-cam'
    evidence = ref(id + '-connectors', 'esp32-cam-schematic', 1,
                   'Ai-Thinker ESP32_CAM Rev 1.6 · P1/P2, camera socket Cam1, microSD SD1 and on-board PSRAM',
                   'visual-diagram')
    with pdfplumber.open(cache / docs['esp32-cam-schematic']['file']) as pdf:
        text = pdf.pages[0].extract_text() or ''
        assert all(word in text for word in ('ESP32_CAM', '1.6', 'Cam1', 'SD1', 'PSRAM'))
    silicon = {p['net']: p for p in esp32['pins']}
    # The two side headers are numbered from the lower end with the antennas at top.
    left = [('GPIO4', 4), ('GPIO2', 2), ('GPIO14', 14), ('GPIO15', 15),
            ('GPIO13', 13), ('GPIO12', 12), ('GND', None), ('5V', None)]
    right = [('GND', None), ('U0T', 1), ('U0R', 3), ('VCC', None),
             ('GND', None), ('GPIO0', 0), ('GPIO16', 16), ('3V3', None)]
    camera = [('Y0', None), ('Y1', None), ('Y4', 36), ('Y3', 39), ('Y5', 21), ('Y2', 5),
              ('Y6', 34), ('PCLK', 22), ('Y7', 35), ('DGND', None), ('Y8', 18), ('XCLK', 0),
              ('Y9', 19), ('DOVDD', None), ('DVDD', None), ('HREF', 23), ('PWDN', 32),
              ('VSYNC', 25), ('RESET', None), ('SIO_C', 27), ('AVDD', None), ('SIO_D', 26),
              ('AGND', None), ('NC', None), ('GND', None), ('GND', None)]
    microsd = [('DAT2', 12), ('DAT3', 13), ('CMD', 15), ('VDD', None), ('CLK', 14),
               ('GND', None), ('DAT0', 2), ('DAT1', 4)]
    pins = []

    def add(connector, pairs, start, x, y, step, side, reverse=False):
        for row, (label, gpio) in enumerate(pairs):
            number = start - row if reverse else start + row
            net = f'GPIO{gpio}' if gpio is not None else label
            kind = 'GPIO' if gpio is not None else 'POWER' if label == 'VDD' else rail_kind(label)
            pin = contact(connector, number, label, net, kind, evidence, x, y + row * step, side)
            if connector in ('P1', 'P2') and gpio is not None:
                add_esp_signal(pin, silicon[net])
            if connector in ('Cam1', 'SD1'):
                pin['reserved'] = True
                if gpio is not None:
                    group, signal = ('SYSTEM', f'CAM_{label}') if connector == 'Cam1' else ('SDIO', f'SDMMC_{label}')
                    pin['functions'].append(pin_function(signal, group, evidence))
            elif gpio in (2, 4, 12, 13, 14, 15):
                warn(pin, 'esp32CamSDLed' if gpio == 4 else 'esp32CamSD', evidence)
            elif gpio == 0:
                warn(pin, 'esp32CamClock', evidence)
            elif gpio == 16:
                pin['reserved'] = True
                warn(pin, 'esp32CamPsram', evidence)
            elif label == 'VCC':
                pin['reserved'] = True
                warn(pin, 'esp32CamVcc', evidence)
            pins.append(pin)

    add('P2', list(reversed(left)), 8, 280, 140, 31, 'left', reverse=True)
    add('P1', list(reversed(right)), 8, 540, 140, 31, 'right', reverse=True)
    add('Cam1', camera[:13], 1, 280, 470, 27, 'left')
    add('Cam1', camera[13:], 14, 540, 470, 27, 'right')
    add('SD1', microsd, 1, 280, 900, 27, 'left')
    gpio_nets = {p['net'] for p in pins if p['type'] == 'GPIO'}
    assignable = {p['net'] for p in pins if p['type'] == 'GPIO' and not p.get('reserved')}
    return board(id, 'Ai-Thinker ESP32-CAM', 'ESP32-CAM', 'Ai-Thinker', 'ESP32', 'Xtensa LX6', '240 MHz',
                 '3.3 V I/O', docs['esp32-cam-schematic']['viewUrl'], docs['esp32-datasheet']['url'], date,
                 diagram(id, 1140, [('P2', 'P2'), ('P1', 'P1'), ('Cam1', 'Camera · Cam1'), ('SD1', 'microSD · SD1')]),
                 pins, orientation='antenna', wireless=True, scopeKey='esp32CamScope',
                 reservedGPIOCount=len(gpio_nets - assignable))


def build_additional_boards(cache, docs, ref, date, boards):
    profiles = {b['id']: b for b in boards}
    rp2350 = profiles['rp2350a']
    pads = {p['name'].split('_ADC')[0]: p for p in rp2350['pins'] if p['type'] == 'GPIO'}
    return [
        *xiao_boards(cache, docs, ref, date, profiles['xiao-rp2040'], pads, profiles['esp32-c6-devkitc-1']),
        *feather_rp2350(cache, docs, ref, date, pads),
        nano_r4(cache, docs, ref, date, profiles['arduino-nano-every']),
        d1_mini(cache, docs, ref, date, profiles['nodemcu-v2']),
        esp32_cam(cache, docs, ref, date, profiles['esp32-devkitc-v4']),
    ]
