"""Raspberry Pi Compute Module 4 and Compute Module 5 (CM4 & CM5) profiles."""
import pdfplumber
import re

def parse_cm_table(pdf_path, page_range):
    pins = {}
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages[page_range[0]:page_range[1]]:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if not row or not row[0]:
                        continue
                    m = re.match(r'^(\d+)$', str(row[0]).strip())
                    if m:
                        pin_num = int(m.group(1))
                        signal = str(row[1]).strip().replace('\n', ' ') if len(row) > 1 and row[1] else ''
                        desc = str(row[2]).strip().replace('\n', ' ') if len(row) > 2 and row[2] else ''
                        pins[pin_num] = (signal, desc)
    assert len(pins) == 200, f'Expected 200 pins from {pdf_path}, found {len(pins)}'
    return pins

def build_compute_modules(cache, docs, obs, ref, verified_on, pi4_pins, pi5_pins):
    cm4_pdf = cache / docs['cm4-datasheet']['file']
    cm5_pdf = cache / docs['cm5-datasheet']['file']
    assert cm4_pdf.exists() and cm5_pdf.exists()

    cm4_table = parse_cm_table(cm4_pdf, (16, 23))
    cm5_table = parse_cm_table(cm5_pdf, (17, 24))

    ref4_pinout = ref('cm4-pinout', 'cm4-datasheet', 17, 'Table 6 · Pinout for the Raspberry Pi Compute Module 4', 'table')
    ref4_elec = ref('cm4-electrical', 'cm4-datasheet', 16, '§4 · Pinout and electrical specification · GPIO_VREF and PCIe', 'pdf-text')

    ref5_pinout = ref('cm5-pinout', 'cm5-datasheet', 18, 'Table 5 · Pinout for the Raspberry Pi Compute Module 5', 'table')
    ref5_elec = ref('cm5-electrical', 'cm5-datasheet', 26, '§4.3 · Electrical specifications · GPIO_VREF and absolute maximum ratings', 'pdf-text')

    # Map GPIO functions from verified pi4 and pi5 profiles
    gpio_funcs_4 = {}
    for p in pi4_pins:
        name = p.get('name')
        if name and name.startswith('GPIO'):
            gpio_funcs_4[name] = p.get('functions', [])

    gpio_funcs_5 = {}
    for p in pi5_pins:
        name = p.get('name')
        if name and name.startswith('GPIO'):
            gpio_funcs_5[name] = p.get('functions', [])

    def classify_pin(sig, desc):
        upper_sig = sig.upper()
        if sig.startswith('GPIO') and sig != 'GPIO_VREF':
            return 'GPIO'
        if sig in ('ID_SD', 'ID_SC'):
            return 'GPIO'
        if 'GND' in upper_sig or 'GROUND' in upper_sig:
            return 'GND'
        if any(v in upper_sig for v in ['5V', '3.3V', '1.8V', 'VREF', 'VBAT', 'POWER']):
            return 'POWER'
        return 'SYSTEM'

    def normalize_gpio_name(sig):
        if sig == 'ID_SD':
            return 'GPIO0'
        if sig == 'ID_SC':
            return 'GPIO1'
        if sig.startswith('GPIO'):
            return sig.split()[0]
        return sig

    def generate_pins(table, ref_doc, gpio_funcs, is_cm5=False):
        pins = []
        for pin_num in range(1, 201):
            sig, desc = table[pin_num]
            ptype = classify_pin(sig, desc)
            norm_name = normalize_gpio_name(sig) if ptype == 'GPIO' else sig

            # Connector geometry
            if pin_num <= 100:
                conn = 'CN1'
                conn_pin = pin_num
                phys_label = f'CN1.{pin_num}'
                row = (pin_num - 1) // 2
                x = 236 if pin_num % 2 == 1 else 284
                side = 'left'
            else:
                conn = 'CN2'
                conn_pin = pin_num - 100
                phys_label = f'CN2.{conn_pin}'
                row = (pin_num - 101) // 2
                x = 636 if pin_num % 2 == 1 else 684
                side = 'right'

            y = round(96 + row * 11.6, 1)

            # Functions
            functions = []
            if ptype == 'GPIO':
                functions = gpio_funcs.get(norm_name, [])
            elif ptype == 'SYSTEM':
                grp = 'SYSTEM'
                if sig.startswith('Ethernet_'):
                    grp = 'ETH'
                elif sig.startswith('PCIe_'):
                    grp = 'PCIE'
                elif sig.startswith('HDMI0_'):
                    grp = 'HDMI0'
                elif sig.startswith('HDMI1_'):
                    grp = 'HDMI1'
                elif any(sig.startswith(k) for k in ['CAM0_', 'CAM1_', 'MIPI0_', 'MIPI1_']):
                    grp = 'MIPI'
                elif any(sig.startswith(k) for k in ['DSI0_', 'DSI1_']):
                    grp = 'DSI'
                elif sig.startswith('SD_'):
                    grp = 'SDIO'
                elif any(sig.startswith(k) for k in ['USB_', 'USB3-']):
                    grp = 'USB'
                functions = [{'name': sig, 'group': grp, 'signal': sig, 'evidence': ref_doc}]

            pin_data = {
                'number': pin_num,
                'physicalLabel': phys_label,
                'connector': conn,
                'connectorPin': conn_pin,
                'name': norm_name,
                'boardLabel': sig,
                'type': ptype,
                'functions': functions,
                'evidence': [ref_doc],
                'net': sig,
                'position': {'x': x, 'y': y, 'side': side}
            }
            pins.append(pin_data)
        return pins

    pins4 = generate_pins(cm4_table, ref4_pinout, gpio_funcs_4, is_cm5=False)
    pins5 = generate_pins(cm5_table, ref5_pinout, gpio_funcs_5, is_cm5=True)

    cm4_board = {
        'id': 'raspberry-pi-cm4',
        'name': 'Raspberry Pi Compute Module 4',
        'shortName': 'Compute Module 4',
        'subtitle': 'BCM2711 · 4 × Cortex-A72 · Dual 100-pin Hirose DF40',
        'layout': 'custom',
        'layoutFamily': 'compute-module',
        'scopeKey': 'cm4Scope',
        'category': 'Raspberry Pi',
        'family': 'Raspberry Pi',
        'packageName': 'Dual 100-pin Hirose DF40 Mezzanine',
        'packagePins': 200,
        'gpioCount': 28,
        'uniqueGPIOCount': 28,
        'voltage': '1.8 V / 3.3 V I/O',
        'mcu': 'BCM2711',
        'processor': 'Broadcom BCM2711 (4 × Arm Cortex-A72 @ 1.5 GHz)',
        'clock': '1.5 GHz',
        'diagram': {
            'width': 920,
            'height': 780,
            'artwork': 'assets/boards/compute-module-4-5.svg'
        },
        'orientation': 'usb-bottom',
        'source': docs['cm4-datasheet']['viewUrl'],
        'datasheet': docs['cm4-datasheet']['url'],
        'verifiedOn': verified_on,
        'cautions': [
            {'key': 'cmVrefCaution', 'evidence': [ref4_elec]},
            {'key': 'cmPcieCaution', 'evidence': [ref4_elec]}
        ],
        'pins': pins4
    }

    cm5_board = {
        'id': 'raspberry-pi-cm5',
        'name': 'Raspberry Pi Compute Module 5',
        'shortName': 'Compute Module 5',
        'subtitle': 'BCM2712 / RP1 · 4 × Cortex-A76 · Dual 100-pin Hirose DF40',
        'layout': 'custom',
        'layoutFamily': 'compute-module',
        'scopeKey': 'cm5Scope',
        'category': 'Raspberry Pi',
        'family': 'Raspberry Pi',
        'packageName': 'Dual 100-pin Hirose DF40 Mezzanine',
        'packagePins': 200,
        'gpioCount': 28,
        'uniqueGPIOCount': 28,
        'voltage': '1.8 V / 3.3 V I/O',
        'mcu': 'BCM2712 / RP1',
        'processor': 'Broadcom BCM2712 (4 × Arm Cortex-A76 @ 2.4 GHz) + RP1 I/O',
        'clock': '2.4 GHz',
        'diagram': {
            'width': 920,
            'height': 780,
            'artwork': 'assets/boards/compute-module-4-5.svg'
        },
        'orientation': 'usb-bottom',
        'source': docs['cm5-datasheet']['viewUrl'],
        'datasheet': docs['cm5-datasheet']['url'],
        'verifiedOn': verified_on,
        'cautions': [
            {'key': 'cmVrefCaution', 'evidence': [ref5_elec]},
            {'key': 'cmPcieCaution', 'evidence': [ref5_elec]}
        ],
        'pins': pins5
    }

    return [cm4_board, cm5_board]
