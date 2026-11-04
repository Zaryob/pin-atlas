#!/usr/bin/env python3
"""Rebuild/check pin facts against hash-locked manufacturer documents.

Tables are extracted afresh with pdfplumber, or from hash-locked raw ST table
snapshots when requested. Outline-only diagrams use recorded visual observations.
"""
import argparse,copy,csv,hashlib,io,json,re,subprocess,sys
from pathlib import Path
try:
    import pdfplumber
    from stm32_sources import build_stm32,verify_snapshot
    from nucleo_sources import build_nucleo,read_f4_chip,read_g4_chip,build_nucleo_g474
    from arduino_sources import build_arduino
    from expanded_arduino_sources import build_expanded_arduino
    from espressif_sources import build_espressif
    from avr_packages import build_avr_packages
    from seeed_sources import build_seeed
    from microbit_sources import build_microbit
    from feather_sources import build_feather_rp2040
    from teensy_sources import build_teensy_41
except ImportError:
    sys.exit('Install source verification dependencies: python3 -m pip install -r requirements-source-verification.txt')
ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'.cache/primary-sources'
MANIFEST=json.loads((ROOT/'sources/manifest.json').read_text())
OBS=json.loads((ROOT/'sources/manual-observations.json').read_text())
DOCS={s['id']:s for s in MANIFEST['documents']}
REFS={}

def clean(value):return ' '.join((value or '').split())
def ref(key,doc,page,locator,method='pdf-table'):
    entry={'document':doc,'title':DOCS[doc]['title'],'url':DOCS[doc].get('viewUrl',DOCS[doc]['url'])+(f'#page={page}' if page else ''),'page':page,'locator':locator,'method':method}
    assert key not in REFS or REFS[key]==entry,key
    REFS[key]=entry
    return key

def acquire(use_snapshots=False):
    CACHE.mkdir(parents=True,exist_ok=True)
    for doc in DOCS.values():
        if use_snapshots and doc.get('tableSnapshot'):
            verify_snapshot(doc,ROOT)
            continue
        path=CACHE/doc['file']
        if not path.exists():
            temporary=path.with_suffix(path.suffix+'.download')
            urls=doc.get('downloadUrls',[doc['url']])
            try:
                for url in urls:
                    # ST's global CDN can stall on hosted runners. Only use
                    # explicitly recorded official mirrors and the same hash.
                    result=subprocess.run(['curl','--http1.1','-fsSL','--retry','1','--retry-all-errors','--retry-delay','1','--connect-timeout','10','--max-time','45',url,'-o',str(temporary)])
                    if result.returncode==0:
                        if hashlib.sha256(temporary.read_bytes()).hexdigest()!=doc['sha256']:
                            sys.exit(f"Source hash mismatch: {doc['id']}. Review the source revision; do not silently update the lock.")
                        temporary.replace(path)
                        break
                    print(f"Download unavailable for {doc['id']}; trying the next recorded URL.",flush=True)
                else:sys.exit(f"Could not download locked source: {doc['id']}")
            finally:
                temporary.unlink(missing_ok=True)
        actual=hashlib.sha256(path.read_bytes()).hexdigest()
        if actual!=doc['sha256']:
            sys.exit(f"Source hash mismatch: {doc['id']}. Review the new manufacturer revision; do not silently update the lock.")

def category(name):
    if name.startswith('SPI'):return 'SPI'
    if name.startswith('I2S'):return 'I2S'
    if re.match(r'(I2C|SDA\d|SCL\d)',name):return 'I2C'
    if re.match(r'(UART|TXD\d|RXD\d|CTS\d|RTS\d)',name):return 'UART'
    for key in ('PWM','HSTX','PIO','USB','QMI','SIO','ADC','PCM'):
        if name.startswith(key):return key
    if name.startswith(('CLOCK','GPCLK','TRACE')):return 'CLOCK'
    if name.startswith('ARM_'):return 'JTAG'
    if name.startswith(('DPI','LCD','PCLK','DE')):return 'DPI'
    if re.match(r'SD(?:IO)?[01]_',name):return 'SDIO'
    if name.startswith(('AUDIO_IN_', 'AUDIO_OUT_')):return 'PCM'
    if re.match(r'(SA\d|SD\d|SOE|SWE)',name):return 'SMI'
    return 'SYSTEM'

def function(signal,alt,evidence,pi=False):
    name=signal
    if pi:
        m=re.fullmatch(r'(SDA|SCL)(\d+)',signal)
        if m:name=f'I2C{m[2]} {m[1]}'
        m=re.fullmatch(r'(TXD|RXD|CTS|RTS)(\d+)',signal)
        if m:name=f"UART{m[2]} {dict(TXD='TX',RXD='RX',CTS='CTS',RTS='RTS')[m[1]]}"
    row={'name':name,'group':category(signal),'signal':signal,'evidence':evidence}
    if alt is not None:row['alt']=alt;row['selector']=('ALT' if pi else 'F')+str(alt)
    return row

def kind(name):
    if name in ('GND','AGND','VREG_PGND'):return 'GND'
    if name.startswith(('GPIO','GP')):return 'GPIO'
    if name=='ADC_VREF':return 'ADC'
    if name in ('VBUS','VSYS','3V3(OUT)','3V3','5V','DVDD','IOVDD','QSPI_IOVDD','USB_OTP_VDD','ADC_AVDD','VREG_AVDD','VREG_VIN'):return 'POWER'
    return 'SYSTEM'

def rp_tables():
    bank0={};bank1={};package={60:{},80:{}}
    with pdfplumber.open(CACHE/'rp2350.pdf') as pdf:
        for index in (17,18,19):
            for table in pdf.pages[index].extract_tables():
                if len(table[0])!=13:continue
                for row in table:
                    if not (row[0] or '').isdigit():continue
                    number=int(row[0]);assert number not in bank0
                    evidence=ref(f'rp-bank0-p{index+1}','rp2350',index+1,'§1.2.3 · Table 3 · Bank 0 function selector F0–F11')
                    bank0[number]=[function(clean(value),alt,evidence) for alt,value in enumerate(row[1:]) if clean(value)]
        assert set(bank0)==set(range(48))
        bank1_names={'USB DP':'USB_DP','USB DM':'USB_DM','QSPI SCK':'QSPI_SCLK','QSPI CSn':'QSPI_SS','QSPI SD0':'QSPI_SD0','QSPI SD1':'QSPI_SD1','QSPI SD2':'QSPI_SD2','QSPI SD3':'QSPI_SD3'}
        for table in pdf.pages[20].extract_tables():
            if len(table[0])==13:
                for row in table[1:]:
                    evidence=ref('rp-bank1','rp2350',21,'§1.2.4 · Table 5 · Bank 1 function selector F0–F11')
                    bank1[bank1_names[clean(row[0])]]=[function(clean(value),alt,evidence) for alt,value in enumerate(row[1:]) if clean(value)]
        assert len(bank1)==8
        for index in (1332,1333,1334,1335):
            for table in pdf.pages[index].extract_tables():
                for row in table:
                    name=clean(row[0]);
                    if len(row)<3 or not re.fullmatch(r'(GPIO\d+(?:_ADC\d)?|QSPI_\w+|XIN|XOUT|RUN|SWCLK|SWDIO|USB_DP|USB_DM|DVDD|IOVDD|USB_OTP_VDD|ADC_AVDD|VREG_\w+)',name):continue
                    if name=='IOVDD':continue # Verified visual override for the documented Table 1679 inconsistency.
                    for col,total in [(1,60),(2,80)]:
                        ns=clean(row[col])
                        if ns=='-':continue
                        assert re.fullmatch(r'\d+(?:, \d+)*',ns),(name,ns)
                        for n in map(int,ns.split(', ')):
                            assert n not in package[total],(name,n)
                            evidence=ref(f'rp-pin-list-p{index+1}','rp2350',index+1,'§14.8.2.2 · Tables 1674–1679 · package pin list')
                            fs=[]
                            if name.startswith('GPIO'):
                                gp=int(re.match(r'GPIO(\d+)',name)[1]);fs=copy.deepcopy(bank0[gp])
                                if '_ADC' in name:
                                    adc=name.split('_')[1];fs.append(function(adc,None,evidence))
                            elif name in bank1:fs=copy.deepcopy(bank1[name])
                            package[total][n]={'number':n,'name':name,'type':kind(name),'functions':fs,'evidence':[evidence]}
        for total,chip,page in [(60,'rp2350a',16),(80,'rp2350b',17)]:
            evidence=ref(f'{chip}-iovdd','rp2350',page,'§1.2.1 · '+('Figure 2' if total==60 else 'Figure 3')+' · IOVDD pads (Table 1679 discrepancy reviewed)','visual-diagram')
            for n in OBS['rp2350-iovdd'][chip]:
                assert n not in package[total]
                package[total][n]={'number':n,'name':'IOVDD','type':'POWER','functions':[],'evidence':[evidence]}
            assert set(package[total])==set(range(1,total+1)),(total,sorted(set(range(1,total+1))-set(package[total])))
    return bank0,package

def pico(bank0):
    physical=ref('pico-header','pico2w-pinout',1,'Manufacturer 40-pin diagram; physical pin names visually checked','visual-diagram')
    details=ref('pico-special','pico2w',9,'§2.1 · special supply / analogue / RUN pins')
    pins=[]
    notes={30:'RUN düşük seviyeye çekildiğinde RP2350 sıfırlanır.',33:'ADC devresinin analog toprak referansı.',35:'ADC besleme / referans bağlantısı; GPIO değildir.',36:'Kartın regüle 3.3 V çıkışı.',37:'Regülatör etkinleştirme girişidir; genel amaçlı GPIO değildir.',39:'Ana besleme girişi: 1.8–5.5 V.',40:'USB VBUS hattı; USB ile beslenirken nominal 5 V.'}
    for n,name in enumerate(OBS['pico2w']['pins'],1):
        fs=[];ev=[physical]
        if re.fullmatch(r'GP\d+',name):
            gp=int(name[2:]);fs=copy.deepcopy(bank0[gp])
            if 26<=gp<=28:fs.append(function('ADC'+str(gp-26),None,ref('pico-adc','pico2w',5,'Figure 2 · GPIO26/27/28 to ADC0/1/2','visual-diagram')))
        if n in notes:ev.append(details)
        pin={'number':n,'name':name,'type':kind(name),'functions':fs,'evidence':ev}
        if n in notes:pin['note']=notes[n]
        pins.append(pin)
    # Text independently confirms the seven special header connections in §2.1.
    with pdfplumber.open(CACHE/'pico2w.pdf') as p:
        text=p.pages[7].extract_text()+'\n'+p.pages[8].extract_text()
        for number,name in [(40,'VBUS'),(39,'VSYS'),(37,'3V3_EN'),(36,'3V3'),(35,'ADC_VREF'),(33,'AGND'),(30,'RUN')]:
            assert re.search(r'PIN'+str(number)+r'\s+'+re.escape(name),text), (number,name)
    return pins

def rp2040_functions():
    bank0={}
    with pdfplumber.open(CACHE/'rp2040.pdf') as pdf:
        for index in (12,13):
            for table in pdf.pages[index].extract_tables():
                if len(table[0])!=10:continue
                for row in table:
                    if not (row[0] or '').isdigit():continue
                    gp=int(row[0]);assert gp not in bank0
                    evidence=ref(f'rp2040-bank0-p{index+1}','rp2040',index+1,'§1.4.3 · Table 2 · Bank 0 function selectors F1–F9')
                    bank0[gp]=[function(clean(value),alt,evidence) for alt,value in enumerate(row[1:],1) if clean(value)]
        assert set(bank0)==set(range(30))
    return bank0

def pico_variant(id,bank0):
    observation=OBS[id]
    physical=ref(id+'-physical',id,5,'Figure 2 · 40-pin physical labels and ADC0/1/2 visually checked','visual-diagram')
    special_page={'pico':8,'picow':9,'pico2':9}[id]
    details=ref(id+'-supply',id,special_page,'§2.1 · special supply / analogue / RUN pins')
    pins=[]
    # These observations are independent reviews of each model's own figure.
    assert len(observation['pins'])==40
    with pdfplumber.open(CACHE/DOCS[id]['file']) as pdf:
        text='\n'.join(p.extract_text() for p in pdf.pages[special_page-1:special_page+1])
        for n,name in [(40,'VBUS'),(39,'VSYS'),(37,'3V3_EN'),(36,'3V3'),(35,'ADC_VREF'),(33,'AGND'),(30,'RUN')]:
            assert re.search(r'PIN'+str(n)+r'\s+'+re.escape(name),text),(id,n,name)
    for n,name in enumerate(observation['pins'],1):
        fs=[];ev=[physical]
        if re.fullmatch(r'GP\d+',name):
            gp=int(name[2:]);fs=copy.deepcopy(bank0[gp])
            if 26<=gp<=28:fs.append(function('ADC'+str(gp-26),None,physical))
        if n in (30,33,35,36,37,39,40):ev.append(details)
        pins.append({'number':n,'name':name,'type':kind(name),'functions':fs,'evidence':ev})
    return pins

def pi4():
    source=(CACHE/'pi-gpio.adoc').read_text()
    table=source.split('.Pin names, types, and typical functions',1)[1].split('|===')[1]
    pins={};block=[]
    rows=table.splitlines()
    for line in rows:
        if not line.startswith('|'):continue
        if re.fullmatch(r'\| \d+',line):
            if block:parse_pi_row(block,pins)
            block=[line[2:]]
        elif block:block.append(line[1:].strip())
    if block:parse_pi_row(block,pins)
    assert set(pins)==set(range(1,41))
    for number,name in OBS['pi4-fixed-pins']['pins'].items():assert pins[int(number)]['name']==name
    # Cross-check every named GPIO net against its row in the manufacturer J8 schematic.
    with pdfplumber.open(CACHE/'pi4-schematic.pdf') as pdf:
        words=pdf.pages[0].crop((45,305,175,414)).extract_words(x_tolerance=1,y_tolerance=1)
        numbers=[w for w in words if w['text'].isdigit() and 95<w['x0']<131]
        assert len(numbers)==40
        checked=0
        for w in words:
            if not (w['text'].startswith('GPIO') or w['text'] in ('ID_SD','ID_SC')):continue
            left=w['x0']<100
            number=min((z for z in numbers if (int(z['text'])%2==1)==left),key=lambda z:abs(z['top']-w['top']))
            name={'ID_SD':'GPIO0','ID_SC':'GPIO1'}.get(w['text'],w['text'])
            assert pins[int(number['text'])]['name']==name,(number,name)
            checked+=1
        assert checked==28,checked
    with pdfplumber.open(CACHE/'bcm2711.pdf') as pdf:
        found=set()
        for index in (77,78):
            for t in pdf.pages[index].extract_tables():
                if len(t[0])!=8:continue
                for row in t:
                    match=re.fullmatch(r'GPIO(\d+)',clean(row[0]))
                    if not match or int(match[1])>27:continue
                    gp=int(match[1]);found.add(gp)
                    pin=next(p for p in pins.values() if p['name']=='GPIO'+str(gp))
                    evidence=ref(f'bcm2711-alt-p{index+1}','bcm2711',index+1,'§5.3 · Table 94 · GPIO alternate function ALT0–ALT5')
                    pin['functions']=[function(clean(value),alt,evidence,True) for alt,value in enumerate(row[2:]) if clean(value) and not clean(value).startswith('<')]
        assert found==set(range(28))
    return list(pins.values())

def pi5():
    source=(CACHE/'pi-gpio.adoc').read_text()
    table=source.split('.Pin names, types, and typical functions',1)[1].split('|===')[1]
    pins={};block=[]
    rows=table.splitlines()
    for line in rows:
        if not line.startswith('|'):continue
        if re.fullmatch(r'\| \d+',line):
            if block:parse_pi_row(block,pins)
            block=[line[2:]]
        elif block:block.append(line[1:].strip())
    if block:parse_pi_row(block,pins)
    assert set(pins)==set(range(1,41))
    for number,name in OBS['pi4-fixed-pins']['pins'].items():assert pins[int(number)]['name']==name
    with pdfplumber.open(CACHE/'rp1-peripherals.pdf') as pdf:
        found=set()
        for index in (15,16):
            for t in pdf.pages[index].extract_tables():
                for row in t:
                    if not row or not row[0] or not clean(row[0]).isdigit():continue
                    gp=int(clean(row[0]))
                    if gp>27:continue
                    found.add(gp)
                    pin=next(p for p in pins.values() if p['name']=='GPIO'+str(gp))
                    evidence=ref(f'rp1-alt-p{index+1}','rp1-peripherals',index+1,'§3.1.1 · Table 4 · GPIO function selection a0–a8')
                    pin['functions']=[function(clean(value),alt,evidence,True) for alt,value in enumerate(row[1:]) if clean(value)]
        assert found==set(range(28))
    return list(pins.values())

def parse_pi_row(row,pins):
    assert len(row)==4,row
    n=int(row[0]);name=row[1].strip('`').replace('GP','GPIO') if row[1].startswith('`GP') else row[1].strip('`')
    evidence=ref('pi-header-doc','pi-gpio',None,'Pin names, types, and typical functions · all 40 header rows','manufacturer-source-table')
    schematic=ref('pi4-j8','pi4-schematic',1,'GPIO EXPANSION · J8 · net labels, power rails and ground','schematic-net-labels+visual-power')
    pins[n]={'number':n,'name':name,'type':kind(name),'functions':[],'evidence':[evidence,schematic]}
    if n in (27,28):pins[n]['note']='HAT kimlik EEPROM hattına ayrılmıştır; normal proje GPIO’su olarak planlamayın.';pins[n]['reserved']=True

def jetson_orin_nano():
    doc='jetson-orin-nano-carrier'
    rows={};figure={}
    normalize=lambda name:{'3.3V':'3V3','5.0V':'5V'}.get(name,name)
    # Figure 3-1 is text-readable; cross-check all 40 positions independently
    # against Table 3-3, rather than transplanting the Raspberry Pi labels.
    with pdfplumber.open(CACHE/DOCS[doc]['file']) as pdf:
        text=pdf.pages[24].extract_text()
        assert '3.3V levels' in text and 'configured as' in text and '>50 k' in text
        for line in text.split('Figure 3-1.',1)[1].splitlines():
            match=re.fullmatch(r'(\S+) (\d+) (\d+) (\S+)',line.strip())
            if not match:continue
            left,odd,even,right=match.groups()
            assert int(odd)%2==1 and int(even)==int(odd)+1
            figure[int(odd)]=normalize(left);figure[int(even)]=normalize(right)
        assert set(figure)==set(range(1,41))
        for index in (25,26):
            tables=pdf.pages[index].extract_tables()
            assert len(tables[0][0])==12
            evidence=ref(f'jetson-j12-p{index+1}',doc,index+1,'§3.3 · Table 3-3 · J12 physical pins, carrier signals and alternate functionality')
            for row in tables[0]:
                if not (row[0] or '').isdigit():continue
                n=int(row[0]);assert n not in rows
                rows[n]=(row,evidence)
    assert set(rows)==set(range(1,41))
    physical=ref('jetson-j12-figure',doc,25,'§3.3 · Figure 3-1 · all 40 J12 pin positions and carrier signal names','pdf-diagram-text')
    rules=ref('jetson-j12-electrical',doc,27,'Table 3-3 notes · 3.3V signals, open-drain I2C and TXB0108 level translators')
    pins=[]
    # These two Table 3-3 spellings contain an extra I. Figure 3-1 and the
    # same rows' SoC CS1_N/CS0_N names identify the chip-select signals.
    corrections={16:('SPI1_CSI1*','SPI1_CS1*'),18:('SPI1_CSI0*','SPI1_CS0*')}
    for n in range(1,41):
        row,evidence=rows[n];name=figure[n];fs=[]
        default,alternate=clean(row[4]),clean(row[5])
        if name in ('3V3','5V'):
            assert ('3.3V' if name=='3V3' else '5.0V') in default
            pin_type='POWER'
        elif name=='GND':
            assert default=='Ground';pin_type='GND'
        else:
            table_name=clean(row[1])
            if n in corrections:
                assert (table_name,name)==corrections[n]
                assert ('CS1' if n==16 else 'CS0') in clean(row[3])
            else:assert table_name==name,(n,table_name,name)
            pin_type='GPIO'
            if not name.startswith('GPIO'):
                fs.append(function(name,None,evidence))
            elif alternate not in ('','–','GPIO'):
                f=function(alternate,None,evidence)
                f['group']='PWM' if alternate=='PWM' else 'CLOCK'
                fs.append(f)
        pin={'number':n,'name':name,'type':pin_type,'functions':fs,'evidence':[physical,evidence]}
        if pin_type=='GPIO':
            pin['evidence'].append(rules)
            pin['noteKey']='jetsonI2cNote' if n in (3,5,27,28) else 'jetsonBufferedNote'
        pins.append(pin)
    return {'id':'jetson-orin-nano','name':'NVIDIA Jetson Orin Nano','shortName':'Jetson Orin Nano','family':'NVIDIA Jetson','subtitle':'J12 · P3768 carrier · 40-pin expansion header','layout':'header','packagePins':40,'gpioCount':28,'voltage':'3.3 V I/O','mcu':'Tegra234','processor':'Jetson Orin Nano','verifiedOn':MANIFEST['verifiedOn'],'scopeKey':'jetsonScope','compatibleKey':'jetsonCompatible','headerLabel':'J12','source':DOCS[doc]['url']+'#page=25','datasheet':DOCS[doc]['url'],'searchTerms':'Jetson Orin Nano NVIDIA P3768 J12 Tegra234','pins':pins}

def rp2040_package(bank0, board_base):
    physical=ref('rp2040-qfn56-physical','rp2040',12,'Figure 3 · QFN-56 top view and exposed GND pad','visual-diagram')
    names=OBS['rp2040-qfn56']['pins']
    assert len(names)==56
    pins=[]
    for number,name in enumerate(names,1):
        gpio=re.fullmatch(r'GPIO(\d+)(?:_ADC(\d+))?',name)
        functions=copy.deepcopy(bank0[int(gpio[1])]) if gpio else []
        if gpio and gpio[2] is not None:
            functions.append(function('ADC'+gpio[2],None,physical))
        pin_type='POWER' if name in ('VREG_VOUT','USB_VDD') else kind(name)
        pins.append({'number':number,'name':name,'type':pin_type,'functions':functions,'evidence':[physical]})
    return {**board_base,'id':'rp2040','name':'RP2040','subtitle':'QFN-56 · dual Cortex-M0+',
            'layout':'qfn','packageName':'QFN-56','packagePins':56,'gpioCount':30,'voltage':'1.8–3.3 V I/O',
            'mcu':'RP2040','processor':'Cortex-M0+','clock':'133 MHz',
            'source':DOCS['rp2040']['url']+'#page=12','datasheet':DOCS['rp2040']['url'],'pins':pins}

def link_board_packages(boards):
    by_id={board['id']:board for board in boards}
    by_id['blue-pill']['mcuProfile']='stm32f103c8t6'
    arduino_packages={
        'arduino-uno-r3':('atmega328p-pdip28','ATmega328P-PU · PDIP-28'),
        'arduino-nano-classic':('atmega328p-qfn32','ATmega328P-MUR · QFN/MLF-32'),
        'arduino-mega-2560':('atmega2560-tqfp100','ATmega2560-AU · TQFP-100'),
    }
    pico_packages={'pico':'rp2040','picow':'rp2040','pico2':'rp2350a','pico2w':'rp2350a','xiao-rp2040':'rp2040'}
    for board_id in (*arduino_packages,*pico_packages):
        board=by_id[board_id]
        if board_id in arduino_packages:
            package_id,description=arduino_packages[board_id]
            schematic=ref(board_id+'-package-schematic',board_id+'-schematic',1,
                          description+' · main MCU and connector nets','visual-diagram')
        else:
            package_id=pico_packages[board_id]
            schematic=None
        board['mcuProfile']=package_id
        by_name={pin['name'].split('_ADC')[0]:pin for pin in by_id[package_id]['pins']}
        for pin in board['pins']:
            if schematic:
                name=pin.get('mcuPort') or {'A6':'ADC6','A7':'ADC7','RESET':'RESET' if board_id=='arduino-mega-2560' else 'PC6',
                                           'AREF':'AREF'}.get(pin['name'])
                if name is None:
                    continue
                pad=by_name[name]
                pin['evidence'].append(schematic)
            else:
                if pin['name']=='RUN':
                    name='RUN'
                elif re.fullmatch(r'GP\d+',pin['name']):
                    name='GPIO'+pin['name'][2:]
                elif pin.get('net') and pin['net'].startswith('GPIO'):
                    name=pin['net']
                else:
                    continue
                pad=by_name[name]
            pin['mcuPin']=pad['number']
            if pad['evidence'][0] not in pin['evidence']:
                pin['evidence'].append(pad['evidence'][0])

def build(use_snapshots=False):
    bank0,packages=rp_tables()
    board_base={'family':'Raspberry Pi','voltage':'3.3 V I/O','verifiedOn':MANIFEST['verifiedOn']}
    boards=[{**board_base,'id':'pico2w','name':'Raspberry Pi Pico 2 W','shortName':'Pico 2 W','subtitle':'RP2350A · 40-pin geliştirme kartı','layout':'pico','packagePins':40,'gpioCount':26,'mcu':'RP2350A','processor':'Cortex-M33 / Hazard3','clock':'150 MHz','wireless':True,'source':DOCS['pico2w-pinout']['url'],'datasheet':DOCS['pico2w']['url'],'pins':pico(bank0)},
        {**board_base,'id':'raspberry-pi-4','scopeKey':'pi4Scope','name':'Raspberry Pi 4 Model B','shortName':'Pi 4 Model B','subtitle':'J8 · 40 pin · BCM2711 alternatif işlevleri','layout':'header','packagePins':40,'gpioCount':28,'reservedGPIOCount':2,'mcu':'BCM2711','processor':'BCM2711','clock':'BCM numaralandırma','source':DOCS['pi4-schematic']['url'],'datasheet':DOCS['bcm2711']['url'],'pins':pi4()},
        {**board_base,'id':'raspberry-pi-5','scopeKey':'pi5Scope','name':'Raspberry Pi 5','shortName':'Pi 5','subtitle':'J8 · 40 pin · RP1 alternatif işlevleri','layout':'header','packagePins':40,'gpioCount':28,'reservedGPIOCount':2,'mcu':'BCM2712 / RP1','processor':'BCM2712 / RP1','clock':'BCM numaralandırma','source':DOCS['rp1-peripherals']['url'],'datasheet':DOCS['rp1-peripherals']['url'],'pins':pi5()}]
    bank2040=rp2040_functions()
    for id,name,mcu,wireless in [('pico','Pico','RP2040',False),('picow','Pico W','RP2040',True),('pico2','Pico 2','RP2350A',False)]:
        boards.append({**board_base,'id':id,'name':'Raspberry Pi '+name,'shortName':name,'subtitle':mcu+' · 40-pin development board','layout':'pico','packagePins':40,'gpioCount':26,'mcu':mcu,'processor':'Cortex-M0+' if mcu=='RP2040' else 'Cortex-M33 / Hazard3','clock':'133 MHz' if mcu=='RP2040' else '150 MHz','wireless':wireless,'source':DOCS[id]['url']+'#page=5','datasheet':DOCS[id]['url'],'pins':pico_variant(id,bank2040 if mcu=='RP2040' else bank0)})
    common_pins=copy.deepcopy(boards[1]['pins'])
    for pin in common_pins:
        pin['functions']=[]
        pin['evidence']=['pi-header-doc']
        if pin.get('reserved'):pin['note']='Reserved for HAT identification EEPROM.'
    boards.append({**board_base,'id':'raspberry-pi-40','name':'Raspberry Pi · 40-pin GPIO','shortName':'40-pin GPIO (common)','subtitle':'Common physical layout · model-specific alternate functions excluded','layout':'header','scopeKey':'commonHeaderScope','packagePins':40,'gpioCount':28,'reservedGPIOCount':2,'mcu':'Common GPIO','source':DOCS['pi-gpio']['viewUrl'],'datasheet':DOCS['pi-gpio']['viewUrl'],'searchTerms':'Pi B+ A+ Pi 2 Pi 3 Pi 4 Pi 5 Zero Zero W Zero 2 W 400 500','pins':common_pins})
    boards.append(jetson_orin_nano())
    stm32_boards=build_stm32(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn'],use_snapshots)
    boards.extend(stm32_boards)
    boards.append(build_nucleo(CACHE,DOCS,ref,stm32_boards[2],'f103rb'))
    f4_chips=[]
    for model in ('f401re','f411re'):
        chip=read_f4_chip(CACHE,DOCS,ref,model,MANIFEST['verifiedOn'],category)
        boards.append(build_nucleo(CACHE,DOCS,ref,chip,model))
        f4_chips.append(chip)
    g4_chip=read_g4_chip(CACHE,DOCS,ref,MANIFEST['verifiedOn'],category)
    boards.append(build_nucleo_g474(CACHE,DOCS,ref,g4_chip))
    boards.extend(build_arduino(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn']))
    boards.extend(build_expanded_arduino(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn'],boards))
    boards.extend(build_espressif(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn']))
    boards.extend(build_avr_packages(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn']))
    rp2040_phys = ref('rp2040-qfn56-physical','rp2040',12,'Figure 3 · QFN-56 top view and exposed GND pad','visual-diagram')
    boards.extend(build_seeed(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn'],bank2040,rp2040_phys))
    boards.extend(build_microbit(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn']))
    boards.extend(build_feather_rp2040(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn'],bank2040,rp2040_phys))
    boards.extend(build_teensy_41(CACHE,DOCS,OBS,ref,MANIFEST['verifiedOn']))
    for total,chip in [(60,'rp2350a'),(80,'rp2350b')]:
        boards.append({**board_base,'id':chip,'name':chip.upper(),'family':'Raspberry Pi','subtitle':f'QFN-{total} · RP2350 · Release 8','layout':'qfn','packagePins':total,'gpioCount':30 if total==60 else 48,'voltage':'1.8–3.3 V I/O','mcu':chip.upper(),'processor':'Cortex-M33 / Hazard3','clock':'150 MHz','source':DOCS['rp2350']['url']+f'#page={16 if total==60 else 17}','datasheet':DOCS['rp2350']['url'],'pins':[packages[total][n] for n in sorted(packages[total])]})
    boards.extend(f4_chips)
    boards.append(g4_chip)
    boards.append(rp2040_package(bank2040,board_base))
    link_board_packages(boards)
    return boards

def outputs(boards):
    physical=sum(len(b['pins']) for b in boards);functions=sum(len(p['functions']) for b in boards for p in b['pins'])
    report={'verifiedOn':MANIFEST['verifiedOn'],'physicalPins':physical,'functionAssignments':functions,'documents':[{k:v for k,v in d.items() if k!='file'} for d in DOCS.values()], 'boards':[{'id':b['id'],'physicalPins':len(b['pins']),'functionAssignments':sum(len(p['functions']) for p in b['pins']),'physicalSourceMethods':sorted({REFS[r]['method'] for p in b['pins'] for r in p['evidence']})} for b in boards], 'qualifications':['Figure-only Pico physical labels were visually checked; they are not machine-readable PDF table cells.','The QFN-60 IOVDD discrepancy in RP2350 Release 8 Table 1679 is resolved using Figures 2 and 152.','The common Raspberry Pi 40-pin profile contains physical connections only; Pi 4 BCM2711 and Pi 5 RP1 alternate functions remain in separate model-specific profiles. Pins 27/28 are reserved for the HAT EEPROM.', 'Pico and Pico W use independently extracted RP2040 functions, not RP2350 selectors. Pico 2 and Pico 2 W use RP2350A functions.', 'ST table snapshots record raw PDF table cells from the locked document hashes; CI can regenerate pin data from those snapshots when the ST CDN is unavailable. Default verification rereads the original ST PDFs.', 'UNO and Nano families group verified main-header positions; MCU functions, BOOT/NC differences and optional programming contacts remain reference-specific. Leonardo I2C/SPI, Every A6/A7 and dual-port TWI, and R4 DAC/CAN mappings are independently extracted.', 'Espressif profiles name exact DevKit revisions and fitted modules. GPIO matrix options describe routing capability, not firmware defaults; input-only pads and flash/PSRAM restrictions remain explicit. S3 v1.1 RGB uses GPIO38 and GPIO46 is bidirectional.', 'ATmega package pin numbers are independent of Arduino headers. ATmega328P PDIP PC0 is pin 23 (Figure 5-1 corrects Table 6-1); reset/clock fuses qualify GPIO use. ATmega2560 TQFP100 functions exclude 64-pin PDI/PDO and resolve CLK0 to CLKO using Figure 1-1.', 'Arduino AVR header contacts include duplicate nets; unique GPIO counts exclude repeated SDA/SCL and ICSP contacts. Nano A6/A7 are analog-only. Current Arduino connector-table typos and Mega D0/D1 PWM marks are resolved using the full pinouts and pinned official AVR core. Functions cover Arduino APIs, not every raw MCU alternate function.', 'Blue Pill board positions use a community reference, not ST manufacturer board documentation. STM32 chip pins and function/remap conditions use ST DS5319 and RM0008. H1/H2/SWD connector labels differ from MCU package pin numbers; clone wiring may differ.', 'Jetson Orin Nano uses NVIDIA P3768 carrier J12 names from Figure 3-1 and Table 3-3; peripheral names are carrier signals, not Linux bus numbers. Table spellings SPI1_CSI1*/CSI0* are resolved using the figure and CS1_N/CS0_N SoC names. Listed capabilities require appropriate pinmux/Jetson-IO configuration and do not assert an active runtime configuration.']}
    buf=io.StringIO();writer=csv.writer(buf,lineterminator='\n');writer.writerow(['board','physical_pin','pin_name','pin_type','function','selector','manufacturer_signal','physical_evidence','function_evidence'])
    for b in boards:
        for p in b['pins']:
            for f in p['functions'] or [{}]:writer.writerow([b['id'],p['number'],p['name'],p['type'],f.get('name',''),f.get('selector',''),f.get('signal',''),' | '.join(p['evidence']),' | '.join(filter(None,[f.get('evidence'),f.get('configurationEvidence')]))])
    js=lambda value:json.dumps(value,ensure_ascii=False,indent=2)+'\n'
    return {'public/data/boards.json':js(boards),'public/data/evidence.json':js({'documents':MANIFEST['documents'],'references':REFS}),'public/data/verification.json':js(report),'sources/pin-verification.csv':buf.getvalue()}

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--write',action='store_true');parser.add_argument('--table-snapshots',action='store_true',help='Use recorded, hash-locked ST table extractions instead of downloading ST PDFs');args=parser.parse_args()
    acquire(args.table_snapshots);boards=build(args.table_snapshots);generated=outputs(boards)
    for name,content in generated.items():
        p=ROOT/name
        if args.write:p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content)
        elif not p.exists() or p.read_text()!=content:sys.exit(f'Official source verification failed: {name} differs. Review and run --write deliberately.')
    print(f"Source verification passed: {sum(len(b['pins']) for b in boards)} physical pins; {sum(len(p['functions']) for b in boards for p in b['pins'])} function assignments; {len(DOCS)} hash-locked source documents.")
if __name__=='__main__':main()
