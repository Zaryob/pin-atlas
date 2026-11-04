"""Fast offline contract checks; manufacturer comparison runs separately in CI."""
import json
from pathlib import Path
from urllib.parse import urlsplit
root=Path(__file__).resolve().parents[1]
read=lambda name:json.loads((root/name).read_text())
boards=read('dist/data/boards.json');evidence=read('dist/data/evidence.json');report=read('dist/data/verification.json');manifest=read('sources/manifest.json')
assert len({b['id'] for b in boards})==len(boards)
refs=evidence['references'];docids={d['id'] for d in manifest['documents']}
for r in refs.values():
    assert r['document'] in docids
    host=urlsplit(r['url']).hostname
    assert host in {'pip-assets.raspberrypi.com','github.com'},host
    if host=='github.com':assert '/raspberrypi/documentation/' in r['url']
for b in boards:
    assert len(b['pins'])==b['packagePins']
    assert {p['number'] for p in b['pins']}==set(range(1,b['packagePins']+1))
    assert sum(p['type']=='GPIO' for p in b['pins'])==b['gpioCount']
    assert b['verifiedOn']==manifest['verifiedOn']
    for p in b['pins']:
        assert p['name'] and p['type'] in ['GPIO','POWER','GND','SYSTEM','ADC']
        assert p['evidence'] and all(r in refs for r in p['evidence'])
        assert len({f['name'] for f in p['functions']})==len(p['functions'])
        for f in p['functions']:
            assert f['name'] and f['signal'] and f['evidence'] in refs
            if 'alt' in f:
                assert f['selector']==('ALT' if b['id']=='raspberry-pi-4' else 'F')+str(f['alt'])
lookup={b['id']:{p['number']:p for p in b['pins']} for b in boards}
assert lookup['pico2w'][1]['name']=='GP0' and lookup['pico2w'][40]['name']=='VBUS'
assert not any(p['name'] in {'GP23','GP24','GP25','GP29'} for p in lookup['pico2w'].values())
assert lookup['rp2350a'][1]['name']=='IOVDD' and lookup['rp2350a'][54]['name']=='QSPI_IOVDD'
assert lookup['rp2350b'][15]['name']=='IOVDD' and lookup['rp2350b'][49]['name']=='GPIO40_ADC0'
assert not any(f['group']=='ADC' for f in lookup['rp2350b'][27]['functions'])
assert all(lookup['raspberry-pi-4'][n]['reserved'] for n in (27,28))
assert any(f['signal']=='PWM0_0' and f['alt']==0 for f in lookup['raspberry-pi-4'][32]['functions'])
assert any(f['signal']=='PWM0_1' and f['alt']==0 for f in lookup['raspberry-pi-4'][33]['functions'])
assert sum(len(b['pins']) for b in boards)==report['physicalPins']
assert sum(len(p['functions']) for b in boards for p in b['pins'])==report['functionAssignments']
print(f"Checked {report['physicalPins']} pins, {report['functionAssignments']} function references and model-specific corner cases.")
