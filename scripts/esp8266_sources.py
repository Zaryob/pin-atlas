"""NodeMCU ESP8266 development board headers."""
import pdfplumber

def build_esp8266(cache, docs, obs, ref, verified_on):
    schematic = cache / docs['nodemcu-v1-schematic']['file']
    assert schematic.exists()
    datasheet = cache / docs['esp8266ex-datasheet']['file']
    assert datasheet.exists()

    with pdfplumber.open(datasheet) as pdf:
        p10_text = pdf.pages[9].extract_text() or ''
        assert 'GPIO16' in p10_text and 'HSPI_CLK' in p10_text and 'HSPI_MISO' in p10_text

    with pdfplumber.open(schematic) as pdf:
        p2_text = pdf.pages[1].extract_text() or ''
        p5_text = pdf.pages[4].extract_text() or ''
        assert 'ESP_12_PIN' in p2_text and 'GPIO16' in p2_text and 'TXD0' in p2_text and 'GPIO15 MUST keep LOW' in p2_text
        assert 'IO CONN' in p5_text and 'A0' in p5_text and 'D0' in p5_text

    physical = ref('nodemcu-v1-header', 'nodemcu-v1-schematic', 5,
                   'Sheet 5/9 · connectors J1 (A0–VIN) and J2 (D0–3V3)', 'visual-diagram')
    mcu_matrix = ref('esp8266ex-matrix', 'esp8266ex-datasheet', 10,
                     'Table 2-1 · ESP8266EX Pin Definitions · pin multiplexing and HSPI/UART assignments', 'pdf-text')
    boot_ref = ref('esp8266ex-boot', 'esp8266ex-datasheet', 11,
                   '§2 · Pin Definitions · Note on strapping: GPIO2, GPIO0, MTDO/GPIO15 boot mode selection', 'pdf-text')

    # J1 (left connector): 15 pins, top to bottom
    j1_defs = [
        # (connPin, name, label, net, type, functions, reserved, noteKey)
        (1,  'A0',   'A0',   'TOUT',     'ADC',    [('ADC0', 'ADC', 'ADC0')], False, 'esp8266AdcNote'),
        (2,  'RSV',  'RSV',  'RSV',      'SYSTEM', [], True,  'espNcNote'),
        (3,  'RSV',  'RSV',  'RSV',      'SYSTEM', [], True,  'espNcNote'),
        (4,  'SD3',  'SD3',  'GPIO10',   'GPIO',   [('SDIO_D3', 'SPI', 'SD3')], True, 'esp8266FlashNote'),
        (5,  'SD2',  'SD2',  'GPIO9',    'GPIO',   [('SDIO_D2', 'SPI', 'SD2')], True, 'esp8266FlashNote'),
        (6,  'SD1',  'SD1',  'GPIO8',    'GPIO',   [('SDIO_D1', 'SPI', 'MOSI')], True, 'esp8266FlashNote'),
        (7,  'CMD',  'CMD',  'GPIO11',   'GPIO',   [('SDIO_CMD', 'SPI', 'CS')], True, 'esp8266FlashNote'),
        (8,  'SD0',  'SD0',  'GPIO7',    'GPIO',   [('SDIO_D0', 'SPI', 'MISO')], True, 'esp8266FlashNote'),
        (9,  'CLK',  'CLK',  'GPIO6',    'GPIO',   [('SDIO_CLK', 'SPI', 'SCLK')], True, 'esp8266FlashNote'),
        (10, 'GND',  'GND',  'GND',      'GND',    [], False, None),
        (11, '3V3',  '3V3',  '3V3',      'POWER',  [], False, None),
        (12, 'EN',   'EN',   'CHIP_EN',  'SYSTEM', [], False, 'espEnableNote'),
        (13, 'RST',  'RST',  'EXT_RSTB', 'SYSTEM', [], False, 'espResetNote'),
        (14, 'GND',  'GND',  'GND',      'GND',    [], False, None),
        (15, 'VIN',  'VIN',  'VIN',      'POWER',  [], False, 'espVinNote'),
    ]

    # J2 (right connector): 15 pins, top to bottom
    j2_defs = [
        # (connPin, name, label, net, type, functions, strap, noteKey)
        (1,  'D0',  'D0',  'GPIO16', 'GPIO',
         [('WAKE', 'SYSTEM', 'WAKE'), ('GPIO interrupt', 'IRQ', 'GPIO16')], False, 'esp8266WakeNote'),
        (2,  'D1',  'D1',  'GPIO5',  'GPIO',
         [('I2C SCL', 'I2C', 'SCL'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO5')], False, 'espGpioNote'),
        (3,  'D2',  'D2',  'GPIO4',  'GPIO',
         [('I2C SDA', 'I2C', 'SDA'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO4')], False, 'espGpioNote'),
        (4,  'D3',  'D3',  'GPIO0',  'GPIO',
         [('FLASH button', 'SYSTEM', 'FLASH'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO0')], True, 'esp8266Boot0Note'),
        (5,  'D4',  'D4',  'GPIO2',  'GPIO',
         [('UART1 TX', 'UART', 'TXD1'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO2')], True, 'esp8266Gpio2Note'),
        (6,  '3V3', '3V3', '3V3',    'POWER',
         [], False, None),
        (7,  'GND', 'GND', 'GND',    'GND',
         [], False, None),
        (8,  'D5',  'D5',  'GPIO14', 'GPIO',
         [('HSPI SCK', 'SPI', 'SCK'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO14')], False, 'espGpioNote'),
        (9,  'D6',  'D6',  'GPIO12', 'GPIO',
         [('HSPI MISO', 'SPI', 'MISO'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO12')], False, 'espGpioNote'),
        (10, 'D7',  'D7',  'GPIO13', 'GPIO',
         [('HSPI MOSI', 'SPI', 'MOSI'), ('UART0 CTS', 'UART', 'CTS0'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO13')], False, 'espGpioNote'),
        (11, 'D8',  'D8',  'GPIO15', 'GPIO',
         [('HSPI CS', 'SPI', 'CS'), ('UART0 RTS', 'UART', 'RTS0'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO15')], True, 'esp8266Gpio15Note'),
        (12, 'RX',  'RX',  'GPIO3',  'GPIO',
         [('UART0 RX', 'UART', 'RXD0'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO3')], False, 'esp8266Uart0Note'),
        (13, 'TX',  'TX',  'GPIO1',  'GPIO',
         [('UART0 TX', 'UART', 'TXD0'), ('PWM', 'PWM', 'PWM'), ('GPIO interrupt', 'IRQ', 'GPIO1')], False, 'esp8266Uart0Note'),
        (14, 'GND', 'GND', 'GND',    'GND',
         [], False, None),
        (15, '3V3', '3V3', '3V3',    'POWER',
         [], False, None),
    ]

    pins = []
    # Build J1 (pins 1..15)
    for connPin, name, label, net, ptype, fns, reserved, noteKey in j1_defs:
        num = len(pins) + 1
        ev = [physical]
        functions = []
        if ptype == 'GPIO' or ptype == 'ADC':
            ev.append(mcu_matrix)
            for fname, fgroup, fsignal in fns:
                functions.append({
                    'name': fname,
                    'group': fgroup,
                    'signal': fsignal,
                    'evidence': mcu_matrix
                })
        pin = {
            'number': num,
            'physicalLabel': f'J1.{connPin}',
            'connector': 'J1',
            'connectorPin': connPin,
            'name': name,
            'boardLabel': label,
            'type': ptype,
            'functions': functions,
            'evidence': ev,
            'net': net,
            'position': {'x': 280, 'y': 115 + (connPin - 1) * 26, 'side': 'left'}
        }
        if reserved:
            pin['reserved'] = True
            pin['reservedLabel'] = label
        if noteKey:
            pin['noteKey'] = noteKey
        pins.append(pin)

    # Build J2 (pins 16..30)
    for connPin, name, label, net, ptype, fns, strap, noteKey in j2_defs:
        num = len(pins) + 1
        ev = [physical]
        functions = []
        if ptype == 'GPIO':
            ev.append(mcu_matrix)
            for fname, fgroup, fsignal in fns:
                functions.append({
                    'name': fname,
                    'group': fgroup,
                    'signal': fsignal,
                    'evidence': mcu_matrix
                })
        pin = {
            'number': num,
            'physicalLabel': f'J2.{connPin}',
            'connector': 'J2',
            'connectorPin': connPin,
            'name': name,
            'boardLabel': label,
            'type': ptype,
            'functions': functions,
            'evidence': ev,
            'net': net,
            'position': {'x': 540, 'y': 115 + (connPin - 1) * 26, 'side': 'right'}
        }
        if strap:
            pin['strapping'] = True
            pin['evidence'].append(boot_ref)
        if noteKey:
            pin['noteKey'] = noteKey
        pins.append(pin)

    board = {
        'id': 'nodemcu-v2',
        'name': 'NodeMCU v2',
        'shortName': 'NodeMCU v2',
        'subtitle': 'ESP8266EX · Tensilica L106 · 80 MHz · Wi-Fi · 3.3 V I/O',
        'layout': 'custom',
        'category': 'Espressif',
        'family': 'Espressif',
        'packageName': '30-pin DIP module',
        'packagePins': 30,
        'gpioCount': 17,
        'uniqueGPIOCount': 17,
        'reservedGPIOCount': 6,
        'voltage': '3.3 V I/O',
        'mcu': 'ESP8266EX',
        'processor': 'Tensilica L106',
        'clock': '80 MHz',
        'diagram': {
            'width': 820,
            'height': 644,
            'artwork': 'assets/boards/nodemcu-v2.svg'
        },
        'orientation': 'usb-bottom',
        'source': docs['nodemcu-v1-schematic']['viewUrl'],
        'datasheet': docs['esp8266ex-datasheet']['url'],
        'verifiedOn': verified_on,
        'pins': pins
    }

    return [board]
