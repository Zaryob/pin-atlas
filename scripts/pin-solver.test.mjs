/* SPDX-License-Identifier: GPL-3.0-or-later */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {suggestPins,applySuggestion} from '../public/pin-solver.mjs';
import {configureBoard,electricalKeys} from '../public/hardware-config.mjs';
import {validatePlan} from '../public/plans.mjs';
import {peripheralSignal} from '../public/peripherals.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const board=id=>boards.find(b=>b.id===id),entry=(functionName,label='')=>({function:functionName,label}),t=k=>k;

test('one SPI plus two distinct UARTs preserve partial connections and labels',()=>{
 const pico=board('picow'),existing={1:entry('UART0 TX','serial console')};
 const result=suggestPins(pico,{SPI:1,UART:2},existing);
 assert.equal(result.status,'ready');assert.equal(result.alternatives.length,3);
 const routes=new Set();
 for(const alternative of result.alternatives){
  assert.deepEqual(alternative.pins[1],existing[1]);assert.equal(alternative.addedPins,7);
  assert.deepEqual(validatePlan(alternative.pins,pico,t),alternative.pins);
  assert.equal(new Set(alternative.connections.filter(c=>c.group==='UART').map(c=>c.id)).size,2);
  assert.equal(alternative.connections.find(c=>c.group==='SPI').signals.length,4);
  const signature=JSON.stringify(alternative.connections);assert(!routes.has(signature));routes.add(signature);
  assert.deepEqual(applySuggestion(existing,alternative,pico),alternative.pins);
 }
 const first=result.alternatives[0];
 const again=suggestPins(pico,{SPI:1,UART:2},first.pins);
 assert.equal(again.status,'ready');assert.equal(again.alternatives[0].addedPins,0);
 assert.deepEqual(again.alternatives[0].pins,first.pins);
 assert.throws(()=>applySuggestion({1:entry('UART0 TX','changed')},first,pico),/suggestStale/);
});

test('configured Nucleo routes obey hardware blocks, physical aliases and shared AFIO settings',()=>{
 for(const id of ['nucleo-l432kc','nucleo-h723zg','blue-pill']){
  const raw=board(id),b=configureBoard(raw,id==='nucleo-l432kc'?{SB16:'on',SB18:'on',SB15:'off',SB2:'off'}:{});
  const result=suggestPins(b,{SPI:1,UART:2});assert.equal(result.status,'ready',id);
  for(const alternative of result.alternatives){
   const keys=new Set();validatePlan(alternative.pins,b,t);
   for(const n of Object.keys(alternative.pins)){
    const p=b.pins.find(p=>String(p.number)===n);assert(!p.hardwareBlocked&&!p.reserved);
    for(const key of electricalKeys(p)){assert(!keys.has(key),id+' '+key);keys.add(key);}
   }
  }
 }
});

test('incompatible AFIO routes cannot be combined and existing conflicts block the solver',()=>{
 const raw=board('stm32f103c8t6'),b=configureBoard(raw),pa9=b.pins.find(p=>p.name.startsWith('PA9')),pb7=b.pins.find(p=>p.name.startsWith('PB7'));
 const existing={[pa9.number]:entry('USART1_TX')};
 const result=suggestPins(b,{UART:1},existing);assert.equal(result.status,'ready');
 for(const alternative of result.alternatives){
  assert.deepEqual(alternative.pins[pa9.number],existing[pa9.number]);
  assert.notEqual(alternative.pins[pb7.number]?.function,'USART1_RX');
 }
 assert.equal(suggestPins(b,{UART:1},{...existing,[pb7.number]:entry('USART1_RX')}).status,'blocked');
 const blocked=b.pins.find(p=>p.hardwareBlocked);assert(blocked);
 assert.equal(suggestPins(b,{SPI:1},{[blocked.number]:entry('GPIO')}).status,'blocked');
});

test('search distinguishes impossible requests, invalid requests, and exhausted budgets',()=>{
 const b=board('picow');
 assert.equal(suggestPins(b,{UART:3}).status,'impossible');
 assert.equal(suggestPins(b,{SPI:1,UART:2},{},{maxNodes:1}).status,'limited');
 for(const req of [{},{SPI:-1},{SPI:1.5},{SPI:5},{SPI:4,UART:4}])assert.equal(suggestPins(b,req).status,'invalid');
 const three=suggestPins(b,{SPI:1},{},{includeSPIChipSelect:false});
 assert.equal(three.alternatives[0].addedPins,3);
});

test('vendor CS and TXD aliases preserve real channels and never invent bus numbers',()=>{
 for(const [name,group,role] of [['SPI0 CSn','SPI','CS'],['SPI0_CE1_N','SPI','CS'],['UART1_TXD','UART','TX'],['U0RXD','UART','RX']])assert.equal(peripheralSignal({name,group}).role,role);
 assert.notEqual(peripheralSignal({name:'SPI0_CE0_N',group:'SPI'}).channel,peripheralSignal({name:'SPI0_CE1_N',group:'SPI'}).channel);
 assert.equal(peripheralSignal({name:'TX','group':'UART'}),null);
});
