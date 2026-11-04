"""ATmega package pins and raw peripheral signals from manufacturer datasheets."""
import copy,re
import pdfplumber

def group(signal):
    if signal.startswith('ADC'):return 'ADC'
    if signal.startswith(('PCINT','INT')):return 'IRQ'
    if signal.startswith('OC'):return 'PWM'
    if signal.startswith(('RXD','TXD','XCK')):return 'UART'
    if signal.startswith(('MOSI','MISO','SCK','SS')):return 'SPI'
    if signal.startswith(('SDA','SCL')):return 'I2C'
    if signal in ('TDI','TDO','TCK','TMS'):return 'JTAG'
    if signal.startswith(('XTAL','TOSC','CLKO')):return 'CLOCK'
    if signal.startswith('AIN'):return 'ANALOG'
    if signal.startswith(('ICP','T')):return 'TIMER'
    if signal in ('ALE','RD','WR') or re.fullmatch(r'AD?\d+',signal):return 'SMI'
    return 'SYSTEM'

def make_pin(n,name,functions,physical):
    kind='GPIO' if re.fullmatch(r'P[A-L]\d',name) else 'ADC' if name.startswith('ADC') else 'GND' if name=='GND' else 'POWER' if name in ('VCC','AVCC') else 'SYSTEM'
    return {'number':n,'name':name,'type':kind,'functions':copy.deepcopy(functions),'evidence':[physical]}

def build_avr_packages(cache,docs,observations,ref,verified_on):
    out=[];source='atmega328p-datasheet';rows=[]
    reset=ref('atmega328p-reset-fuse',source,18,'§5.2.5 · PC6/RESET · RSTDISBL fuse condition and reset behavior','pdf-text')
    clock=ref('atmega328p-clock-pins',source,17,'§5.2.3 continued on page 18 · PB6/PB7 clock selection and asynchronous Timer2','pdf-text')
    with pdfplumber.open(cache/docs[source]['file']) as pdf:
        assert 'RSTDISBL Fuse is programmed' in ' '.join(pdf.pages[17].extract_text().split())
        for page in (19,20):
            table=pdf.pages[page-1].extract_tables()[0]
            assert len(table[0])==13 and table[0][3]=='PAD'
            evidence=ref('atmega328p-mux-'+str(page),source,page,'§6 · Table 6-1 · PORT Function Multiplexing; PDIP PC0 typo resolved using Figure 5-1')
            for row in table[1:]:rows.append((row,evidence))
    for id,title,package,col,page,layout in [('atmega328p-pdip28','ATmega328P','PDIP-28',2,14,'dip'),('atmega328p-tqfp32','ATmega328P','TQFP-32',0,16,'lqfp'),('atmega328p-qfn32','ATmega328P','QFN/MLF-32',0,17,'qfn'),('atmega328p-qfn28','ATmega328P','QFN/MLF-28',1,15,'qfn')]:
        physical=ref(id+'-physical',source,page,'§5 · package pin diagram · top view; package-specific numbering and exposed-pad qualification','visual-diagram')
        observed=observations[id]['pins'];pins=[]
        for row,evidence in rows:
            if not row[col].isdigit():continue
            n=int(row[col]);name=re.sub(r'\[(\d)\]',r'\1',row[3].split('/')[0]).strip();fs=[]
            if col==2 and name=='PC0':
                assert n==13;n=23
            for cell in row[4:]:
                for signal in re.split(r'/|\s+',cell or ''):
                    if signal and not any(f['name']==signal for f in fs):fs.append({'name':signal,'group':group(signal),'signal':signal,'evidence':evidence})
            pin=make_pin(n,name,fs,physical);pin['evidence'].append(evidence)
            if name=='PC6':
                pin['baseFunction']='RESET';pin['noteKey']='avrResetFuseNote'
                pin['evidence'].append(reset)
                pin['functions'].append({'name':'GPIO','group':'GPIO','signal':'PC6','selector':'RSTDISBL programmed','evidence':reset})
            elif name in ('PB6','PB7'):pin['noteKey']='avrClockNote';pin['evidence'].append(clock)
            elif pin['type']=='ADC':pin['noteKey']='avrAnalogOnlyNote'
            elif pin['type']=='GPIO':pin['noteKey']='avrGpioNote'
            elif name=='AREF':pin['noteKey']='avrArefNote'
            pins.append(pin)
        pins.sort(key=lambda p:p['number']);assert [p['name'] for p in pins]==observed
        assert [p['number'] for p in pins]==list(range(1,len(pins)+1))
        out.append({'id':id,'name':title+' · '+package,'shortName':title+' '+package,'family':'Microchip AVR','subtitle':package+' · bare MCU · up to 20 MHz','layout':layout,'packageName':package,'packagePins':len(pins),'gpioCount':23,'voltage':'1.8–5.5 V (speed dependent)','mcu':title,'processor':'8-bit AVR','clock':'Up to 20 MHz','scopeKey':'atmega328pPackageScope','verifiedOn':verified_on,'source':docs[source]['url']+'#page='+str(page),'datasheet':docs[source]['url'],'pins':pins})
    source='atmega2560-datasheet';functions={}
    with pdfplumber.open(cache/docs[source]['file']) as pdf:
        for page in (75,76,79,80,82,85,86,88,90,92,93,94):
            for table in pdf.pages[page-1].extract_tables():
                if not table or table[0][0]!='Port Pin':continue
                evidence=ref('atmega2560-port-'+str(page),source,page,'§13.3 · Port alternate-function table · 100-pin package restrictions; raw MCU functions')
                for row in table[1:]:
                    name=row[0];assert re.fullmatch(r'P[A-L][0-7]',name)
                    raw=re.sub(r'\(\d+\)','',row[1] or '').split('(')[0]
                    fs=[]
                    for signal in re.split(r'/|\s+',raw.strip()):
                        if not signal or signal in ('–','—','-','PDI','PDO'):continue # PDI/PDO footnote applies only to 64-pin parts.
                        if signal=='CLK0':signal='CLKO' # Figure 1-1 and the divided-clock description agree.
                        fs.append({'name':signal,'group':group(signal),'signal':signal,'evidence':evidence})
                    functions[name]=fs
        assert len(functions)==86,(len(functions),sorted(functions))
        assert 'ATmega1281/2561' in pdf.pages[81].extract_text()
    physical=ref('atmega2560-tqfp100-physical',source,2,'Figure 1-1 · TQFP100 top view · all 100 package pins; not the 64-pin ATmega2561','visual-diagram')
    names=observations['atmega2560-tqfp100']['pins'];assert len(names)==100
    pins=[]
    for n,name in enumerate(names,1):
        pin=make_pin(n,name,functions.get(name,[]),physical)
        if pin['type']=='GPIO':pin['noteKey']='avrJtagNote' if name in ('PF4','PF5','PF6','PF7') else 'avrClockNote' if name in ('PG3','PG4') else 'avrGpioNote'
        elif name=='RESET':pin['noteKey']='avrResetNote'
        elif name=='AREF':pin['noteKey']='avrArefNote'
        pins.append(pin)
    assert sum(p['type']=='GPIO' for p in pins)==86
    out.append({'id':'atmega2560-tqfp100','name':'ATmega2560 · TQFP-100','shortName':'ATmega2560 TQFP-100','family':'Microchip AVR','subtitle':'TQFP-100 · bare MCU · up to 16 MHz','layout':'lqfp','packageName':'TQFP-100','packagePins':100,'gpioCount':86,'voltage':'4.5–5.5 V (16 MHz grade)','mcu':'ATmega2560','processor':'8-bit AVR','clock':'Up to 16 MHz','scopeKey':'atmega2560PackageScope','compatibleKey':'atmega2560Compatible','verifiedOn':verified_on,'source':docs[source]['url']+'#page=2','datasheet':docs[source]['url'],'pins':pins})
    return out
