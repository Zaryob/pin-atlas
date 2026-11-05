import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildLayouts} from '../public/layouts.mjs';
import {boardFamilies, featuredCards, homeFilterChips} from '../public/catalog.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json', import.meta.url)));
const layouts=buildLayouts(boards);

test('every physical layout appears exactly once in the shared catalog', () => {
  const ids=boardFamilies.flatMap(family=>family.items.flatMap(entry=>entry.packages?.map(pkg=>pkg.id) || [entry.id]));
  assert.deepEqual(ids.sort(),layouts.map(layout=>layout.id).sort());
  for (const family of boardFamilies) assert(homeFilterChips.some(chip=>family.id===chip.id || family.id.startsWith(chip.id+'-')));
});

test('featured cards retain exact model links and verified GPIO and I/O values', () => {
  for (const card of featuredCards(layouts)) {
    const profile=layouts.find(layout=>layout.id===card.layoutId).profiles.find(profile=>profile.id===card.profileId);
    assert.equal(card.name,profile.name);
    assert(card.specs.includes(profile.voltage));
    assert(card.specs.includes(`${profile.uniqueGPIOCount ?? profile.gpioCount} GPIO`));
  }
  const xiao=featuredCards(layouts).find(card=>card.profileId==='xiao-rp2040');
  assert(xiao.specs.includes('3.3 V I/O')); assert(!xiao.specs.includes('5V'));
  const pico=featuredCards(layouts).find(card=>card.profileId==='pico2w');
  assert(pico.specs.startsWith('26 GPIO'));
});
