/* SPDX-License-Identifier: GPL-3.0-or-later */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { samePlan, validatePlan } from '../public/plans.mjs';

const boards = JSON.parse(readFileSync(new URL('../public/data/boards.json', import.meta.url)));
const pico = boards.find(board => board.id === 'picow');
const pi4 = boards.find(board => board.id === 'raspberry-pi-4');
const t = key => key;
const entry = (fn, label = '') => ({ function: fn, label });

test('legacy version 1 assignments retain the pin, function and label', () => {
  const saved = { 1: entry('I2C0 SDA', 'sensör'), 2: entry('I2C0 SCL') };
  assert.deepEqual(validatePlan(saved, pico, t), saved);
  assert.throws(() => validatePlan({ 27: entry('I2C0 SDA') }, pi4, t), /invalidAssignment/);
});

test('a duplicate bus signal is rejected while older browser plans stay readable', () => {
  const sdaPins = pico.pins.filter(pin => pin.functions.some(fn => fn.name === 'I2C0 SDA'));
  const duplicate = Object.fromEntries(sdaPins.slice(0, 2).map(pin => [pin.number, entry('I2C0 SDA')]));
  assert.equal(Object.keys(duplicate).length, 2);
  assert.throws(() => validatePlan(duplicate, pico, t), /duplicateSignal/);
  assert.deepEqual(validatePlan(duplicate, pico, t, { allowDuplicateSignals: true }), duplicate);
});

test('a preview only matches a saved plan when pins, functions and labels match', () => {
  const saved = { 1: entry('GPIO', 'LED'), 2: entry('I2C0 SCL') };
  assert.ok(samePlan(saved, { 2: entry('I2C0 SCL'), 1: { label: 'LED', function: 'GPIO' } }));
  assert.ok(!samePlan(saved, { ...saved, 1: entry('GPIO', 'sensor') }));
  assert.ok(!samePlan(saved, { ...saved, 1: entry('I2C0 SDA', 'LED') }));
  assert.ok(!samePlan(saved, {}));
});

test('USART and LPUART duplicates are rejected across pin routes',()=>{
 const chip=boards.find(b=>b.id==='stm32f405rgt6');
 const duplicate={42:entry('USART1_TX'),58:entry('USART1_TX')};
 assert.throws(()=>validatePlan(duplicate,chip,t),/duplicateSignal/);
 assert.deepEqual(validatePlan(duplicate,chip,t,{allowDuplicateSignals:true}),duplicate);
 const lpuart=boards.find(b=>b.id==='stm32l476rgt6');
 const pins=lpuart.pins.filter(p=>p.functions.some(f=>f.name==='LPUART1_TX'));
 assert(pins.length>=2);
 assert.throws(()=>validatePlan(Object.fromEntries(pins.slice(0,2).map(p=>[p.number,entry('LPUART1_TX')])),lpuart,t),/duplicateSignal/);
});

test('F103 AFIO conditions must have a common value across the whole plan',()=>{
 const chip=boards.find(b=>b.id==='stm32f103c8t6');
 const find=(port,signal)=>[chip.pins.find(p=>p.name.startsWith(port)).number,entry(signal)];
 const incompatible=Object.fromEntries([find('PA9','USART1_TX'),find('PB7','USART1_RX')]);
 assert.throws(()=>validatePlan(incompatible,chip,t),/remapConflict/);
 const compatible=Object.fromEntries([find('PB6','USART1_TX'),find('PB7','USART1_RX')]);
 assert.deepEqual(validatePlan(compatible,chip,t),compatible);
 assert.deepEqual(validatePlan(incompatible,chip,t,{allowConflictingRemaps:true}),incompatible);
});

test('H723 retired ADC assignments and duplicate net entries are preserved only for browser restoration',()=>{
 const board=boards.find(b=>b.id==='nucleo-h723zg');
 const retired=board.pins.find(p=>p.retiredFunctions?.length);
 assert(retired?.retiredFunctions.includes('ADC1_INP2'));
 {
  const plan={[retired.number]:entry(retired.retiredFunctions[0],'old ADC')};
  assert.throws(()=>validatePlan(plan,board,t),/retiredFunction/);
  assert.deepEqual(validatePlan(plan,board,t,{allowRetiredFunctions:true}),plan);
 }
 const same=board.pins.filter(p=>p.net==='PB5');assert(same.length>=2);
 const plan=Object.fromEntries(same.slice(0,2).map(p=>[p.number,entry('GPIO')]));
 assert.throws(()=>validatePlan(plan,board,t),/sharedSignal/);
 assert.deepEqual(validatePlan(plan,board,t,{allowSharedNets:true}),plan);
});

test('RP PWM channels require explicit sharing and preserve consent through validation',()=>{
 const independent={1:entry('PWM0 A','servo1'),21:entry('PWM0 A','servo2')};
 assert.throws(()=>validatePlan(independent,pico,t),/pwmDuplicate/);
 const partial={...independent,21:{...independent[21],sharedPWM:true}};
 assert.throws(()=>validatePlan(partial,pico,t),/pwmDuplicate/);
 const shared=Object.fromEntries(Object.entries(independent).map(([n,e])=>[n,{...e,sharedPWM:true}]));
 assert.deepEqual(validatePlan(shared,pico,t),shared);
 assert.deepEqual(validatePlan(independent,pico,t,{allowDuplicateSignals:true}),independent);
 assert(!samePlan(independent,shared));
 assert.throws(()=>validatePlan({1:{...entry('GPIO'),sharedPWM:true}},pico,t),/invalidAssignment/);
 assert.throws(()=>validatePlan({1:{...entry('PWM0 A'),sharedPWM:'true'}},pico,t),/invalidAssignment/);
 assert.doesNotThrow(()=>validatePlan({1:entry('PWM0 A'),2:entry('PWM0 B')},pico,t));
});
