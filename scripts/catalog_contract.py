"""Shared schema and board-to-package contracts for every generated profile."""
import json
from pathlib import Path
import re
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = json.loads((ROOT / 'sources/board.schema.json').read_text())
VALIDATOR = Draft202012Validator(SCHEMA, format_checker=FormatChecker())

def port(name):
    match = re.match(r'(P[A-K]\d+(?:_C)?|GPIO\d+|GP\d+)', name or '')
    return re.sub(r'^GP(?=\d)', 'GPIO', match[0]) if match else None

def validate_catalog(boards, documents):
    by_id = {b['id']: b for b in boards}
    assert len(by_id) == len(boards), 'Duplicate profile ID'
    assert len({d['id'] for d in documents}) == len(documents), 'Duplicate source ID'
    for board in boards:
        errors = sorted(VALIDATOR.iter_errors(board), key=lambda e:str(e.path))
        assert not errors, f"{board['id']}: {errors[0].json_path}: {errors[0].message}" if errors else ''
        target = board.get('mcuProfile')
        if target:
            assert target in by_id and target != board['id'], f"Invalid MCU profile: {board['id']}"
            pads = {p['number']:p for p in by_id[target]['pins']}
            for pin in board['pins']:
                if 'mcuPin' not in pin:
                    continue
                assert pin['mcuPin'] in pads, f"Invalid MCU pad: {board['id']} {pin['number']}"
                expected = port(pin.get('mcuPort') or pin.get('net') or pin['name'])
                pad = pads[pin['mcuPin']]
                actual = {port(pad['name']), *(port(f['name']) for f in pad['functions'] if f['group']=='GPIO')}
                assert not expected or expected in actual, f"MCU net mismatch: {board['id']} {pin['number']}: {expected} not in {actual}"

def validate_registry(registry, docs):
    assert registry['version'] == 1
    models = list(registry['nucleo64']) + registry['packages'] + list(registry.get('nucleo32',{})) + list(registry.get('nucleo144',{})) + registry.get('blackpill',[])
    assert len(set(models)) == len(models), 'Duplicate STM32 model'
    for model in models:
        package = docs[f'{model}-package']
        assert package.get('gpioModesDocument', f'{model}-modes') in docs
        assert re.fullmatch(r'[0-9a-f]{40}', package['revision'])
    for spec in registry['nucleo64'].values():
        assert set(spec) == {'arduino','morpho','tables'}
        assert len(spec['tables']) == 2 and all(isinstance(n,int) and n>0 for n in spec['tables'])
        for kind in ('arduino','morpho'):
            assert spec[kind] and all(len(item)==2 and all(isinstance(n,int) for n in item) and item[0]>0 and item[1]>=0 for item in spec[kind])
