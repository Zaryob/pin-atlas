import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ProfileLibrary} from '../public/profile-library.mjs';
import {buildLayouts,resolveProfile} from '../public/layouts.mjs';
const root=new URL('../public/data/',import.meta.url);
const read=name=>JSON.parse(readFileSync(new URL(name,root)));
test('catalog metadata resolves every legacy model without loading pin payloads',()=>{
 const index=read('catalog.json'),layouts=buildLayouts(index.profiles);
 assert(index.profiles.every(p=>!p.pins));
 assert(Buffer.byteLength(JSON.stringify(index))<100000);
 for(const profile of index.profiles)assert.equal(resolveProfile(layouts,profile.id).profile.id,profile.id);
});
test('profile loads deduplicate requests and retry failed chunks without discarding catalog data',async()=>{
 const index=read('catalog.json'),calls=[],references={};let fail=true;
 const library=new ProfileLibrary(index,async name=>{
  calls.push(name);if(fail)throw new Error('offline');return read(name);
 },evidence=>Object.assign(references,evidence.references));
 await assert.rejects(()=>library.ensure('picow'),/offline/);
 assert.equal(library.profiles.length,index.profiles.length);
 fail=false;
 const [a,b]=await Promise.all([library.workspace('picow'),library.workspace('picow')]);
 assert.equal(a,b);assert(a.pins.length===40);
 assert(library.profiles.find(p=>p.id==='rp2040').pins.length===56);
 assert.equal(calls.length,3); // One failure, one board retry and one linked MCU.
 assert(Object.keys(references).length>0);
 await library.workspace('picow');assert.equal(calls.length,3);
});
