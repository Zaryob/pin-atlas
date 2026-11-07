/* SPDX-License-Identifier: GPL-3.0-or-later */
import {configureBoard,normalizeHardware} from './hardware-config.mjs';
import {validatePlan,physicalLabel} from './plans.mjs';
export const legacyStorageKey='pin-atlas:plans:v1';
export const configuredStorageKey='pin-atlas:plans:v2';
const object=value=>value && typeof value==='object' && !Array.isArray(value);
function readObject(storage,key){const value=JSON.parse(storage.getItem(key)||'{}');return object(value)?value:{};}
export function readPlanRecords(storage,fallback={}){
 let legacy,configured;
 try{legacy=readObject(storage,legacyStorageKey);}catch{}
 try{configured=readObject(storage,configuredStorageKey);}catch{}
 const records=Object.fromEntries(Object.entries(legacy||{}).map(([id,pins])=>[id,{version:1,pins}]));
 for(const [id,record] of Object.entries(fallback))if((record.version===1&&!legacy)||(record.version===2&&!configured))records[id]=record;
 for(const [id,record] of Object.entries(configured||{}))if(record?.version===2 && object(record.pins) && object(record.hardware))records[id]=record;
 return records;
}
export function writePlanRecord(storage,source,pins,hardware){
 if(source.hardware){
  const records=readObject(storage,configuredStorageKey);
  records[source.id]={version:2,pins,hardware:normalizeHardware(source,hardware)};
  // One atomic write keeps pins and the hardware interpretation together.
  storage.setItem(configuredStorageKey,JSON.stringify(records));
 }else{
  const legacy=readObject(storage,legacyStorageKey);legacy[source.id]=pins;
  storage.setItem(legacyStorageKey,JSON.stringify(legacy));
 }
}
export function planPayload(source,pins,hardware={}){
 return source.hardware?{version:2,board:source.id,pins,hardware:normalizeHardware(source,hardware)}:{version:1,board:source.id,pins};
}

// Downloaded files describe physical contacts; compact share/storage records stay v1/v2.
export function exportPlanPayload(source,pins,hardware={},evidence={references:{},documents:[]}) {
 const target=configureBoard(source,hardware),keys=new Set();
 const rows=Object.entries(pins).map(([number,entry])=>{
  const pin=target.pins.find(pin=>String(pin.number)===number);
  const fn=pin.functions.find(fn=>fn.name===entry.function);
  const references=[...new Set([...pin.evidence,fn?.evidence,fn?.configurationEvidence].filter(Boolean))].sort();
  references.forEach(key=>keys.add(key));
  return {physical:physicalLabel(pin),signal:pin.name,mcuPin:pin.mcuPin??null,
   function:entry.function,selector:fn?.selector||null,label:entry.label,...(entry.sharedPWM === true ? {sharedPWM:true} : {}),sources:references};
 }).sort((a,b)=>a.physical.localeCompare(b.physical,'en',{numeric:true}));
 for(const control of source.hardware?.controls||[])control.evidence.forEach(key=>keys.add(key));
 const references=Object.fromEntries([...keys].sort().filter(key=>evidence.references[key]).map(key=>[key,evidence.references[key]]));
 const documentIds=new Set(Object.values(references).map(ref=>ref.document));
 const documents=(evidence.documents||[]).filter(doc=>documentIds.has(doc.id))
  .map(({id,title,revision,url,sha256})=>({id,title,revision,url,sha256})).sort((a,b)=>a.id.localeCompare(b.id));
 return {version:3,board:source.id,hardware:normalizeHardware(source,hardware),pins:rows,
  provenance:{profile:{id:source.id,name:source.name,verifiedOn:source.verifiedOn,
   file:source.dataFile||null,revision:source.dataFile?.match(/\.([a-f0-9]{16})\.json$/)?.[1]||null},documents,references}};
}
export function decodePlanPayload(payload,source,fallbackHardware={},t=k=>k){
 if(!payload || ![1,2,3].includes(payload.version) || payload.board!==source.id ||
    (payload.version===1 && payload.hardware!==undefined) || (payload.version>=2 && !object(payload.hardware)))throw new Error(t('unsupportedFormat'));
 const hardware=normalizeHardware(source,payload.version>=2?payload.hardware:fallbackHardware,t);
 const target=configureBoard(source,hardware,t);
 let pins=payload.pins,revisionMismatch=false;
 if(payload.version===3) {
  if(!Array.isArray(pins)||pins.length>target.pins.length||!object(payload.provenance?.profile)||
     payload.provenance.profile.id!==source.id)throw new Error(t('unsupportedFormat'));
  const entries={};
  for(const row of pins) {
   const pin=target.pins.find(pin=>physicalLabel(pin)===row?.physical);
   const fn=pin?.functions.find(fn=>fn.name===row.function);
   if(!pin || entries[pin.number] || row.signal!==pin.name || row.mcuPin!==(pin.mcuPin??null) ||
      row.selector!==(fn?.selector||null))throw new Error(t('exportContactChanged'));
   entries[pin.number]={function:row.function,label:row.label,...(row.sharedPWM !== undefined ? {sharedPWM:row.sharedPWM} : {})};
  }
  pins=entries;
  revisionMismatch=!!(source.dataFile && payload.provenance.profile.file && source.dataFile!==payload.provenance.profile.file);
 }
 return {source,target,hardware,pins:validatePlan(pins,target,t),revisionMismatch};
}
