import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildLayouts,resolveProfile} from '../public/layouts.mjs';
import {boardFamilies,featuredCards,homeFilterChips,buildCatalog,filterCatalog} from '../public/catalog.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const layouts=buildLayouts(boards),catalog=buildCatalog(layouts);

test('every documented model appears once and resolves to its own profile',()=>{
  assert.deepEqual(catalog.map(entry=>entry.profile).sort(),boards.map(board=>board.id).sort());
  assert.deepEqual(boardFamilies.flatMap(family=>family.layouts).sort(),layouts.map(layout=>layout.id).sort());
  for(const entry of catalog)assert.equal(resolveProfile(layouts,entry.id,entry.profile).profile.id,entry.profile);
  for(const family of boardFamilies)assert(homeFilterChips.some(chip=>chip.id===family.id));
});

test('shared layouts expose exact models with board and MCU categories separated',()=>{
  const models=filterCatalog(catalog,{family:'stm32',type:'boards'});
  for(const id of ['nucleo-f042k6','nucleo-l432kc','nucleo-f401re','nucleo-h743zi2','weact-blackpill-f411ce']){
    assert(models.some(entry=>entry.profile===id));
  }
  assert(!models.some(entry=>entry.profile.startsWith('stm32')));
  assert.equal(catalog.find(entry=>entry.profile==='nucleo-l432kc').series,'Nucleo-32');
  assert.deepEqual(filterCatalog(catalog,{type:'headers'}).map(entry=>entry.profile),['raspberry-pi-40']);
  assert.equal(filterCatalog(catalog,{query:'ATmega328P',type:'chips'}).length,4);
});

test('search tolerates punctuation and word order and respects series numbers and combined filters',()=>{
  assert.deepEqual(filterCatalog(catalog,{query:'L432KC nucleo'}).map(e=>e.profile),['nucleo-l432kc']);
  assert.deepEqual(filterCatalog(catalog,{query:'nucleo 32'}).map(e=>e.profile),['nucleo-f042k6','nucleo-l432kc']);
  assert.deepEqual(filterCatalog(catalog,{query:'N8R8'}).map(e=>e.profile),['esp32-s3-devkitc-1-octal']);
  assert.equal(filterCatalog(catalog,{query:'Pico W'})[0].profile,'picow');
  assert.equal(filterCatalog(catalog,{query:'RP2040',family:'arduino'}).length,0);
  assert.equal(filterCatalog(catalog,{query:'STM32F401CCU6',type:'boards'})[0].profile,'weact-blackpill-f401cc');
});

test('compatibility-only models resolve to the common documented reference without new catalog entries',()=>{
  assert.deepEqual(filterCatalog(catalog,{query:'Raspberry Pi Zero'}).map(e=>e.profile),['raspberry-pi-40']);
  assert.deepEqual(filterCatalog(catalog,{query:'STM32F103CBT6'}).map(e=>e.profile),['stm32f103c8t6']);
  assert(!catalog.some(e=>e.name==='STM32F103CBT6'));
  assert.equal(filterCatalog(catalog,{query:'STM32F103CBT6'})[0].matchedAlias,'STM32F103CBT6');
});

test('metadata-only catalog has the same model names, types and search results as full profiles',()=>{
  const metadata=JSON.parse(readFileSync(new URL('../public/data/catalog.json',import.meta.url)));
  const lightweight=buildCatalog(buildLayouts(metadata.profiles));
  assert.deepEqual(lightweight,catalog);
});

test('featured cards retain exact model links and verified GPIO and I/O values',()=>{
  for(const card of featuredCards(layouts)){
    const profile=layouts.find(layout=>layout.id===card.layoutId).profiles.find(profile=>profile.id===card.profileId);
    assert.equal(card.name,profile.name);assert(card.specs.includes(profile.voltage));
    assert(card.specs.includes(`${profile.uniqueGPIOCount ?? profile.gpioCount} GPIO`));
  }
  const xiao=featuredCards(layouts).find(card=>card.profileId==='xiao-rp2040');
  assert(xiao.specs.includes('3.3 V I/O'));assert(!xiao.specs.includes('5V'));
  assert(featuredCards(layouts).find(card=>card.profileId==='pico2w').specs.startsWith('26 GPIO'));
});
