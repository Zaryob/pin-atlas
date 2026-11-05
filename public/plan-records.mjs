/* SPDX-License-Identifier: GPL-3.0-or-later */
import {configureBoard,normalizeHardware} from './hardware-config.mjs';
import {validatePlan} from './plans.mjs';
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
export function decodePlanPayload(payload,source,fallbackHardware={},t=k=>k){
 if(!payload || ![1,2].includes(payload.version) || payload.board!==source.id ||
    (payload.version===1 && payload.hardware!==undefined) || (payload.version===2 && !object(payload.hardware)))throw new Error(t('unsupportedFormat'));
 const hardware=normalizeHardware(source,payload.version===2?payload.hardware:fallbackHardware,t);
 const target=configureBoard(source,hardware,t);
 return {source,target,hardware,pins:validatePlan(payload.pins,target,t)};
}
