/* SPDX-License-Identifier: GPL-3.0-or-later */
// Crawlable pages, the sitemap and the suite search index, all derived from the
// generated profile data. Nothing here adds a fact that the dataset does not hold.
import vm from 'node:vm';
import {boardFamilies,buildCatalog} from '../public/catalog.mjs';
import {pinNotes} from '../public/pin-notes.mjs';
import {physicalLabel} from '../public/plans.mjs';

export const languages = ['en','tr'];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localized = (value, language) => typeof value === 'string' ? value : value?.[language] || value?.en || '';
const isChip = profile => ['qfn','lqfp','dip'].includes(profile.layout);
const busOrder = ['I2C','SPI','UART','CAN','USB','ADC','DAC','PWM'];
const typeKeys = {GPIO:'generalIO',POWER:'power',GND:'ground',SYSTEM:'system',ADC:'analog'};
const groupLabel = (t, group) => group === 'I2C' ? 'I²C' : t(group, {}, group);

// The interface dictionary is a browser script; run it against a stub to read both languages.
export function loadTranslators(source) {
  let listener;
  const window = {ZaryobLanguage:{supported:['tr','en'],language:'en',subscribe(fn){listener=fn;}},dispatchEvent(){}};
  const document = {addEventListener(){},documentElement:{},querySelectorAll:()=>[]};
  vm.runInNewContext(source,{window,document,CustomEvent:class{}});
  const missing = '\u0000';
  return Object.fromEntries(languages.map(language => [language,(key,values={},fallback) => {
    listener(language);
    const text = window.ZaryobI18n.t(key,values,fallback ?? missing);
    if (text === missing) throw new Error(`Missing interface text: ${key}`);
    return text;
  }]));
}

// Site-relative paths; `prefix` climbs from a page back to the site root.
export const boardPath = (id, language) => `${language === 'tr' ? 'tr/' : ''}boards/${id}/`;
export const indexPath = language => `${language === 'tr' ? 'tr/' : ''}boards/`;
export const atlasHash = profile => '#'+new URLSearchParams({board:profile.physicalLayout,profile:profile.id});
export const lastReviewed = (profile, research) => [profile.verifiedOn,research?.reviewedOn].filter(Boolean).sort().at(-1);

function interfaces(board) {
  const counts = new Map();
  for (const pin of board.pins) for (const group of new Set(pin.functions.map(fn => fn.group))) counts.set(group,(counts.get(group)||0)+1);
  const groups = [...counts.keys()];
  return [...busOrder.filter(group => counts.has(group)),...groups.filter(group => !busOrder.includes(group)).sort()].map(group => ({group,pins:counts.get(group)}));
}

function frontMatter(fields) {
  return '---\n'+Object.entries(fields).map(([key,value]) => `${key}: ${typeof value === 'string' ? JSON.stringify(value) : value}`).join('\n')+'\n---\n';
}
const jsonLd = data => JSON.stringify(data).replace(/</g,'\\u003c');

function page({site,language,path,title,description,body,structured,alternates,type}) {
  const absolute = relative => site+relative;
  return frontMatter({layout:'board',lang:language,title,description,canonical:absolute(path),og_type:type,
    alternate_en:absolute(alternates.en),alternate_tr:absolute(alternates.tr),json_ld:jsonLd(structured),
    render_with_liquid:false,generated_by:'scripts/static-pages.mjs'})+body+'\n';
}


function boardPage({site,language,t,board,profile,entry,related,evidence}) {
  const prefix = language === 'tr' ? '../../../' : '../../';
  const path = boardPath(board.id,language);
  const name = board.name, research = board.research;
  const gpio = board.uniqueGPIOCount ?? board.gpioCount;
  const buses = interfaces(board);
  const keyBuses = buses.filter(item => busOrder.includes(item.group)).map(item => groupLabel(t,item.group)).join(', ');
  const title = t('staticTitle',{name});
  const description = t(keyBuses ? 'staticDescription' : 'staticDescriptionPlain',{name,pins:board.pins.length,buses:keyBuses,gpio,voltage:board.voltage});

  // References cited on the page are numbered once, in order of first use.
  const cited = [];
  const cite = keys => [...new Set(keys||[])].filter(key => evidence.references[key]).map(key => {
    if (!cited.includes(key)) cited.push(key);
    const ref = evidence.references[key];
    return `<a href="${esc(ref.url)}" rel="noopener" title="${esc(ref.title)}">[${cited.indexOf(key)+1}]</a>`;
  }).join(' ');
  const sourced = keys => { const links = cite(keys); return links ? ` <span class="note-sources">${esc(t('noteSource'))}: ${links}</span>` : ''; };

  const researchKeys = research ? Object.keys(research.sources) : [];
  const researchCite = keys => keys.map(key => `<a href="${esc(research.sources[key].url)}" rel="noopener" title="${esc(research.sources[key].title)}">[${String.fromCharCode(97+researchKeys.indexOf(key))}]</a>`).join(' ');
  const fact = (label,value,extra='') => value === undefined || value === null || value === '' ? '' : `<div><dt>${esc(label)}</dt><dd>${esc(value)}${extra ? ' '+extra : ''}</dd></div>`;
  const packageName = isChip(board) ? board.packageName || `${board.layout.toUpperCase()}-${board.packagePins}` : board.packageName;
  const typeLabel = t(entry.type === 'headers' ? 'catalogHeaders' : entry.type === 'chips' ? 'catalogChips' : 'catalogBoards');
  const facts = [
    fact(t('catalogPlatformLabel'),entry.familyName),
    fact(t('staticType'),typeLabel),
    fact('MCU',board.mcu),
    fact(t('staticPackage'),packageName),
    fact(t('staticContacts'),board.pins.length),
    fact('GPIO',gpio+(board.reservedGPIOCount ? ` (${t('reservedCount',{count:board.reservedGPIOCount})})` : '')),
    fact(t('staticVoltage'),board.voltage),
    fact(t('staticInterfaces'),buses.map(item => `${groupLabel(t,item.group)} (${item.pins})`).join(' · ')),
    ...(research ? [
      fact(t('researchDate.'+research.date.kind),research.date.kind === 'unverified' ? t('researchDateUnknown') : research.date.value,researchCite(research.date.sources)),
      ...research.facts.map(item => fact(t('researchFact.'+item.key),localized(item.value,language),researchCite(item.sources)))
    ] : []),
    fact(t('staticChecked'),board.verifiedOn),
    fact(t('staticReviewed'),research?.reviewedOn)
  ].join('');

  const scope = board.scopeKey ? t(board.scopeKey) : '';
  const cautions = (board.cautions||[]).length ? `<section class="board-cautions" aria-labelledby="cautions-title"><h2 id="cautions-title">${esc(t('boardCautions'))}</h2><ul>${board.cautions.map(item => `<li><span>${esc(t(item.key))}</span>${sourced(item.evidence)}</li>`).join('')}</ul></section>` : '';

  const general = new Map();
  const rows = board.pins.map(pin => {
    const notes = pinNotes(pin);
    for (const note of notes.general) general.set(note.key||note.text,note);
    const identity = [pin.boardLabel && pin.boardLabel !== pin.name ? t('boardLabel',{label:pin.boardLabel}) : '',
      pin.arduinoPin !== undefined ? `Arduino D${pin.arduinoPin}` : '',pin.mcuPort ? t('mcuPort',{port:pin.mcuPort}) : '',
      pin.mcuPin ? t('mcuPin',{pin:pin.mcuPin}) : ''].filter(Boolean);
    const flags = [pin.reserved ? (key => t(key,{},key))(pin.reservedLabel || (pin.name === 'NC' ? 'unconnected' : 'reserved')) : '',
      pin.inputOnly ? t('researchInputOnly') : '',
      pin.inputTolerance ? t(pin.inputTolerance.kind === 'rp2350-ft' ? 'rp2350FTLabel' : 'rp2350AnalogLabel') : '',
      pin.fiveVoltTolerant === true ? t('badgeFiveVoltFT') : pin.fiveVoltTolerant === false ? t('badgeThreeVoltOnly') : '',
      pin.sharedWith?.length ? t('staticShared',{pins:pin.sharedWith.join(', ')}) : ''].filter(Boolean);
    const warnings = notes.specific.map(note => `<p>${esc(note.key ? t(note.key) : note.text)}${sourced(note.evidence)}</p>`).join('');
    const functions = pin.functions.map(fn => `<span>${esc(fn.name)}${fn.selector ? ` <small>${esc(fn.selector)}</small>` : ''}${fn.configuration ? ` <small>${esc(fn.configuration.field)}: ${esc(fn.configuration.values.join(' / '))}</small>` : ''}</span>`).join('');
    return `<tr id="pin-${pin.number}"><th scope="row">${esc(physicalLabel(pin))}</th><td><b>${esc(pin.name)}</b>${identity.length ? `<small>${esc(identity.join(' · '))}</small>` : ''}</td><td>${esc(t(typeKeys[pin.type] || pin.type,{},pin.type))}</td><td class="static-functions">${functions || '—'}</td><td class="static-notes">${flags.length ? `<p class="static-flags">${esc(flags.join(' · '))}</p>` : ''}${warnings}${flags.length || warnings ? '' : '—'}</td><td>${cite([...pin.evidence,pin.inputTolerance?.evidence].filter(Boolean)) || '—'}</td></tr>`;
  }).join('\n');
  // A closed list of links to each pin's row, one per package side on chips, so a long table is one tap from any pin.
  const sides = board.layout === 'dip' ? ['left','right'] : ['qfn','lqfp'].includes(board.layout) ? ['left','bottom','right','top'] : [];
  const perSide = sides.length ? board.packagePins/sides.length : 0;
  const jumpGroups = sides.length ? [...sides.map((side,index) => ({label:`${t('stripSide.'+side)} · ${index*perSide+1}–${(index+1)*perSide}`,
    pins:board.pins.filter(pin => pin.number > index*perSide && pin.number <= (index+1)*perSide)})),
    {label:t('stripOther'),pins:board.pins.filter(pin => pin.number > board.packagePins)}].filter(group => group.pins.length) : [{label:'',pins:board.pins}];
  const jump = `<nav class="static-pin-jump" aria-label="${esc(t('staticPinJump'))}">${jumpGroups.map(group => `<details><summary>${esc(t('staticPinJump'))}${group.label ? ` · ${esc(group.label)}` : ''}</summary><ul>${group.pins.map(pin => `<li><a href="#pin-${pin.number}">${esc(physicalLabel(pin))} <span>${esc(pin.name)}</span></a></li>`).join('')}</ul></details>`).join('')}</nav>`;
  const labels = [t('physical'),t('pinName'),t('staticType'),t('functions'),t('staticNotes'),t('noteSource')];
  const table = `<section class="static-section" aria-labelledby="pins-title"><h2 id="pins-title">${esc(t('staticPinTable',{count:board.pins.length}))}</h2>
${jump}
<table class="static-pins" style="${labels.map((label,index) => `--label-${index+1}:${esc(JSON.stringify(label))}`).join(';')}"><caption>${esc(t('staticPinCaption',{name}))}</caption><thead><tr>${labels.map(label => `<th scope="col">${esc(label)}</th>`).join('')}</tr></thead><tbody>
${rows}
</tbody></table>
${general.size ? `<div class="static-general"><h3>${esc(t('staticGeneralNotes'))}</h3>${[...general.values()].map(note => `<p>${esc(note.key ? t(note.key) : note.text)}${sourced(note.evidence)}</p>`).join('')}</div>` : ''}</section>`;

  const researchNotes = research?.notes.length ? `<section class="static-section" aria-labelledby="model-notes-title"><h2 id="model-notes-title">${esc(t('researchNotes'))}</h2><ul>${research.notes.map(note => `<li>${esc(localized(note.text,language))} ${researchCite(note.sources)}</li>`).join('')}</ul></section>` : '';
  const pageLabel = ref => ref.page ? ` · ${t('pdfPage',{page:ref.page})}` : '';
  const sources = `<section class="static-section static-sources" aria-labelledby="sources-title"><h2 id="sources-title">${esc(t('staticSources'))}</h2>
${cited.length ? `<h3>${esc(t('staticPinReferences'))}</h3><ol>${cited.map(key => { const ref = evidence.references[key]; return `<li><a href="${esc(ref.url)}" rel="noopener">${esc(ref.title+pageLabel(ref))}</a><small>${esc(ref.locator)}</small></li>`; }).join('')}</ol>` : ''}
${researchKeys.length ? `<h3>${esc(t('researchSources',{count:researchKeys.length}))}</h3><ol type="a">${researchKeys.map(key => { const source = research.sources[key]; return `<li><a href="${esc(source.url)}" rel="noopener">${esc(source.title)}</a><small>${esc(source.publisher)} · ${esc(source.locator)}</small></li>`; }).join('')}</ol>` : ''}
<h3>${esc(t('staticDocuments'))}</h3><ul>${evidence.documents.map(doc => `<li><a href="${esc(doc.viewUrl || doc.url)}" rel="noopener">${esc(doc.title)}</a><small>${esc([doc.publisher,doc.revision].filter(Boolean).join(' · '))}</small></li>`).join('')}</ul>
<p><a href="${esc(board.source)}" rel="noopener">${esc(t('officialSource'))}</a> · <a href="${esc(board.datasheet)}" rel="noopener">${esc(t('datasheet'))}</a></p></section>`;
  const relatedList = related.length ? `<section class="static-section" aria-labelledby="related-title"><h2 id="related-title">${esc(t('staticRelated',{family:entry.familyName}))}</h2><ul class="static-links">${related.map(item => `<li><a href="../${esc(item.profile)}/">${esc(item.name)}</a></li>`).join('')}</ul></section>` : '';
  const other = language === 'tr' ? 'en' : 'tr';
  const body = `<main id="main" class="static-main" lang="${language}">
<nav class="static-crumbs" aria-label="${esc(t('staticBreadcrumb'))}"><a href="${prefix}">Pin Atlas</a><span aria-hidden="true">/</span><a href="../">${esc(t('staticBoards'))}</a><span aria-hidden="true">/</span><span>${esc(entry.familyName)}</span></nav>
<header class="static-heading"><p class="hardware-kind">${esc(typeLabel)}</p><h1>${esc(t('staticHeading',{name}))}</h1><p class="static-lead">${esc(t('board.'+board.id,{},board.subtitle))}</p></header>
<p class="static-actions"><a class="button primary" href="${prefix}${esc(atlasHash(profile))}">${esc(t('staticOpenAtlas'))} →</a><span>${esc(t('staticOpenAtlasNote'))}</span><a class="static-language" href="${prefix}${boardPath(board.id,other)}" hreflang="${other}" lang="${other}">${other === 'tr' ? 'Türkçe' : 'English'}</a></p>
${scope ? `<p class="board-scope">${esc(scope)}</p>` : ''}
<section class="static-section" aria-labelledby="facts-title"><h2 id="facts-title">${esc(t('staticFacts'))}</h2><dl class="static-facts">${facts}</dl></section>
${cautions}
${table}
${researchNotes}
${sources}
${relatedList}
</main>`;
  const structured = {'@context':'https://schema.org','@graph':[
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Pin Atlas',item:site},
      {'@type':'ListItem',position:2,name:t('staticBoards'),item:site+indexPath(language)},
      {'@type':'ListItem',position:3,name,item:site+path}]},
    {'@type':'TechArticle',headline:t('staticHeading',{name}),description,inLanguage:language,url:site+path,
      mainEntityOfPage:site+path,about:{'@type':'Thing',name},isPartOf:{'@type':'WebSite',name:'Pin Atlas',url:site},
      author:{'@type':'Person',name:'Süleyman Poyraz'}}]};
  return page({site,language,path,title,description,body,structured,type:'article',
    alternates:{en:boardPath(board.id,'en'),tr:boardPath(board.id,'tr')}});
}

function indexPage({site,language,t,catalog,totals}) {
  const prefix = language === 'tr' ? '../../' : '../';
  const path = indexPath(language), other = language === 'tr' ? 'en' : 'tr';
  const title = t('staticIndexTitle'), description = t('staticIndexDescription',{count:catalog.length,pins:totals.pins.toLocaleString('en-US')});
  const groups = boardFamilies.map(family => {
    const entries = catalog.filter(entry => entry.family === family.id);
    return `<section class="static-section" aria-labelledby="family-${family.id}"><h2 id="family-${family.id}">${esc(t(family.nameKey))} <small>${entries.length}</small></h2><ul class="static-index">${entries.map(entry => `<li><a href="${esc(entry.profile)}/">${esc(entry.name)}</a><small>${esc([...new Set([entry.detail,entry.specs].filter(Boolean).join(' · ').split(' · '))].join(' · '))}</small></li>`).join('')}</ul></section>`;
  }).join('\n');
  const body = `<main id="main" class="static-main" lang="${language}">
<nav class="static-crumbs" aria-label="${esc(t('staticBreadcrumb'))}"><a href="${prefix}">Pin Atlas</a><span aria-hidden="true">/</span><span>${esc(t('staticBoards'))}</span></nav>
<header class="static-heading"><h1>${esc(t('staticIndexHeading'))}</h1><p class="static-lead">${esc(description)}</p></header>
<p class="static-actions"><a class="button primary" href="${prefix}">${esc(t('staticOpenHome'))} →</a><a class="static-language" href="${prefix}${indexPath(other)}" hreflang="${other}" lang="${other}">${other === 'tr' ? 'Türkçe' : 'English'}</a></p>
${groups}
</main>`;
  const structured = {'@context':'https://schema.org','@graph':[
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Pin Atlas',item:site},
      {'@type':'ListItem',position:2,name:t('staticBoards'),item:site+path}]},
    {'@type':'CollectionPage',name:t('staticIndexHeading'),description,inLanguage:language,url:site+path,
      isPartOf:{'@type':'WebSite',name:'Pin Atlas',url:site}}]};
  return page({site,language,path,title,description,body,structured,type:'website',
    alternates:{en:indexPath('en'),tr:indexPath('tr')}});
}

function sitemap(site, bundles, profiles) {
  const alternates = paths => languages.map(language => `    <xhtml:link rel="alternate" hreflang="${language}" href="${site}${paths[language]}" />`).join('\n')
    +`\n    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${paths.en}" />`;
  const url = (path,paths,lastmod) => `  <url>\n    <loc>${site}${path}</loc>\n${alternates(paths)}${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
  const dates = profiles.map(profile => lastReviewed(profile,bundles.get(profile.id).profile.research));
  const index = Object.fromEntries(languages.map(language => [language,indexPath(language)]));
  return `---\nlayout: null\npermalink: /sitemap.xml\n---\n<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${site}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${site}?lang=en" />
    <xhtml:link rel="alternate" hreflang="tr" href="${site}?lang=tr" />
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${languages.map(language => url(index[language],index,[...dates].sort().at(-1))).join('\n')}
${profiles.flatMap((profile,position) => {
    const paths = Object.fromEntries(languages.map(language => [language,boardPath(profile.id,language)]));
    return languages.map(language => url(paths[language],paths,dates[position]));
  }).join('\n')}
</urlset>
`;
}

// Suite search results open the exact profile; a query string would be taken as a pin filter.
export function searchIndex(profiles, translators, basePath) {
  return profiles.flatMap(profile => ['tr','en'].map(language => ({lang:language,title:profile.name,
    url:`${basePath}${atlasHash(profile)}`,type:'pin-atlas/',
    description:translators[language]('board.'+profile.id,{},profile.subtitle || '')+(profile.mcu ? ' · '+profile.mcu : '')+(profile.family ? ' · '+profile.family : '')})));
}

// Returns every generated file as [path relative to public/, content].
export function buildStaticFiles({homepage,profiles,bundles,layouts,totals,dictionary}) {
  const site = homepage.endsWith('/') ? homepage : homepage+'/';
  const translators = loadTranslators(dictionary);
  const files = new Map();
  for (const language of languages) {
    const t = translators[language];
    const catalog = buildCatalog(layouts,t);
    for (const profile of profiles) {
      const {profile:board,evidence} = bundles.get(profile.id);
      const entry = catalog.find(item => item.profile === profile.id);
      if (!entry) throw new Error(`Profile missing from the catalog: ${profile.id}`);
      const related = catalog.filter(item => item.family === entry.family && item.profile !== profile.id);
      files.set(boardPath(profile.id,language)+'index.html',boardPage({site,language,t,board,profile,entry,related,evidence}));
    }
    files.set(indexPath(language)+'index.html',indexPage({site,language,t,catalog,totals}));
  }
  files.set('sitemap.xml',sitemap(site,bundles,profiles));
  files.set('search.json',JSON.stringify(searchIndex(profiles,translators,new URL(site).pathname),null,2)+'\n');
  return files;
}
