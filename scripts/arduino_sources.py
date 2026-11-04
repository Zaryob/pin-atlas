"""Arduino AVR board headers, checked against official diagrams and AVR core maps."""
import re
import pdfplumber

def core_tables(text):
    # Select the ATmega328P branch, not the older ATmega8 PWM implementation.
    text=re.sub(r'#if defined\(__AVR_ATmega8__\).*?#else\n(.*?)#endif',r'\1',text,flags=re.S)
    text=re.sub(r'/\*.*?\*/|//[^\n]*','',text,flags=re.S)
    def array(name):return re.search(name+r'\[\]\s*=\s*\{(.*?)\};',text,re.S)[1]
    ports=re.findall(r'P[A-L]',array('digital_pin_to_port_PGM'))
    bits=re.findall(r'_BV\(\s*(\d+)\s*\)',array('digital_pin_to_bit_mask_PGM'))
    timers=re.findall(r'NOT_ON_TIMER|TIMER\d+[A-C]?',array('digital_pin_to_timer_PGM'))
    assert len(ports)==len(bits)==len(timers)
    defines={key:int(value) for key,value in re.findall(r'#define\s+(PIN_\w+|NUM_DIGITAL_PINS|NUM_ANALOG_INPUTS)\s+\(?(\d+)\)?',text)}
    assert len(ports)==defines['NUM_DIGITAL_PINS']
    return [port+bit for port,bit in zip(ports,bits)],timers,defines

def build_arduino(cache,docs,observations,ref,verified_on):
    boards=[]
    models=[('uno-r3','Arduino UNO R3','A000066','standard','ATmega328P',38,20),
            ('nano-classic','Arduino Nano (classic)','A000005','standard','ATmega328P',36,20),
            ('mega-2560','Arduino Mega 2560 Rev3','A000067','mega','ATmega2560',92,70)]
    for model,title,sku,variant,mcu,total,unique in models:
        id='arduino-'+model;docid=id+'-pinout';obs=observations[id]
        coreid='arduino-avr-'+variant
        ports,timers,defines=core_tables((cache/docs[coreid]['file']).read_text())
        core=ref(id+'-core',coreid,None,'pins_arduino.h · digital port/bit arrays, analog aliases, PWM timer array and SPI/Wire pin constants','source-code')
        physical=ref(id+'-headers',docid,1,'Main headers · USB at top · connector order visually checked','visual-diagram')
        icsp=ref(id+'-icsp',docid,obs['icspPage'],'Main MCU ICSP · six numbered contacts, top-view orientation; USB bridge programming header excluded','visual-diagram')
        advanced_page=3 if model=='uno-r3' else 2
        advanced=ref(id+'-signals',docid,advanced_page,'Arduino pin labels, USART lines, external INT numbers and MCU ports; use AVR core for supported PWM pins','pdf-text')
        with pdfplumber.open(cache/docs[docid]['file']) as pdf:
            pinout=pdf.pages[0].extract_text()
            signal_text=pdf.pages[advanced_page-1].extract_text()
            icsp_text=pdf.pages[obs['icspPage']-1].extract_text()
        assert all(token in icsp_text for token in ['ICSP','CIPO','COPI','RESET'])
        uart={}
        for number,direction,bus,port in re.findall(r'~?D(\d+)/(RX|TX)(\d*)\s+(P[A-L]\d)',pinout):
            n=int(number);assert ports[n]==port
            uart[n]=('UART'+(bus or '0')+' '+direction,direction+'D'+bus)
        assert len(uart)==(8 if variant=='mega' else 2)
        interrupts={}
        for line in signal_text.splitlines():
            match=re.search(r'~?D(\d+)(?:/[^\s]+)?\s+P[A-L]\d.*?\bINT\[(\d+)\]',line)
            if match:interrupts[int(match[1])]=int(match[2])
        assert set(interrupts)==({2,3,18,19,20,21} if variant=='mega' else {2,3})
        analog_count=defines['NUM_ANALOG_INPUTS']
        nano_source=None
        if model=='nano-classic':
            nano_text=(cache/docs['arduino-avr-nano']['file']).read_text()
            assert '#include "../standard/pins_arduino.h"' in nano_text
            analog_count=int(re.search(r'#define NUM_ANALOG_INPUTS\s+(\d+)',nano_text)[1])
            nano_source=ref(id+'-analog','arduino-avr-nano',None,'eightanaloginputs inherits the 20-entry standard digital map and exposes eight ADC channels; A6/A7 have no digital port entries','source-code')
        pins=[]
        def add(name,connector,contact,position,evidence):
            name={'+3V3':'3V3','+5V':'5V','Reset':'RESET'}.get(name,name)
            pin={'number':len(pins)+1,'physicalLabel':f'{connector}.{contact}','connector':connector,'connectorPin':contact,'name':name,'functions':[],'evidence':list(evidence),'position':position}
            digital=None;analog=None
            if re.fullmatch(r'D\d+',name):digital=int(name[1:])
            elif re.fullmatch(r'A\d+',name):
                analog=int(name[1:]);assert analog<analog_count
                candidate=defines['PIN_A'+str(analog)]
                if candidate<len(ports):digital=candidate
            elif name in ('SDA','SCL'):digital=defines['PIN_WIRE_'+name]
            elif name in ('CIPO','COPI','SCK'):
                digital=defines['PIN_SPI_'+{'CIPO':'MISO','COPI':'MOSI','SCK':'SCK'}[name]]
            pin['type']='GPIO' if digital is not None else 'ADC' if analog is not None else 'GND' if name=='GND' else 'POWER' if name in ('3V3','5V','VIN','IOREF') else 'SYSTEM'
            pin['net']=ports[digital] if digital is not None else name
            def function(label,group,signal,evidence):pin['functions'].append({'name':label,'group':group,'signal':signal,'evidence':evidence})
            if digital is not None:
                pin['arduinoPin']=digital;pin['mcuPort']=ports[digital];pin['evidence'].append(core)
                for key,label,signal,group in [('PIN_SPI_SS','SPI SS','SS','SPI'),('PIN_SPI_MOSI','SPI COPI / MOSI','MOSI','SPI'),('PIN_SPI_MISO','SPI CIPO / MISO','MISO','SPI'),('PIN_SPI_SCK','SPI SCK','SCK','SPI'),('PIN_WIRE_SDA','I2C SDA','SDA','I2C'),('PIN_WIRE_SCL','I2C SCL','SCL','I2C')]:
                    if digital==defines[key]:function(label,group,signal,core)
                if digital in uart:function(uart[digital][0],'UART',uart[digital][1],advanced)
                if timers[digital]!='NOT_ON_TIMER':
                    signal=timers[digital].replace('TIMER','OC');function('PWM '+signal,'PWM',signal,core)
                if digital in interrupts:function('INT'+str(interrupts[digital]),'IRQ','INT'+str(interrupts[digital]),advanced)
                # Duplicated SDA/SCL contacts and ICSP pins retain every capability of the same net.
                for channel in range(analog_count):
                    if defines['PIN_A'+str(channel)]==digital:analog=channel
            if analog is not None:function('ADC'+str(analog),'ADC','ADC'+str(analog),nano_source or core)
            pin['noteKey']='arduinoGpioNote'
            if pin['type']=='ADC':pin['noteKey']='arduinoAnalogOnlyNote';pin['evidence'].append(nano_source)
            elif name=='NC':pin['noteKey']='arduinoNcNote';pin['reserved']=True
            elif name=='AREF':pin['noteKey']='arduinoArefNote'
            elif name=='IOREF':pin['noteKey']='arduinoIorefNote'
            elif name=='VIN':pin['noteKey']='arduinoVinNote'
            elif name=='RESET':pin['noteKey']='arduinoResetNote'
            elif digital in (0,1):pin['noteKey']='arduinoSerialNote'
            elif digital==13:pin['noteKey']='arduinoLedNote'
            elif pin['type'] in ('POWER','GND'):pin.pop('noteKey')
            pins.append(pin)
        if model=='nano-classic':
            for side in ('left','right'):
                for index,name in enumerate(obs[side],1):
                    add(name,'L' if side=='left' else 'R',index,{'x':280 if side=='left' else 540,'y':110+(index-1)*28,'side':side},[physical])
            center=410;icsp_y=600
        else:
            dsid=id+'-datasheet'
            with pdfplumber.open(cache/docs[dsid]['file']) as pdf:
                tables=pdf.pages[9].extract_tables()
                analog_rows=tables[0][1:];digital_rows=tables[1][1:]
                if variant=='mega':digital_rows+=pdf.pages[10].extract_tables()[0][1:]
                end_rows=[pdf.pages[11].extract_tables()[2][1:],pdf.pages[12].extract_tables()[0][1:]] if variant=='mega' else []
            table_ref=ref(id+'-connector-tables',dsid,10,'§5 · Connector Pinouts · numbering cross-checked against the full pinout; duplicate SDA/SCL and D0 label typos resolved using the diagram','pdf-table')
            def normalize(value):
                if value in ('SS','MOSI','MISO','SCK') and variant=='standard':return 'D'+str(defines['PIN_SPI_'+value])
                return re.match(r'[AD]\d+',value)[0] if re.match(r'[AD]\d+',value) else value
            for row in analog_rows:
                n=int(row[0]);name=normalize(row[1]);connector='PWR' if n<=8 else 'ANALOG';contact=n if n<=8 else n-8
                y=(220+(n-1)*26) if n<=8 else (480+(n-9)*26) if variant=='standard' else (450+(n-9)*26+(24 if n>=17 else 0))
                add(name,connector,contact,{'x':300,'y':y,'side':'left'},[physical,table_ref])
            for row in digital_rows:
                n=int(row[0]);name=normalize(row[1])
                if variant=='standard' and n in (17,18):name='SDA' if n==17 else 'SCL'
                if variant=='mega' and n in (1,2):name='SCL' if n==1 else 'SDA'
                if variant=='standard':y=150+(18-n)*26+(20 if n<=8 else 0)
                else:y=120+(n-1)*26+(20 if n>=11 else 0)+(20 if n>=19 else 0)
                add(name,'DIGITAL',n,{'x':600 if variant=='standard' else 900,'y':y,'side':'right'},[physical,table_ref])
            if variant=='mega':
                end_ref=ref(id+'-end-header',docid,3,'D22–D53 end header · near-USB row and outer row, oriented with USB at top','visual-diagram')
                for side,rows in enumerate(end_rows):
                    assert [r[1].replace('+','') for r in rows]==obs['endColumns'][side]
                    for index,row in enumerate(rows):
                        # The separate source figure is rotated 90° counterclockwise.
                        contact=index*2+side+1
                        add(row[1],'END',contact,{'x':328+(17-index)*32,'y':1035+side*60,'side':'right','compact':True,'padWidth':30},[end_ref])
            center=450 if variant=='standard' else 600;icsp_y=710 if variant=='standard' else 875
        for row,numbers in enumerate(obs['icspRows']):
            for col,number in enumerate(numbers):
                add(obs['icsp'][number-1],'ICSP',number,{'x':center+(col-1)*68,'y':icsp_y+row*60,'side':'right','compact':True,'padWidth':62},[icsp])
        for pin in pins:
            shared=[other['physicalLabel'] for other in pins if other['number']!=pin['number'] and other['net']==pin['net']]
            if shared and pin['type'] in ('GPIO','ADC','SYSTEM') and pin['name']!='NC':pin['sharedWith']=shared
        assert len(pins)==total
        assert len({p['net'] for p in pins if p['type']=='GPIO'})==unique
        board={'id':id,'name':title,'shortName':title.replace('Arduino ',''),'family':'Arduino AVR','subtitle':mcu+' · 16 MHz · 5 V I/O','layout':'custom','diagram':{'width':820 if model=='nano-classic' else 900 if variant=='standard' else 1200,'height':780 if model=='nano-classic' else 860 if variant=='standard' else 1160,'artwork':'assets/boards/'+id+'.svg'},'orientation':'usb','packagePins':total,'gpioCount':sum(p['type']=='GPIO' for p in pins),'uniqueGPIOCount':unique,'voltage':'5 V I/O','mcu':mcu,'processor':'8-bit AVR','clock':'16 MHz','compatibleKey':id+'Compatible','scopeKey':id+'Scope','verifiedOn':verified_on,'source':docs[docid]['url'],'datasheet':docs.get(id+'-datasheet',docs[docid])['url'],'pins':pins}
        if variant=='mega':board['diagram']['minWidth']=1000
        boards.append(board)
    return boards
