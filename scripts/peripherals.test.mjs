import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {availablePeripherals,assemblePeripheral,peripheralSignal} from '../public/peripherals.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const pico=boards.find(b=>b.id==='picow');
test('peripheral roles retain manufacturer functions and exact bus instances',()=>{
 assert.deepEqual(peripheralSignal({name:'SPI0 RX',group:'SPI'}),{id:'SPI0',group:'SPI',role:'MISO'});
 assert.equal(peripheralSignal({name:'SPI CIPO / MISO',group:'SPI'}).role,'MISO');
 assert.equal(peripheralSignal({name:'USART1_TX',group:'UART'}).id,'USART1');
 assert.equal(peripheralSignal({name:'U0RXD',group:'UART'}).role,'RX');
 assert.equal(peripheralSignal({name:'USART1_CTS',group:'UART'}),null);
 assert.deepEqual(peripheralSignal({name:'CAN1_TX',group:'CAN'}),{id:'CAN1',group:'CAN',role:'TX'});
 assert.deepEqual(peripheralSignal({name:'CANRX',group:'CAN'}),{id:'CAN1',group:'CAN',role:'RX'});
 assert.deepEqual(peripheralSignal({name:'FDCAN1_TX',group:'CAN'}),{id:'FDCAN1',group:'CAN',role:'TX'});
 assert.deepEqual(peripheralSignal({name:'CAN2 RX',group:'CAN'}),{id:'CAN2',group:'CAN',role:'RX'});
 for(const board of boards) for(const bus of availablePeripherals(board)) {
  for(const candidate of bus.candidates) {
   assert(!candidate.pin.reserved);assert(candidate.pin.functions.includes(candidate.fn));
   assert.equal(peripheralSignal(candidate.fn).id,bus.id);
  }
 }
});
test('guided connections preserve labels and refuse occupied pins or mixed buses',()=>{
 const bus=availablePeripherals(pico).find(b=>b.id==='I2C0');
 const sda=bus.candidates.find(c=>c.pin.number===1),scl=bus.candidates.find(c=>c.pin.number===2);
 const saved={1:{function:sda.fn.name,label:'sensor'}};
 const picks={SDA:sda.key,SCL:scl.key};
 const next=assemblePeripheral(bus,picks,saved);
 assert.equal(next[1].label,'sensor');assert.equal(next[2].function,'I2C0 SCL');
 assert.deepEqual(Object.keys(saved),['1']);
 assert.throws(()=>assemblePeripheral(bus,picks,{1:{function:'GPIO',label:'LED'}}),/peripheralOccupied/);
 assert.throws(()=>assemblePeripheral(bus,{...picks,SCL:'[2,"I2C1 SCL"]'},saved),/peripheralChoosePins/);
 const duplicate={...bus,candidates:bus.candidates.map(c=>({...c,pin:{...c.pin,net:'same-net'}}))};
 assert.throws(()=>assemblePeripheral(duplicate,picks,{}),/peripheralPinConflict/);
 const bluePill=boards.find(b=>b.id==='blue-pill');
 const canBus=availablePeripherals(bluePill).find(b=>b.id==='CAN1');
 assert(canBus);assert.equal(canBus.group,'CAN');assert.deepEqual(canBus.roles,['TX','RX']);
});

test('RP1 SPI uses explicit single-lane controller roles and keeps array CS identities',()=>{
 const b=boards.find(b=>b.id==='raspberry-pi-5');
 const buses=availablePeripherals(b,{includeSPIChipSelect:true});
 const spi=buses.filter(b=>b.group==='SPI');
 assert.deepEqual(spi.map(b=>b.id),['SPI0','SPI1','SPI3','SPI5']);
 const spi0=spi.find(b=>b.id==='SPI0');assert.equal(spi0.mode,'spi-controller-single');
 for(const [role,pin,name] of [['MOSI',19,'SPI0_SIO[0]'],['MISO',21,'SPI0_SIO[1]'],['SCK',23,'SPI0_SCLK'],['CS',24,'SPI0_CSn[0]']])
  assert(spi0.candidates.some(c=>c.role===role&&c.pin.number===pin&&c.fn.name===name),role);
 const chipSelects=spi0.candidates.filter(c=>c.role==='CS');
 assert.equal(new Set(chipSelects.map(c=>peripheralSignal(c.fn).channel)).size,4);
 assert.equal(peripheralSignal({name:'SPI0_SIO[0]',group:'SPI'}),null);
 assert.equal(peripheralSignal({name:'SPI4_SIO[0]',group:'SPI',mode:'spi-device-single'}),null);
 assert(availablePeripherals(boards.find(b=>b.id==='raspberry-pi-4')).some(b=>b.id==='SPI0'));
});
