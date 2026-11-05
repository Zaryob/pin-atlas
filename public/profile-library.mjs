/* SPDX-License-Identifier: GPL-3.0-or-later */
export class ProfileLibrary {
 constructor(index,fetchJSON,onEvidence=()=>{}) {
  if(index.version!==1 || !Array.isArray(index.profiles))throw new Error('Unsupported catalog');
  this.index=index;this.profiles=index.profiles;this.fetchJSON=fetchJSON;this.onEvidence=onEvidence;this.pending=new Map();
 }
 async ensure(id){
  const target=this.profiles.find(p=>p.id===id);
  if(!target)throw new Error('Unknown profile');
  if(target.pins)return target;
  if(this.pending.has(id))return this.pending.get(id);
  const operation=(async()=>{
   if(!/^profiles\/[a-z0-9-]+\.[a-f0-9]{16}\.json$/.test(target.dataFile))throw new Error('Invalid profile path');
   const bundle=await this.fetchJSON(target.dataFile);
   if(bundle.profile?.id!==id || !Array.isArray(bundle.profile.pins) || !bundle.evidence?.references)throw new Error('Invalid profile data');
   this.onEvidence(bundle.evidence);Object.assign(target,bundle.profile);return target;
  })();
  this.pending.set(id,operation);
  try{return await operation;}finally{this.pending.delete(id);}
 }
 async workspace(id){
  const profile=await this.ensure(id);
  const dependencies=profile.mcuProfile?[profile.mcuProfile]:this.profiles.filter(p=>p.mcuProfile===id).map(p=>p.id);
  await Promise.all(dependencies.map(id=>this.ensure(id)));
  return profile;
 }
}
