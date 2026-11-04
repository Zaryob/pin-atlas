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
    assert host in {'pip-assets.raspberrypi.com','datasheets.raspberrypi.com','developer.nvidia.com','www.st.com','stm32-base.org','github.com'},host
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
            if f.get('configurationEvidence'):assert f['configurationEvidence'] in refs
            if f.get('configuration'):
                assert f['configuration']['field'] and f['configuration']['values']
                assert not f.get('alt')
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
# Model families share physical positions, but not their processor function sets.
for id in ('pico','picow','pico2'):
    assert [p['name'] for p in lookup[id].values()]==[p['name'] for p in lookup['pico2w'].values()]
    assert lookup[id][31]['functions'][-1]['name']=='ADC0'
for id in ('pico','picow'):
    assert not any(f['group'] in {'HSTX','QMI'} or f['name']=='PIO2' for p in lookup[id].values() for f in p['functions'])
    assert any(f['name']=='USB OVCUR DET' and f['selector']=='F9' for f in lookup[id][1]['functions'])
assert any(f['name']=='USB OVCUR DET' and f['selector']=='F10' for f in lookup['pico2'][1]['functions'])
assert [p['name'] for p in lookup['raspberry-pi-40'].values()]==[p['name'] for p in lookup['raspberry-pi-4'].values()]
assert all(not p['functions'] for p in lookup['raspberry-pi-40'].values())
assert all(lookup['raspberry-pi-40'][n]['reserved'] for n in (27,28))
jetson=lookup['jetson-orin-nano']
assert jetson[1]['name']=='3V3' and jetson[2]['name']=='5V'
assert jetson[16]['name']=='SPI1_CS1*' and jetson[18]['name']=='SPI1_CS0*'
assert jetson[27]['name']=='I2C0_SDA' and not jetson[27].get('reserved')
assert jetson[28]['name']=='I2C0_SCL' and not jetson[28].get('reserved')
assert all(jetson[n]['functions'][0]['group']=='I2S' for n in (12,35,38,40))
assert all(jetson[n]['functions'][0]['group']=='PWM' for n in (32,33))
assert not jetson[15]['functions'] # A PWM substring in a SoC pad name is not a verified header capability.
assert not any('alt' in f or f['group']=='ADC' for p in jetson.values() for f in p['functions'])
assert [n for n,p in jetson.items() if p['type']=='GND']==[6,9,14,20,25,30,34,39]
stm=lookup['stm32f103c8t6'];blue=lookup['blue-pill']
assert stm[1]['name']=='VBAT' and stm[34]['name']=='PA13' and stm[44]['name']=='BOOT0'
assert stm[5]['functions'][0]['name']=='PD0' and stm[5]['baseFunction']=='OSC_IN'
assert all('alt' not in f for p in stm.values() for f in p['functions'])
assert next(f for f in stm[42]['functions'] if f['name']=='USART1_TX')['configuration']=={'field':'USART1_REMAP','values':['1']}
assert next(f for f in stm[21]['functions'] if f['name']=='TIM2_CH3')['configuration']['values']==['10','11']
assert next(f for f in stm[45]['functions'] if f['name']=='CANRX')['configuration']['values']==['10']
assert not any(f['name'] in {'ADC12_IN10','ADC12_IN11','SPI3_MOSI','TIM8_CH1'} for p in stm.values() for f in p['functions'])
assert len(blue)==44 and len({p['physicalLabel'] for p in blue.values()})==44
assert blue[17]['name']=='NRST' and blue[17]['mcuPin']==7
assert blue[42]['name']=='PA13' and blue[42]['mcuPin']==34
assert blue[43]['name']=='PA14' and blue[43]['mcuPin']==37
assert not any(p['name'] in {'PB2','OSC_IN','OSC_OUT'} for p in blue.values())
assert all(p['position']['y']==640 for p in blue.values() if p['connector']=='SWD')
for board in boards:
    if board['layout']=='custom':
        assert (root/'dist'/board['diagram']['artwork']).exists()
        for pin in board['pins']:assert 0<=pin['position']['x']<=board['diagram']['width'] and 0<=pin['position']['y']<=board['diagram']['height']
print(f"Checked {report['physicalPins']} pins, {report['functionAssignments']} function references and model-specific corner cases.")
