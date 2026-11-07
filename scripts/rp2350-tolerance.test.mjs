/* SPDX-License-Identifier: GPL-3.0-or-later */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const evidence=JSON.parse(readFileSync(new URL('../public/data/evidence.json',import.meta.url)));

test('RP2350 tolerance follows package pad type through Pico board links, including RP2350B ADC bank',()=>{
 for(const b of boards.filter(b=>/^RP2350/.test(b.mcu))){
  const gp=p=>Number((p.name.match(/^(?:GP|GPIO)(\d+)/)||[])[1]);
  for(const p of b.pins.filter(p=>Number.isInteger(gp(p)))){
   const analogStart=b.mcu==='RP2350B'?40:26;
   assert.equal(p.inputTolerance.kind,gp(p)<analogStart?'rp2350-ft':'rp2350-analog',b.id+' '+p.name);
   assert(p.evidence.includes(p.inputTolerance.evidence));
   assert.equal(evidence.references[p.inputTolerance.evidence].document,'rp2350');
  }
 }
 for(const b of boards.filter(b=>b.mcu==='RP2040'))assert(!b.pins.some(p=>p.inputTolerance));
});
