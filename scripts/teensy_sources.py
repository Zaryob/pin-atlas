"""Teensy 4.1 hardware definition from PJRC official reference cards and schematics."""
import json

IMXRT_PORTS = {
    0: 'GPIO6[3]', 1: 'GPIO6[2]', 2: 'GPIO9[4]', 3: 'GPIO9[5]', 4: 'GPIO9[6]',
    5: 'GPIO9[8]', 6: 'GPIO7[10]', 7: 'GPIO7[17]', 8: 'GPIO7[16]', 9: 'GPIO7[11]',
    10: 'GPIO7[0]', 11: 'GPIO7[2]', 12: 'GPIO7[1]', 13: 'GPIO7[3]', 14: 'GPIO6[18]',
    15: 'GPIO6[19]', 16: 'GPIO6[23]', 17: 'GPIO6[22]', 18: 'GPIO6[17]', 19: 'GPIO6[16]',
    20: 'GPIO6[26]', 21: 'GPIO6[27]', 22: 'GPIO6[24]', 23: 'GPIO6[25]', 24: 'GPIO6[12]',
    25: 'GPIO6[13]', 26: 'GPIO6[30]', 27: 'GPIO6[31]', 28: 'GPIO8[18]', 29: 'GPIO9[31]',
    30: 'GPIO8[23]', 31: 'GPIO8[22]', 32: 'GPIO7[12]', 33: 'GPIO9[7]', 34: 'GPIO8[15]',
    35: 'GPIO8[14]', 36: 'GPIO8[13]', 37: 'GPIO8[12]', 38: 'GPIO8[17]', 39: 'GPIO8[16]',
    40: 'GPIO6[20]', 41: 'GPIO6[21]'
}

# Left side pins (1-24) and right side pins (1-24)
LEFT_PINS = [
    ('GND', 'GND', None, []),
    ('0', 'GPIO', 0, [('UART1 RX', 'UART', 'RX1'), ('CAN2 RX', 'CAN', 'CRX2'), ('PWM', 'PWM', 'PWM')]),
    ('1', 'GPIO', 1, [('UART1 TX', 'UART', 'TX1'), ('CAN2 TX', 'CAN', 'CTX2'), ('PWM', 'PWM', 'PWM')]),
    ('2', 'GPIO', 2, [('I2S2 OUT2', 'AUDIO', 'OUT2'), ('PWM', 'PWM', 'PWM')]),
    ('3', 'GPIO', 3, [('I2S2 LRCLK2', 'AUDIO', 'LRCLK2'), ('PWM', 'PWM', 'PWM')]),
    ('4', 'GPIO', 4, [('I2S2 BCLK2', 'AUDIO', 'BCLK2'), ('PWM', 'PWM', 'PWM')]),
    ('5', 'GPIO', 5, [('I2S2 IN2', 'AUDIO', 'IN2'), ('PWM', 'PWM', 'PWM')]),
    ('6', 'GPIO', 6, [('I2S1 OUT1D', 'AUDIO', 'OUT1D'), ('PWM', 'PWM', 'PWM')]),
    ('7', 'GPIO', 7, [('UART2 RX', 'UART', 'RX2'), ('I2S1 OUT1A', 'AUDIO', 'OUT1A'), ('PWM', 'PWM', 'PWM')]),
    ('8', 'GPIO', 8, [('UART2 TX', 'UART', 'TX2'), ('I2S1 IN1', 'AUDIO', 'IN1')]),
    ('9', 'GPIO', 9, [('I2S1 OUT1C', 'AUDIO', 'OUT1C'), ('PWM', 'PWM', 'PWM')]),
    ('10', 'GPIO', 10, [('SPI0 CS', 'SPI', 'CS'), ('MQSR', 'AUDIO', 'MQSR'), ('PWM', 'PWM', 'PWM')]),
    ('11', 'GPIO', 11, [('SPI0 MOSI', 'SPI', 'MOSI'), ('PWM', 'PWM', 'PWM')]),
    ('12', 'GPIO', 12, [('SPI0 MISO', 'SPI', 'MISO'), ('MQSL', 'AUDIO', 'MQSL')]),
    ('3.3V', 'POWER', None, []),
    ('24', 'GPIO', 24, [('ADC1_CH10', 'ADC', 'A10'), ('UART6 TX', 'UART', 'TX6'), ('I2C2 SCL', 'I2C', 'SCL2'), ('PWM', 'PWM', 'PWM')]),
    ('25', 'GPIO', 25, [('ADC1_CH11', 'ADC', 'A11'), ('UART6 RX', 'UART', 'RX6'), ('I2C2 SDA', 'I2C', 'SDA2'), ('PWM', 'PWM', 'PWM')]),
    ('26', 'GPIO', 26, [('ADC1_CH12', 'ADC', 'A12'), ('SPI1 MOSI', 'SPI', 'MOSI1')]),
    ('27', 'GPIO', 27, [('ADC1_CH13', 'ADC', 'A13'), ('SPI1 SCK', 'SPI', 'SCK1')]),
    ('28', 'GPIO', 28, [('UART7 RX', 'UART', 'RX7'), ('PWM', 'PWM', 'PWM')]),
    ('29', 'GPIO', 29, [('UART7 TX', 'UART', 'TX7'), ('PWM', 'PWM', 'PWM')]),
    ('30', 'GPIO', 30, [('CAN3 RX', 'CAN', 'CRX3')]),
    ('31', 'GPIO', 31, [('CAN3 TX', 'CAN', 'CTX3')]),
    ('32', 'GPIO', 32, [('I2S1 OUT1B', 'AUDIO', 'OUT1B')])
]

RIGHT_PINS = [
    ('VIN', 'POWER', None, []),
    ('GND', 'GND', None, []),
    ('3.3V', 'POWER', None, []),
    ('23', 'GPIO', 23, [('ADC1_CH9', 'ADC', 'A9'), ('CAN1 RX', 'CAN', 'CRX1'), ('I2S1 MCLK1', 'AUDIO', 'MCLK1'), ('PWM', 'PWM', 'PWM')]),
    ('22', 'GPIO', 22, [('ADC1_CH8', 'ADC', 'A8'), ('CAN1 TX', 'CAN', 'CTX1'), ('PWM', 'PWM', 'PWM')]),
    ('21', 'GPIO', 21, [('ADC1_CH7', 'ADC', 'A7'), ('UART5 RX', 'UART', 'RX5'), ('PWM', 'PWM', 'PWM')]),
    ('20', 'GPIO', 20, [('ADC1_CH6', 'ADC', 'A6'), ('UART5 TX', 'UART', 'TX5'), ('PWM', 'PWM', 'PWM')]),
    ('19', 'GPIO', 19, [('ADC1_CH5', 'ADC', 'A5'), ('I2C0 SCL', 'I2C', 'SCL'), ('PWM', 'PWM', 'PWM')]),
    ('18', 'GPIO', 18, [('ADC1_CH4', 'ADC', 'A4'), ('I2C0 SDA', 'I2C', 'SDA'), ('PWM', 'PWM', 'PWM')]),
    ('17', 'GPIO', 17, [('ADC1_CH3', 'ADC', 'A3'), ('UART4 TX', 'UART', 'TX4'), ('I2C1 SDA', 'I2C', 'SDA1')]),
    ('16', 'GPIO', 16, [('ADC1_CH2', 'ADC', 'A2'), ('UART4 RX', 'UART', 'RX4'), ('I2C1 SCL', 'I2C', 'SCL1')]),
    ('15', 'GPIO', 15, [('ADC1_CH1', 'ADC', 'A1'), ('UART3 RX', 'UART', 'RX3'), ('SPDIF IN', 'AUDIO', 'SPDIF_IN'), ('PWM', 'PWM', 'PWM')]),
    ('14', 'GPIO', 14, [('ADC1_CH0', 'ADC', 'A0'), ('UART3 TX', 'UART', 'TX3'), ('SPDIF OUT', 'AUDIO', 'SPDIF_OUT'), ('PWM', 'PWM', 'PWM')]),
    ('13', 'GPIO', 13, [('SPI0 SCK', 'SPI', 'SCK'), ('LED', 'SYSTEM', 'LED_BUILTIN'), ('PWM', 'PWM', 'PWM')]),
    ('GND', 'GND', None, []),
    ('41', 'GPIO', 41, [('ADC2_CH17', 'ADC', 'A17'), ('SPI1 MISO', 'SPI', 'MISO1'), ('UART8 RX', 'UART', 'RX8')]),
    ('40', 'GPIO', 40, [('ADC2_CH16', 'ADC', 'A16'), ('SPI1 CS', 'SPI', 'CS1'), ('UART8 TX', 'UART', 'TX8')]),
    ('39', 'GPIO', 39, [('ADC2_CH15', 'ADC', 'A15'), ('I2S2 MCLK2', 'AUDIO', 'MCLK2')]),
    ('38', 'GPIO', 38, [('ADC2_CH14', 'ADC', 'A14'), ('I2S1 IN1', 'AUDIO', 'IN1'), ('SPI1 CS', 'SPI', 'CS1')]),
    ('37', 'GPIO', 37, [('SPI0 CS', 'SPI', 'CS')]),
    ('36', 'GPIO', 36, [('SPI0 CS', 'SPI', 'CS'), ('PWM', 'PWM', 'PWM')]),
    ('35', 'GPIO', 35, [('I2S1 BCLK1', 'AUDIO', 'BCLK1'), ('PWM', 'PWM', 'PWM')]),
    ('34', 'GPIO', 34, [('I2S1 LRCLK1', 'AUDIO', 'LRCLK1'), ('PWM', 'PWM', 'PWM')]),
    ('33', 'GPIO', 33, [('I2S1 OUT1A', 'AUDIO', 'OUT1A'), ('PWM', 'PWM', 'PWM')])
]

def build_teensy_41(cache, docs, obs, ref, verified_on):
    doc_a = 'teensy41-card11a'
    doc_b = 'teensy41-card11b'
    doc_sch = 'teensy41-schematic'

    ref_front = ref('teensy41-front', doc_a, 1, 'Teensy 4.1 Card 11a · Front pinout, alternate functions and PWM', 'visual-diagram')
    ref_back = ref('teensy41-back', doc_b, 1, 'Teensy 4.1 Card 11b · Back features, SD card, USB Host, Ethernet and QSPI memory', 'visual-diagram')
    ref_sch = ref('teensy41-schematic', doc_sch, None, 'Teensy 4.1 Schematic Rev D · Power, USB, Ethernet and MCU wiring', 'schematic')

    pins = []
    pin_number = 1

    # Left header (L.1 - L.24)
    for i, (name, ptype, gp, fns) in enumerate(LEFT_PINS, 1):
        pos = {'x': 280, 'y': 110 + (i - 1) * 26, 'side': 'left'}
        net = IMXRT_PORTS[gp] if gp is not None else name
        pin = {
            'number': pin_number,
            'physicalLabel': f'L.{i}',
            'connector': 'L',
            'connectorPin': i,
            'name': name,
            'boardLabel': name,
            'type': ptype,
            'functions': [],
            'evidence': [ref_front],
            'net': net,
            'position': pos
        }
        if gp is not None:
            pin['arduinoPin'] = gp
            pin['mcuPort'] = IMXRT_PORTS[gp]
            pin['noteKey'] = 'teensyGpioNote'
            for fname, fgroup, fsignal in fns:
                pin['functions'].append({'name': fname, 'group': fgroup, 'signal': fsignal, 'evidence': ref_front})
            pin['functions'].append({'name': 'GPIO interrupt', 'group': 'IRQ', 'signal': net, 'evidence': ref_front})
        elif name == '3.3V':
            pin['noteKey'] = 'teensy3v3Note'
        pin_number += 1
        pins.append(pin)

    # Right header (R.1 - R.24)
    for i, (name, ptype, gp, fns) in enumerate(RIGHT_PINS, 1):
        pos = {'x': 540, 'y': 110 + (i - 1) * 26, 'side': 'right'}
        net = IMXRT_PORTS[gp] if gp is not None else name
        pin = {
            'number': pin_number,
            'physicalLabel': f'R.{i}',
            'connector': 'R',
            'connectorPin': i,
            'name': name,
            'boardLabel': name,
            'type': ptype,
            'functions': [],
            'evidence': [ref_front],
            'net': net,
            'position': pos
        }
        if gp is not None:
            pin['arduinoPin'] = gp
            pin['mcuPort'] = IMXRT_PORTS[gp]
            pin['noteKey'] = 'teensyGpioNote'
            for fname, fgroup, fsignal in fns:
                pin['functions'].append({'name': fname, 'group': fgroup, 'signal': fsignal, 'evidence': ref_front})
            pin['functions'].append({'name': 'GPIO interrupt', 'group': 'IRQ', 'signal': net, 'evidence': ref_front})
        elif name == 'VIN':
            pin['noteKey'] = 'teensyVinNote'
        elif name == '3.3V':
            pin['noteKey'] = 'teensy3v3Note'
        pin_number += 1
        pins.append(pin)

    # USB Host 5-pin header
    usb_pins = [
        ('5V', 'POWER', '5V'),
        ('D-', 'SYSTEM', 'USB_HOST_DM'),
        ('D+', 'SYSTEM', 'USB_HOST_DP'),
        ('GND', 'GND', 'GND'),
        ('GND', 'GND', 'GND')
    ]
    for i, (name, ptype, net) in enumerate(usb_pins, 1):
        pins.append({
            'number': pin_number,
            'physicalLabel': f'USB_HOST.{i}',
            'connector': 'USB_HOST',
            'connectorPin': i,
            'name': name,
            'boardLabel': name,
            'type': ptype,
            'functions': [{'name': f'USB Host {name}', 'group': 'USB', 'signal': net, 'evidence': ref_back}],
            'evidence': [ref_back, ref_sch],
            'net': net,
            'position': {'x': 360 + (i - 1) * 25, 'y': 465, 'side': 'right', 'compact': True, 'padWidth': 22}
        })
        pin_number += 1

    # Ethernet 6-pin header
    eth_pins = [
        ('RX+', 'SYSTEM', 'ETH_RX+'),
        ('RX-', 'SYSTEM', 'ETH_RX-'),
        ('LED', 'SYSTEM', 'ETH_LED'),
        ('GND', 'GND', 'GND'),
        ('TX-', 'SYSTEM', 'ETH_TX-'),
        ('TX+', 'SYSTEM', 'ETH_TX+')
    ]
    for i, (name, ptype, net) in enumerate(eth_pins, 1):
        col = (i - 1) % 3
        row = (i - 1) // 3
        pins.append({
            'number': pin_number,
            'physicalLabel': f'ETH.{i}',
            'connector': 'ETH',
            'connectorPin': i,
            'name': name,
            'boardLabel': name,
            'type': ptype,
            'functions': [{'name': f'Ethernet {name}', 'group': 'ETHERNET', 'signal': net, 'evidence': ref_back}],
            'evidence': [ref_back, ref_sch],
            'net': net,
            'position': {'x': 385 + col * 25, 'y': 525 + row * 25, 'side': 'right', 'compact': True, 'padWidth': 22}
        })
        pin_number += 1

    # Micro SD Card Socket pins (42-47, GND, 3.3V)
    sd_pins = [
        ('42', 'GPIO', 42, 'GPIO6[28]', 'DAT1'),
        ('43', 'GPIO', 43, 'GPIO6[29]', 'DAT0'),
        ('CLK', 'SYSTEM', None, 'SD_CLK', 'CLK'),
        ('3.3V', 'POWER', None, '3.3V', '3.3V'),
        ('CMD', 'SYSTEM', None, 'SD_CMD', 'CMD'),
        ('GND', 'GND', None, 'GND', 'GND'),
        ('46', 'GPIO', 46, 'GPIO6[15]', 'DAT3'),
        ('47', 'GPIO', 47, 'GPIO6[14]', 'DAT2')
    ]
    for i, (name, ptype, gp, net, signal) in enumerate(sd_pins, 1):
        col = (i - 1) % 4
        row = (i - 1) // 4
        pin = {
            'number': pin_number,
            'physicalLabel': f'SD.{i}',
            'connector': 'SD',
            'connectorPin': i,
            'name': name,
            'boardLabel': signal,
            'type': ptype,
            'functions': [{'name': f'SDIO {signal}', 'group': 'SDIO', 'signal': signal, 'evidence': ref_back}],
            'evidence': [ref_back, ref_sch],
            'net': net,
            'position': {'x': 370 + col * 26, 'y': 640 + row * 26, 'side': 'right', 'compact': True, 'padWidth': 24}
        }
        if gp is not None:
            pin['arduinoPin'] = gp
            pin['mcuPort'] = net
            pin['noteKey'] = 'teensySdNote'
            pin['functions'].append({'name': 'GPIO interrupt', 'group': 'IRQ', 'signal': net, 'evidence': ref_back})
        pin_number += 1
        pins.append(pin)

    # Set sharedWith nets
    for pin in pins:
        same = [p['physicalLabel'] for p in pins if p is not pin and p['net'] == pin['net']]
        if same and pin['type'] in ('GPIO', 'SYSTEM'):
            pin['sharedWith'] = same

    gpio_count = sum(p['type'] == 'GPIO' for p in pins)
    unique_gpio = len({p['net'] for p in pins if p['type'] == 'GPIO'})

    board = {
        'id': 'teensy-41',
        'name': 'Teensy 4.1',
        'shortName': 'Teensy 4.1',
        'family': 'PJRC Teensy',
        'subtitle': 'NXP i.MX RT1062 · 600 MHz · 3.3 V I/O',
        'layout': 'custom',
        'diagram': {
            'width': 820,
            'height': 840,
            'artwork': 'assets/boards/teensy-41.svg'
        },
        'orientation': 'usb-top',
        'packagePins': len(pins),
        'gpioCount': gpio_count,
        'uniqueGPIOCount': unique_gpio,
        'voltage': '3.3 V I/O',
        'mcu': 'i.MX RT1062',
        'processor': 'Arm Cortex-M7',
        'clock': '600 MHz',
        'scopeKey': 'teensy41Scope',
        'compatibleKey': 'teensy41Compatible',
        'source': docs[doc_a]['url'],
        'datasheet': docs[doc_b]['url'],
        'verifiedOn': verified_on,
        'pins': pins
    }
    return [board]
