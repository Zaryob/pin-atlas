import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildLayouts, resolveProfile} from '../public/layouts.mjs';

const boards = JSON.parse(readFileSync(new URL('../public/data/boards.json', import.meta.url)));
const layouts = buildLayouts(boards);

test('catalog contains one entry per shared footprint', () => {
  assert.deepEqual(layouts.map(layout => layout.id), ['pico-family', 'raspberry-pi-40', 'arduino-uno', 'arduino-nano', 'esp32-devkitc-v4', 'esp32-s3-devkitc-1', 'seeed-xiao', 'jetson-orin-nano', 'blue-pill', 'stm32f103c8t6', 'stm32f103rbt6', 'stm32f103vbt6','nucleo-f103rb', 'nucleo-f401re', 'nucleo-f411re', 'arduino-mega-2560', 'arduino-micro', 'esp32-c3-devkitm-1', 'atmega328p-pdip28', 'atmega328p-tqfp32', 'atmega328p-qfn32', 'atmega328p-qfn28', 'atmega2560-tqfp100', 'atmega2561-tqfp64', 'microbit-v2', 'rp2350a', 'rp2350b', 'stm32f401ret6', 'stm32f411ret6', 'rp2040']);
  assert.equal(layouts[0].profiles.length, 4);
  assert.equal(layouts[1].profiles.length, 3);
  assert.equal(new Set(layouts.flatMap(layout => layout.profileIds)).size, boards.length);
});

test('grouping refuses a changed physical connection', () => {
  const changed = structuredClone(boards);
  changed.find(board => board.id === 'picow').pins[0].name = 'VBUS';
  assert.throws(() => buildLayouts(changed), /Incompatible physical layout: picow/);
});

test('all old board links resolve to their original reference inside one layout', () => {
  for (const board of boards) {
    const resolved = resolveProfile(layouts, board.id);
    assert.equal(resolved.profile.id, board.id);
    assert(resolved.layout.profileIds.includes(board.id));
  }
  assert.equal(resolveProfile(layouts, 'pico-family', 'picow').profile.id, 'picow');
  assert.equal(resolveProfile(layouts, 'raspberry-pi-40', 'raspberry-pi-4').profile.id, 'raspberry-pi-4');
  assert.equal(resolveProfile(layouts, 'pico-family', 'raspberry-pi-4').profile.id, 'pico2w');
});

test('a shared layout retains distinct processor selectors and scope', () => {
  const pico = resolveProfile(layouts, 'pico-family', 'pico').profile;
  const pico2 = resolveProfile(layouts, 'pico-family', 'pico2w').profile;
  const selector = board => board.pins[0].functions.find(fn => fn.name === 'USB OVCUR DET').selector;
  assert.equal(selector(pico), 'F9');
  assert.equal(selector(pico2), 'F10');
  assert(!pico.pins.some(pin => pin.functions.some(fn => fn.group === 'HSTX')));
  const common = resolveProfile(layouts, 'raspberry-pi-40').profile;
  const pi4 = resolveProfile(layouts, 'raspberry-pi-40', 'raspberry-pi-4').profile;
  assert(common.pins.every(pin => pin.functions.length === 0));
  assert(pi4.pins.some(pin => pin.functions.some(fn => fn.selector === 'ALT0')));
});

test('Jetson J12 stays distinct from the Raspberry Pi header', () => {
  const jetson = resolveProfile(layouts, 'jetson-orin-nano');
  const pi = resolveProfile(layouts, 'raspberry-pi-40');
  assert.notEqual(jetson.layout.id, pi.layout.id);
  assert.equal(jetson.profile.pins[26].name, 'I2C0_SDA');
  assert.equal(pi.profile.pins[26].name, 'GPIO0');
  assert(!jetson.profile.pins[26].reserved);
});

test('Blue Pill connectors are distinct from STM32 package pins', () => {
  const board = resolveProfile(layouts, 'blue-pill').profile;
  const chip = resolveProfile(layouts, 'stm32f103c8t6').profile;
  assert.equal(board.packagePins, 44);
  assert.equal(chip.packagePins, 48);
  const swdio = board.pins.find(pin => pin.physicalLabel === 'SWD.2');
  assert.equal(swdio.name, 'PA13');
  assert.equal(swdio.mcuPin, 34);
  assert.equal(chip.pins[33].name, swdio.name);
  assert.equal(chip.layout, 'lqfp');
  assert(!board.pins.some(pin => pin.name === 'PB2'));
});

test('UNO headers retain separate MCU references and the old UNO link', () => {
  const family = resolveProfile(layouts, 'arduino-uno').layout;
  assert.equal(family.profiles.length, 4);
  assert.equal(resolveProfile(layouts, 'arduino-uno-r3').profile.id, 'arduino-uno-r3');
  const signal = (id, label, group) => resolveProfile(layouts, id).profile.pins.find(p => p.physicalLabel === label).functions.some(f => f.group === group);
  assert(signal('arduino-uno-r3','ANALOG.5','I2C'));
  assert(!signal('arduino-leonardo','ANALOG.5','I2C'));
  assert(signal('arduino-leonardo','DIGITAL.3','I2C'));
  assert(signal('arduino-uno-r4-minima','ANALOG.1','DAC'));
  assert(signal('arduino-uno-r4-minima','DIGITAL.5','CAN'));
  assert(!signal('arduino-uno-r4-wifi','DIGITAL.5','CAN'));
  assert(signal('arduino-uno-r4-wifi','DIGITAL.11','CAN'));
});

test('Nano references share positions while exposing different GPIO and programming contacts', () => {
  const classic = resolveProfile(layouts,'arduino-nano-classic').profile;
  const every = resolveProfile(layouts,'arduino-nano-every').profile;
  assert.equal(resolveProfile(layouts,classic.id).layout.id,resolveProfile(layouts,every.id).layout.id);
  assert.equal(classic.pins.find(p=>p.physicalLabel==='L.10').type,'ADC');
  assert.equal(every.pins.find(p=>p.physicalLabel==='L.10').type,'GPIO');
  assert(classic.pins.some(p=>p.connector==='ICSP'));
  assert(!every.pins.some(p=>p.connector==='ICSP'));
  assert(!every.pins.find(p=>p.name==='D11').functions.some(f=>f.group==='PWM'));
  const changed=structuredClone(boards);
  changed.find(b=>b.id===every.id).pins[0].position.x+=1;
  assert.throws(()=>buildLayouts(changed),/Incompatible physical layout: arduino-nano-every/);
});

test('ESP module choices retain physical pins and reserve the fitted memory bus', () => {
  for(const [layoutId,variantId,pins] of [
    ['esp32-devkitc-v4','esp32-devkitc-v4-wrover',[16,17]],
    ['esp32-s3-devkitc-1','esp32-s3-devkitc-1-octal',[35,36,37]]
  ]){
    const regular=resolveProfile(layouts,layoutId).profile;
    const memory=resolveProfile(layouts,layoutId,variantId).profile;
    assert.equal(regular.packagePins,memory.packagePins);
    for(const number of pins){
      assert(!regular.pins.find(p=>p.name===`GPIO${number}`).reserved);
      const pin=memory.pins.find(p=>p.name===`GPIO${number}`);
      assert(pin.reserved);assert.equal(pin.functions.length,0);
    }
  }
  const classic=resolveProfile(layouts,'esp32-devkitc-v4').profile;
  assert(classic.pins.find(p=>p.name==='GPIO34').inputOnly);
  assert(!classic.pins.find(p=>p.name==='GPIO34').functions.some(f=>f.group==='PWM'));
  assert(!resolveProfile(layouts,'esp32-s3-devkitc-1').profile.pins.find(p=>p.name==='GPIO46').inputOnly);
});

test('AVR package numbers differ from board headers and analog-only pads depend on package', () => {
  for(const id of ['atmega328p-pdip28','atmega328p-qfn28']){
    const chip=resolveProfile(layouts,id).profile;
    assert(!chip.pins.some(p=>p.name==='ADC6'||p.name==='ADC7'));
    assert.equal(chip.gpioCount,23);
  }
  for(const id of ['atmega328p-tqfp32','atmega328p-qfn32']){
    const chip=resolveProfile(layouts,id).profile;
    assert.equal(chip.pins.find(p=>p.name==='ADC6').type,'ADC');
    assert.equal(chip.pins.find(p=>p.name==='PC0').number,23);
  }
  const dip=resolveProfile(layouts,'atmega328p-pdip28').profile;
  assert.equal(dip.pins.find(p=>p.name==='PC0').number,23);
  assert.equal(dip.pins.find(p=>p.name==='PC6').baseFunction,'RESET');
  const mega=resolveProfile(layouts,'atmega2560-tqfp100').profile;
  assert.equal(mega.gpioCount,86);assert.equal(mega.pins.length,100);
  assert.equal(mega.pins[0].name,'PG5');assert.equal(mega.pins[99].name,'AVCC');
  assert(!mega.pins.some(p=>p.functions.some(f=>f.name==='PDI'||f.name==='PDO')));
});

test('Seeed XIAO references share 14 physical positions while changing processor GPIOs', () => {
  const xiaoRp = resolveProfile(layouts, 'xiao-rp2040').profile;
  const xiaoC3 = resolveProfile(layouts, 'seeed-xiao', 'xiao-esp32c3').profile;
  assert.equal(resolveProfile(layouts, xiaoRp.id).layout.id, resolveProfile(layouts, xiaoC3.id).layout.id);
  assert.equal(xiaoRp.packagePins, 14);
  assert.equal(xiaoC3.packagePins, 14);
  assert.equal(xiaoRp.pins.find(p => p.physicalLabel === 'L.1').net, 'GPIO26');
  assert.equal(xiaoC3.pins.find(p => p.physicalLabel === 'L.1').net, 'GPIO2');
  assert.equal(xiaoRp.pins.find(p => p.physicalLabel === 'L.7').net, 'GPIO0');
  assert.equal(xiaoC3.pins.find(p => p.physicalLabel === 'L.7').net, 'GPIO21');
  assert(xiaoC3.pins.find(p => p.physicalLabel === 'L.1').strapping);
});

test('micro:bit V2 exposes edge connector with 5 rings and 16 expansion pins', () => {
  const mb = resolveProfile(layouts, 'microbit-v2').profile;
  assert.equal(mb.pins.length, 21);
  assert.equal(mb.pins.filter(p => p.connector === 'RING').length, 5);
  assert.equal(mb.pins.filter(p => p.connector === 'EDGE').length, 16);
  assert.equal(mb.gpioCount, 19);
  assert(mb.pins.find(p => p.name === 'P0').functions.some(f => f.group === 'TOUCH'));
  assert(mb.pins.find(p => p.name === 'P5').functions.some(f => f.signal === 'BUTTON_A'));
  assert(mb.pins.find(p => p.name === 'P13').functions.some(f => f.signal === 'SPI_SCK'));
  assert(mb.pins.find(p => p.name === 'P19').functions.some(f => f.signal === 'I2C_SCL'));
});
