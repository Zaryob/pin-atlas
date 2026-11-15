/* SPDX-License-Identifier: GPL-3.0-or-later */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compileHardwareDetails} from './hardware-details.mjs';
import {connectionGroups,renderHardwareDetails} from '../public/hardware-details.mjs';
const read = path => JSON.parse(readFileSync(new URL('../'+path,import.meta.url)));
const data=read('sources/hardware-details.json'),boards=read('public/data/boards.json'),evidence=read('public/data/evidence.json');
const compiled=compileHardwareDetails(data,boards);
const fact=(id,key)=>compiled.get(id).facts.find(item=>item.key===key)?.value;
const t=(key,params={},fallback=key)=>fallback.replace(/\{(\w+)\}/g,(_,key)=>params[key]);

test('every catalog profile has sourced, localized hardware details and a qualified date',()=>{
  assert.equal(compiled.size,83);
  for(const board of boards){
    const research=compiled.get(board.id);
    assert.ok(research.sources && Object.keys(research.sources).length);
    const html=renderHardwareDetails({...board,research},evidence,t,'en');
    assert.ok(html.includes('hardware-details-title'),board.id);
    assert.ok(!html.includes('undefined'),board.id);
    assert.ok(!html.includes('>[0]</a>'),board.id);
    if(research.date.value===null)assert.equal(research.date.kind,'unverified');
    for(const item of research.facts)assert.ok(item.sources.every(key=>research.sources[key]),board.id);
  }
});

test('board Flash, bare silicon ROM and exact STM32 suffix capacities remain distinct',()=>{
  assert.match(fact('pico','flash').en,/2 MB/);
  assert.match(fact('pico2','flash').en,/4 MB/);
  assert.match(fact('rp2040','flash').en,/No internal Flash/);
  assert.equal(fact('rp2040','rom'),'16 KB boot ROM');
  assert.equal(fact('rp2350a','rom'),'32 KB boot ROM');
  assert.equal(fact('stm32f103c8t6','flash'),'64 KB Flash');
  assert.equal(fact('stm32f103rbt6','flash'),'128 KB Flash');
  assert.equal(fact('stm32f401ccu6','flash'),'256 KB Flash');
  assert.equal(fact('stm32f401ret6','flash'),'512 KB Flash');
  assert.equal(fact('esp32-s3-devkitc-1-octal','psram'),'8 MB Octal PSRAM');
  assert.match(fact('teensy-41','flash').en,/7936 KB/);
  assert.equal(fact('stm32h743zit6','ram'),'1056 KB (192 KB TCM + 864 KB SRAM) + 4 KB backup');
  assert.equal(fact('nucleo-f401re','firstDocument'),'2014-01-16');
  assert.equal(compiled.get('nucleo-f401re').date.kind,'unverified');
  assert.match(fact('raspberry-pi-4','clock').en,/1.8 GHz/);
  assert.equal(boards.find(b=>b.id==='raspberry-pi-5').clock,'2.4 GHz');
});

test('connection reference lists every verified function exactly once and preserves contact-to-pad identity',()=>{
  for(const board of boards){
    const groups=connectionGroups(board);
    assert.equal(groups.flatMap(g=>g.rows.flatMap(row=>row.functions)).length,board.pins.flatMap(pin=>pin.functions).length,board.id);
    for(const group of groups)for(const row of group.rows){
      assert.ok(board.pins.includes(row.pin));
      assert.ok(row.functions.every(fn=>fn.group===group.id));
      assert.ok(row.functions.every(fn=>evidence.references[fn.evidence]));
    }
  }
  const source=boards.find(b=>b.id==='pico');
  const configured={...source,pins:source.pins.map(pin=>pin.number===1?{...pin,hardwareBlocked:true}:pin)};
  const html=renderHardwareDetails({...configured,research:compiled.get(source.id)},evidence,t,'en');
  assert.match(html,/researchBlocked/);
  const uart=connectionGroups(configured).find(group=>group.id==='UART');
  assert.equal(uart.rows.find(row=>row.pin.number===1).pin.mcuPin,2);
});

test('incomplete research, unknown chip keys and missing citations fail the build',()=>{
  for(const mutate of [
    d=>delete d.profiles.pico,
    d=>d.profiles.pico.chip='invented',
    d=>d.chips.RP2040.sources=['missing'],
    d=>d.profiles.pico.date.kind='production-year-guessed',
    d=>d.profiles.pico.power={en:'5 V'},
  ]){
    const copy=structuredClone(data);mutate(copy);
    assert.throws(()=>compileHardwareDetails(copy,boards));
  }
});

test('localized facts and source strings are escaped and URLs remain usable',()=>{
  const board=boards.find(b=>b.id==='pico'),research=structuredClone(compiled.get('pico'));
  research.facts[0].value={tr:'Çekirdek <script>',en:'Core <img onerror="x">'};
  research.sources[Object.keys(research.sources)[0]].title='<img onerror="y">';
  const en=renderHardwareDetails({...board,research},evidence,t,'en');
  const tr=renderHardwareDetails({...board,research},evidence,t,'tr');
  assert.match(en,/Core &lt;img/);assert.match(tr,/Çekirdek &lt;script&gt;/);
  assert.ok(!en.includes('<img'));assert.ok(!tr.includes('<script>'));
  assert.match(en,/target="_blank" rel="noopener"/);
});
