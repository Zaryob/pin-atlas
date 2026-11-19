"""Fast offline contract checks; manufacturer comparison runs separately in CI."""
import json,re
from catalog_contract import validate_catalog, validate_registry
from pathlib import Path
from urllib.parse import urlsplit
root=Path(__file__).resolve().parents[1]
read=lambda name:json.loads((root/name).read_text())
boards=read('public/data/boards.json');evidence=read('public/data/evidence.json');report=read('public/data/verification.json');manifest=read('sources/manifest.json')
validate_catalog(boards,manifest['documents'])
validate_registry(read('sources/stm32-catalog.json'),{d['id']:d for d in manifest['documents']})
assert len({b['id'] for b in boards})==len(boards)
refs=evidence['references'];docids={d['id'] for d in manifest['documents']}
for b in boards:
    for control in b.get('hardware',{}).get('controls',[]):
        assert all(key in refs for key in control['evidence']), (b['id'], control['id'])
for r in refs.values():
    assert r['document'] in docids
    host=urlsplit(r['url']).hostname
    assert host in {'www.ti.com','pip-assets.raspberrypi.com','datasheets.raspberrypi.com','www.raspberrypi.com','developer.nvidia.com','www.st.com','stm32-base.org','github.com','raw.githubusercontent.com','docs.arduino.cc','docs.espressif.com','www.espressif.com','ww1.microchip.com','files.seeedstudio.com','wiki.seeedstudio.com','tech.microbit.org','www.pjrc.com','docs.beagleboard.org','www.wemos.cc','www.renesas.com','cdn.sparkfun.com','www.wch-ic.com','docs.nordicsemi.com'},host
    if host in {'github.com','raw.githubusercontent.com'}:assert any(repo in r['url'] for repo in ['/raspberrypi/documentation/','/arduino/ArduinoCore-avr/','/arduino/docs-content/','/arduino/ArduinoCore-renesas/','/arduino/ArduinoCore-megaavr/','/arduino/ArduinoCore-mbed/','/espressif/esp-dev-kits/','/STMicroelectronics/STM32_open_pin_data/','/adafruit/','/stm32duino/Arduino_Core_STM32/','/WeActStudio/WeActStudio.MiniSTM32F4x1/','/espressif/arduino-esp32/','/Seeed-Studio/Adafruit_nRF52_Arduino/','/nodemcu/nodemcu-devkit-v1.0/','/SeeedDocument/forum_doc/','/openwch/','/NordicSemiconductor/'])
for b in boards:
    assert len(b['pins'])==b['packagePins']
    assert {p['number'] for p in b['pins']}==set(range(1,b['packagePins']+1))
    assert sum(p['type']=='GPIO' for p in b['pins'])==b['gpioCount']
    assert b['verifiedOn']==manifest.get('verifiedOnByProfile',{}).get(b['id'],manifest['verifiedOn'])
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
                assert f['selector']==('ALT' if b['id'] in ('raspberry-pi-4','raspberry-pi-5','raspberry-pi-cm4','raspberry-pi-cm5','raspberry-pi-zero-w','raspberry-pi-zero-2-w','raspberry-pi-3b-plus','raspberry-pi-500') else 'F')+str(f['alt'])
lookup={b['id']:{p['number']:p for p in b['pins']} for b in boards}
assert lookup['pico2w'][1]['name']=='GP0' and lookup['pico2w'][40]['name']=='VBUS'
assert not any(p['name'] in {'GP23','GP24','GP25','GP29'} for p in lookup['pico2w'].values())
assert lookup['rp2350a'][1]['name']=='IOVDD' and lookup['rp2350a'][54]['name']=='QSPI_IOVDD'
assert lookup['rp2350b'][15]['name']=='IOVDD' and lookup['rp2350b'][49]['name']=='GPIO40_ADC0'
assert not any(f['group']=='ADC' for f in lookup['rp2350b'][27]['functions'])
assert all(lookup['raspberry-pi-4'][n]['reserved'] for n in (27,28))
assert all(lookup['raspberry-pi-5'][n]['reserved'] for n in (27,28))
assert any(f['signal']=='PWM0_0' and f['alt']==0 for f in lookup['raspberry-pi-4'][32]['functions'])
assert any(f['signal']=='PWM0_1' and f['alt']==0 for f in lookup['raspberry-pi-4'][33]['functions'])
assert any(f['signal']=='PWM0[0]' and f['selector']=='ALT0' for f in lookup['raspberry-pi-5'][32]['functions'])
assert any(f['signal']=='PIO[0]' and f['selector']=='ALT7' for f in lookup['raspberry-pi-5'][27]['functions'])
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
assert [p['name'] for p in lookup['raspberry-pi-5'].values()]==[p['name'] for p in lookup['raspberry-pi-4'].values()]
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
stm64=lookup['stm32f103rbt6'];stm100=lookup['stm32f103vbt6']
atm64=lookup['atmega2561-tqfp64']
assert len(stm64)==64 and sum(p['type']=='GPIO' for p in stm64.values())==51
assert len(stm100)==100 and sum(p['type']=='GPIO' for p in stm100.values())==80
for pins in (stm,stm64):
    for number,osc,signal in ((5,'OSC_IN','PD0'),(6,'OSC_OUT','PD1')):
        pin=pins[number]
        assert (pin['name'],pin['type'],pin['baseFunction'])==(osc,'GPIO',osc)
        assert any(f['name']==signal and f['selector']=='PD01_REMAP=1' for f in pin['functions'])
for number,osc,port_number,port in ((12,'OSC_IN',81,'PD0'),(13,'OSC_OUT',82,'PD1')):
    pin=stm100[number]
    assert (pin['name'],pin['type'],pin['baseFunction'])==(osc,'SYSTEM',osc) and not pin['functions']
    assert (stm100[port_number]['name'],stm100[port_number]['type'])==(port,'GPIO')
tim1_full_remap=['TIM1_ETR','TIM1_CH1N','TIM1_CH1','TIM1_CH2N','TIM1_CH2','TIM1_CH3N','TIM1_CH3','TIM1_CH4','TIM1_BKIN']
for number,port,signal in zip(range(38,47),range(7,16),tim1_full_remap):
    assert stm100[number]['name']==f'PE{port}'
    function=next(f for f in stm100[number]['functions'] if f['name']==signal)
    assert function['configuration']=={'field':'TIM1_REMAP','values':['11']} and function['selector']=='TIM1_REMAP=11'
for pins in (stm,stm64):
    assert not any(f.get('selector')=='TIM1_REMAP=11' for pin in pins.values() for f in pin['functions'])
assert len(atm64)==64 and sum(p['type']=='GPIO' for p in atm64.values())==54
assert any(f['name']=='PDI' for f in atm64[2]['functions']) and any(f['name']=='PDO' for f in atm64[3]['functions'])
assert any(f['name']=='ADC12_IN10' for f in stm64[8]['functions'])
assert any(f['name']=='USART3_TX' for f in stm64[51]['functions'])
assert stm[1]['name']=='VBAT' and stm[34]['name']=='PA13' and stm[44]['name']=='BOOT0'
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
for id,count,unique in [('arduino-uno-r3',38,20),('arduino-nano-classic',36,20),('arduino-mega-2560',92,70)]:
    board=next(b for b in boards if b['id']==id);pins=board['pins']
    assert len(pins)==count and board['uniqueGPIOCount']==unique
    assert len({p['net'] for p in pins if p['type']=='GPIO'})==unique
    assert len({p['physicalLabel'] for p in pins})==count
    assert not any('alt' in f or 'selector' in f for p in pins for f in p['functions'])
    for pin in pins:
        if pin['type'] in ('GPIO','ADC'):
            assert set(pin.get('sharedWith',[]))=={p['physicalLabel'] for p in pins if p['number']!=pin['number'] and p['net']==pin['net']}
        if pin.get('arduinoPin') is not None:assert pin['type']=='GPIO' and re.fullmatch(r'P[A-L][0-7]',pin['mcuPort'])
uno=lookup['arduino-uno-r3'];nano=lookup['arduino-nano-classic'];mega=lookup['arduino-mega-2560']
get=lambda pins,label:next(p for p in pins.values() if p['physicalLabel']==label)
assert get(uno,'ANALOG.5')['name']=='A4' and get(uno,'ANALOG.5')['net']==get(uno,'DIGITAL.17')['net']
assert get(uno,'DIGITAL.14')['net']==get(uno,'ICSP.3')['net']=='PB5'
assert get(uno,'PWR.1')['reserved'] and not get(uno,'PWR.1')['functions']
for label,ch in [('L.10',6),('L.11',7)]:
    pin=get(nano,label);assert pin['type']=='ADC' and 'arduinoPin' not in pin
    assert [f['name'] for f in pin['functions']]==['ADC'+str(ch)]
assert get(nano,'R.14')['name']=='D0' and get(nano,'R.15')['name']=='D1'
assert get(nano,'ICSP.1')['position']['x']<get(nano,'ICSP.5')['position']['x']
assert get(mega,'END.3')['name']=='D22' and get(mega,'END.4')['name']=='D23'
assert get(mega,'END.1')['position']['x']>get(mega,'END.35')['position']['x']
assert get(mega,'END.3')['position']['y']<get(mega,'END.4')['position']['y']
assert get(mega,'ANALOG.9')['mcuPort']=='PK0' and get(mega,'ANALOG.9')['arduinoPin']==62
for pin in mega.values():
    if pin.get('arduinoPin') in (0,1):assert not any(f['group']=='PWM' for f in pin['functions'])
    if pin.get('arduinoPin')==51:assert any(f['signal']=='MOSI' for f in pin['functions'])
assert len({p['net'] for p in mega.values() if any(f['group']=='PWM' for f in p['functions'])})==15
for board in boards:
    if board['layout']=='custom':
        assert (root/'public'/board['diagram']['artwork']).exists()
        for pin in board['pins']:assert 0<=pin['position']['x']<=board['diagram']['width'] and 0<=pin['position']['y']<=board['diagram']['height']

nucleo=lookup['nucleo-f103rb']
contacts={pin['physicalLabel']:pin for pin in nucleo.values()}
assert len(contacts)==len(nucleo)==108
board_by_id={board['id']:board for board in boards}
assert board_by_id['nucleo-f103rb']['mcuProfile']=='stm32f103rbt6'
for pin in nucleo.values():
    if 'mcuPin' in pin:
        pad=stm64[pin['mcuPin']]
        assert pad['name']=={'RESET':'NRST','AVDD':'VDDA','PD0':'OSC_IN','PD1':'OSC_OUT'}.get(pin['name'],pin['name'])
for header in ('CN7','CN10'):
    first, second, last = (contacts[f'{header}.{number}']['position'] for number in (1,2,38))
    assert first['x']<second['x']==last['x'] and first['y']==second['y']<last['y']
for header, size in (('CN5',10),('CN9',8)):
    assert contacts[f'{header}.{size}']['position']['y']<contacts[f'{header}.1']['position']['y']

for label in ('CN5.6','CN10.11'):
    pin=contacts[label]
    assert (pin['name'],pin['net'],pin['mcuPin'])==('PA5','PA5',21)
    assert pin['boardCircuitKey']=='nucleoLed'
assert contacts['CN5.6']['boardLabel']=='D13'
assert contacts['CN8.5']['sharedWith']==['CN7.36']
assert contacts['CN9.2']['boardCircuitKey']=='nucleoUsart'
assert contacts['CN7.29']['mcuPin']==5 and contacts['CN7.29']['boardCircuitKey']=='nucleoHse'
assert contacts['CN6.1']['reserved']
f401={pin['physicalLabel']:pin for pin in lookup['nucleo-f401re'].values()}
assert len(f401)==108
assert f401['CN7.29']['name']=='PH0' and f401['CN7.29']['mcuPin']==5
assert f401['CN10.18']['reserved']
assert f401['CN5.6']['mcuPin']==21
assert any(f['name']=='SPI1_SCK' and f.get('selector')=='AF5' for f in f401['CN5.6']['functions'])
f411={pin['physicalLabel']:pin for pin in lookup['nucleo-f411re'].values()}
assert len(f411)==108
assert f411['CN7.29']['name']=='PH0' and f411['CN7.29']['mcuPin']==5
assert f411['CN10.18']['reserved']
assert f411['CN5.6']['mcuPin']==21
assert any(f['name']=='SPI1_SCK' and f.get('selector')=='AF5' for f in f411['CN5.6']['functions'])
assert any(f['name']=='I2C3_SDA' and f.get('selector')=='AF9' for f in f411['CN10.3']['functions'])
assert not any(f['name']=='I2C3_SDA' for f in f401['CN10.3']['functions'])
for item in boards:
    if 'mcuProfile' not in item:
        continue
    package=board_by_id[item['mcuProfile']]
    assert package['layout'] in {'dip','lqfp','qfn'} and package['mcu']==item['mcu']
    assert any('mcuPin' in pin for pin in item['pins'])
    for pin in item['pins']:
        if 'mcuPin' in pin:
            assert pin['mcuPin'] in lookup[package['id']]
assert board_by_id['arduino-uno-r3']['mcuProfile']=='atmega328p-pdip28'
assert next(pin for pin in uno.values() if pin['name']=='D13')['mcuPin']==19
assert board_by_id['arduino-nano-classic']['mcuProfile']=='atmega328p-qfn32'
assert (get(nano,'L.10')['mcuPin'],get(nano,'L.11')['mcuPin'])==(19,22)
assert get(mega,'DIGITAL.5')['mcuPin']==26
assert lookup['blue-pill'][42]['mcuPin']==34
for board_id,package_id,run_pin,gpio_pin in [('pico','rp2040',26,38),('picow','rp2040',26,38),
                                          ('pico2','rp2350a',26,40),('pico2w','rp2350a',26,40)]:
    assert board_by_id[board_id]['mcuProfile']==package_id
    assert lookup[board_id][30]['mcuPin']==run_pin and lookup[board_id][31]['mcuPin']==gpio_pin
    assert 'mcuPin' not in lookup[board_id][35]
assert lookup['rp2040'][56]['name']=='QSPI_SS_N'
xiao=lookup['xiao-rp2040']
assert len(xiao)==14 and sum(p['type']=='GPIO' for p in xiao.values())==11
assert xiao[1]['name']=='D0_ADC0' and xiao[1]['mcuPin']==38 and xiao[1]['net']=='GPIO26'
assert xiao[7]['name']=='D6' and xiao[7]['mcuPin']==2 and xiao[7]['net']=='GPIO0'
assert xiao[8]['name']=='5V' and xiao[8]['type']=='POWER'
assert xiao[9]['name']=='GND' and xiao[9]['type']=='GND'
assert xiao[10]['name']=='3V3' and xiao[10]['type']=='POWER'
assert xiao[14]['name']=='D7' and xiao[14]['mcuPin']==3 and xiao[14]['net']=='GPIO1'
assert any(f['group']=='ADC' and f['name']=='ADC0' for f in xiao[1]['functions'])
assert any(f['group']=='ADC' and f['name']=='ADC3' for f in xiao[4]['functions'])
assert not any(f['group']=='ADC' for f in xiao[5]['functions'])
xiao_c3=lookup['xiao-esp32c3']
assert len(xiao_c3)==14 and sum(p['type']=='GPIO' for p in xiao_c3.values())==11
assert xiao_c3[1]['name']=='D0' and xiao_c3[1]['net']=='GPIO2' and xiao_c3[1]['strapping']
assert xiao_c3[7]['name']=='D6' and xiao_c3[7]['net']=='GPIO21'
assert xiao_c3[8]['name']=='5V' and xiao_c3[8]['type']=='POWER'
assert xiao_c3[9]['name']=='GND' and xiao_c3[9]['type']=='GND'
assert xiao_c3[10]['name']=='3V3' and xiao_c3[10]['type']=='POWER'
assert xiao_c3[14]['name']=='D7' and xiao_c3[14]['net']=='GPIO20'
assert any(f['group']=='ADC' and f['name']=='ADC1_CH2' for f in xiao_c3[1]['functions'])
assert any(f['group']=='ADC' and f['name']=='ADC2_CH0' for f in xiao_c3[4]['functions'])
assert xiao_c3[4]['analogCautionKey']=='espC3Adc2Note'
assert not any(f['group']=='ADC' for f in xiao_c3[5]['functions'])
assert xiao_c3[12]['strapping'] and xiao_c3[13]['strapping']
mb=lookup['microbit-v2']
assert len(mb)==25 and sum(p['type']=='GPIO' for p in mb.values())==19
assert mb[1]['name']=='P0' and mb[1]['net']=='P0.02' and mb[1]['connector']=='RING'
assert mb[12]['name']=='3V' and mb[12]['type']=='POWER' and mb[12]['connector']=='RING'
assert mb[13]['name']=='GND' and mb[13]['type']=='GND' and mb[13]['connector']=='RING'
assert mb[21]['name']=='P20' and mb[21]['net']=='P1.00' and mb[21]['connector']=='EDGE'
assert any(f['group']=='TOUCH' and f['name']=='TOUCH' for f in mb[1]['functions'])
assert any(f['group']=='SYSTEM' and f['name']=='BUTTON_A' for f in mb[6]['functions'])
assert any(f['group']=='SYSTEM' and f['name']=='BUTTON_B' for f in mb[14]['functions'])
assert any(f['group']=='SPI' and f['name']=='SPI_SCK' for f in mb[16]['functions'])
assert any(f['group']=='I2C' and f['name']=='I2C_SDA' for f in mb[21]['functions'])
assert mb[4]['boardCircuitKey']=='microbitLedColNote'
assert mb[6]['boardCircuitKey']=='microbitButtonANote'
assert mb[14]['boardCircuitKey']=='microbitButtonBNote'
assert mb[20]['boardCircuitKey']=='microbitI2cPullupNote'
feather=lookup['adafruit-feather-rp2040']
assert len(feather)==28 and sum(p['type']=='GPIO' for p in feather.values())==21
assert feather[5]['name']=='A0' and feather[5]['net']=='GPIO26' and feather[5]['mcuPin']==38
assert feather[11]['name']=='SCK' and feather[11]['net']=='GPIO18' and feather[11]['mcuPin']==29
# Right header counts from the USB end: VBAT is opposite A0, SDA opposite D4.
assert feather[17]['name']=='VBAT' and feather[17]['type']=='POWER' and feather[17]['position']['y']==feather[5]['position']['y']
assert feather[28]['name']=='SDA' and feather[28]['net']=='GPIO2' and feather[28]['mcuPin']==4 and feather[28]['position']['y']==feather[16]['position']['y']
assert feather[3]['name']=='3V3' and feather[3]['type']=='POWER' and not any(p['name']=='AREF' for p in feather.values())
assert feather[20]['name']=='D13' and feather[20]['net']=='GPIO13' and feather[20]['mcuPin']==16
assert any(f['group']=='ADC' and f['name']=='ADC0' for f in feather[5]['functions'])
FINAL_PRINT=lambda:print(f"Checked {report['physicalPins']} pins, {report['functionAssignments']} function references and model-specific corner cases.")

# Teensy 4.1: ports follow cores/teensy4/core_pins.h, functions follow PJRC card 11a/11b.
teensy={p['physicalLabel']:p for p in next(b for b in boards if b['id']=='teensy-41')['pins']}
teensy_signals=lambda label:{f['signal'] for f in teensy[label]['functions']}
assert [teensy[f'SD.{i}']['name'] for i in range(1,9)]==['42','43','GND','44','3.3V','45','46','47']
assert teensy['R.23']['mcuPort']=='GPIO7[29]' and 'RX8' in teensy_signals('R.23') and 'PWM' not in teensy_signals('R.23')
assert teensy['R.22']['mcuPort']=='GPIO7[28]' and 'TX8' in teensy_signals('R.22')
assert teensy['R.18']['mcuPort']=='GPIO6[29]' and {'A15','MISO1','OUT1A'}<=teensy_signals('R.18')
assert teensy_signals('R.16')=={'A17',teensy['R.16']['net']} and 'PWM' not in teensy_signals('R.6')|teensy_signals('R.7')
assert teensy['SD.1']['mcuPort']=='GPIO8[15]' and teensy['SD.8']['mcuPort']=='GPIO8[16]'

# NUCLEO-G474RE: UM2505 puts D0/D1 on USART1 PC5/PC4 by default, not LPUART1 PA3/PA2.
g474={p['physicalLabel']:p for p in next(b for b in boards if b['id']=='nucleo-g474re')['pins']}
assert g474['CN9.1']['net']=='PC5' and g474['CN9.2']['net']=='PC4' and g474['CN10.37']['net']=='PC5' and g474['CN10.35']['net']=='PC4'
assert all(g474[label]['boardCircuitKey']=='nucleoG4Usart' for label in ('CN9.1','CN9.2','CN10.35','CN10.37'))
assert not any(str(p.get('boardCircuitKey','')) in ('nucleoA45','nucleoUsart','nucleoLed','nucleoLse','nucleoHse') for p in g474.values())
g474_chip={p['number']:p for p in next(b for b in boards if b['id']=='stm32g474ret6')['pins']}
assert g474_chip[28]['name']=='VREF+' and g474_chip[29]['name']=='VDDA'

# --- Audit corrections (2026-11): every corrected fact stays pinned here. ---
by_label=lambda id:{p['physicalLabel']:p for p in board_by_id[id]['pins']}
names=lambda pin:{f['name'] for f in pin['functions']}
# Sourced notes: every referenced evidence key exists, and every warning/caution names a source.
for b in boards:
    for item in b.get('cautions',[]):assert item['key'] and item['evidence'] and all(k in refs for k in item['evidence']),(b['id'],item)
    for p in b['pins']:
        for key,keys in p.get('noteEvidence',{}).items():
            assert keys and all(k in refs and k in p['evidence'] for k in keys),(b['id'],p['number'],key)
            assert key in (p.get('noteKey'),p.get('boardCircuitKey'),p.get('analogCautionKey'),*p.get('warnings',[])) or (key=='espStrappingNote' and p.get('strapping')),(b['id'],p['number'],key)
        for key in p.get('warnings',[]):assert key in p['noteEvidence'],(b['id'],p['number'],key)
        assert not re.search('[ğışçöüİĞŞÇÖÜ]',p.get('note','')),(b['id'],p['number']) # raw notes must not be Turkish-only; prefer i18n keys
    assert not re.search('[ğışçöüİĞŞÇÖÜ]',json.dumps({k:v for k,v in b.items() if k!='pins'},ensure_ascii=False)),b['id']
# BeagleBone Black: P9.41/P9.42 nets, second balls, eMMC/HDMI default use, PWR_BUT, rails, signal names.
bbb=by_label('beaglebone-black');bbb_board=board_by_id['beaglebone-black']
assert (bbb['P9.41']['net'],bbb['P9.41']['mcuPin'],bbb['P9.41']['alternateBall'])==('gpio0[20]','D14',{'ball':'D13','name':'GPIO3_20','net':'gpio3[20]'})
assert (bbb['P9.42']['net'],bbb['P9.42']['mcuPin'],bbb['P9.42']['alternateBall'])==('gpio0[7]','C18',{'ball':'B12','name':'GPIO3_18','net':'gpio3[18]'})
assert {'gpio0[20] (Mode 7)','gpio3[20] (D13 · Mode 7)'}<=names(bbb['P9.41']) and {'gpio0[7] (Mode 7)','gpio3[18] (B12 · Mode 7)'}<=names(bbb['P9.42'])
assert (bbb['P9.41']['boardCircuitKey'],bbb['P9.42']['boardCircuitKey'])==('bbbP941Note','bbbP942Note')
assert sorted(int(k[3:]) for k,p in bbb.items() if p.get('boardCircuitKey')=='bbbEmmcNote')==[3,4,5,6,20,21,22,23,24,25]
assert sorted(int(k[3:]) for k,p in bbb.items() if p.get('boardCircuitKey')=='bbbHdmiNote')==list(range(27,47))
assert all(k.startswith('P8.') for k,p in bbb.items() if p.get('boardCircuitKey') in ('bbbEmmcNote','bbbHdmiNote'))
assert bbb_board['gpioCount']==67 and bbb_board['defaultUsedGPIOCount']==30
assert bbb['P9.9']['noteKey']=='bbbPwrButNote' and bbb['P9.9']['type']=='SYSTEM'
assert bbb['P9.3']['noteKey']=='bbb3v3Note' and bbb['P9.3']['noteEvidence']['bbb3v3Note']==['bbb-cape-power']
assert {c['key'] for c in bbb_board['cautions']}=={'bbbPowerSequenceCaution','bbbDefaultUseCaution'}
assert 'gmii2_rxerr (Mode 1)' in names(bbb['P9.13']) and 'rgmii2_rctl (Mode 2)' in names(bbb['P9.23']) and 'rmii2_txen (Mode 3)' in names(bbb['P9.15'])
assert not any(f['signal'] in ('mii_rxerr','mii2_crs','mii2_col','rmii2_tctl','rgmii2_rxdv') for p in bbb.values() for f in p['functions'])
# Arduino Nano ESP32: B1 is Arduino pin 15 (LED_GREEN); GPIO0/GPIO3/GPIO46 header pins are strapping pins.
nesp=by_label('arduino-nano-esp32')
assert (nesp['L.13']['name'],nesp['L.13']['net'],nesp['L.13']['arduinoPin'])==('B1','GPIO0',15)
assert (nesp['L.3']['arduinoPin'],nesp['L.6']['arduinoPin'])==(14,19)
assert sorted(p['net'] for p in nesp.values() if p.get('strapping'))==['GPIO0','GPIO3','GPIO46']
assert board_by_id['arduino-nano-esp32']['cautions'][0]['key']=='arduinoNanoEsp32StrapCaution'
# RP2350 erratum E9 on every Bank 0 GPIO of the four RP2350 profiles.
for id,count in (('pico2',26),('pico2w',26),('rp2350a',30),('rp2350b',48)):
    marked=[p for p in board_by_id[id]['pins'] if 'rp2350E9Note' in p.get('warnings',[])]
    assert len(marked)==count and all(p['type']=='GPIO' and p['noteEvidence']['rp2350E9Note']==['rp2350-e9'] for p in marked)
assert refs['rp2350-e9']['page']==1359
assert not any('rp2350E9Note' in p.get('warnings',[]) for id in ('pico','picow','rp2040') for p in board_by_id[id]['pins'])
# XIAO ESP32C3: no USB-UART bridge note; BOOT button on D9; C3-specific ADC2 caveat.
assert not any(p.get('boardCircuitKey')=='espUartBridgeNote' for p in xiao_c3.values())
assert xiao_c3[7]['boardCircuitKey']==xiao_c3[14]['boardCircuitKey']=='xiaoC3Uart0Note' and xiao_c3[12]['boardCircuitKey']=='xiaoC3BootNote' and xiao_c3[12]['net']=='GPIO9'
c3kit=next(p for p in board_by_id['esp32-c3-devkitm-1']['pins'] if p.get('analogCautionKey'))
assert c3kit['analogCautionKey']=='espC3Adc2Note' and refs['esp32c3-adc2-note']['page']==49
assert all(p.get('analogCautionKey')!='espC3Adc2Note' for id in ('esp32-devkitc-v4','esp32-s3-devkitc-1') for p in board_by_id[id]['pins'])
# XIAO SAMD21: TCC names from DS40001882L Table 7-1; PA08 is NMI only; D5/D7 share EXTINT[9].
samd=by_label('xiao-samd21')
assert not any(re.match(r'TC[01]_WO',f['name']) for p in samd.values() for f in p['functions'])
assert {'TCC0/WO[0]'}<=names(samd['L.2']) and {'TCC1/WO[0]','TCC0/WO[2]'}<=names(samd['L.3']) and {'TC4/WO[0]'}<=names(samd['L.7'])
assert 'NMI' in names(samd['L.5']) and not any(f['group']=='IRQ' for f in samd['L.5']['functions']) and samd['L.5']['boardCircuitKey']=='xiaoSamdNmiNote'
assert 'EXTINT[9]' in names(samd['L.6']) and 'EXTINT[9]' in names(samd['R.7']) and samd['L.6']['boardCircuitKey']==samd['R.7']['boardCircuitKey']=='xiaoSamdExtint9Note'
assert refs['samd21-port-mux']['page']==28
# micro:bit V2: 25 front strips in the manufacturer's physical order; saved-plan IDs 1-21 keep their signals.
order=[p['name'] for p in sorted(mb.values(),key=lambda p:p['edgePosition'])]
assert order==['P3','P0','P4','P5','P6','P7','P1','P8','P9','P10','P11','P12','P2','P13','P14','P15','P16','3V','3V','3V','P19','P20','GND','GND','GND']
assert [mb[n]['name'] for n in (22,23,24,25)]==['3V','3V','GND','GND'] and sum(p['connector']=='RING' for p in mb.values())==5
assert mb[20]['noteEvidence']['microbitI2cPullupNote']==['microbit-v2-edge-table','microbit-v2-i2c-buses']
assert board_by_id['microbit-v2']['cautions'][0]['key']=='microbitCurrentCaution'
# Evidence locators corrected by the audit.
assert refs['atmega2561-port-pdi']['page']==84 and 'Table 13-17' in refs['atmega2561-port-pdi']['locator'] and 'Table 13-22' not in refs['atmega2561-port-pdi']['locator']
assert refs['esp32-devkitc-v4-matrix']['page']==16 and 'Table 2-1' in refs['esp32-devkitc-v4-matrix']['locator']
# Low items: Nano Every runs at 16 MHz; Nano 33 BLE VUSB jumper; UNO R4 IOREF note is not the AVR text.
assert board_by_id['arduino-nano-every']['clock']=='16 MHz' and '20 MHz' not in board_by_id['arduino-nano-every']['subtitle']
assert next(p for p in board_by_id['arduino-nano-33-ble-sense-rev2']['pins'] if p.get('noteKey')=='arduinoBle5VNote')['noteEvidence']
for id in ('arduino-uno-r4-minima','arduino-uno-r4-wifi'):
    assert next(p for p in board_by_id[id]['pins'] if p['name']=='IOREF')['noteKey']=='arduinoR4IorefNote'
assert next(p for p in uno.values() if p['name']=='IOREF')['noteKey']=='arduinoIorefNote'
# Raspberry Pi header: voltage/current cautions and the fixed I2C pull-ups carry their source.
for id in ('raspberry-pi-4','raspberry-pi-5','raspberry-pi-40'):
    assert {c['key'] for c in board_by_id[id]['cautions']}=={'piNot5vCaution','piCurrentCaution'}
    assert all('piI2cPullupNote' in lookup[id][n]['warnings'] for n in (3,5)) and all(lookup[id][n]['noteKey']=='reservedNote' for n in (27,28))
# Zero W / Zero 2 W / Pi 3 Model B+ use the BCM2835 §6.2 table; Pi 500 reuses the Pi 5 RP1 table.
bcm283x=('raspberry-pi-zero-w','raspberry-pi-zero-2-w','raspberry-pi-3b-plus')
for id in (*bcm283x,'raspberry-pi-500'):
    assert [p['name'] for p in lookup[id].values()]==[p['name'] for p in lookup['raspberry-pi-4'].values()]
    assert [c['key'] for c in board_by_id[id]['cautions']][:2]==['piNot5vCaution','piCurrentCaution']
    assert all('piI2cPullupNote' in lookup[id][n]['warnings'] for n in (3,5))
    assert all(lookup[id][n]['reserved'] and lookup[id][n]['noteKey']=='reservedNote' for n in (27,28))
    assert 'pi4-j8' not in {r for p in lookup[id].values() for r in p['evidence']}
for id in bcm283x:
    fs={f['signal'] for p in lookup[id].values() for f in p['functions']}
    assert len([f for p in lookup[id].values() for f in p['functions']])==83
    assert not any(re.fullmatch(r'(TXD|RXD|CTS|RTS)[2-5]|(SDA|SCL)[3-6]|SPI[3-6]_\w+|DPI_\w+|PCLK|DE|LCD_\w+',s) for s in fs),id
    assert any(f['signal']=='TXD1' and f['selector']=='ALT5' for f in lookup[id][8]['functions'])
    assert any(f['signal']=='PWM0' and f['selector']=='ALT0' for f in lookup[id][32]['functions'])
    assert 'piBcm283xLevelsCaution' in {c['key'] for c in board_by_id[id]['cautions']}
assert {f['evidence'] for p in lookup['raspberry-pi-zero-w'].values() for f in p['functions']}=={'bcm2835-alt-p102'}
for id in ('raspberry-pi-zero-2-w','raspberry-pi-3b-plus'):
    assert {f['evidence'] for p in lookup[id].values() for f in p['functions']}=={'bcm2835-alt-p102-bcm2837'}
    assert 'piBcm2837FunctionsCaution' in {c['key'] for c in board_by_id[id]['cautions']}
for id in ('raspberry-pi-zero-w','raspberry-pi-zero-2-w'):
    assert 'piZeroHeaderCaution' in {c['key'] for c in board_by_id[id]['cautions']}
assert [p['functions'] for p in lookup['raspberry-pi-500'].values()]==[p['functions'] for p in lookup['raspberry-pi-5'].values()]
assert {'piKeyboardHeaderCaution','pi500Rp1Caution'}<={c['key'] for c in board_by_id['raspberry-pi-500']['cautions']}
# Pico 2 W special pins use i18n keys; subtitles are English in the data.
assert all(lookup['pico2w'][n]['noteKey']==f'note.pico2w.{n}' for n in (30,33,35,36,37,39,40))
# Teensy 4.1: voltage caution and the six SD-socket signal pads.
assert board_by_id['teensy-41']['cautions'][0]['key']=='teensyNot5vCaution'
assert sorted(p['name'] for p in board_by_id['teensy-41']['pins'] if 'teensySdPadNote' in p.get('warnings',[]))==['42','43','44','45','46','47']
# Provenance: no mutable-branch or mirror URLs; ST manuals come from st.com at the locked revisions.
for d in manifest['documents']:
    assert not re.search(r'/(main|master)/',d['url']) and 'evo.net.ua' not in json.dumps(d),d['id']
    if 'raw.githubusercontent.com' in d['url']:assert re.search(r'/[0-9a-f]{40}/',d['url']),d['id']
docs_by_id={d['id']:d for d in manifest['documents']}
assert docs_by_id['nucleo-um1724-r17']['revision'].startswith('UM1724 Rev 17') and docs_by_id['nucleo-g4-um2505']['revision'].startswith('UM2505 Rev 7')
assert sum('docs.arduino.cc/resources' in d['url'] for d in manifest['documents'])==1 # only the ATmega328P data sheet has no pinned copy
# Every i18n key referenced by generated data exists in both languages.
i18n=(root/'public/i18n.js').read_text()
used={c['key'] for b in boards for c in b.get('cautions',[])}|{b['scopeKey'] for b in boards if b.get('scopeKey')}
for b in boards:
    for p in b['pins']:
        used|={p[k] for k in ('noteKey','boardCircuitKey','analogCautionKey') if p.get(k)}|set(p.get('warnings',[]))
for key in sorted(used):
    m=re.search(r'^\s*'+re.escape(json.dumps(key))+r': \[("(?:[^"\\]|\\.)*"), ("(?:[^"\\]|\\.)*")\],?$',i18n,re.M)
    assert m and json.loads(m[1]).strip() and json.loads(m[2]).strip(),key
    assert not re.search('[ğışİĞŞ]',json.loads(m[2])),key # English column must be English
FINAL_PRINT()
