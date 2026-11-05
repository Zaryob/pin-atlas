import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildLayouts,resolveProfile} from '../public/layouts.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const layouts=buildLayouts(boards);

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

test('F072RB retains its MCU, low-power clock and analog input mapping',()=>{
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
