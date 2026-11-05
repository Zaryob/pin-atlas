"""Physical STM32 board contacts from locked manufacturer source tables/CAD."""
import copy
import re
import pdfplumber
from stm32_sources import SnapshotDocument, verify_snapshot

def source_document(cache,docs,document,use_snapshots):
    return SnapshotDocument(verify_snapshot(docs[document],cache.parents[1])) if use_snapshots else pdfplumber.open(cache/docs[document]['file'])

def compact(value):
    return re.sub(r'\s+','',re.sub(r'\(\d+\)','',value or ''))

def contact(chip,signal,number,header,index,label,evidence,position):
    by_name={p['name'].split('/')[0]:p for p in chip['pins']}
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
