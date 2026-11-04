"""STM32F103C8/CB package facts and the community Blue Pill reference layout."""
import copy,re,json,hashlib
from html.parser import HTMLParser
import pdfplumber

class BoardTables(HTMLParser):
    def __init__(self):
        super().__init__();self.tables={};self.heading='';self.title=None;self.cell=None;self.row=None;self.table=None
    def handle_starttag(self,tag,attrs):
        if tag in ('h2','h3','h4'):self.title=[]
        if tag=='table':self.table=[]
        if tag=='tr':self.row=[]
        if tag in ('th','td'):self.cell=[]
    def handle_data(self,data):
        if self.title is not None:self.title.append(data)
        if self.cell is not None:self.cell.append(data)
    def handle_endtag(self,tag):
        if tag in ('h2','h3','h4') and self.title is not None:
            self.heading=''.join(self.title).strip();self.title=None
        if tag in ('th','td') and self.cell is not None:
            if self.row is not None:self.row.append(' '.join(''.join(self.cell).split()))
            self.cell=None
        if tag=='tr' and self.row is not None:
            if self.table is not None:self.table.append(self.row)
            self.row=None
        if tag=='table' and self.table is not None:self.tables[self.heading]=self.table;self.table=None

def verify_snapshot(doc,root):
    spec=doc['tableSnapshot'];path=root/spec['file']
    raw=path.read_bytes()
    assert hashlib.sha256(raw).hexdigest()==spec['sha256'], 'ST table snapshot hash mismatch'
    data=json.loads(raw)
    assert data['schema']==1 and data['document']==doc['id']
    assert data['sourceSha256']==doc['sha256'], 'ST table snapshot references a different PDF'
    return data

class SnapshotPage:
    def __init__(self,data):self.data=data
    def extract_tables(self):return self.data['tables']
    def extract_text(self):return ' '.join(self.data.get('tokens',[]))

class SnapshotDocument:
    def __init__(self,data):self.pages={int(number)-1:SnapshotPage(page) for number,page in data['pages'].items()}
    def __enter__(self):return self
    def __exit__(self,*args):return False

def build_stm32(cache,docs,observations,ref,verified_on,use_snapshots=False):
    def open_source(id):
        if use_snapshots:return SnapshotDocument(verify_snapshot(docs[id],cache.parents[1]))
        return pdfplumber.open(cache/docs[id]['file'])
    compact=lambda value:re.sub(r'\s+','',re.sub(r'\(\d+\)','',value or ''))
    configs={}
    # Match remap destinations to the pins present in each package below.
    specs=[(176,0,34,'CAN_REMAP',['00','10','11'],[1,2,3]),
           (178,2,43,'TIM4_REMAP',['0','1'],[1,2]),
           (178,3,44,'TIM3_REMAP',['00','10','11'],[1,2,3]),
           (179,0,45,'TIM2_REMAP',['00','01','10','11'],[1,2,3,4]),
           (179,1,46,'TIM1_REMAP',['00','01','11'],[1,2,3]),
           (180,3,52,'USART3_REMAP',['00','01','11'],[1,2,3]),
           (180,4,53,'USART2_REMAP',['0','1'],[1,2]),
           (181,0,54,'USART1_REMAP',['0','1'],[1,2]),
           (181,1,55,'I2C1_REMAP',['0','1'],[1,2]),
           (181,2,56,'SPI1_REMAP',['0','1'],[1,2])]
    with open_source('stm32-rm0008') as rm:
        for page,index,table_no,field,values,columns in specs:
            table=rm.pages[page-1].extract_tables()[index]
            assert field in compact(''.join(c or '' for c in table[0]))
            evidence=ref(f'stm32-remap-{table_no}','stm32-rm0008',page,f'§9.3 · Table {table_no} · {field}')
            for row in table[1:]:
                signal=compact(row[0])
                if signal.startswith('CAN1_RX'):signal='CANRX'
                elif signal.startswith('CAN1_TX'):signal='CANTX'
                previous=None
                for col in range(1,len(row)):
                    cell=row[col] if row[col] is not None else previous
                    previous=cell
                    if col not in columns:continue
                    ports=re.findall(r'P[A-E]\d+',cell or '')
                    assert len(ports)==1,(table_no,row,col)
                    key=(signal,ports[0])
                    entry=configs.setdefault(key,{'field':field,'values':[],'evidence':evidence})
                    assert entry['field']==field
                    entry['values'].append(values[col-1])
        assert 'PD01_REMAP' in rm.pages[174].extract_text()
    osc_evidence=ref('stm32-osc-remap','stm32-rm0008',175,'PD0/PD1 remapping on OSC_IN/OSC_OUT in LQFP48 and LQFP64; HSE oscillator must be released')
    debug_evidence=ref('stm32-debug-mapping','stm32-rm0008',177,'§9.3.5 · Table 37 · SWJ_CFG debug-port release conditions')
    token_re=re.compile(r'USART\d+_(?:CTS|RTS|TX|RX|CK)|SPI\d+_(?:NSS|SCK|MISO|MOSI)|I2C\d+_(?:SCL|SDA|SMBAl)|ADC12_IN\d+|TIM\d+_(?:CH[1-4]N?(?:_ETR)?|ETR|BKIN)|CANRX|CANTX|USBDM|USBDP|MCO|WKUP|TAMPER-RTC|OSC32_IN|OSC32_OUT|PD[012]|JTMS|JTCK|JTDI|JTDO|JNTRST|NJTRST|SWDIO|SWCLK|TRACESWO|TRACE(?:CK|D[0-3])|PA13|PA14|PA15|PB3|PB4')
    def group(signal):
        if signal.startswith('USART'):return 'UART'
        if signal.startswith('SPI'):return 'SPI'
        if signal.startswith('I2C'):return 'I2C'
        if signal.startswith('ADC'):return 'ADC'
        if signal.startswith('CAN'):return 'CAN'
        if signal.startswith('USB'):return 'USB'
        if signal.startswith('TIM'):return 'PWM' if '_CH' in signal else 'TIMER'
        if signal in ('SWDIO','SWCLK'):return 'SWD'
        if signal.startswith(('JT','JNTRST','NJTRST','TRACESWO')):return 'JTAG'
        if signal in ('MCO','OSC32_IN','OSC32_OUT') or signal.startswith('TRACE'):return 'CLOCK'
        if signal in ('PD0','PD1'):return 'GPIO'
        return 'SYSTEM'
    electrical=ref('stm32-electrical-notes','stm32f103',33,'Table 5 notes · FT qualification, PC13–PC15 limits and HSE remap restrictions')
    def extract_pins(col_idx, package_pins, expected_gpios, physical_ref):
        hse_remap_supported=package_pins in (48,64)
        pins=[]
        with open_source('stm32f103') as ds:
            for page in range(28,34):
                table=ds.pages[page-1].extract_tables()[0]
                assert len(table[0])==13 and '84PFQL' in compact(table[1][2])
                evidence=ref(f'stm32-pin-table-p{page}','stm32f103',page,'§3 · Table 5 · LQFP columns, pin names, I/O tolerance and alternate functions')
                for row in table[2:]:
                    if not (row[col_idx] or '').isdigit():continue
                    n=int(row[col_idx]);raw_name=compact(row[7]);main=compact(row[10]);port=re.match(r'P[A-E]\d+',raw_name)
                    name=port[0] if port else raw_name
                    is_hse_pin=name in ('OSC_IN','OSC_OUT')
                    pin_type='GPIO' if port or (is_hse_pin and hse_remap_supported) else 'GND' if name.startswith('VSS') else 'POWER' if name.startswith(('VDD','VBAT')) else 'SYSTEM'
                    functions=[]
                    for cell in (row[11],row[12],main if main!=name else ''):
                        text=compact(cell)
                        for signal in token_re.findall(text):
                            if signal in ('PA13','PA14','PA15','PB3','PB4'):continue # Generic GPIO planning already covers these released debug pins.
                            # Table 5 shares these cells across packages. Footnote 7 limits the HSE remap.
                            if is_hse_pin and not hse_remap_supported and signal in ('PD0','PD1'):continue
                            if any(f['name']==signal for f in functions):continue
                            f={'name':signal,'group':group(signal),'signal':signal,'evidence':evidence}
                            cfg=configs.get((signal,name))
                            if cfg:
                                f['configuration']={'field':cfg['field'],'values':cfg['values']}
                                f['selector']=cfg['field']+'='+'|'.join(cfg['values'])
                                f['configurationEvidence']=cfg['evidence']
                            elif signal in ('PD0','PD1'):
                                f['configuration']={'field':'PD01_REMAP','values':['1']};f['selector']='PD01_REMAP=1';f['configurationEvidence']=osc_evidence
                            elif signal in ('JTMS','JTCK','JTDI','JTDO','SWDIO','SWCLK','JNTRST','NJTRST','TRACESWO') or signal.startswith('TRACE'):
                                f['configurationEvidence']=debug_evidence
                            functions.append(f)
                    note='stm32GpioNote'
                    if name in ('PC13','PC14','PC15'):note='stm32BackupNote'
                    elif name in ('PA13','PA14'):note='stm32SwdNote'
                    elif name in ('PA15','PB3','PB4'):note='stm32JtagNote'
                    elif is_hse_pin:note='stm32OscNote' if hse_remap_supported else 'stm32DedicatedOscNote'
                    elif name=='PB2':note='stm32Boot1Note'
                    elif name=='NRST':note='stm32ResetNote'
                    elif name=='BOOT0':note='stm32Boot0Note'
                    elif name=='VBAT':note='stm32VbatNote'
                    elif pin_type!='GPIO':note=None
                    pin={'number':n,'name':name,'type':pin_type,'functions':functions,'evidence':[evidence]}
                    if pin_type=='GPIO':pin['fiveVoltTolerant']=compact(row[9])=='FT'
                    if is_hse_pin:pin['baseFunction']=name
                    if note:pin['noteKey']=note
                    pins.append(pin)
        pins.sort(key=lambda p:p['number']);assert [p['number'] for p in pins]==list(range(1,package_pins+1))
        assert sum(p['type']=='GPIO' for p in pins)==expected_gpios
        for pin in pins:
            pin['evidence'].insert(0,physical_ref)
            if pin['type']=='GPIO':pin['evidence'].append(electrical)
        return pins

    phys_lqfp48=ref('stm32-lqfp48','stm32f103',26,'§3 · Figure 8 · LQFP48 perimeter numbering; no exposed center pad')
    pins48=extract_pins(2,48,37,phys_lqfp48)
    chip48={'id':'stm32f103c8t6','name':'STM32F103C8T6','shortName':'STM32F103C8T6','family':'STMicroelectronics','subtitle':'LQFP-48 · Cortex-M3 · 72 MHz','layout':'lqfp','packagePins':48,'gpioCount':37,'voltage':'2.0–3.6 V I/O','mcu':'STM32F103C8T6','processor':'Arm Cortex-M3','clock':'72 MHz','verifiedOn':verified_on,'compatibleKey':'stm32F103Compatible','scopeKey':'stm32F103Scope','source':docs['stm32f103']['url']+'#page=26','datasheet':docs['stm32f103']['url'],'pins':pins48}

    phys_lqfp64=ref('stm32-lqfp64','stm32f103',25,'§3 · Figure 7 · LQFP64 perimeter numbering; no exposed center pad')
    pins64=extract_pins(4,64,51,phys_lqfp64)
    chip64={'id':'stm32f103rbt6','name':'STM32F103RBT6','shortName':'STM32F103RBT6','family':'STMicroelectronics','subtitle':'LQFP-64 · Cortex-M3 · 72 MHz','layout':'lqfp','packageName':'LQFP-64','packagePins':64,'gpioCount':51,'voltage':'2.0–3.6 V I/O','mcu':'STM32F103RBT6','processor':'Arm Cortex-M3','clock':'72 MHz','verifiedOn':verified_on,'compatibleKey':'stm32F103Rbt6Compatible','scopeKey':'stm32F103Rbt6Scope','source':docs['stm32f103']['url']+'#page=25','datasheet':docs['stm32f103']['url'],'pins':pins64}

    phys_lqfp100=ref('stm32-lqfp100','stm32f103',24,'§3 · Figure 6 · LQFP100 perimeter numbering; no exposed center pad')
    pins100=extract_pins(5,100,80,phys_lqfp100)
    chip100={'id':'stm32f103vbt6','name':'STM32F103VBT6','shortName':'STM32F103VBT6','family':'STMicroelectronics','subtitle':'LQFP-100 · Cortex-M3 · 72 MHz','layout':'lqfp','packageName':'LQFP-100','packagePins':100,'gpioCount':80,'voltage':'2.0–3.6 V I/O','mcu':'STM32F103VBT6','processor':'Arm Cortex-M3','clock':'72 MHz','verifiedOn':verified_on,'compatibleKey':'stm32F103Vbt6Compatible','scopeKey':'stm32F103Vbt6Scope','source':docs['stm32f103']['url']+'#page=24','datasheet':docs['stm32f103']['url'],'pins':pins100}

    parser=BoardTables();parser.feed((cache/docs['bluepill-board']['file']).read_text())
    by_name={pin['name']:pin for pin in pins48};board_pins=[]
    nets={'VBAT':'VBAT','+3.3V rail':'3V3','+5V rail':'5V','Ground plane':'GND'}
    orientation=observations['bluepill-orientation']
    assert orientation['left']=='H2' and orientation['right']=='H1' and orientation['usb']=='top'
    schematic=ref('bluepill-schematic','bluepill-schematic',1,'Community schematic · P3/P4 headers, P2 SWD and shared circuitry; RESET/NRST net-label mismatch; use board connector table for reset','community-schematic')
    photo=ref('bluepill-orientation','bluepill-photo',None,'Community reference top view; USB at top, SWD at bottom; H2 left / H1 right','visual-photo')
    for header,title,size in [('H1','Header 1 pins',20),('H2','Header 2 pins',20),('SWD','SWD header pins',4)]:
        rows=[row for row in parser.tables[title] if row and row[0].isdigit()]
        assert [int(row[0]) for row in rows]==list(range(1,size+1))
        ev=ref('bluepill-'+header.lower(),'bluepill-board',None,title+' · numbered connector pins and connected nets','community-source-table')
        for row in rows:
            connector_pin=int(row[0]);name=nets.get(row[3],row[3])
            assert name in by_name or name in ('3V3','5V','GND'),row
            source=by_name.get(name)
            pin=copy.deepcopy(source) if source else {'name':name,'type':'GND' if name=='GND' else 'POWER','functions':[],'evidence':[]}
            pin['number']=len(board_pins)+1;pin['physicalLabel']=f'{header}.{connector_pin}';pin['connector']=header;pin['connectorPin']=connector_pin
            pin['evidence']=[ev,schematic,photo]+pin['evidence']
            if source:pin['mcuPin']=source['number']
            if header in ('H1','H2'):
                pin['position']={'x':530 if header=='H1' else 290,'y':100+(20-connector_pin)*24,'side':'right' if header=='H1' else 'left'}
            else:pin['position']={'x':350+(4-connector_pin)*40,'y':640,'side':'right','angle':90}
            if name=='PC13':pin['noteKey']='bluepillLedNote'
            elif name in ('PC14','PC15'):pin['noteKey']='bluepillLseNote'
            elif name in ('PA11','PA12'):pin['noteKey']='bluepillUsbNote'
            elif name=='5V':pin['noteKey']='bluepillPowerNote'
            board_pins.append(pin)
    assert len(board_pins)==44 and sum(p['type']=='GPIO' for p in board_pins)==34
    board={'id':'blue-pill','name':'STM32 Blue Pill','shortName':'Blue Pill','family':'STM32','subtitle':'STM32F103C8T6 · 2 × 20 + 4 SWD pins','layout':'custom','diagram':{'width':820,'height':900,'artwork':'assets/boards/bluepill.svg'},'orientation':'usb','packagePins':44,'gpioCount':34,'voltage':'3.3 V I/O','mcu':'STM32F103C8T6','processor':'Arm Cortex-M3','clock':'72 MHz','verifiedOn':verified_on,'compatibleKey':'bluepillCompatible','scopeKey':'bluepillScope','source':docs['bluepill-board']['url'],'datasheet':docs['stm32f103']['url'],'searchTerms':'STM32F103C8T6 Bluepill Blue Pill STM32 ARM Cortex M3','pins':board_pins}
    return board,chip48,chip64,chip100
