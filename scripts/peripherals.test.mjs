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
});
