/* SPDX-License-Identifier: GPL-3.0-or-later */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,readdirSync,unlinkSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {buildLayouts} from '../public/layouts.mjs';
import {compileHardwareDetails,hardwareResearchReport} from './hardware-details.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const boards=JSON.parse(readFileSync(root+'public/data/boards.json'));
const evidence=JSON.parse(readFileSync(root+'public/data/evidence.json'));
const research=compileHardwareDetails(JSON.parse(readFileSync(root+'sources/hardware-details.json')),boards);
const layouts=buildLayouts(boards); // Validate full geometry before producing metadata.
const files=new Map(),profiles=[];
for(const board of boards){
 const keys=new Set([...board.pins.flatMap(pin=>[...pin.evidence,...pin.functions.flatMap(fn=>[fn.evidence,fn.configurationEvidence].filter(Boolean))]),...(board.hardware?.controls.flatMap(control=>control.evidence)||[]),
  ...board.pins.flatMap(pin=>Object.values(pin.noteEvidence||{}).flat()),...(board.cautions||[]).flatMap(item=>item.evidence)]);
 const references=Object.fromEntries([...keys].map(key=>[key,evidence.references[key]]));
 const documentIds=new Set(Object.values(references).map(ref=>ref.document));
 const documents=evidence.documents.filter(doc=>documentIds.has(doc.id));
 const content=JSON.stringify({profile:{...board,research:research.get(board.id)},evidence:{references,documents}})+'\n';
 const digest=createHash('sha256').update(content).digest('hex').slice(0,16);
 const dataFile=`profiles/${board.id}.${digest}.json`;
 files.set(dataFile,content);
 const {pins,diagram,hardware,...metadata}=board;
 profiles.push({...metadata,physicalLayout:layouts.find(layout=>layout.profileIds.includes(board.id)).id,dataFile,
  functionAssignments:pins.reduce((n,p)=>n+p.functions.length,0)});
}
files.set('catalog.json',JSON.stringify({version:1,verifiedOn:boards[0].verifiedOn,
 totals:{pins:boards.reduce((n,b)=>n+b.pins.length,0),functions:profiles.reduce((n,b)=>n+b.functionAssignments,0),sources:evidence.documents.length},profiles})+'\n');
const write=process.argv.includes('--write'),directory=root+'public/data/';
if(write) {
  mkdirSync(directory+'profiles',{recursive:true});
  const searchEntries = [];
  // Each language's entry uses that language's subtitle from the interface dictionary (board.<id>).
  const dictionary = readFileSync(root+'public/i18n.js','utf8');
  const localized = (id, index, fallback) => {
    const line = dictionary.split('\n').find(row => row.trimStart().startsWith(JSON.stringify('board.'+id)+':'));
    if (!line) return fallback;
    return JSON.parse(line.slice(line.indexOf(':')+1).trim().replace(/,$/,''))[index] || fallback;
  };
  for (const p of profiles) {
    const url = `/pin-atlas/?q=${encodeURIComponent(p.name)}&highlight=${encodeURIComponent(p.name)}#board=${encodeURIComponent(p.layout)}&profile=${encodeURIComponent(p.id)}`;
    for (const lang of ['tr', 'en']) {
      const desc = localized(p.id, lang === 'tr' ? 0 : 1, p.subtitle || '') + (p.mcu ? ' · ' + p.mcu : '') + (p.family ? ' · ' + p.family : '');
      searchEntries.push({ lang, title: p.name, url, type: 'pin-atlas/', description: desc });
    }
  }
  writeFileSync(root+'public/search.json', JSON.stringify(searchEntries, null, 2) + '\n');
}
for(const [name,content] of files){
 if(write)writeFileSync(directory+name,content);
 else if(!existsSync(directory+name)||readFileSync(directory+name,'utf8')!==content)throw new Error(`Runtime data differs: ${name}. Run npm run build:data after reviewing source data.`);
}
if(existsSync(directory+'profiles'))for(const name of readdirSync(directory+'profiles')){
 if(files.has('profiles/'+name))continue;
 if(write)unlinkSync(directory+'profiles/'+name);else throw new Error(`Obsolete runtime profile: ${name}`);
}
for(const language of ['en','tr']){
 const path=root+`docs/HARDWARE-REFERENCE${language==='tr'?'.tr':''}.md`;
 const content=hardwareResearchReport(research,boards,layouts,language);
 if(write)writeFileSync(path,content);
 else if(!existsSync(path)||readFileSync(path,'utf8')!==content)throw new Error(`Hardware reference differs: ${path}. Run npm run build:data.`);
}
console.log(`Runtime catalog: ${profiles.length} profiles, ${Buffer.byteLength(files.get('catalog.json'))} bytes at startup; pin data loads on demand.`);
