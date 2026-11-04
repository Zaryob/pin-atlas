"""Espressif reference-board headers from pinned official user-guide tables."""
import copy,re
import pdfplumber

def rst_headers(text):
    result={}
    sections=re.split(r'(?m)^J([123])\n[\^~-]+\n',text)
    for i in range(1,len(sections),2):
        connector='J'+sections[i];body=sections[i+1];rows=[];row=None
        if re.search(r'^\s*\* - \d+\s*$',body,re.M):
            for line in body.splitlines():
                m=re.match(r'\s*\* - (\d+)\s*$',line)
                if m:
                    if row:assert len(row)==4;rows.append(row)
                    row=[m[1]]
                elif row is not None and len(row)<4:
                    m=re.match(r'\s+- (.*)',line)
                    if m:row.append(m[1])
            if row:assert len(row)==4;rows.append(row)
        else:
            for line in body.splitlines():
                m=re.match(r'\s*(\d+)\s+(\S+)\s+(I/O/T|I/O|I|P|G)\s+(.+)',line)
                if m:rows.append(list(m.groups()))
        if rows:result[connector]=rows
    return result

def build_espressif(cache,docs,obs,ref,verified_on):
    boards=[]
    models=[('esp32-devkitc-v4','ESP32-DevKitC V4','esp32',19,'J2','ESP32-WROOM-32E'),
            ('esp32-c3-devkitm-1','ESP32-C3-DevKitM-1','esp32c3',15,'J1','ESP32-C3-MINI-1'),
            ('esp32-s3-devkitc-1','ESP32-S3-DevKitC-1 v1.1','esp32s3',22,'J1','ESP32-S3-WROOM-1-N8')]
    for id,name,chip,count,left,module in models:
        docid=chip+'-devkit-guide';text=(cache/docs[docid]['file']).read_text();headers=rst_headers(text)
        assert set(headers)=={left,'J3'}
        physical=ref(id+'-header',docid,None,'Header Block · '+left+'/J3 numbered rows and module-specific restrictions','source-table')
        orientation=ref(id+'-orientation',chip+'-devkit-photo',None,'Official front/pin-layout image · USB at bottom, antenna at top; header numbers start at antenna end','visual-diagram')
        ds=chip+'-datasheet'
        matrix_page={'esp32':16,'esp32c3':19,'esp32s3':20}[chip]
        matrix=ref(id+'-matrix',ds,matrix_page,'I/O pins / IO MUX and GPIO Matrix · routable peripheral capabilities, not a default firmware pin assignment','pdf-text')
        boot_page={'esp32':22,'esp32c3':30,'esp32s3':32}[chip]
        boot=ref(id+'-strapping',ds,boot_page,'Boot configurations · strapping levels are sampled during reset')
        with pdfplumber.open(cache/docs[ds]['file']) as pdf:
            boot_text=pdf.pages[boot_page-1].extract_text() or ''
            pin_text='\n'.join(p.extract_text() or '' for p in pdf.pages[11:27])
        assert 'GPIO' in boot_text and 'Matrix' in pin_text
        straps={'esp32':{0,2,5,12,15},'esp32c3':{2,8,9},'esp32s3':{0,3,45,46}}[chip]
        pins=[]
        for connector in (left,'J3'):
            rows=headers[connector];assert [int(row[0]) for row in rows]==list(range(1,count+1))
            for number,label,kind,functions in rows:
                gpio=re.search(r'\bGPIO(\d+)\b',functions);gp=int(gpio[1]) if gpio else None
                name='GPIO'+str(gp) if gp is not None else 'GND' if kind=='G' else label
                pin={'number':len(pins)+1,'physicalLabel':f'{connector}.{number}','connector':connector,'connectorPin':int(number),'name':name,'boardLabel':label,'type':'GPIO' if gpio else 'GND' if kind=='G' else 'POWER' if kind=='P' else 'SYSTEM','functions':[],'evidence':[physical,orientation],'net':name,'position':{'x':280 if connector==left else 540,'y':115+(int(number)-1)*26,'side':'left' if connector==left else 'right'}}
                if gp is not None:
                    pin['inputOnly']=kind=='I';pin['noteKey']='espInputOnlyNote' if pin['inputOnly'] else 'espGpioNote'
                    if pin['inputOnly']:pin['baseFunction']='GPIO input'
                    def function(label,group,signal,evidence,selector=None):
                        f={'name':label,'group':group,'signal':signal,'evidence':evidence}
                        if selector:f['selector']=selector
                        pin['functions'].append(f)
                    for token in functions.split(','):
                        token=re.sub(r'\s*\[\d+\]_?','',token).strip()
                        group='ADC' if token.startswith('ADC') else 'DAC' if token.startswith('DAC') else 'TOUCH' if token.startswith('TOUCH') else 'UART' if re.fullmatch(r'U\d(?:TXD|RXD|RTS|CTS)',token) else 'SPI' if re.match(r'(?:F|SUB)?SPI',token) else 'USB' if token.startswith('USB_') else 'JTAG' if token in ('MTMS','MTDI','MTCK','MTDO') else 'CLOCK' if token.startswith(('CLK_OUT','XTAL_')) else None
                        if group:function(token,group,token,physical)
                    # These are routing choices. Input-only classic ESP32 pads
                    # cannot drive a clock, PWM, UART TX, SPI MOSI or I2C.
                    routes=[('UART1 RX','UART'),('SPI2 MISO','SPI')]
                    if not pin['inputOnly']:
                        routes += [('UART1 TX','UART'),('SPI2 MOSI','SPI'),('SPI2 SCK','SPI'),('SPI2 CS','SPI'),('I2C0 SDA','I2C'),('I2C0 SCL','I2C'),('LEDC PWM','PWM')]
                    for signal,group in routes:function(signal+' (matrix)',group,signal,matrix,'GPIO matrix')
                    function('GPIO interrupt','IRQ',name,matrix)
                    if gp in straps:pin['strapping']=True;pin['evidence'].append(boot)
                    if chip=='esp32' and gp in range(6,12):
                        pin['reserved']=True;pin['reservedLabel']='unavailable';pin['noteKey']='espFlashNote';pin['functions']=[]
                    if chip=='esp32c3' and gp==8 or chip=='esp32s3' and gp==38:pin['boardCircuitKey']='espRgbLedNote'
                    if any(f['group']=='USB' for f in pin['functions']):pin['boardCircuitKey']='espUsbNote'
                    if any(f['signal'].startswith('ADC2') for f in pin['functions']):pin['analogCautionKey']='espAdc2Note'
                    if gp in ({1,3} if chip=='esp32' else {20,21} if chip=='esp32c3' else {43,44}):pin['boardCircuitKey']='espUartBridgeNote'
                elif pin['type']=='SYSTEM':pin['noteKey']='espEnableNote'
                pins.append(pin)
        for pin in pins:
            same=[p['physicalLabel'] for p in pins if p is not pin and p['net']==pin['net']]
            if same and pin['type']=='GPIO':pin['sharedWith']=same
        gpio_count=sum(p['type']=='GPIO' for p in pins)
        board={'id':id,'name':name,'shortName':name,'family':'Espressif','subtitle':module+' · 3.3 V I/O','layout':'custom','diagram':{'width':820,'height':180+(count-1)*26+100,'artwork':'assets/boards/'+id+'.svg'},'orientation':'usb-bottom','packagePins':len(pins),'gpioCount':gpio_count,'mcu':{'esp32':'ESP32','esp32c3':'ESP32-C3','esp32s3':'ESP32-S3'}[chip],'processor':'RISC-V' if chip=='esp32c3' else 'Xtensa','clock':'160 MHz' if chip=='esp32c3' else '240 MHz','voltage':'3.3 V I/O','scopeKey':id+'Scope','compatibleKey':id+'Compatible','source':docs[docid]['viewUrl'],'datasheet':docs[ds]['url'],'verifiedOn':verified_on,'pins':pins}
        if any(p.get('reserved') for p in pins):board['reservedGPIOCount']=sum(p.get('reserved',False) for p in pins)
        boards.append(board)
        if chip in ('esp32','esp32s3'):
            variant=copy.deepcopy(board);variant['id']=id+('-wrover' if chip=='esp32' else '-octal');variant['name']=name+(' · WROVER' if chip=='esp32' else ' · Octal memory');variant['subtitle']='ESP32-WROVER' if chip=='esp32' else 'ESP32-S3-WROOM-1-N8R8 · Octal PSRAM'
            variant['scopeKey']=variant['id']+'Scope'
            restricted={16,17} if chip=='esp32' else {35,36,37}
            assert ('GPIO16 and GPIO17' in text) if chip=='esp32' else ('GPIO35, GPIO36 and GPIO37' in text)
            for pin in variant['pins']:
                if pin['name'] in {'GPIO'+str(n) for n in restricted}:
                    pin.update(reserved=True,reservedLabel='unavailable',noteKey='espMemoryNote',functions=[])
            variant['reservedGPIOCount']=sum(p.get('reserved',False) for p in variant['pins'])
            boards.append(variant)
    return boards
