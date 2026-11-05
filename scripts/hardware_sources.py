"""Derive user-declared hardware constraints from verified board/pin evidence.

Unknown is deliberate: the application cannot inspect a user's solder bridges,
debug wiring or fitted components. No documented default is claimed as observed.
"""
import re

VALUE_KEYS={'unknown':'hwUnknown','on':'hwOn','off':'hwOff','active':'hwInUse','released':'hwReleased',
            'swd':'hwSwd','swd-trace':'hwSwdTrace','jtag':'hwJtag','fitted':'hwFitted','absent':'hwAbsent',
            'analog':'hwAnalog','i2c':'hwI2c'}

def attach_hardware(boards,ref,cache,docs):
    for board in boards:
        if not board['mcu'].startswith('STM32'):
            continue
        pins=board['pins'];controls=[]
        def control(id,label,help_key,values,effects,evidence):
            assert evidence,(board['id'],id)
            controls.append({'id':id,'labelKey':label,'helpKey':help_key,'default':'unknown',
                             'options':[{'value':v,'key':VALUE_KEYS[v]} for v in values],
                             'effects':effects,'evidence':list(dict.fromkeys(evidence))})
        def evidence_for(items):return [r for p in items for r in p['evidence']]
        def block(items,states,scope='net'):
            return {'when':states,'block':[p['number'] for p in items],'scope':scope}
        if board.get('layoutFamily')=='nucleo-32':
            evidence=ref('hw-nucleo32-bridges','nucleo-um1956-r6',21,'Tables 7/8, continued p.22 · SB2, SB15, SB16 and SB18 states')
            physical={p['physicalLabel']:p for p in pins}
            for id,sink,via in [('SB16','CN4.7','CN3.8'),('SB18','CN4.8','CN3.7')]:
                target,source=physical[sink],physical[via]
                control(id,'hw'+id,'hw'+id+'Help',['unknown','off','on'],[
                    block([target,source],['unknown'],'contact'),
                    {'when':['on'],'block':[source['number']],'scope':'contact',
                     'routes':[{'pin':target['number'],'via':source['number'],'floating':[target['name']]}]}
                ],[evidence])
            control('SB2','hwSB2','hwSB2Help',['unknown','on','off'],[block([physical['CN4.5']],['unknown','on'])],[evidence])
            control('SB15','hwSB15','hwSB15Help',['unknown','on','off'],[block([physical['CN4.15']],['unknown','on'])],[evidence])
        if board['id'] in ('nucleo-h723zg','nucleo-h743zi2'):
            evidence=ref('hw-mb1364-bridges','nucleo-um2407-r6',32,'Table 14, continued pp.33/34 · SDMMC contacts and A4/A5 analog/I2C routing')
            physical={p['physicalLabel']:p for p in pins}
            sinks=[physical['CN9.9'],physical['CN9.11']]
            control('analogHeader','hwAnalogHeader','hwAnalogHeaderHelp',['unknown','analog','i2c'],[
                block(sinks,['unknown'],'contact'),
                {'when':['i2c'],'routes':[{'pin':physical[sink]['number'],'via':physical[via]['number'],'floating':[]}
                                         for sink,via in [('CN9.9','CN12.5'),('CN9.11','CN12.3')]]}
            ],[evidence])
            for id,label in [('SB14','CN12.2'),('SB15','CN12.1')]:
                control(id,'hw'+id+'Morpho','hwMorphoHelp',['unknown','off','on'],
                        [block([physical[label]],['unknown','off'],'contact')],[evidence])
        if board.get('layoutFamily')=='black-pill':
            items=[p for p in pins if p.get('boardCircuitKey')=='blackPillFlash']
            control('flash','hwFlash','hwFlashHelp',['unknown','fitted','absent'],[block(items,['unknown','fitted'])],evidence_for(items))
        # These keys are already backed by the selected board's circuit sources.
        for id,label,help_key,keys in [
            ('usb','hwUsb','hwUsbHelp',{'blackPillUsb','nucleoH7Usb'}),
            ('ethernet','hwEthernet','hwEthernetHelp',{'nucleoH7Rmii'}),
            ('vcp','hwVcp','hwVcpHelp',{'nucleoUsart','nucleoH7VcpTx','nucleoH7VcpRx'})
        ]:
            items=[p for p in pins if p.get('boardCircuitKey') in keys]
            if items:control(id,label,help_key,['unknown','active','released'],[block(items,['unknown','active'])],evidence_for(items))
        ioc_id=board['id'].replace('nucleo-h743zi2','nucleo-h743zi')+'-ioc'
        if ioc_id in docs and not any(c['id']=='vcp' for c in controls):
            configuration=dict(line.split('=',1) for line in (cache/docs[ioc_id]['file']).read_text().splitlines() if '=' in line)
            ports={key.split('.')[0] for key,value in configuration.items() if key.endswith('.GPIO_Label') and re.search(r'STLK|STLINK',value)}
            items=[p for p in pins if p['name'] in ports and configuration.get(p['name']+'.Signal','').startswith(('USART','UART'))]
            if items:
                evidence=ref('hw-'+board['id']+'-vcp',ioc_id,None,'GPIO_Label STLK/STLINK virtual serial nets and USART signals','hardware-spec')
                control('vcp','hwVcp','hwVcpHelp',['unknown','active','released'],[block(items,['unknown','active'])],[evidence])
        swd=[];jtag=[];trace=[];hse=[];lse=[]
        for pin in pins:
            text=' '.join([pin['name'],pin.get('noteKey',''),pin.get('boardCircuitKey',''),*(f['name'] for f in pin['functions'])]).upper()
            if re.search(r'SWDIO|SWCLK|STM32SWDNOTE',text):swd.append(pin)
            if re.search(r'JTMS|JTCK|JTDI|JTDO|JTRST|STM32JTAGNOTE',text):jtag.append(pin)
            if 'SWO' in text:trace.append(pin)
            if 'OSC32' in text or 'NUCLEOLSE' in text:lse.append(pin)
            elif re.search(r'OSC_IN|OSC_OUT|NUCLEO(?:F4)?HSE',text):hse.append(pin)
        # A board exposing only a trace-capable pin does not imply attached SWD.
        if len({p.get('mcuPin',p['number']) for p in swd})>=2:
            unique={p['number']:p for p in [*swd,*jtag,*trace]};all_debug=list(unique.values())
            values=['unknown','swd']+(['swd-trace'] if trace else [])+(['jtag'] if {p['number'] for p in jtag}-{p['number'] for p in swd} else [])+['released']
            effects=[block(all_debug,[v for v in ['unknown','jtag'] if v in values]),block(swd,['swd'])]
            if trace:effects.append(block([*swd,*trace],['swd-trace']))
            control('debug','hwDebug','hwDebugHelp',values,effects,evidence_for(all_debug))
        for id,items in [('hse',hse),('lse',lse)]:
            if items:control(id,'hw'+id.upper(),'hwClockHelp',['unknown','on','off'],[block(items,['unknown','on'])],evidence_for(items))
        if controls:board['hardware']={'version':1,'controls':controls}
