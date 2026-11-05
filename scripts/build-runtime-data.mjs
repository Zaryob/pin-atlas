/* SPDX-License-Identifier: GPL-3.0-or-later */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,readdirSync,unlinkSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {buildLayouts} from '../public/layouts.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const boards=JSON.parse(readFileSync(root+'public/data/boards.json'));
const evidence=JSON.parse(readFileSync(root+'public/data/evidence.json'));
const layouts=buildLayouts(boards); // Validate full geometry before producing metadata.
const files=new Map(),profiles=[];
for(const board of boards){
 const keys=new Set(board.pins.flatMap(pin=>[...pin.evidence,...pin.functions.flatMap(fn=>[fn.evidence,fn.configurationEvidence].filter(Boolean))]));
 const references=Object.fromEntries([...keys].map(key=>[key,evidence.references[key]]));
 const documentIds=new Set(Object.values(references).map(ref=>ref.document));
 const documents=evidence.documents.filter(doc=>documentIds.has(doc.id));
 const content=JSON.stringify({profile:board,evidence:{references,documents}})+'\n';
 const digest=createHash('sha256').update(content).digest('hex').slice(0,16);
 const dataFile=`profiles/${board.id}.${digest}.json`;
 files.set(dataFile,content);
 const {pins,diagram,...metadata}=board;
 profiles.push({...metadata,physicalLayout:layouts.find(layout=>layout.profileIds.includes(board.id)).id,dataFile,
  functionAssignments:pins.reduce((n,p)=>n+p.functions.length,0)});
}
files.set('catalog.json',JSON.stringify({version:1,verifiedOn:boards[0].verifiedOn,
 totals:{pins:boards.reduce((n,b)=>n+b.pins.length,0),functions:profiles.reduce((n,b)=>n+b.functionAssignments,0),sources:evidence.documents.length},profiles})+'\n');
const write=process.argv.includes('--write'),directory=root+'public/data/';
if(write)mkdirSync(directory+'profiles',{recursive:true});
for(const [name,content] of files){
 if(write)writeFileSync(directory+name,content);
 else if(!existsSync(directory+name)||readFileSync(directory+name,'utf8')!==content)throw new Error(`Runtime data differs: ${name}. Run npm run build:data after reviewing source data.`);
}
if(existsSync(directory+'profiles'))for(const name of readdirSync(directory+'profiles')){
 if(files.has('profiles/'+name))continue;
 if(write)unlinkSync(directory+'profiles/'+name);else throw new Error(`Obsolete runtime profile: ${name}`);
}
console.log(`Runtime catalog: ${profiles.length} profiles, ${Buffer.byteLength(files.get('catalog.json'))} bytes at startup; pin data loads on demand.`);
