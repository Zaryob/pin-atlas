/* SPDX-License-Identifier: GPL-3.0-or-later */
export function normalizeHardware(board,settings={},t=k=>k){
 if(!settings || typeof settings!=='object' || Array.isArray(settings))throw new Error(t('hwInvalid'));
 const controls=board.hardware?.controls || [],known=new Set(controls.map(c=>c.id));
 if(Object.keys(settings).some(key=>!known.has(key)))throw new Error(t('hwInvalid'));
 return Object.fromEntries(controls.map(control=>{
  const value=settings[control.id]??control.default;
  if(!control.options.some(option=>option.value===value))throw new Error(t('hwInvalid'));
  return [control.id,value];
 }));
}
export function sameHardware(first={},second={}){
 const keys=new Set([...Object.keys(first),...Object.keys(second)]);
 return [...keys].every(key=>first[key]===second[key]);
}
export function hardwareSummary(board,settings=board.appliedHardware||{},t=k=>k){
 const normalized=normalizeHardware(board,settings,t);
 return (board.hardware?.controls||[]).map(control=>({id:control.id,label:t(control.labelKey),
  value:t(control.options.find(option=>option.value===normalized[control.id]).key),evidence:control.evidence}));
}
export function electricalKeys(pin){
 return [...new Set([pin.mcuPin!==undefined?'pad:'+pin.mcuPin:'net:'+(pin.net||pin.name||pin.number),
  ...(pin.coupledPads||[]).map(pad=>'pad:'+pad)])];
}
export function configureBoard(source,settings={},t=k=>k){
 const applied=normalizeHardware(source,settings,t);
 if(!source.hardware)return source;
 const base=new Map(source.pins.map(pin=>[pin.number,pin]));
 const pins=source.pins.map(pin=>({...pin,functions:[...pin.functions],evidence:[...pin.evidence],hardwareBlocks:[],hardwareRoutes:[]}));
 const byNumber=new Map(pins.map(pin=>[pin.number,pin])),netBlocks=[];
 // Preserve all source-backed routes for read-only restoration after a setting changes.
 for(const control of source.hardware.controls){
  for(const effect of control.effects){
   for(const route of effect.routes||[]){
    const pin=byNumber.get(route.pin),via=base.get(route.via);
    pin.inactiveFunctions=[...new Set([...(pin.inactiveFunctions||[]),...pin.functions.map(fn=>fn.name),...via.functions.map(fn=>fn.name)])];
   }
  }
 }
 for(const control of source.hardware.controls){
  for(const effect of control.effects.filter(effect=>effect.when.includes(applied[control.id]))){
   for(const route of effect.routes||[]){
    const pin=byNumber.get(route.pin),via=base.get(route.via),original=base.get(route.pin);
    pin.name=via.name;pin.net=via.net||via.name;pin.mcuPin=via.mcuPin;pin.functions=[...via.functions];
    for(const key of ['fiveVoltTolerant','mcuPort','analogCautionKey']){
     if(via[key]===undefined)delete pin[key];else pin[key]=via[key];
    }
    pin.evidence=[...new Set([...pin.evidence,...via.evidence,...control.evidence])];
    pin.coupledPads=(route.floating||[]).length?[original.mcuPin,via.mcuPin].filter(pad=>pad!==undefined):[];
    pin.hardwareRoutes.push({control:control.id,from:original.name,to:via.name,floating:route.floating||[]});
   }
   for(const number of effect.block||[]){
    if(effect.scope==='contact')byNumber.get(number).hardwareBlocks.push(control.id);
    else netBlocks.push({keys:electricalKeys(base.get(number)),control:control.id});
   }
  }
 }
 for(const pin of pins){
  const keys=electricalKeys(pin);
  for(const block of netBlocks)if(block.keys.some(key=>keys.includes(key)))pin.hardwareBlocks.push(block.control);
  pin.hardwareBlocks=[...new Set(pin.hardwareBlocks)];pin.hardwareBlocked=pin.hardwareBlocks.length>0;
  pin.evidence=[...new Set([...pin.evidence,...pin.hardwareBlocks.flatMap(id=>source.hardware.controls.find(control=>control.id===id).evidence)])];
  if(pin.type==='GPIO')pin.sharedWith=pins.filter(other=>other!==pin && electricalKeys(other).some(key=>keys.includes(key))).map(other=>other.physicalLabel||String(other.number));
 }
 return {...source,pins,appliedHardware:applied};
}
