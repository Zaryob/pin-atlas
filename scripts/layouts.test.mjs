import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildLayouts, resolveProfile} from '../dist/layouts.mjs';

const boards = JSON.parse(readFileSync(new URL('../dist/data/boards.json', import.meta.url)));
const layouts = buildLayouts(boards);

test('catalog contains one entry per shared footprint', () => {
  assert.deepEqual(layouts.map(layout => layout.id), ['pico-family', 'raspberry-pi-40', 'rp2350a', 'rp2350b']);
  assert.equal(layouts[0].profiles.length, 4);
  assert.equal(layouts[1].profiles.length, 2);
  assert.equal(new Set(layouts.flatMap(layout => layout.profileIds)).size, boards.length);
});

test('grouping refuses a changed physical connection', () => {
  const changed = structuredClone(boards);
  changed.find(board => board.id === 'picow').pins[0].name = 'VBUS';
  assert.throws(() => buildLayouts(changed), /Incompatible physical layout: picow/);
});

test('all old board links resolve to their original reference inside one layout', () => {
  for (const board of boards) {
    const resolved = resolveProfile(layouts, board.id);
    assert.equal(resolved.profile.id, board.id);
    assert(resolved.layout.profileIds.includes(board.id));
  }
  assert.equal(resolveProfile(layouts, 'pico-family', 'picow').profile.id, 'picow');
  assert.equal(resolveProfile(layouts, 'raspberry-pi-40', 'raspberry-pi-4').profile.id, 'raspberry-pi-4');
  assert.equal(resolveProfile(layouts, 'pico-family', 'raspberry-pi-4').profile.id, 'pico2w');
});

test('a shared layout retains distinct processor selectors and scope', () => {
  const pico = resolveProfile(layouts, 'pico-family', 'pico').profile;
  const pico2 = resolveProfile(layouts, 'pico-family', 'pico2w').profile;
  const selector = board => board.pins[0].functions.find(fn => fn.name === 'USB OVCUR DET').selector;
  assert.equal(selector(pico), 'F9');
  assert.equal(selector(pico2), 'F10');
  assert(!pico.pins.some(pin => pin.functions.some(fn => fn.group === 'HSTX')));
  const common = resolveProfile(layouts, 'raspberry-pi-40').profile;
  const pi4 = resolveProfile(layouts, 'raspberry-pi-40', 'raspberry-pi-4').profile;
  assert(common.pins.every(pin => pin.functions.length === 0));
  assert(pi4.pins.some(pin => pin.functions.some(fn => fn.selector === 'ALT0')));
});
