"""Physical STM32 board contacts from locked manufacturer source tables/CAD."""
import copy
from collections import Counter
import json
from pathlib import Path
import re
import pdfplumber
from stm32_sources import SnapshotDocument, verify_snapshot

def source_document(cache,docs,document,use_snapshots):
    return SnapshotDocument(verify_snapshot(docs[document],cache.parents[1])) if use_snapshots else pdfplumber.open(cache/docs[document]['file'])

def compact(value):
    return re.sub(r'\s+','',re.sub(r'\(\d+\)','',value or ''))

def contact(chip,signal,number,header,index,label,evidence,position):
    counts=Counter(p['name'].split('/')[0] for p in chip['pins'])
    by_name={p['name'].split('/')[0]:p for p in chip['pins'] if counts[p['name'].split('/')[0]]==1}
    if signal not in by_name and signal+'_C' in by_name:signal+='_C'
    pad=by_name.get(signal)
    pin=copy.deepcopy(pad) if pad else {'type':'GND' if signal in ('GND','AGND') else 'SYSTEM' if signal in ('NC','BOOT0') else 'POWER','functions':[],'evidence':[]}
    pin.update(number=number,name=signal,net=signal,connector=header,connectorPin=index,physicalLabel=f'{header}.{index}',boardLabel=label,position=position)
    pin['evidence']=[*evidence,*pin['evidence']]
    if pad:pin['mcuPin']=pad['number']
    if signal=='NC':pin['reserved']=True
    return pin

def board_profile(chip,id,name,family,pins,diagram,source,scope):
    for pin in pins:
        if pin['type']=='GPIO':pin['sharedWith']=[p['physicalLabel'] for p in pins if p is not pin and p['net']==pin['net']]
    return {'id':id,'name':name,'shortName':name,'family':'STM32','layoutFamily':family,'layout':'custom',
            'subtitle':family+' · '+chip['mcu'],'diagram':diagram,'packagePins':len(pins),
            'gpioCount':sum(p['type']=='GPIO' for p in pins),'uniqueGPIOCount':len({p['net'] for p in pins if p['type']=='GPIO'}),
            'voltage':'3.3 V I/O','mcu':chip['mcu'],'processor':chip['processor'],'clock':chip['clock'],
            'verifiedOn':chip['verifiedOn'],'source':source,'datasheet':chip['datasheet'],'mcuProfile':chip['id'],
            'orientation':'usb','scopeKey':scope,'pins':pins}

def build_nucleo32(cache,docs,ref,chip,model,page,use_snapshots=False):
    document='nucleo-um1956-r6';id='nucleo-'+model
    pin_ref=ref(id+'-headers',document,page,f'UM1956 Rev 6 · Table {10 if model=="f042k6" else 16} · CN3/CN4 contacts')
    drawing=ref(id+'-top-view',document,12,'Figure 3 · MB1180 top view; CN3 left and CN4 right','visual-diagram')
    bridges=ref('nucleo32-bridges',document,21,'Tables 7/8 (continued on p.22) · VCP, SB16/SB18, clocks and LED')
    with source_document(cache,docs,document,use_snapshots) as pdf:table=pdf.pages[page-1].extract_tables()[0]
    pins=[];header=None
    for row in table[1:]:
        if not (row[1] or '').isdigit():continue
        if row[0]:header=row[0]
        assert header in ('CN3','CN4')
        index=int(row[1]);label=compact(row[2]);signal=compact(row[3])
        if signal=='-':signal=label
        pin=contact(chip,signal,len(pins)+1,header,index,label,[pin_ref,drawing],
                    {'x':240 if header=='CN3' else 480,'y':160+29*(index-1),'side':'left' if header=='CN3' else 'right'})
        if (header=='CN3' and index in (7,8)) or (header=='CN4' and index in (7,8)):pin['boardCircuitKey']='nucleo32I2cBridge'
        elif signal=='PA2':pin['boardCircuitKey']='nucleo32Vcp'
        elif signal=='PB3':pin['boardCircuitKey']='nucleo32Led'
        elif signal in ('PF0','PF1','PC14','PC15'):pin['boardCircuitKey']='nucleo32Clock'
        elif label=='AREF':pin['boardCircuitKey']='nucleo32Aref'
        if pin.get('boardCircuitKey'):pin['evidence'].append(bridges)
        pins.append(pin)
    assert len(pins)==30 and all(sum(p['connector']==h for p in pins)==15 for h in ('CN3','CN4'))
    return board_profile(chip,id,id.upper(),'nucleo-32',pins,
                         {'width':720,'height':650,'minWidth':680,'artwork':'assets/boards/nucleo-mb1180.svg',
                          'connectorGroups':[{'id':h,'label':h,'contacts':[h]} for h in ('CN3','CN4')]},
                         docs[document]['viewUrl']+f'#page={page}','nucleo32Scope')

def build_nucleo144(cache,docs,ref,chip,model,spec,use_snapshots=False):
    document=spec['manual'];id='nucleo-'+('h743zi2' if model=='h743zi' else model)
    drawing=ref(id+'-drawing',document,spec['drawing'],'Mechanical drawing · CN7/CN8/CN9/CN10 ST Zio and CN11/CN12 ST Morpho','visual-diagram')
    contacts={}
    def put(header,index,label,raw,pin_ref):
        label=compact(label);signal=compact(raw).split('or')[0].split('/')[0]
        if signal in ('','-'):
            signal=label if label in {'IOREF','NRST','RESET','3V3','+3.3V','5V','+5V','GND','AGND','VIN','VREFP','AVDD'} else 'NC'
        if signal=='RESET':signal='NRST'
        key=(header,index);assert key not in contacts,key
        contacts[key]=(label,signal,pin_ref)
    with source_document(cache,docs,document,use_snapshots) as pdf:
        if model=='f767zi':
            header=None
            for page,index in spec['zio']:
                evidence=ref(id+f'-zio-{page}',document,page,'UM1974 Rev 11 · Table 19 · NUCLEO-F767ZI ST Zio')
                for row in pdf.pages[page-1].extract_tables()[index][1:]:
                    if not (row[1] or '').isdigit():continue
                    if row[0]:header=row[0]
                    put(header,int(row[1]),row[2],row[4],evidence)
        else:
            for header,page,index in spec['zio']:
                evidence=ref(id+f'-zio-{header}-{page}',document,page,f'UM2407 Rev 6 · {header} ST Zio pinout')
                for row in pdf.pages[page-1].extract_tables()[index][1:]:
                    for offset in (0,5):
                        if (row[offset] or '').isdigit():put(header,int(row[offset]),row[offset+1],row[offset+3],evidence)
        for page,index in spec['morpho']:
            evidence=ref(id+f'-morpho-{page}',document,page,'ST Morpho · CN11/CN12 numbered contacts')
            for row in pdf.pages[page-1].extract_tables()[index][2:]:
                for offset,header in [(0,'CN11'),(2,'CN11'),(4,'CN12'),(6,'CN12')]:
                    if (row[offset] or '').isdigit():put(header,int(row[offset]),row[offset+1],row[offset+1],evidence)
    expected={'CN7':20,'CN8':16,'CN9':30,'CN10':34,'CN11':70,'CN12':70}
    assert {header:sum(h==header for h,n in contacts) for header in expected}==expected
    pins=[]
    for header,count in expected.items():
        for index in range(1,count+1):
            label,signal,evidence=contacts[header,index]
            x,y={'CN7':(746,230),'CN8':(354,230),'CN9':(354,435),'CN10':(746,475),'CN11':(126,230),'CN12':(974,230)}[header]
            pin=contact(chip,signal,len(pins)+1,header,index,label,[evidence,drawing],
                        {'x':x+26*((index-1)%2),'y':y+20*((index-1)//2),'side':'left' if index%2 else 'right'})
            if pin['type']=='POWER':assert signal in {'IOREF','3V3','+3.3V','5V','+5V','VIN','VREFP','AVDD','VDD','E5V','U5V','VBAT','3V3_VDD','5V_EXT','5V_USB_STLK'},signal
            if header=='CN9' and index in (9,11):pin['boardCircuitKey']='nucleo144AnalogBridge'
            pins.append(pin)
    ioc_id='nucleo-'+model+'-ioc'
    if document=='nucleo-um2407-r6':
        limits=ref(id+'-board-limits',document,32,'Table 14 · SB14/SB15 Morpho SDMMC links; continued p.34, SB65/PF11 ADC restriction')
        for pin in pins:
            if pin['physicalLabel'] in ('CN12.1','CN12.2'):
                pin['boardCircuitKey']='nucleo144SdBridge';pin['evidence'].append(limits)
            if pin['net']=='PF11':
                pin['functions']=[fn for fn in pin['functions'] if not re.match(r'ADC\d+_IN',fn['name'])]
                pin['boardCircuitKey']='nucleo144Pf11';pin['evidence'].append(limits)
    if ioc_id in docs:
        source=ref(ioc_id+'-circuit',ioc_id,None,'Official board configuration · fitted peripheral and GPIO labels','hardware-spec')
        configuration=dict(line.split('=',1) for line in (cache/docs[ioc_id]['file']).read_text().splitlines() if '=' in line)
        for pin in pins:
            signal=configuration.get(pin['name']+'.Signal','');label=configuration.get(pin['name']+'.GPIO_Label','').upper()
            note='nucleoH7Rmii' if signal.startswith('ETH_') else 'nucleoH7Usb' if signal.startswith('USB_') else 'nucleo144Led' if 'LED' in label or re.match(r'LD\d',label) else 'nucleo144Button' if 'BUTTON' in label or 'BTN' in label else None
            if note:pin['boardCircuitKey']=note;pin['evidence'].append(source)
    return board_profile(chip,id,id.upper(),'nucleo-144',pins,
                         {'width':1100,'height':1040,'minWidth':1000,'artwork':'assets/boards/nucleo-144.svg',
                          'connectorGroups':[{'id':h,'label':('ST Zio' if h in ('CN7','CN8','CN9','CN10') else 'ST Morpho')+' · '+h,'contacts':[h]} for h in expected]},
                         docs[document]['viewUrl'],'nucleo144SourceScope')

def preserve_h723_assignments(board,legacy):
    """Retain v0.6 electrical assignment IDs while correcting physical labels."""
    mapping=json.loads((Path(__file__).resolve().parents[1]/'sources/legacy-h723-pin-ids.json').read_text())
    assert [item['number'] for item in mapping]==list(range(1,132))
    original={p['number']:p for p in legacy['pins']};physical={p['physicalLabel']:p for p in board['pins']}
    aliases={'+3.3V':'3V3','+5V':'5V','VDD':'3V3_VDD','VREF+':'VREFP'}
    used=set()
    for item in mapping:
        old=original[item['number']];pin=physical[item['physicalLabel']]
        assert item['physicalLabel'] not in used
        assert item['name']==old['name'] and item['mcuPin']==old.get('mcuPin')
        assert aliases.get(old['name'],old['name'])==pin['name']
        if old.get('mcuPin'):assert old['mcuPin']==pin.get('mcuPin')
        retired=sorted({f['name'] for f in old['functions']}-{f['name'] for f in pin['functions']})
        if retired:pin['retiredFunctions']=retired
        pin['number']=item['number'];pin['name']=old['name'];used.add(item['physicalLabel'])
    number=132
    for pin in board['pins']:
        if pin['physicalLabel'] not in used:pin['number']=number;number+=1
    board['pins'].sort(key=lambda p:p['number'])
    assert number==241
    return board

def kicad_expression(text):
    tokens=iter(re.findall(r'"(?:\\.|[^"\\])*"|[()]|[^\s()]+',text))
    def parse(first):
        if first!='(':return json.loads(first) if first.startswith('"') else first
        result=[]
        for token in tokens:
            if token==')':return result
            result.append(parse(token))
        raise ValueError('Unclosed KiCad expression')
    return parse(next(tokens))

def cad_nodes(node,kind):
    if isinstance(node,list):
        if node and node[0]==kind:yield node
        for item in node:yield from cad_nodes(item,kind)

def cad_child(node,key):
    return next(item for item in node if isinstance(item,list) and item and item[0]==key)

def build_blackpill(cache,docs,ref,chip,model):
    symbol_id,footprint_id='weact-blackpill-symbol','weact-blackpill-footprint'
    symbol=kicad_expression((cache/docs[symbol_id]['file']).read_text())
    footprint=kicad_expression((cache/docs[footprint_id]['file']).read_text())
    raw_pins=list(cad_nodes(symbol,'pin'));raw_pads=[pad for pad in cad_nodes(footprint,'pad') if pad[1].isdigit()]
    names={int(cad_child(pin,'number')[1]):cad_child(pin,'name')[1] for pin in raw_pins}
    positions={int(pad[1]):list(map(float,cad_child(pad,'at')[1:3])) for pad in raw_pads}
    assert len(raw_pins)==len(raw_pads)==44 and set(names)==set(positions)==set(range(1,45))
    readme=(cache/docs['weact-blackpill-readme']['file']).read_text()
    revisions=(cache/docs['weact-blackpill-revisions']['file']).read_text()
    assert chip['mcu'] in readme and 'pin definition unchanged' in revisions
    pin_ref=ref('weact-blackpill-symbol',symbol_id,None,'KiCad symbol · 44 manufacturer pad names','manufacturer-cad')
    shape_ref=ref('weact-blackpill-footprint',footprint_id,None,'KiCad footprint · all 44 pad coordinates; USB-C at negative Y','manufacturer-cad')
    circuit_ref=ref('weact-blackpill-circuits','weact-blackpill-schematic',1,'v3.1 schematic · PA0 key, PC13 LED, boot, USB and optional SPI flash','visual-diagram')
    pins=[]
    for number in range(1,45):
        label=names[number];signal={'~{RESET}':'NRST','BOOT1':'PB2','SWDIO':'PA13','SWCLK':'PA14'}.get(label,label)
        x,y=positions[number];header='LEFT' if number<=20 else 'RIGHT' if number<=40 else 'SWD'
        pin=contact(chip,signal,number,header,number,label,[pin_ref,shape_ref],
                    {'x':round(450+x*18,2),'y':round(150+(y+20.7)*12,2),'side':'left' if number<=20 or number>40 else 'right',**({'angle':90} if number>40 else {})})
        pin['physicalLabel']=f'PAD.{number}'
        note='blackPillKey' if signal=='PA0' else 'blackPillLed' if signal=='PC13' else 'blackPillUsb' if signal in ('PA11','PA12') else 'blackPillBoot' if signal=='PB2' else 'blackPillFlash' if signal in ('PA4','PA5','PA6','PA7') else 'blackPillDebug' if signal in ('PA13','PA14') else None
        if note:pin['boardCircuitKey']=note;pin['evidence'].append(circuit_ref)
        pins.append(pin)
    return board_profile(chip,'weact-blackpill-'+model,'WeAct Black Pill '+model.upper()+' v3.x','black-pill',pins,
                         {'width':900,'height':820,'minWidth':850,'artwork':'assets/boards/black-pill.svg',
                          'connectorGroups':[{'id':h,'label':h,'contacts':[h]} for h in ('LEFT','RIGHT','SWD')]},
                         docs['weact-blackpill-readme']['viewUrl'],'blackPillScope')
