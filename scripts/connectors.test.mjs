import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {connectorGroupsFor} from '../public/connectors.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json', import.meta.url)));

test('connector navigation covers each exposed connector with no empty group', () => {
  for (const board of boards) {
    const groups=connectorGroupsFor(board);
    assert.equal(new Set(groups.map(group=>group.id)).size, groups.length, board.id);
    const actual=[...new Set(board.pins.map(pin=>pin.connector).filter(Boolean))].sort();
    assert.deepEqual(groups.flatMap(group=>group.contacts).sort(), actual, board.id);
    for (const group of groups) assert(board.pins.some(pin=>group.contacts.includes(pin.connector)));
  }
});

test('Nucleo-144 uses Zio and Morpho groups rather than the Nucleo-64 connector list', () => {
  const h7=boards.find(board=>board.id==='nucleo-h723zg');
  assert.deepEqual(connectorGroupsFor(h7).map(group=>[group.id,group.label]), [
    ['CN7','ST Zio · CN7'],['CN8','ST Zio · CN8'],['CN9','ST Zio · CN9'],['CN10','ST Zio · CN10'],['CN11','ST Morpho · CN11'],['CN12','ST Morpho · CN12']
  ]);
  const f1=boards.find(board=>board.id==='nucleo-f103rb');
  const arduino=connectorGroupsFor(f1).find(group=>group.id==='arduino');
  assert.equal(f1.pins.filter(pin=>arduino.contacts.includes(pin.connector)).length,32);
});

test('stale navigation metadata never exposes an empty connector', () => {
  const board={pins:[{connector:'P1'}],diagram:{connectorGroups:[{id:'missing',contacts:['CN10']}]}};
  assert.deepEqual(connectorGroupsFor(board),[{id:'P1',label:'P1',contacts:['P1']}]);
});
