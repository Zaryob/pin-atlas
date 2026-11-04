"""Additional Arduino references sharing verified headers, with per-MCU functions."""
import copy,re
import pdfplumber
from arduino_sources import core_tables

def array(text,name):
    text=re.sub(r'/\*.*?\*/|//[^\n]*','',text,flags=re.S)
    return re.search(name+r'\[\]\s*=\s*\{(.*?)\};',text,re.S)[1]

def finish(board,pins):
    for n,pin in enumerate(pins,1):
        pin['number']=n
        same=[p['physicalLabel'] for p in pins if p is not pin and p['net']==pin['net']]
        if same and pin['type'] in ('GPIO','ADC','SYSTEM') and pin['name']!='NC':pin['sharedWith']=same
        else:pin.pop('sharedWith',None)
    board['pins']=pins;board['packagePins']=len(pins)
    board['gpioCount']=sum(p['type']=='GPIO' for p in pins)
    board['uniqueGPIOCount']=len({p['net'] for p in pins if p['type']=='GPIO'})
    return board

def build_expanded_arduino(cache,docs,obs,ref,verified_on,base_boards):
    base={b['id']:b for b in base_boards};out=[]
    for model in ['leonardo','micro','nano-every','nano-33-ble-sense-rev2','uno-r4-minima','uno-r4-wifi']:
        id='arduino-'+model;docid=id+'-pinout'
        source=ref(id+'-headers',docid,1,'Main headers · USB at top · recorded connector positions, signal labels and optional SPI/ICSP connector','visual-diagram')
        with pdfplumber.open(cache/docs[docid]['file']) as pdf:
            texts=[p.extract_text() or '' for p in pdf.pages]
        is32=model in ('leonardo','micro');r4=model.startswith('uno-r4');is_ble=model=='nano-33-ble-sense-rev2'
        coreid='arduino-avr-leonardo' if is32 else id+'-variant' if is_ble else id+'-core'
        coretext=(cache/docs[coreid]['file']).read_text()
        core=ref(id+'-core',coreid,None,'Official core · Arduino pin aliases, MCU port map, analog channels, SPI/Wire and supported PWM outputs','source-code')
        advanced=ref(id+'-signals',docid,2 if is32 or model=='nano-every' else 4,'MCU signals and peripheral capabilities; Arduino PWM support comes from the matching core','pdf-text')
        defines={key:int(value) for key,value in re.findall(r'#define\s+(\w+)\s+\(?\s*(\d+)u?\)?',coretext)}
        analogs={};timers={};irq={}
        if is32:
            ports,ts,defines=core_tables(coretext)
            timers={n:'OC'+v[5:] for n,v in enumerate(ts) if v!='NOT_ON_TIMER'}
            channels=[int(n) for n in re.findall(r'\d+',array(coretext,'analog_pin_to_channel_PGM'))]
            for a,ch in enumerate(channels):analogs[ports[defines['PIN_A'+str(a)]]]=('ADC'+str(ch),core)
            for line in texts[1].splitlines():
                m=re.search(r'~?D(\d+)(?:/\S+)?(?: A\d+)?\s+(P[A-F]\d).*?\bINT\[(\d+)\]',line)
                if m:irq[ports[int(m[1])]]=('INT'+m[3],advanced)
            assert set(irq)=={'PD0','PD1','PD2','PD3','PE6'}
            if model=='micro':
                assert '#include "../leonardo/pins_arduino.h"' in (cache/docs[id+'-core']['file']).read_text()
        elif is_ble:
            core=ref(id+'-variant',coreid,None,'PinDescription g_APinDescription · nRF52840 port map and sensor interfaces','source-code')
            desc=re.search(r'PinDescription g_APinDescription\[\]\s*=\s*\{(.*?)\};',coretext,re.S)[1]
            ports=[f'P{m[0]}.{int(m[1]):02d}' for m in re.findall(r'P(\d)_(\d+)',desc)]
            defines={'PIN_A0':14,'PIN_A1':15,'PIN_A2':16,'PIN_A3':17,'PIN_A4':18,'PIN_A5':19,'PIN_A6':20,'PIN_A7':21,'PIN_SPI_SS':10,'PIN_SPI_MOSI':11,'PIN_SPI_MISO':12,'PIN_SPI_SCK':13,'PIN_WIRE_SDA':18,'PIN_WIRE_SCL':19}
            timers={n:'PWM' for n in range(14)}
            saadc={'P0.02':'AIN0','P0.03':'AIN1','P0.04':'AIN2','P0.05':'AIN3','P0.28':'AIN4','P0.29':'AIN5','P0.30':'AIN6','P0.31':'AIN7'}
            for p,ain in saadc.items():analogs[p]=(ain,source)
        elif r4:
            variantid=id+'-variant';variant=(cache/docs[variantid]['file']).read_text()
            core=ref(id+'-variant',variantid,None,'g_pin_cfg · RA4M1 port map; initVariant · six Arduino PWM channels','source-code')
            ports=[f'P{int(port)}{int(bit):02d}' for port,bit in re.findall(r'\{ BSP_IO_PORT_(\d+)_PIN_(\d+),',variant)]
            assert len(ports)>=20
            pwm=[int(n) for n in re.findall(r'getPinCfgs\((\d+), PIN_CFG_REQ_PWM',variant)]
            assert set(pwm)=={3,5,6,9,10,11};timers={n:'PWM' for n in pwm}
            for line in texts[0].splitlines():
                for m in re.finditer(r'\b(AN\d{3})\b.*?\b(P\d{3})\s+A(\d+)\s+D(\d+)',line):
                    assert ports[int(m[4])]==m[2];analogs[m[2]]=(m[1],source)
            assert len(analogs)==6
            defines.update(PIN_SPI_SS=defines['PIN_SPI_CS'],PIN_WIRE_SDA=defines['WIRE_SDA_PIN'],PIN_WIRE_SCL=defines['WIRE_SCL_PIN'])
        else:
            ps=re.findall(r'P[A-F]',array(coretext,'digital_pin_to_port'))
            bits=re.findall(r'PIN(\d)_bp',array(coretext,'digital_pin_to_bit_position'))
            ports=[p+b for p,b in zip(ps,bits)];assert len(ports)==26
            pwm=re.search(r'#define digitalPinHasPWM\(p\)\s+([^\n]+)',coretext)[1]
            timers={int(n):'PWM' for n in re.findall(r'==\s*(\d+)',pwm)}
            channels=[int(n) for n in re.findall(r'\d+',array(coretext,'analog_pin_to_channel'))]
            assert channels==[3,2,1,0,12,13,4,5]
            analogs={ports[14+a]:('ADC'+str(ch),core) for a,ch in enumerate(channels)}
        template=base['arduino-nano-classic' if model in ('nano-every','micro','nano-33-ble-sense-rev2') else 'arduino-uno-r3']
        board=copy.deepcopy(template)
        if model=='micro':
            pins=[]
            for side in ('left','right'):
                for i,name in enumerate(obs[id][side],1):
                    pins.append({'name':name,'connector':'L' if side=='left' else 'R','connectorPin':i,'physicalLabel':f'{"L" if side=="left" else "R"}.{i}','position':{'x':280 if side=='left' else 540,'y':110+(i-1)*28,'side':side}})
            for row in range(3):
                for col in range(2):
                    n=row*2+col+1;pins.append({'name':['CIPO','5V','SCK','COPI','RESET','GND'][n-1],'connector':'ICSP','connectorPin':n,'physicalLabel':'ICSP.'+str(n),'position':{'x':376+col*68,'y':660+row*60,'side':'right','compact':True,'padWidth':62}})
            board['diagram']['height']=860
        else:pins=copy.deepcopy([p for p in template['pins'] if model not in ('nano-every','nano-33-ble-sense-rev2') or p['connector'] in ('L','R')])
        for pin in pins:
            for key in ('functions','evidence','arduinoPin','mcuPort','noteKey','sharedWith','reserved','baseFunction'):pin.pop(key,None)
            name=pin['name'];digital=None
            if r4 and pin['physicalLabel']=='PWR.1':name=pin['name']='BOOT'
            if is_ble and pin['physicalLabel']=='R.14':name=pin['name']='D1'
            if is_ble and pin['physicalLabel']=='R.15':name=pin['name']='D0'
            if re.fullmatch(r'D\d+',name):digital=int(name[1:])
            elif re.fullmatch(r'A\d+',name):digital=defines['PIN_A'+name[1:]]
            elif name in ('SDA','SCL'):digital=defines['PIN_WIRE_'+name]
            elif name in ('CIPO','COPI','SCK','SS'):
                digital=defines['PIN_SPI_'+{'CIPO':'MISO','COPI':'MOSI','SCK':'SCK','SS':'SS'}[name]]
            pin['type']='GPIO' if digital is not None else 'GND' if name=='GND' else 'POWER' if name in ('3V3','5V','VIN','IOREF') else 'SYSTEM'
            pin['evidence']=[source];pin['functions']=[];pin['net']=ports[digital] if digital is not None else name
            def function(label,group,signal,evidence):
                pin['functions'].append({'name':label,'group':group,'signal':signal,'evidence':evidence})
            if digital is not None:
                port=ports[digital];pin['arduinoPin']=digital;pin['mcuPort']=port;pin['evidence'].append(core)
                for key,label,signal,group in [('PIN_SPI_SS','SPI SS','SS','SPI'),('PIN_SPI_MOSI','SPI COPI / MOSI','MOSI','SPI'),('PIN_SPI_MISO','SPI CIPO / MISO','MISO','SPI'),('PIN_SPI_SCK','SPI SCK','SCK','SPI'),('PIN_WIRE_SDA','I2C SDA','SDA','I2C'),('PIN_WIRE_SCL','I2C SCL','SCL','I2C')]:
                    match=ports[defines[key]]==port
                    if model=='nano-every' and key in ('PIN_WIRE_SDA','PIN_WIRE_SCL'):match=digital==(18 if key.endswith('SDA') else 19)
                    if match:function(label,group,signal,core)
                if digital in (0,1):
                    is_rx=(digital==1 if is_ble else digital==0)
                    function('Serial1 '+('RX' if is_rx else 'TX'),'UART',('SCI_RXD2' if digital==0 else 'SCI_TXD2') if r4 else ('RX' if is_rx else 'TX'),core)
                if digital in timers:function('PWM' if timers[digital]=='PWM' else 'PWM '+timers[digital],'PWM',timers[digital],core)
                if port in analogs:
                    signal,ev=analogs[port];function(signal,'ADC',signal,ev)
                if port in irq:function(irq[port][0],'IRQ',irq[port][0],irq[port][1])
                if model=='nano-every' or is_ble:function('GPIO interrupt','IRQ',port,core)
                if r4:
                    if digital==14:
                        assert 'DA0' in texts[0] or '#define DAC         A0' in coretext;function('DAC0','DAC','DA0',source)
                    for direction in ('TX','RX'):
                        if digital==defines['PIN_CAN0_'+direction]:function('CAN0 '+direction,'CAN','CTX0' if direction=='TX' else 'CRX0',advanced)
                pin['noteKey']='arduinoBleGpioNote' if is_ble else 'arduinoR4GpioNote' if r4 else 'arduino32u4GpioNote' if is32 else 'arduinoGpioNote'
                if digital in (0,1) and not is_ble:pin['noteKey']='arduinoNativeSerialNote' if is32 else 'arduinoR4SerialNote' if r4 else 'arduinoEverySerialNote'
                if model=='nano-every' and digital in (18,19):
                    pin['mcuPort']+=' / '+ports[defines['PIN_WIRE_SDA' if digital==18 else 'PIN_WIRE_SCL']];pin['noteKey']='arduinoEveryTwiNote'
            elif name=='NC':pin['reserved']=True;pin['noteKey']='arduinoNcNote'
            elif name=='BOOT':pin['noteKey']='arduinoBootNote'
            elif name=='AREF':pin['noteKey']='arduinoArefNote'
            elif name=='VIN':pin['noteKey']='arduinoVinNote'
            elif name=='5V' and is_ble:pin['noteKey']='arduinoBle5VNote'
            elif name=='RESET':pin['noteKey']='arduinoResetNote'
            elif name=='IOREF':pin['noteKey']='arduinoIorefNote'
        mcu='nRF52840' if is_ble else 'ATmega32U4' if is32 else 'Renesas RA4M1' if r4 else 'ATmega4809'
        name={'leonardo':'Arduino Leonardo','micro':'Arduino Micro','nano-every':'Arduino Nano Every','nano-33-ble-sense-rev2':'Arduino Nano 33 BLE Sense Rev2','uno-r4-minima':'Arduino UNO R4 Minima','uno-r4-wifi':'Arduino UNO R4 WiFi'}[model]
        clock='64 MHz' if is_ble else '48 MHz' if r4 else '20 MHz' if model=='nano-every' else '16 MHz'
        voltage='3.3 V I/O' if is_ble else '5 V I/O'
        processor='Arm Cortex-M4F' if is_ble else 'Arm Cortex-M4' if r4 else '8-bit AVR'
        board.update(id=id,name=name,shortName=name.replace('Arduino ',''),mcu=mcu,processor=processor,clock=clock,family='Arduino',subtitle=mcu+' · '+clock+' · '+voltage+(' · BLE + Sensors' if is_ble else ''),scopeKey=id+'Scope',compatibleKey=id+'Compatible',source=docs[docid]['url'],datasheet=docs.get(id+'-datasheet',docs[docid])['url'])
        board['diagram']['artwork']='assets/boards/'+id+'.svg'
        result=finish(board,pins)
        assert result['uniqueGPIOCount']==(22 if is_ble else 23 if model=='leonardo' else 24 if model=='micro' else 22 if model=='nano-every' else 20)
        out.append(result)
    return out
