import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildLayouts,resolveProfile} from '../public/layouts.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const layouts=buildLayouts(boards);

test('WeAct F401CC uses the manufacturer 44-pad CAD footprint and its own QFN48 package',()=>{
 const board=boards.find(b=>b.id==='weact-blackpill-f401cc'),chip=boards.find(b=>b.id===board.mcuProfile);
 assert.equal(chip.packagePins,48);assert.equal(chip.gpioCount,36);assert.equal(chip.clock,'84 MHz');assert.equal(chip.layout,'qfn');
 assert.equal(board.pins.length,44);assert.equal(board.uniqueGPIOCount,34);
 assert.equal(board.pins[0].name,'PB12');assert.equal(board.pins[0].physicalLabel,'PAD.1');assert.equal(board.pins[0].position.x,315);
 assert.equal(board.pins[39].name,'5V');
 const swd=board.pins.find(p=>p.number===42);assert.equal(swd.name,'PA13');assert.equal(swd.connector,'SWD');
 assert.equal(board.pins.find(p=>p.number===36).name,'PB2');
 assert.equal(resolveProfile(layouts,board.id).layout.id,'black-pill');
});

test('MB1364 H743ZI2 and corrected H723 share physical connectors without renumbering legacy assignments',()=>{
 const h743=boards.find(b=>b.id==='nucleo-h743zi2'),chip=boards.find(b=>b.id===h743.mcuProfile);
 assert.equal(chip.packagePins,144);assert.equal(chip.gpioCount,114);assert.equal(chip.clock,'480 MHz');
 const h723=boards.find(b=>b.id==='nucleo-h723zg');assert.equal(h743.pins.length,240);assert.equal(h723.pins.length,240);
 const legacy=JSON.parse(readFileSync(new URL('../sources/legacy-h723-pin-ids.json',import.meta.url)));
 for(const old of legacy){
  const pin=h723.pins.find(p=>p.number===old.number);assert.equal(pin.name,old.name);assert.equal(pin.physicalLabel,old.physicalLabel);
  if(old.mcuPin)assert.equal(pin.mcuPin,old.mcuPin);
 }
 for(const board of [h723,h743]){
  assert.equal(resolveProfile(layouts,board.id).layout.id,'nucleo-144');
  assert(!board.pins.find(p=>p.net==='PF11').functions.some(f=>/^ADC\d+_IN/.test(f.name)));
  assert.equal(board.pins.find(p=>p.physicalLabel==='CN12.1').boardCircuitKey,'nucleo144SdBridge');
 }
});

test('NUCLEO-F767ZI exposes the complete six physical headers and its Cortex-M7 package',()=>{
 const board=boards.find(b=>b.id==='nucleo-f767zi'),chip=boards.find(b=>b.id===board.mcuProfile);
 assert.equal(chip.packagePins,144);assert.equal(chip.gpioCount,114);assert.equal(chip.clock,'216 MHz');
 assert.equal(board.pins.length,240);
 for(const [header,count] of Object.entries({CN7:20,CN8:16,CN9:30,CN10:34,CN11:70,CN12:70}))
  assert.equal(board.pins.filter(p=>p.connector===header).length,count);
 const sck=board.pins.find(p=>p.physicalLabel==='CN7.10');assert.equal(sck.name,'PA5');assert.equal(sck.mcuPin,41);
 assert(sck.functions.some(f=>f.name==='SPI1_SCK' && f.selector==='AF5'));
 assert.equal(resolveProfile(layouts,board.id).layout.id,'nucleo-144');
});

test('NUCLEO-L432KC shares the Nucleo32 footprint while retaining QFN pads and LSE pins',()=>{
 const board=boards.find(b=>b.id==='nucleo-l432kc'),chip=boards.find(b=>b.id===board.mcuProfile);
 assert.equal(chip.layout,'qfn');assert.equal(chip.packagePins,32);assert.equal(chip.gpioCount,26);assert.equal(chip.clock,'80 MHz');
 assert.equal(chip.exposedPad,false);
 const clock=board.pins.find(p=>p.physicalLabel==='CN3.10');assert.equal(clock.name,'PC14');
 const a0=board.pins.find(p=>p.physicalLabel==='CN4.12');assert(a0.functions.some(f=>f.name==='ADC1_IN5'));
 assert.equal(resolveProfile(layouts,board.id).layout.id,'nucleo-32');
});

test('NUCLEO-F042K6 uses UM1956 header numbering and its own LQFP32 package',()=>{
 const board=boards.find(b=>b.id==='nucleo-f042k6'),chip=boards.find(b=>b.id===board.mcuProfile);
 assert.equal(chip.packagePins,32);assert.equal(chip.gpioCount,26);assert.equal(chip.clock,'48 MHz');
 assert.equal(board.pins.length,30);
 const tx=board.pins.find(p=>p.physicalLabel==='CN3.1');assert.equal(tx.name,'PA9');assert(tx.functions.some(f=>f.name==='USART1_TX'));
 const a5=board.pins.find(p=>p.physicalLabel==='CN4.7');assert.equal(a5.name,'PA6');assert.equal(a5.boardCircuitKey,'nucleo32I2cBridge');
 assert(!a5.functions.some(f=>f.name==='I2C1_SCL'));
 assert.equal(resolveProfile(layouts,board.id).layout.id,'nucleo-32');
});

test('Nucleo-64 references share physical positions while preserving old model links',()=>{
  const family=layouts.find(layout=>layout.id==='nucleo-64');
  assert(family.profileIds.includes('nucleo-f446re'));
  assert(!family.profileIds.includes('nucleo-h723zg'));
  for(const board of boards.filter(board=>board.layoutFamily==='nucleo-64')){
    assert.equal(resolveProfile(layouts,board.id).profile.id,board.id);
    assert.equal(resolveProfile(layouts,board.id).layout.id,'nucleo-64');
    assert.equal(board.pins.length,108);
    const packageView=boards.find(chip=>chip.id===board.mcuProfile);
    assert.equal(packageView.mcu,board.mcu);
    for(const pin of board.pins.filter(pin=>pin.type==='GPIO')){
      const pad=packageView.pins.find(pad=>pad.number===pin.mcuPin);
      if(board.id!=='nucleo-f103rb')assert.equal(pad.name,pin.net);
    }
  }
  const changed=structuredClone(boards);
  changed.find(board=>board.id==='nucleo-f446re').pins[0].position.x+=1;
  assert.throws(()=>buildLayouts(changed),/Incompatible physical layout/);
});

test('STM32F446 package and Nucleo contacts retain independently documented ADC and AF mappings',()=>{
  const board=boards.find(board=>board.id==='nucleo-f446re');
  const chip=boards.find(board=>board.id==='stm32f446ret6');
  assert.equal(chip.packagePins,64);assert.equal(chip.gpioCount,50);
  const a0=board.pins.find(pin=>pin.physicalLabel==='CN8.1');
  assert.equal(a0.name,'PA0');assert.equal(a0.mcuPin,14);
  assert(a0.functions.some(fn=>fn.name==='ADC1_IN0'));
  const sck=board.pins.find(pin=>pin.physicalLabel==='CN5.6');
  assert.equal(sck.name,'PA5');assert.equal(sck.mcuPin,21);
  assert(sck.functions.some(fn=>fn.name==='SPI1_SCK' && fn.selector==='AF5'));
});

test('F303RE D0 is corroborated by the pinned ST variant rather than an invented manual row',()=>{
  const board=boards.find(board=>board.id==='nucleo-f303re');
  const chip=boards.find(board=>board.id==='stm32f303ret6');
  assert.equal(chip.clock,'72 MHz');assert.equal(chip.gpioCount,51);
  const d0=board.pins.find(pin=>pin.physicalLabel==='CN9.1');
  assert.equal(d0.name,'PA3');assert.equal(d0.mcuPin,17);
  assert(d0.evidence.includes('nucleo-f303re-d0'));
  assert(d0.functions.some(fn=>fn.name==='USART2_RX'));
  const analog=board.pins.find(pin=>pin.physicalLabel==='CN8.1');
  assert(analog.functions.some(fn=>fn.name==='ADC1_IN1'));
});

test('L476RG retains its MCU, low-power clock and analog input mapping',()=>{
  const board=boards.find(board=>board.id==='nucleo-l476rg');
  const chip=boards.find(board=>board.id==='stm32l476rgt6');
  assert.equal(chip.clock,'80 MHz');assert.equal(chip.gpioCount,51);
  assert.equal(chip.packagePins,64);assert(chip.processor.includes('Cortex-M4'));
  const a0=board.pins.find(pin=>pin.physicalLabel==='CN8.1');
  assert.equal(a0.name,'PA0');assert.equal(a0.mcuPin,14);
  assert(a0.functions.some(fn=>fn.name==='ADC1_IN5'));
  const supply=board.pins.find(pin=>pin.physicalLabel==='CN7.33');
  assert.equal(supply.name,'VBAT');
});

test('F072RB retains its MCU clock and analog input mapping',()=>{
  const board=boards.find(board=>board.id==='nucleo-f072rb');
  const chip=boards.find(board=>board.id==='stm32f072rbt6');
  assert.equal(chip.clock,'48 MHz');assert.equal(chip.gpioCount,51);
  assert.equal(chip.packagePins,64);assert(chip.processor.includes('Cortex-M0'));
  const a0=board.pins.find(pin=>pin.physicalLabel==='CN8.1');
  assert.equal(a0.name,'PA0');assert.equal(a0.mcuPin,14);
  assert(a0.functions.some(fn=>fn.name==='ADC_IN0'));
  const supply=board.pins.find(pin=>pin.physicalLabel==='CN7.33');
  assert.equal(supply.name,'VBAT');
});

test('L053R8 retains its MCU, low-power clock and analog input mapping',()=>{
  const board=boards.find(board=>board.id==='nucleo-l053r8');
  const chip=boards.find(board=>board.id==='stm32l053r8t6');
  assert.equal(chip.clock,'32 MHz');assert.equal(chip.gpioCount,51);
  assert.equal(chip.packagePins,64);assert(chip.processor.includes('Cortex-M0+'));
  const a0=board.pins.find(pin=>pin.physicalLabel==='CN8.1');
  assert.equal(a0.name,'PA0');assert.equal(a0.mcuPin,14);
  assert(a0.functions.some(fn=>fn.name==='ADC_IN0'));
  const supply=board.pins.find(pin=>pin.physicalLabel==='CN7.33');
  assert.equal(supply.name,'VLCD');
});

test('L152RE retains its MCU, low-power clock and analog input mapping',()=>{
  const board=boards.find(board=>board.id==='nucleo-l152re');
  const chip=boards.find(board=>board.id==='stm32l152ret6');
  assert.equal(chip.clock,'32 MHz');assert.equal(chip.gpioCount,51);
  assert.equal(chip.packagePins,64);assert(chip.processor.includes('Cortex-M3'));
  const a0=board.pins.find(pin=>pin.physicalLabel==='CN8.1');
  assert.equal(a0.name,'PA0');assert.equal(a0.mcuPin,14);
  assert(a0.functions.some(fn=>fn.name==='ADC_IN0'));
  const supply=board.pins.find(pin=>pin.physicalLabel==='CN7.33');
  assert.equal(supply.name,'VLCD');
});

test('F407VG exposes its own package geometry and USART selector',()=>{
 const chip=boards.find(board=>board.id==='stm32f407vgt6');
 assert.equal(chip.packagePins,100);assert.equal(chip.gpioCount,82);assert.equal(chip.clock,'168 MHz');
 const tx=chip.pins.find(pin=>pin.name==='PA9');assert.equal(tx.number,68);
 assert(tx.functions.some(fn=>fn.name==='USART1_TX' && fn.selector==='AF7'));
});

test('F405RG exposes its own package geometry and USART selector',()=>{
 const chip=boards.find(board=>board.id==='stm32f405rgt6');
 assert.equal(chip.packagePins,64);assert.equal(chip.gpioCount,51);assert.equal(chip.clock,'168 MHz');
 const tx=chip.pins.find(pin=>pin.name==='PA9');assert.equal(tx.number,42);
 assert(tx.functions.some(fn=>fn.name==='USART1_TX' && fn.selector==='AF7'));
});
