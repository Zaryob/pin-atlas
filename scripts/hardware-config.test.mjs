/* SPDX-License-Identifier: GPL-3.0-or-later */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {configureBoard,normalizeHardware} from '../public/hardware-config.mjs';
import {validatePlan} from '../public/plans.mjs';
import {readPlanRecords,writePlanRecord,planPayload,decodePlanPayload,legacyStorageKey,configuredStorageKey} from '../public/plan-records.mjs';
import {planReport,reportHTML} from '../public/plan-output.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const source=id=>boards.find(b=>b.id===id),contact=(b,label)=>b.pins.find(p=>p.physicalLabel===label);
const entry=(name,label='')=>({function:name,label}),t=k=>k;

test('SB16/SB18 switch the MCU routes and remove unrelated analog functions',()=>{
 const raw=source('nucleo-l432kc'),unknown=configureBoard(raw);
 for(const label of ['CN4.7','CN4.8','CN3.7','CN3.8'])assert(contact(unknown,label).hardwareBlocked);
 const on=configureBoard(raw,{SB16:'on',SB18:'on'}),off=configureBoard(raw,{SB16:'off',SB18:'off'});
 for(const [sink,via] of [['CN4.7','CN3.8'],['CN4.8','CN3.7']]){
  const routed=contact(on,sink),original=contact(off,sink),other=contact(off,via);
  assert.equal(routed.mcuPin,other.mcuPin);assert.equal(routed.name,other.name);
  assert.deepEqual(routed.functions,other.functions);assert(!routed.hardwareBlocked);
  assert(contact(on,via).hardwareBlocked);assert(!original.hardwareBlocked);assert(!other.hardwareBlocked);
  const analog=original.functions.find(f=>f.group==='ADC');assert(analog);
  const old={[original.number]:entry(analog.name,'keep')};
  assert.throws(()=>validatePlan(old,on,t),/hwRouteConflict/);
  assert.deepEqual(validatePlan(old,on,t,{allowHardwareConflicts:true}),old);
 }
 assert.equal(contact(raw,'CN4.7').name,'PA6'); // immutable source
});

test('debug, flash and contact-only bridges constrain the actual electrical nets',()=>{
 const raw=source('weact-blackpill-f411ce'),busy=configureBoard(raw),free=configureBoard(raw,{flash:'absent',debug:'swd'});
 for(const name of ['PA4','PA5','PA6','PA7']){
  assert(busy.pins.find(p=>p.name===name).hardwareBlocked);
  assert(!free.pins.find(p=>p.name===name).hardwareBlocked);
 }
 for(const p of free.pins.filter(p=>['PA13','PA14'].includes(p.name)))assert(p.hardwareBlocked);
 assert(!free.pins.find(p=>p.name==='PB3').hardwareBlocked);
 const h7=configureBoard(source('nucleo-h723zg'),{SB14:'off',analogHeader:'i2c'});
 assert(contact(h7,'CN12.2').hardwareBlocked);
 assert(h7.pins.some(p=>p.net==='PC8'&&!p.hardwareBlocked));
 assert.equal(contact(h7,'CN9.9').name,'PB9');assert.equal(contact(h7,'CN9.11').name,'PB8');
 const same=h7.pins.filter(p=>p.name==='PB9'&&!p.hardwareBlocked).slice(0,2);
 assert.equal(same.length,2);
 assert.throws(()=>validatePlan(Object.fromEntries(same.map(p=>[p.number,entry('GPIO')])),h7,t),/sharedSignal/);
 assert(h7.pins.filter(p=>['PD8','PD9'].includes(p.name)).every(p=>p.hardwareBlocked));
});

test('configured plans persist atomically with a legacy backup and strict imports',()=>{
 const raw=source('nucleo-l432kc'),settings=normalizeHardware(raw,{SB16:'off'}),p=contact(raw,'CN4.7'),pins={[p.number]:entry('GPIO','existing')};
 const data=new Map([[legacyStorageKey,JSON.stringify({[raw.id]:pins})]]);
 const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
 assert.equal(readPlanRecords(storage)[raw.id].version,1);
 writePlanRecord(storage,raw,pins,settings);
 assert.deepEqual(JSON.parse(data.get(legacyStorageKey)),{[raw.id]:pins});
 assert.deepEqual(readPlanRecords(storage)[raw.id],{version:2,pins,hardware:settings});
 const payload=planPayload(raw,pins,settings);assert.equal(payload.version,2);
 assert.deepEqual(decodePlanPayload(payload,raw,{},t).pins,pins);
 assert.throws(()=>decodePlanPayload({...payload,hardware:{SB16:'unknown'}},raw,{},t),/hwPinUnavailable/);
 assert.throws(()=>decodePlanPayload({...payload,hardware:{fake:'on'}},raw,{},t),/hwInvalid/);
 assert.throws(()=>decodePlanPayload({...payload,version:1},raw,{},t),/unsupportedFormat/);
 const before=data.get(configuredStorageKey);storage.setItem=()=>{throw new Error('quota');};
 assert.throws(()=>writePlanRecord(storage,raw,{},settings),/quota/);assert.equal(data.get(configuredStorageKey),before);
 const pico=source('picow');assert.deepEqual(planPayload(pico,{}),{version:1,board:pico.id,pins:{}});
});

test('exported reports record the applied hardware interpretation and its sources',()=>{
 const raw=source('nucleo-l432kc'),b=configureBoard(raw,{SB16:'on'}),p=contact(b,'CN4.7');
 const evidence=JSON.parse(readFileSync(new URL('../public/data/evidence.json',import.meta.url)));
 const report=planReport(b,{[p.number]:entry('GPIO')},evidence,t);
 assert(report.hardware.some(row=>row.id==='SB16'&&row.value==='hwOn'));
 assert(report.sources.some(row=>row.id==='hw-nucleo32-bridges'));
 assert.match(reportHTML(report,t),/hwTitle/);
});

test('a corrupt configured-plan record does not discard readable legacy plans',()=>{
 const pins={1:entry('GPIO','legacy')};
 const storage={getItem:key=>key===legacyStorageKey?JSON.stringify({picow:pins}):'{bad json'};
 assert.deepEqual(readPlanRecords(storage).picow,{version:1,pins});
});

test('the MB1404 A4/A5 preset selects the matching MCU pads without changing contact IDs',()=>{
  const raw=source('nucleo-h563zi');
  const unknown=configureBoard(raw);
  const analog=configureBoard(raw,{analogHeader:'analog'});
  const i2c=configureBoard(raw,{analogHeader:'i2c'});
  for (const [label, analogNet, i2cNet] of [['CN9.9','PC2','PB9'],['CN9.11','PF11','PB8']]){
    assert(contact(unknown,label).hardwareBlocked);
    assert.equal(contact(analog,label).net,analogNet);
    assert(contact(analog,label).functions.some(fn=>fn.group==='ADC'));
    assert.equal(contact(i2c,label).net,i2cNet);
    assert(contact(i2c,label).functions.some(fn=>fn.group==='I2C'));
    assert.equal(contact(analog,label).number,contact(i2c,label).number);
  }
});

test('on-board memory and the Nano R4 connector voltage stay profile-specific',()=>{
  const standard=source('adafruit-feather-rp2350'),psram=source('adafruit-feather-rp2350-psram');
  const pcs=contact(standard,'JP1.1');
  assert.equal(pcs.net,'GPIO8');
  assert.deepEqual(validatePlan({[pcs.number]:entry('GPIO')},standard,t),{[pcs.number]:entry('GPIO')});
  assert.throws(()=>validatePlan({[pcs.number]:entry('GPIO')},psram,t),/invalidAssignment/);
  assert.equal(contact(psram,'CN2.11').net,'GPIO12');
  assert.equal(contact(psram,'CN2.21').net,'GPIO19');
  const cam=source('ai-thinker-esp32-cam');
  assert(contact(cam,'P1.7').reserved);
  assert.equal(contact(cam,'Cam1.12').net,'GPIO0');
  assert.equal(contact(cam,'SD1.8').net,contact(cam,'P2.1').net);
  const nano=source('arduino-nano-r4');
  assert.equal(nano.voltage,'5 V I/O');
  assert.equal(contact(nano,'QWIIC.3').voltage,'3.3 V I/O');
  assert(contact(nano,'QWIIC.3').functions.some(fn=>fn.name==='I2C0 SDA'));
  assert(contact(nano,'L.8').functions.some(fn=>fn.name==='I2C1 SDA'));
  assert.equal(contact(source('xiao-rp2350'),'TP.16').net,'GPIO21');
});
