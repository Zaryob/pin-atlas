/* SPDX-License-Identifier: GPL-3.0-or-later */
import {physicalLabel,planReference,validatePlan} from './plans.mjs';
import {hardwareSummary} from './hardware-config.mjs';
import {pwmNotes} from './pwm-resources.mjs';
export const escapeText=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function planReport(board,assignments,evidence,t=k=>k){
 const sources=new Map();
 const rows=Object.entries(assignments).map(([number,entry])=>{
  const pin=board.pins.find(pin=>String(pin.number)===number);
  const fn=pin.functions.find(fn=>fn.name===entry.function);
  const keys=[...new Set([...pin.evidence,fn?.evidence,fn?.configurationEvidence].filter(Boolean))];
  for(const key of keys)if(evidence.references[key])sources.set(key,evidence.references[key]);
  return {physical:physicalLabel(pin),name:pin.name,function:entry.function,label:entry.label,selector:fn?.selector||'',keys};
 });
 const hardware=hardwareSummary(board,board.appliedHardware||{},t);
 for(const row of hardware)for(const key of row.evidence)if(evidence.references[key])sources.set(key,evidence.references[key]);
 let warning='';try{validatePlan(assignments,board,t);}catch(error){warning=error.message;}
 warning=[warning,...pwmNotes(assignments,board,t)].filter(Boolean).join(' ');
 const sourceList=[...sources].map(([id,ref])=>({id,...ref}));
 for(const row of rows)row.references=row.keys.map(key=>sourceList.findIndex(source=>source.id===key)+1).filter(Boolean);
 return {model:planReference(board,t),date:board.verifiedOn,voltage:board.voltage,rows,sources:sourceList,warning,hardware};
}
export function reportHTML(report,t=k=>k){
 const e=escapeText;
 const hardware=report.hardware?.length?`<h2>${e(t('hwTitle'))}</h2><ul>${report.hardware.map(row=>`<li>${e(row.label)}: ${e(row.value)}</li>`).join('')}</ul>`:'';
 return `<h1>Pin Atlas · ${e(t('myPlan'))}</h1><h2>${e(report.model)}</h2><p>${e(report.voltage)} · ${e(t('verifiedOn',{date:report.date}))}</p>${hardware}${report.warning?`<p><strong>${e(report.warning)}</strong></p>`:''}<table><thead><tr>${['physicalPin','pinName','outputFunction','label'].map(key=>`<th>${e(t(key))}</th>`).join('')}</tr></thead><tbody>${report.rows.map(row=>`<tr><td>${e(row.physical)}</td><td>${e(row.name)}</td><td>${e(row.function)}${row.selector?' · '+e(row.selector):''} <sup>[${row.references.join(', ')}]</sup></td><td>${e(row.label)}</td></tr>`).join('')}</tbody></table><h2>${e(t('outputSources'))}</h2><ol>${report.sources.map(source=>`<li><a href="${e(source.url)}">${e(source.title)}</a><p>${e(source.locator)}<br>${e(source.url)}</p></li>`).join('')}</ol><p>${e(t('schematicNote'))}</p>`;
}
export function reportSVG(report,diagram,t=k=>k){
 const e=escapeText,lines=[];
 const wrap=text=>{const chars=Array.from(text);for(let i=0;i<chars.length;i+=108)lines.push(chars.slice(i,i+108).join(''));};
 wrap(report.model);wrap(`${report.voltage} · ${t('verifiedOn',{date:report.date})}`);
 wrap(t('outputTopView'));lines.push('');
 for(const row of report.hardware||[])wrap(row.label+': '+row.value);
 if(report.warning)wrap(report.warning);
 for(const row of report.rows)wrap(`${row.physical} · ${row.name} · ${row.function}${row.selector?' · '+row.selector:''}${row.label?' · '+row.label:''} [${row.references.join(', ')}]`);
 lines.push('');wrap(t('outputSources'));
 for(const [index,source] of report.sources.entries()){wrap((index+1)+'. '+source.title+' · '+source.locator);wrap(source.url);lines.push('');}
 const drawingHeight=Math.round(960*diagram.height/diagram.width),start=100+drawingHeight,height=start+lines.length*21+40;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${height}" viewBox="0 0 1000 ${height}" role="img"><title>${e(report.model+' · '+t('myPlan'))}</title><desc>${e(t('outputTopView'))}</desc><rect width="1000" height="${height}" fill="#ffffff"/><text x="20" y="36" font-family="monospace" font-size="24" fill="#17221d">Pin Atlas · ${e(t('myPlan'))}</text><svg x="20" y="60" width="960" height="${drawingHeight}" viewBox="${e(diagram.viewBox)}">${diagram.content}</svg><g font-family="monospace" font-size="14" fill="#17221d">${lines.map((line,i)=>`<text x="20" y="${start+i*21}">${e(line)}</text>`).join('')}</g></svg>`;
}

// Resolve CSS colors and embed local artwork so the downloaded SVG works offline.
export async function standaloneDiagram(svg){
 const clone=svg.cloneNode(true),sourceNodes=[svg,...svg.querySelectorAll('*')],nodes=[clone,...clone.querySelectorAll('*')];
 const properties=['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','stroke-linejoin','paint-order','font-size','font-weight','opacity','text-anchor'];
 sourceNodes.forEach((source,index)=>{
  const computed=getComputedStyle(source),node=nodes[index];node.removeAttribute('style');
  for(const property of properties)node.setAttribute(property,computed.getPropertyValue(property));
  if(node.tagName.toLowerCase()==='text')node.setAttribute('font-family','monospace');
  for(const attribute of ['tabindex','role','aria-current','aria-label'])node.removeAttribute(attribute);
 });
 await Promise.all([...clone.querySelectorAll('image')].map(async image=>{
  const response=await fetch(image.getAttribute('href'));if(!response.ok)throw new Error('Artwork could not be loaded');
  const data=await response.blob();
  const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(data);});
  image.setAttribute('href',url);
 }));
 const viewBox=svg.getAttribute('viewBox'),[, ,width,height]=viewBox.split(/\s+/).map(Number);
 return {viewBox,width,height,content:[...clone.childNodes].map(node=>new XMLSerializer().serializeToString(node)).join('')};
}
