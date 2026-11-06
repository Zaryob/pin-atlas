/* SPDX-License-Identifier: GPL-3.0-or-later */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {configureBoard} from '../public/hardware-config.mjs';
import {pinAssignment,assignmentMessage} from '../public/pin-assignments.mjs';
import {pinNotes,circuitNotes} from '../public/pin-notes.mjs';
import {availablePeripherals,assemblePeripheral} from '../public/peripherals.mjs';
import {suggestPins} from '../public/pin-solver.mjs';
import {planPayload,exportPlanPayload,decodePlanPayload} from '../public/plan-records.mjs';

const read=name=>JSON.parse(readFileSync(new URL('../public/data/'+name,import.meta.url)));
const boards=read('boards.json'),catalog=read('catalog.json'),evidence=read('evidence.json');
const source=id=>({...boards.find(board=>board.id===id),dataFile:catalog.profiles.find(board=>board.id===id).dataFile});
const raw=source('nucleo-f446re'),settings={vcp:'active',debug:'swd',hse:'on',lse:'off'};
const board=configureBoard(raw,settings),contact=label=>board.pins.find(pin=>pin.physicalLabel===label);
const entry=(functionName,label='')=>({function:functionName,label});
const t=(key,params={})=>key+' '+JSON.stringify(params);

test('an alias with a smaller numeric ID reports the actual saved contact and function',()=>{
 const saved=contact('CN5.9'),alias=contact('CN10.5');
 assert(alias.number<saved.number);
 const pins={[saved.number]:entry('I2C1_SDA','sensor')};
 const occupied=pinAssignment(alias,pins,board);
 assert.equal(occupied.pin.physicalLabel,'CN5.9');
 assert.match(assignmentMessage(occupied,t),/CN5\.9.*I2C1_SDA/);
 assert.equal(pinAssignment(saved,pins,board,{otherContactOnly:true}),null);
 const bus=availablePeripherals(board).find(bus=>bus.id==='CAN1');
 const picks={TX:bus.candidates.find(c=>c.pin.number===alias.number).key,
  RX:bus.candidates.find(c=>c.pin.physicalLabel==='CN10.3').key};
 assert.throws(()=>assemblePeripheral(bus,picks,pins,t),/CN5\.9.*I2C1_SDA/);
 assert.deepEqual(pins,{[saved.number]:entry('I2C1_SDA','sensor')});
});

test('occupancy includes coupled pads and aliases without a candidate in the requested bus',()=>{
 const pin={number:1,name:'PA1',type:'GPIO',mcuPin:1,coupledPads:[2]},other={number:2,name:'PA2',type:'GPIO',mcuPin:2};
 assert.equal(pinAssignment(pin,{2:entry('GPIO')},{pins:[pin,other]}).pin,other);
 const shared={...other,number:3};
 assert.equal(pinAssignment(shared,{2:entry('GPIO')},{pins:[pin,other,shared]}).pin,other);
 const grounds=board.pins.filter(pin=>pin.type==='GND');assert(grounds.length>1);
 assert.equal(pinAssignment(grounds[0],{[grounds[1].number]:entry(grounds[1].name)},board),null);
});

test('general GPIO guidance is excluded from hardware warnings and shared notes are deduplicated',()=>{
 const clock=contact('CN5.6'),sda=contact('CN5.9');
 assert(pinNotes(clock).specific.some(note=>note.key==='nucleoLed'));
 assert.deepEqual(pinNotes(sda).specific,[]);
 assert(pinNotes(sda).general.some(note=>note.key==='stm32CubeGpio'));
 assert.equal(circuitNotes([clock,{...clock,number:500}]).length,1);
 const result=suggestPins(board,{SPI:1,I2C:1,UART:1},{[clock.number]:entry('SPI1_SCK','FLASH_SCK')});
 assert.equal(result.status,'ready');
 assert.equal(result.alternatives[0].warnings,1);
});

test('readable export records physical routes, AF, data revision and source hashes',()=>{
 const clock=contact('CN5.6'),pins={[clock.number]:entry('SPI1_SCK','FLASH_SCK')};
 const payload=exportPlanPayload(raw,pins,settings,evidence);
 assert.equal(payload.version,3);
 assert.deepEqual(payload.pins[0],{physical:'CN5.6',signal:'PA5',mcuPin:21,function:'SPI1_SCK',selector:'AF5',label:'FLASH_SCK',sources:payload.pins[0].sources});
 assert(payload.pins[0].sources.includes('f446re-modes'));
 assert.equal(payload.provenance.profile.file,raw.dataFile);
 assert.match(payload.provenance.profile.revision,/^[a-f0-9]{16}$/);
 assert(payload.provenance.documents.length>0);
 assert(payload.provenance.documents.every(doc=>/^[a-f0-9]{64}$/.test(doc.sha256)));
 assert(payload.provenance.documents.every(doc=>doc.revision&&doc.url));
 const decoded=decodePlanPayload(payload,raw,{},t);
 assert.deepEqual(decoded.pins,pins);assert.deepEqual(decoded.hardware,settings);
 assert.equal(decoded.revisionMismatch,false);
 assert.deepEqual(exportPlanPayload(raw,decoded.pins,decoded.hardware,evidence),payload);
 // Existing storage/share formats retain their original shape and interpretation.
 assert.deepEqual(decodePlanPayload(planPayload(raw,pins,settings),raw,{},t).pins,pins);
 assert.deepEqual(decodePlanPayload({version:1,board:raw.id,pins},raw,settings,t).pins,pins);
});

test('imports reject ambiguous or changed physical routes and flag a changed profile revision',()=>{
 const payload=exportPlanPayload(raw,{[contact('CN5.6').number]:entry('SPI1_SCK')},settings,evidence);
 for(const patch of [{physical:'CN5.9'},{signal:'PB9'},{mcuPin:62},{selector:'AF9'}]) {
  const changed=structuredClone(payload);Object.assign(changed.pins[0],patch);
  assert.throws(()=>decodePlanPayload(changed,raw,{},t),/exportContactChanged/);
 }
 const duplicate=structuredClone(payload);duplicate.pins.push({...duplicate.pins[0]});
 assert.throws(()=>decodePlanPayload(duplicate,raw,{},t),/exportContactChanged/);
 const changed=structuredClone(payload);changed.provenance.profile.file='profiles/nucleo-f446re.0000000000000000.json';
 assert.equal(decodePlanPayload(changed,raw,{},t).revisionMismatch,true);
});

test('readable exports use applied bridge routes and physical contacts survive internal renumbering',()=>{
 const raw=source('nucleo-l432kc'),hardware={SB16:'on',SB18:'off'},target=configureBoard(raw,hardware);
 const pin=target.pins.find(pin=>pin.physicalLabel==='CN4.7'),pins={[pin.number]:entry('GPIO','routed')};
 const payload=exportPlanPayload(raw,pins,hardware,evidence);
 assert.equal(payload.pins[0].signal,'PB6');assert.equal(payload.pins[0].mcuPin,pin.mcuPin);
 assert.deepEqual(decodePlanPayload(payload,raw,{},t).pins,pins);
 const pico=source('picow'),exported=exportPlanPayload(pico,{1:entry('I2C0 SDA','sensor')},{},evidence);
 const renumbered={...pico,pins:pico.pins.map(pin=>({...pin,physicalLabel:String(pin.number).padStart(2,'0'),number:pin.number+1000}))};
 assert.deepEqual(decodePlanPayload(exported,renumbered,{},t).pins,{1001:entry('I2C0 SDA','sensor')});
});
