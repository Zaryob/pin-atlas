import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildLayouts,resolveProfile} from '../public/layouts.mjs';
import {compatibleModels,filterCompatibleModels} from '../public/compatibility.mjs';
const boards=JSON.parse(readFileSync(new URL('../public/data/boards.json',import.meta.url)));
const layouts=buildLayouts(boards);

test('compatible model links stay within their verified source profiles',()=>{
  for(const layout of layouts){
    const models=compatibleModels(layout);
    assert.equal(new Set(models.map(model=>model.id)).size,models.length);
    for(const model of models){
      assert(layout.profileIds.includes(model.profileId));
      assert.equal(resolveProfile(layouts,layout.id,model.profileId).profile.id,model.profileId);
      assert(model.name && model.name!=='GND' && model.name!=='GPIO6');
    }
  }
});
test('Pi 5 and Zero models open the common pinout, never the Pi 4 mux reference',()=>{
  const models=compatibleModels(layouts.find(layout=>layout.id==='raspberry-pi-40'));
  for(const model of models.filter(model=>model.id!=='raspberry-pi-4')){
    assert.equal(model.profileId,'raspberry-pi-40');assert.equal(model.kind,'physical');
  }
  assert.equal(models.find(model=>model.id==='raspberry-pi-4').profileId,'raspberry-pi-4');
  assert.equal(filterCompatibleModels(models,' ZERO ').length,3);
});
test('Pico model slots and memory-restricted ESP references remain separately addressable',()=>{
  assert.deepEqual(compatibleModels(layouts.find(l=>l.id==='pico-family')).map(m=>m.profileId),['pico','picow','pico2','pico2w']);
  for(const id of ['esp32-devkitc-v4','esp32-s3-devkitc-1']){
    const models=compatibleModels(layouts.find(l=>l.id===id));
    assert.equal(models.length,2);assert.notEqual(models[0].profileId,models[1].profileId);
  }
  for(const board of boards.filter(board=>board.family==='Espressif'))assert(board.name.startsWith('ESP32'));
});
