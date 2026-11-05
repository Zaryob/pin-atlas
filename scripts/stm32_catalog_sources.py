"""Build additional STM32 packages and Nucleo-64 references from pinned ST sources."""
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path, PurePosixPath
from urllib.parse import urlsplit

from nucleo_sources import build_nucleo
from stm32_board_sources import build_nucleo32,build_nucleo144,build_blackpill

# Table locations are reviewed data, separate from the reusable parser.
REGISTRY = json.loads((Path(__file__).resolve().parents[1] / 'sources/stm32-catalog.json').read_text())
MODELS = REGISTRY['nucleo64']
PACKAGES = REGISTRY['packages']


def stm32_group(signal):
    for prefixes, group in [
        (('USART', 'UART', 'LPUART'), 'UART'), (('I2C',), 'I2C'),
        (('I2S', 'SAI'), 'I2S'), (('SPI',), 'SPI'), (('ADC',), 'ADC'),
        (('DAC',), 'DAC'), (('CAN', 'FDCAN'), 'CAN'), (('USB',), 'USB'),
        (('SDIO', 'SDMMC'), 'SDIO'), (('RCC', 'MCO', 'LSCO'), 'CLOCK'),
    ]:
        if signal.startswith(prefixes):
            return group
    if signal.startswith(('TIM', 'HRTIM')):
        return 'PWM' if re.search(r'_CH\d', signal) else 'TIMER'
    if 'SWD' in signal or 'SWCLK' in signal:
        return 'SWD'
    if signal.startswith(('DEBUG_', 'SYS_JT')):
        return 'JTAG'
    return 'SYSTEM'


def read_cube_package(cache, docs, ref, model, verified_on):
    package_doc = docs[f'{model}-package']
    modes_id = package_doc.get('gpioModesDocument', f'{model}-modes')
    modes_doc = docs[modes_id]
    package = ET.parse(cache / package_doc['file']).getroot()
    modes = ET.parse(cache / modes_doc['file']).getroot()
    gpio_version = package.find("{*}IP[@Name='GPIO']").get('Version')
    # Check the manufacturer's dependency even with a warm cache. H723 previously
    # passed locally because its cached file hid a nonexistent download filename.
    assert PurePosixPath(urlsplit(modes_doc['url']).path).name == f'GPIO-{gpio_version}_Modes.xml'
    assert re.fullmatch(r'[0-9a-f]{40}', package_doc['revision'])
    assert modes_doc['revision'] == package_doc['revision']
    package_name = package.get('Package')
    match = re.fullmatch(r'(LQFP|UFQFPN)(\d+)', package_name)
    assert match, package_name
    total = int(match[2])
    qfn=match[1]=='UFQFPN'
    pin_ref = ref(f'{model}-package', f'{model}-package', None,
                  f'{package_name} numbered package pins and physical signals', 'manufacturer-xml')
    mode_ref = ref(f'{model}-modes', modes_id, None,
                   f'{gpio_version} GPIO alternate function selectors', 'manufacturer-xml')
    selectors = {}
    for pad in modes.findall('{*}GPIO_Pin'):
        port = re.match(r'P[A-K]\d+(?:_C)?', pad.get('Name'))
        if not port:
            continue
        for signal in pad.findall('{*}PinSignal'):
            values = signal.findall("{*}SpecificParameter[@Name='GPIO_AF']/{*}PossibleValue")
            choices = {m[1] for value in values for m in re.finditer(r'GPIO_(AF\d+)_', value.text or '')}
            assert len(choices) <= 1, (model, port[0], signal.get('Name'), choices)
            if choices:
                selectors[port[0], signal.get('Name')] = choices.pop()
    pins = []
    for pad in package.findall('{*}Pin'):
        raw_name = pad.get('Name')
        port = re.match(r'P[A-K]\d+(?:_C)?', raw_name)
        name = port[0] if port else raw_name
        kind = 'GPIO' if port else 'GND' if name.startswith('VSS') else 'POWER' if pad.get('Type') == 'Power' else 'SYSTEM'
        functions = []
        for raw_signal in pad.findall('{*}Signal'):
            signal = raw_signal.get('Name')
            if signal == 'GPIO':
                continue
            entry = {'name': signal, 'signal': signal, 'group': stm32_group(signal), 'evidence': pin_ref}
            selector = selectors.get((name, signal))
            if selector:
                entry.update(selector=selector, configurationEvidence=mode_ref)
            functions.append(entry)
        pin = {'number': int(pad.get('Position')), 'name': name, 'type': kind,
               'functions': functions, 'evidence': [pin_ref]}
        if port:
            pin['noteKey'] = 'stm32CubeGpio'
            if any(word in raw_name for word in ('JT', 'SWD', 'SWCLK')):
                pin['noteKey'] = 'stm32CubeDebug'
            elif 'OSC' in raw_name:
                pin['noteKey'] = 'stm32CubeOsc'
        pins.append(pin)
    assert sorted(pin['number'] for pin in pins) == list(range(1, total + 1))
    gpio_count = sum(pin['type'] == 'GPIO' for pin in pins)
    assert gpio_count == int(package.findtext('{*}IONb'))
    voltage = package.find('{*}Voltage')
    name = REGISTRY.get('partNames',{}).get(model,f'STM32{model.upper()}T6')
    core, frequency = package.findtext('{*}Core'), package.findtext('{*}Frequency')
    return {'id': name.lower(), 'name': name, 'shortName': name, 'mcu': name,
            'family': 'STMicroelectronics', 'processor': core, 'clock': f'{frequency} MHz',
            'subtitle': f'{"UFQFPN" if qfn else "LQFP"}-{total} · {core} · {frequency} MHz',
            'layout': 'qfn' if qfn else 'lqfp', 'packageName': f'{"UFQFPN" if qfn else "LQFP"}-{total}', 'packagePins': total,
            'gpioCount': gpio_count, 'voltage': f"{voltage.get('Min')}–{voltage.get('Max')} V",
            'verifiedOn': verified_on, 'scopeKey': 'stm32CubeQfnScope' if qfn else 'stm32CubeScope',
            **({'exposedPad':False} if qfn else {}),
            'source': package_doc['viewUrl'], 'datasheet': f'https://www.st.com/resource/en/datasheet/stm32{model}.pdf',
            'pins': pins}


def build_catalog(cache, docs, ref, verified_on, use_snapshots=False):
    boards = []
    for model, table_spec in MODELS.items():
        chip = read_cube_package(cache, docs, ref, model, verified_on)
        extra = []
        if model == 'f303re':
            # UM1724 Table 14 omits D0. The shared MB1136 drawing identifies
            # CN9.1; ST's pinned variant independently maps Arduino D0 to PA3.
            document = 'nucleo-f303re-variant-cpp'
            text = (cache / docs[document]['file']).read_text()
            array = re.search(r'const PinName digitalPin\[\]\s*=\s*\{(.*?)\};', text, re.S)[1]
            match = re.search(r'^\s*(P[A-K]_\d+),\s*//D0(?:/|\s)', array, re.M)
            assert match, 'Review the F303RE D0 corroboration'
            evidence = ref('nucleo-f303re-d0', document, None,
                           'digitalPin[0] · Arduino D0; CN9.1 position from the common MB1136 layout', 'code-variant')
            extra.append(('CN9', 1, 'D0', match[1].replace('_', ''), evidence))
        board = build_nucleo(cache, docs, ref, chip, model, use_snapshots=use_snapshots, table_spec=table_spec, extra_arduino=extra)
        boards.extend([board, chip])
    for model in PACKAGES:
        boards.append(read_cube_package(cache, docs, ref, model, verified_on))
    for model,page in REGISTRY.get('nucleo32',{}).items():
        chip=read_cube_package(cache,docs,ref,model,verified_on)
        boards.extend([build_nucleo32(cache,docs,ref,chip,model,page,use_snapshots),chip])
    for model,spec in REGISTRY.get('nucleo144',{}).items():
        chip=read_cube_package(cache,docs,ref,model,verified_on)
        boards.extend([build_nucleo144(cache,docs,ref,chip,model,spec,use_snapshots),chip])
    for model in REGISTRY.get('blackpill',[]):
        chip=read_cube_package(cache,docs,ref,model,verified_on)
        boards.extend([build_blackpill(cache,docs,ref,chip,model),chip])
    return boards
