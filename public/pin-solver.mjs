/* SPDX-License-Identifier: GPL-3.0-or-later */
import {availablePeripherals,peripheralSignal} from './peripherals.mjs';
import {validatePlan,samePlan} from './plans.mjs';
import {electricalKeys} from './hardware-config.mjs';
import {pinNotes,circuitNotes} from './pin-notes.mjs';

// All assignments are locked, including labels. Search only extends a valid plan.
// A bounded search is intentionally reported as incomplete rather than impossible.
export function suggestPins(board,requests,assignments={},options={}){
 const {maxNodes=20000,maxAlternatives=3,includeSPIChipSelect=true}=options;
 const counts=Object.fromEntries(['SPI','I2C','UART','CAN'].map(group=>[group,Number(requests?.[group]??0)]));
 if(Object.values(counts).some(n=>!Number.isInteger(n)||n<0||n>4)||Object.values(counts).reduce((a,b)=>a+b,0)>6||!Object.values(counts).some(Boolean))return {status:'invalid',alternatives:[],nodes:0};
 try{validatePlan(assignments,board,k=>k);}catch(error){return {status:'blocked',error:error.message,alternatives:[],nodes:0};}
 const buses=availablePeripherals(board,{includeSPIChipSelect}),locked=new Map();
 for(const [number,entry] of Object.entries(assignments)){
  const pin=board.pins.find(p=>String(p.number)===number),fn=pin.functions.find(f=>f.name===entry.function),signal=fn&&peripheralSignal(fn);
  if(signal){const key=signal.id+':'+signal.role;if(!locked.has(key))locked.set(key,[]);locked.get(key).push({pin,fn,role:signal.role});}
 }
 const complete=bus=>bus.roles.every(role=>locked.has(bus.id+':'+role));
 const completed=buses.filter(complete),tasks=[],byGroup={};
 for(const group of Object.keys(counts)){
  byGroup[group]=buses.filter(b=>b.group===group&&!complete(b)).sort((a,b)=>{
   const partial=bus=>bus.roles.filter(role=>locked.has(bus.id+':'+role)).length;
   return partial(b)-partial(a)||a.id.localeCompare(b.id,undefined,{numeric:true});
  });
  const needed=Math.max(0,counts[group]-completed.filter(b=>b.group===group).length);
  if(needed>byGroup[group].length)return {status:'impossible',alternatives:[],nodes:0};
  for(let i=0;i<needed;i++)tasks.push(group);
 }
 tasks.sort((a,b)=>byGroup[a].length-byGroup[b].length);
 let nodes=0,truncated=false,solutions=0;
 const alternatives=[],seen=new Set();
 const limit=()=>{if(nodes>=maxNodes||solutions>=Math.max(30,maxAlternatives*30)){truncated=true;return true;}return false;};
 const warning=pin=>pinNotes(pin).specific.length;
 function record(plan,chosen){
  const connections=[...completed,...chosen].filter(bus=>counts[bus.group]).map(bus=>({id:bus.id,group:bus.group,signals:bus.roles.map(role=>{
   const c=bus.candidates.find(c=>c.role===role&&plan[c.pin.number]?.function===c.fn.name);
   return {role,pin:c.pin.number,function:c.fn.name,selector:c.fn.selector||'',evidence:c.fn.evidence};
  })}));
  const addedPins=Object.keys(plan).filter(key=>!assignments[key]);
  const signature=connections.map(bus=>bus.id+':'+bus.signals.map(s=>s.role+'@'+electricalKeys(board.pins.find(p=>p.number===s.pin)).join(',')).join(';')).sort().join('|');
  if(seen.has(signature))return;seen.add(signature);solutions++;
  const warnings=circuitNotes(Object.keys(plan).map(n=>board.pins.find(p=>String(p.number)===n))).length;
  alternatives.push({pins:plan,connections,addedPins:addedPins.length,warnings});
  alternatives.sort((a,b)=>a.addedPins-b.addedPins||a.warnings-b.warnings);
  alternatives.splice(maxAlternatives);
 }
 function visitTask(index,plan,chosen,starts){
  if(limit())return;
  if(index===tasks.length){record(plan,chosen);return;}
  const group=tasks[index],list=byGroup[group],start=starts[group]||0;
  const remaining=tasks.slice(index).filter(g=>g===group).length;
  for(let i=start;i<=list.length-remaining;i++){
   const bus=list[i];
   const choices=bus.roles.map(role=>{
    const fixed=locked.get(bus.id+':'+role);
    const candidates=fixed?.length?[fixed[0]]:bus.candidates.filter(c=>c.role===role);
    const unique=new Map();
    for(const c of candidates.sort((a,b)=>warning(a.pin)-warning(b.pin)||Number(!a.pin.boardLabel)-Number(!b.pin.boardLabel)||a.pin.number-b.pin.number)){
     if(plan[c.pin.number]&&plan[c.pin.number].function!==c.fn.name)continue;
     const key=electricalKeys(c.pin).sort().join(',')+'|'+c.fn.name;
     if(!unique.has(key))unique.set(key,c);
    }
    return [...unique.values()];
   }).sort((a,b)=>a.length-b.length);
   function route(roleIndex,next){
    if(limit())return;
    if(roleIndex===choices.length){visitTask(index+1,next,[...chosen,bus],{...starts,[group]:i+1});return;}
    for(const c of choices[roleIndex]){
     if(limit())return;
     nodes++;
     if(next[c.pin.number]&&next[c.pin.number].function!==c.fn.name)continue;
     const updated={...next,[c.pin.number]:next[c.pin.number]||{function:c.fn.name,label:''}};
     try{validatePlan(updated,board,k=>k);}catch{continue;}
     route(roleIndex+1,updated);if(limit())return;
    }
   }
   route(0,plan);if(limit())return;
  }
 }
 visitTask(0,{...assignments},[],{});
 return {status:alternatives.length?'ready':truncated?'limited':'impossible',alternatives,nodes,truncated};
}

// Recheck at application time; a worker result is never authority to overwrite.
export function applySuggestion(current,alternative,board,t=k=>k){
 const preserved=Object.fromEntries(Object.keys(current).map(key=>[key,alternative.pins[key]]));
 if(!samePlan(current,preserved))throw new Error(t('suggestStale'));
 return validatePlan(alternative.pins,board,t);
}
