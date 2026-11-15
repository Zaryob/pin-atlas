import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildLayouts,resolveProfile} from '../public/layouts.mjs';
import {compatibleModels,filterCompatibleModels,normalizeCatalogText} from '../public/compatibility.mjs';
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
test('Pi models with a verified mux reference open it; the rest open the common pinout',()=>{
  const references=['raspberry-pi-3b-plus','raspberry-pi-4','raspberry-pi-5','raspberry-pi-zero-w','raspberry-pi-zero-2-w','raspberry-pi-500'];
  const models=compatibleModels(layouts.find(layout=>layout.id==='raspberry-pi-40'));
  for(const model of models.filter(model=>!references.includes(model.id))){
    assert.equal(model.profileId,'raspberry-pi-40');assert.equal(model.kind,'physical');
  }
  for(const id of references){
    const model=models.find(model=>model.id===id);
    assert.equal(model.profileId,id);assert.equal(model.kind,'reference');assert.notEqual(model.detailKey,'commonReference');
  }
  assert.equal(filterCompatibleModels(models,' ZERO ').length,3);
});
test('Pico model slots and memory-restricted ESP references remain separately addressable',()=>{
  assert.deepEqual(compatibleModels(layouts.find(l=>l.id==='pico-family')).map(m=>m.profileId),['pico','picow','pico2','pico2w']);
  for(const id of ['esp32-devkitc-v4','esp32-s3-devkitc-1']){
    const models=compatibleModels(layouts.find(l=>l.id===id));
    assert.equal(models.length,2);assert.notEqual(models[0].profileId,models[1].profileId);
  }
  for(const board of boards.filter(board=>board.family==='Espressif'))assert(board.name.startsWith('ESP32') || board.name.startsWith('NodeMCU'));
});
test('model search ignores the browser locale (Turkish dotless i)',()=>{
  const models=[{id:'nucleo-f767zi',name:'NUCLEO-F767ZI',detail:'STM32F767ZIT6'},
    {id:'nucleo-f446re',name:'NUCLEO-F446RE',detail:'STM32F446RET6'}];
  const original=String.prototype.toLocaleLowerCase;
  // Emulate a tr-TR browser: locale-aware lowercasing maps "I" to dotless "ı".
  String.prototype.toLocaleLowerCase=function(){return original.call(this,'tr-TR');};
  try{
    for(const query of ['f767zi','F767ZI','f767zı','F767Zİ',' nucleo-f767zi ']){
      assert.deepEqual(filterCompatibleModels(models,query).map(model=>model.id),['nucleo-f767zi'],query);
    }
  }finally{String.prototype.toLocaleLowerCase=original;}
  for(const value of ['F767ZI','f767zi','F767Zİ','f767zı'])assert.equal(normalizeCatalogText(value),'f767zi',value);
  assert.equal(normalizeCatalogText('İı Iİ'),'ii ii');
  assert.equal(filterCompatibleModels(models,'').length,2);
});
