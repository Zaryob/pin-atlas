/* SPDX-License-Identifier: GPL-3.0-or-later */
import {compatibleModels} from './compatibility.mjs';

// Catalog models are independent of the geometry shared in layouts.mjs.
export const boardFamilies = [
  {id:'raspberry-pi',nameKey:'familyRaspberryPi',layouts:['pico-family','raspberry-pi-40','rp2040','rp2350a','rp2350b']},
  {id:'arduino',nameKey:'familyArduino',layouts:['arduino-uno','arduino-nano','arduino-mega-2560','arduino-micro']},
  {id:'espressif',nameKey:'familyEspressif',layouts:['esp32-devkitc-v4','esp32-s3-devkitc-1','esp32-c6-devkitc-1','esp32-c3-devkitm-1']},
  {id:'stm32',nameKey:'familyStm32',layouts:['blue-pill','black-pill','nucleo-32','nucleo-64','nucleo-144',
    'stm32f401ccu6','stm32f411ceu6','stm32h743zit6','stm32f767zit6','stm32f042k6t6','stm32l432kcu6',
    'stm32f103c8t6','stm32f103rbt6','stm32f103vbt6','stm32f401ret6','stm32f411ret6','stm32g474ret6',
    'stm32h723zgt6','stm32f446ret6','stm32l476rgt6','stm32f072rbt6','stm32l053r8t6','stm32l152ret6',
    'stm32f407vgt6','stm32f405rgt6','stm32f303ret6']},
  {id:'seeed',nameKey:'familySeeed',layouts:['seeed-xiao']},
  {id:'adafruit',nameKey:'familyAdafruit',layouts:['adafruit-feather-rp2040']},
  {id:'teensy',nameKey:'familyTeensy',layouts:['teensy-41']},
  {id:'beagleboard',nameKey:'familyBeagleBoard',layouts:['beaglebone-black']},
  {id:'microbit',nameKey:'familyMicrobit',layouts:['microbit-v2']},
  {id:'microchip',nameKey:'familyMicrochip',layouts:['atmega328p-pdip28','atmega328p-tqfp32','atmega328p-qfn32','atmega328p-qfn28','atmega2560-tqfp100','atmega2561-tqfp64']},
  {id:'nvidia',nameKey:'familyNvidia',layouts:['jetson-orin-nano']}
];
export const catalogTypes = [
  {id:'all',labelKey:'catalogAll'}, {id:'boards',labelKey:'catalogBoards',filterKey:'catalogBoardsShort'},
  {id:'chips',labelKey:'catalogChips'}, {id:'headers',labelKey:'catalogHeaders'}
];
export const homeFilterChips = [{id:'all',labelKey:'catalogAllPlatforms'},
  ...boardFamilies.map(family=>({id:family.id,labelKey:family.nameKey}))];
const seriesNames = {'nucleo-32':'Nucleo-32','nucleo-64':'Nucleo-64','nucleo-144':'Nucleo-144',
  'black-pill':'WeAct Black Pill','pico-family':'Pico','seeed-xiao':'XIAO'};
const fallback = (key,params,value) => value || key;
export const normalizeCatalogText = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/ı/g,'i').replace(/[^a-z0-9]+/g,' ').trim();

export function buildCatalog(layouts,t=fallback) {
  return boardFamilies.flatMap(family=>family.layouts.flatMap(id=>{
    const layout=layouts.find(item=>item.id===id);
    if(!layout)throw new Error(`Missing catalog layout: ${id}`);
    const models=compatibleModels(layout);
    return layout.profiles.map(profile=>{
      const type=profile.id==='raspberry-pi-40'?'headers':['qfn','lqfp','dip'].includes(profile.layout)?'chips':'boards';
      const series=seriesNames[layout.id] || '';
      const detail=profile.layoutFamily?[profile.mcu,profile.clock].filter(Boolean).join(' · '):t('board.'+profile.id,{},profile.subtitle);
      // Physical-only aliases point to the documented reference, never a new MCU map.
      const aliases=models.filter(model=>model.profileId===profile.id && model.kind==='physical').map(model=>model.name);
      const primarySearchText=normalizeCatalogText([profile.name,profile.id,profile.mcu,profile.processor,profile.searchTerms,
        profile.packageName,profile.subtitle,detail,series,t(family.nameKey)].filter(Boolean).join(' '));
      const specs=[type==='chips'?profile.packageName || `${profile.layout.toUpperCase()}-${profile.packagePins}`:'',
        `${profile.uniqueGPIOCount ?? profile.gpioCount} GPIO`,profile.voltage].filter(Boolean).join(' · ');
      return {id:layout.id,profile:profile.id,name:profile.name,detail,specs,series,type,
        family:family.id,familyName:t(family.nameKey),aliases,mcuProfile:profile.mcuProfile,primarySearchText,
        searchText:normalizeCatalogText([primarySearchText,...aliases].join(' '))};
    }).sort((a,b)=>a.name.localeCompare(b.name,'en',{numeric:true}));
  }));
}
export function filterCatalog(entries,{query='',type='all',family='all'}={}) {
  const needle=normalizeCatalogText(query),terms=needle.split(' ').filter(Boolean);
  const nucleoSeries=needle.match(/\bnucleo (32|64|144)\b/)?.[1];
  const matchesTerm=(text,term)=>/^\d+$/.test(term)?text.split(' ').includes(term):text.includes(term);
  return entries.filter(entry=>(type==='all'||entry.type===type) && (family==='all'||entry.family===family)
    && (!nucleoSeries || entry.series===`Nucleo-${nucleoSeries}`)
    && terms.every(term=>matchesTerm(entry.searchText,term)))
    .map(entry=>{
      const matchedAlias=terms.length && !terms.every(term=>matchesTerm(entry.primarySearchText,term))
        ?entry.aliases.find(alias=>terms.every(term=>matchesTerm(normalizeCatalogText(alias),term))):undefined;
      return matchedAlias?{...entry,matchedAlias}:entry;
    })
    .sort((a,b)=>{
      const rank=entry=>normalizeCatalogText(entry.name)===needle||normalizeCatalogText(entry.profile)===needle?0
        :normalizeCatalogText(entry.name).includes(needle)?1:2;
      return needle?rank(a)-rank(b):0;
    });
}

const featuredProfiles = [
  ['pico-family','pico2w'],
  ['esp32-devkitc-v4','esp32-devkitc-v4'],
  ['arduino-nano','arduino-nano-classic'],
  ['seeed-xiao','xiao-rp2040'],
  ['blue-pill','blue-pill'],
  ['nucleo-32','nucleo-l432kc']
];

export function featuredCards(layouts, t = (key, params, fallback) => fallback || key) {
  return featuredProfiles.map(([layoutId, profileId]) => {
    const profile = layouts.find(layout => layout.id === layoutId)?.profiles.find(profile => profile.id === profileId);
    if (!profile) throw new Error(`Missing featured model: ${profileId}`);
    const chip = ['qfn','lqfp','dip'].includes(profile.layout);
    return {layoutId, profileId, name:profile.name, family:profile.family,
      description:t('board.'+profile.id, {}, profile.subtitle),
      specs:[`${profile.uniqueGPIOCount ?? profile.gpioCount} GPIO`, profile.voltage,
        chip ? profile.packageName || `${profile.layout.toUpperCase()}-${profile.packagePins}` : profile.mcu].filter(Boolean).join(' · ')};
  });
}
