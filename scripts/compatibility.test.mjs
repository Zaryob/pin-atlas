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
test('Pi 4 and Pi 5 open their verified mux references; Zero models open the common pinout',()=>{
  const models=compatibleModels(layouts.find(layout=>layout.id==='raspberry-pi-40'));
  for(const model of models.filter(model=>!['raspberry-pi-4','raspberry-pi-5'].includes(model.id))){
    assert.equal(model.profileId,'raspberry-pi-40');assert.equal(model.kind,'physical');
  }
  assert.equal(models.find(model=>model.id==='raspberry-pi-4').profileId,'raspberry-pi-4');
  assert.equal(models.find(model=>model.id==='raspberry-pi-5').profileId,'raspberry-pi-5');
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
