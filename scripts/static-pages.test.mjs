/* SPDX-License-Identifier: GPL-3.0-or-later */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {buildLayouts,resolveProfile,resolveLinkTarget} from '../public/layouts.mjs';
import {boardFamilies} from '../public/catalog.mjs';
import {boardPath,indexPath,languages,atlasHash} from './static-pages.mjs';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const boards=JSON.parse(read('public/data/boards.json'));
const {profiles}=JSON.parse(read('public/data/catalog.json'));
const {references}=JSON.parse(read('public/data/evidence.json'));
const layouts=buildLayouts(boards);
const site=JSON.parse(read('package.json')).homepage;
// What the application opens for a link, following loadHash in public/app.js.
const opened=href=>{
  const url=new URL(href,site),params=new URLSearchParams(url.hash.slice(1));
  const link=resolveLinkTarget(layouts,{board:params.get('board'),profile:params.get('profile')});
  return {url,link,profile:link.layout?resolveProfile(layouts,link.layout,link.profile).profile.id:undefined};
};

test('every search index entry opens its own profile without a pin filter',()=>{
  const entries=JSON.parse(read('public/search.json'));
  assert.equal(entries.length,profiles.length*2);
  profiles.forEach((profile,index)=>{
    for(const entry of entries.slice(index*2,index*2+2)){
      assert.equal(entry.title,profile.name);
      const {url,link,profile:target}=opened(entry.url);
      assert.equal(url.pathname,new URL(site).pathname,entry.url);
      assert.equal(url.search,'',`${entry.url} must not carry a query: the app reads q as a pin filter`);
      assert.equal(target,profile.id,entry.url);
      assert.equal(link.layout,profile.physicalLayout,entry.url);
      assert.equal(link.unknown,undefined,entry.url);
    }
    assert.deepEqual(entries.slice(index*2,index*2+2).map(entry=>entry.lang),['tr','en']);
  });
});

test('a profile id decides the target, alone or beside a stale board value',()=>{
  for(const profile of profiles){
    // Older search links named the renderer type (custom, header, pico, lqfp, qfn, dip) as the board.
    assert.equal(opened(`#board=${profile.layout}&profile=${profile.id}`).profile,profile.id);
    assert.equal(opened(`#profile=${profile.id}`).profile,profile.id);
    assert.equal(opened(`#board=${profile.id}`).profile,profile.id);
  }
  for(const layout of layouts)assert.equal(opened(`#board=${layout.id}`).profile,layout.defaultProfile);
});

test('an unknown board or profile is reported instead of opening the default board',()=>{
  assert.deepEqual(resolveLinkTarget(layouts,{board:'custom'}),{unknown:'custom'});
  assert.deepEqual(resolveLinkTarget(layouts,{board:'custom',profile:'no-such-board'}),{unknown:'no-such-board'});
  assert.deepEqual(resolveLinkTarget(layouts,{profile:'no-such-board'}),{unknown:'no-such-board'});
  assert.deepEqual(resolveLinkTarget(layouts,{board:'pico-family',profile:'no-such-board'}),{layout:'pico-family',unknown:'no-such-board'});
  assert.deepEqual(resolveLinkTarget(layouts,{}),{unknown:''});
});

test('each profile has a generated page in both languages with its own title, canonical and full pin table',()=>{
  const titles=new Set();
  for(const language of languages)for(const profile of profiles){
    const path=boardPath(profile.id,language),html=read(`public/${path}index.html`);
    const board=boards.find(item=>item.id===profile.id);
    const title=JSON.parse(html.match(/^title: (.*)$/m)[1]);
    assert.ok(title.startsWith(profile.name+' ') && title.endsWith('— Pin Atlas'),title);
    assert.ok(language==='tr'||title===`${profile.name} pinout — Pin Atlas`,title);
    assert.ok(!titles.has(title),`Duplicate title: ${title}`);titles.add(title);
    assert.equal(JSON.parse(html.match(/^canonical: (.*)$/m)[1]),site+path);
    assert.equal(JSON.parse(html.match(/^alternate_tr: (.*)$/m)[1]),site+boardPath(profile.id,'tr'));
    const description=JSON.parse(html.match(/^description: (.*)$/m)[1]);
    assert.ok(description.includes(profile.name) && description.includes(String(board.pins.length)),description);
    assert.equal(html.match(/<tr id="pin-/g).length,board.pins.length,path);
    assert.equal(html.match(/<h1>/g).length,1,path);
    assert.ok(html.includes(`href="${language==='tr'?'../../../':'../../'}${atlasHash(profile).replace('&','&amp;')}"`),path);
    for(const caution of board.cautions||[])for(const key of caution.evidence)assert.ok(html.includes(`href="${references[key].url.replaceAll('&','&amp;')}"`),`${path} caution source ${key}`);
    JSON.parse(JSON.parse(html.match(/^json_ld: (.*)$/m)[1]));
  }
});

test('the index lists every profile once under its platform and the sitemap covers every page',()=>{
  const sitemap=read('public/sitemap.xml');
  const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
  assert.equal(new Set(locations).size,locations.length);
  assert.deepEqual(locations,[site,...languages.map(language=>site+indexPath(language)),
    ...profiles.flatMap(profile=>languages.map(language=>site+boardPath(profile.id,language)))]);
  for(const location of locations.slice(1))assert.ok(existsSync(new URL('public/'+location.slice(site.length)+'index.html',root)),location);
  for(const language of languages){
    const html=read(`public/${indexPath(language)}index.html`);
    for(const profile of profiles)assert.equal(html.split(`<a href="${profile.id}/">`).length,2,profile.id);
    assert.equal(html.match(/<section class="static-section"/g).length,boardFamilies.length);
  }
});
