import { buildLayouts, resolveProfile } from './layouts.mjs';
import { compatibleModels, filterCompatibleModels } from './compatibility.mjs';
import { options, physicalLabel, planReference, samePlan, validatePlan } from './plans.mjs';
const { t, verificationUrl } = window.ZaryobI18n;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = {
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 chip:'<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/>',
 board:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 2v4h4V2M9 11h6v5H9zM3 6h3m-3 4h3m-3 4h3m-3 4h3m12-12h3m-3 4h3m-3 4h3m-3 4h3"/>',
 book:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1v15"/>',
 list:'<path d="M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 file:'<path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8m-8 4h6"/>',
 share:'<path d="M12 15V3m-4 4 4-4 4 4M5 11H3v10h18V11h-2"/>',
 flip:'<path d="M12 2v20M3 6l6 6-6 6zm18 0-6 6 6 6z"/>',
 rotate:'<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',
 reset:'<path d="M4 10a8 8 0 1 1 2 8M4 4v6h6"/>',
 fit:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 12h8m-4-4v8"/>',
 cursor:'<path d="m4 3 15 10-7 1-3 7z"/>',
 crosshair:'<circle cx="12" cy="12" r="7"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/>',
 bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M3 16v5h18v-5"/>',
 upload:'<path d="M12 15V3m-4 4 4-4 4 4M3 16v5h18v-5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 wifi:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0M12 20h.01"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>'
};
const isChip = item => ['qfn','lqfp','dip'].includes(item.layout);
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.chip}</svg>`;
function hydrateIcons(root = document) { $$('[data-icon]', root).forEach(el => el.innerHTML = icon(el.dataset.icon)); }
hydrateIcons();
const colors = Object.fromEntries(['GPIO','POWER','GND','SYSTEM','SPI','I2C','UART','PWM','ADC','HSTX','PIO','USB','QMI','SIO','PCM','I2S','CLOCK','JTAG','DPI','SDIO','SMI','SWD','CAN','TIMER','IRQ','DAC','TOUCH'].map(group => [group, `var(--pin-${group.toLowerCase()})`]));
const appBase = new URL('./', import.meta.url);
const familyKeys = { GPIO: 'generalIO', POWER: 'power', GND: 'ground', SYSTEM: 'system', ADC: 'analog' };
const familyName = type => t(familyKeys[type] || type);
const subtitle = item => t(`board.${item.id}`, {}, item.subtitle);
const groups = ['SPI','I2C','UART','PWM','ADC','HSTX','PIO','PCM','I2S','CLOCK','JTAG','DPI','SDIO','SMI','SWD','CAN','TIMER','USB','IRQ','DAC','TOUCH'];
let evidence = {references:{}};
let boards, layouts, layout, board, selected = 1, selectedFn, filters = new Set(), search = '', flipped = false, rotated = false, view = 'map', assignments = {}, toastTimer;
const storageKey = 'pin-atlas:plans:v1';
const rememberedProfiles = new Map();
let compatibilityModels = [], compatibilityQuery = '';
const layoutTitle = item => item.nameKey ? t(item.nameKey) : item.name;
const layoutSubtitle = item => item.subtitleKey ? t(item.subtitleKey) : subtitle(item);
function readSavedPlans(fallback = {}) {
 try {
   const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
   if (stored && typeof stored === 'object' && !Array.isArray(stored)) return stored;
 } catch {}
 return fallback;
}
let savedPlans = readSavedPlans();
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500); }
function persist() {
 savedPlans = { ...readSavedPlans(savedPlans), [board.id]: assignments };
 renderCompatibilityList();
 try {
   localStorage.setItem(storageKey, JSON.stringify(savedPlans));
   return true;
 } catch {
   return false;
 }
}
function pinByNumber(n) { return board.pins.find(p => p.number === Number(n)); }
function matches(pin) { const text = [pin.number, pin.name, pin.physicalLabel, pin.boardLabel, pin.mcuPort, pin.arduinoPin !== undefined ? `D${pin.arduinoPin}` : '', ...pin.functions.flatMap(f => [f.name,f.signal]), assignments[pin.number]?.label].join(' ').toLowerCase(); return text.includes(search.toLowerCase().trim()) && (!filters.size || pin.functions.some(f => filters.has(f.group))); }
function setBoard(id, initial = false, preferredProfile) {
 const next = resolveProfile(layouts, id, preferredProfile);
 const sameLayout = layout?.id === next.layout.id;
 const previousPin = selected;
 layout = next.layout; board = next.profile;
 rememberedProfiles.set(layout.id, board.id);
 selected = sameLayout && board.pins.some(pin => pin.number === previousPin) ? previousPin : board.pins.find(p => p.type === 'GPIO')?.number || 1;
 try {
   assignments = validatePlan(savedPlans[board.id] || {}, board, t, { allowDuplicateSignals: true, ignoreLegacyHseAssignments: true });
 } catch { assignments = {}; }
 selectedFn = assignments[selected]?.function || options(pinByNumber(selected))[0].name;
 if (!sameLayout) { filters = new Set(); search = ''; $('#pin-search').value = ''; flipped = rotated = false; compatibilityQuery=''; $('#compatible-boards').open=false; }
 const available = new Set(board.pins.flatMap(pin => pin.functions.map(fn => fn.group)));
 filters = new Set([...filters].filter(group => available.has(group)));
 renderBoard();
 if (!initial) history.replaceState(null, '', `#${new URLSearchParams({board:layout.id,profile:board.id,pin:selected})}`);
 if ($('#details-dialog').open) $('#details-dialog').close();
 setDetailTab('pin');
}
function openLayout(id, profile) {
 const target = layouts.find(item => item.id === id);
 if (!target) return;
 // Reopen the last function reference, including legacy saved model plans.
 const savedProfile = target.profiles.find(profile => Object.keys(savedPlans[profile.id] || {}).length)?.id;
 setBoard(id, false, profile || rememberedProfiles.get(id) || savedProfile);
}
function renderBoard() {
 document.title = `${layoutTitle(layout)} Pinout — Pin Atlas`;
 $('#board-title').textContent = layoutTitle(layout);
 const scope = board.scopeKey ? t(board.scopeKey) : layout.scopeKey ? t(layout.scopeKey) : '';
 $('#board-scope').hidden = !scope;
 $('#board-scope').textContent = scope;
 renderCompatibilityIndex();
 $('#library-count').textContent = layouts.length;
 $('#crumb').textContent = board.shortName || board.name;
 $('#board-family').textContent = board.family;
 $('#datasheet').href = board.datasheet;
 $('#reference-link').href = board.source;
 $('#reference-link').innerHTML = `${t('officialSource')} <span>↗</span>`;
 $('#pin-count').textContent = t('pinCount', { count: board.packagePins });
 $('#specs').innerHTML = `<span>${icon('chip')}<b>${board.uniqueGPIOCount ?? board.gpioCount}</b>GPIO${board.reservedGPIOCount ? ` (${t('reservedCount', { count: board.reservedGPIOCount })})` : ''}</span><span>${icon('bolt')}<b>${esc(board.voltage)}</b></span>`;
 renderNav(); renderFunctionReference(); renderFilters(); renderMap(); renderDetail(); renderPlan();
}
function renderCompatibilityIndex() {
 compatibilityModels=compatibleModels(layout);
 $('#compatible-boards').hidden=!compatibilityModels.length;
 $('#compatibility-title').textContent=t(isChip(layout)?'compatibleDevices':'compatibleBoards');
 $('#compatibility-count').textContent=compatibilityModels.length;
 $('#compatibility-current').textContent=compatibilityModels.find(model=>model.kind==='reference' && model.profileId===board.id)?.name || board.shortName || board.name;
 $('#compatibility-search-row').hidden=compatibilityModels.length<7;
 $('#compatibility-search').value=compatibilityQuery;
 renderCompatibilityList();
}
function renderCompatibilityList() {
 const detail=model=>model.detailKey?t(model.detailKey):model.detail;
 const found=filterCompatibleModels(compatibilityModels,compatibilityQuery,model=>[model.name,detail(model),model.referenceKey?t(model.referenceKey):''].join(' '));
 $('#compatibility-empty').hidden=found.length>0;
 $('#compatibility-results').textContent=t('matchingModelCount',{count:found.length,total:compatibilityModels.length});
 $('#compatibility-list').innerHTML=found.map(model=>{
   const active=model.kind==='reference' && model.profileId===board.id;
   const target=new URL(location.href);
   target.searchParams.set('lang',document.documentElement.lang);
   target.hash=new URLSearchParams({board:layout.id,profile:model.profileId}).toString();
   const status=active?t('selectedModel'):model.kind==='physical'?t('sharedPinout'):t('openReference');
   const saved=model.kind==='reference' && Object.keys(savedPlans[model.profileId] || {}).length>0;
   return `<li><a href="${esc(target.href)}" data-compatible-model="${esc(model.id)}" data-profile="${esc(model.profileId)}" ${active?'aria-current="true"':''} aria-label="${esc(t('openCompatibleModel',{model:model.name,reference:detail(model)}))}"><span class="compatibility-number" aria-hidden="true">${String(compatibilityModels.indexOf(model)+1).padStart(2,'0')}</span><span class="compatibility-model"><strong>${esc(model.name)}</strong><small>${esc(detail(model))}${saved?`<span class="compatibility-saved">${esc(t('hasSavedPlan'))}</span>`:''}</small></span><span class="compatibility-state">${esc(status)}<span aria-hidden="true">${active?'✓':'→'}</span></span></a></li>`;
 }).join('');
}
function renderFunctionReference() {
 $('#function-reference-bar').hidden = !layout.references.length;
 $('#reference-note').hidden = !layout.references.length;
 $('#reference-note').textContent = layout.id === 'raspberry-pi-40' ? t(board.id === 'raspberry-pi-4' ? 'pi4ReferenceNote' : 'commonReferenceNote') : layout.id === 'pico-family' ? t('picoReferenceNote') : t('headerReferenceNote');
 const choices = layout.references.flatMap(reference => {
   const hasSavedPlan = id => Object.keys(savedPlans[id] || {}).length > 0;
   const selectedId = reference.profileIds.includes(board.id) ? board.id : reference.profileIds.find(hasSavedPlan) || reference.profileIds[0];
   const result = [{id:selectedId, label:t(reference.key)}];
   // If both old model slots contain plans, expose them rather than merge or hide data.
   for (const id of reference.profileIds.filter(id => id !== selectedId && hasSavedPlan(id))) {
     const profile = boards.find(item => item.id === id);
     result.push({id, label:`${t(reference.key)} · ${t('savedModelPlan', {model:profile.shortName})}`});
   }
   return result;
 });
 $('#function-reference').innerHTML = choices.map(choice => `<option value="${choice.id}" ${choice.id === board.id ? 'selected' : ''}>${esc(choice.label)}</option>`).join('');
}
function renderNav() {
 const nav = $('#board-nav');
 if (!nav) return;
 nav.innerHTML = ['layouts','chips'].map(group => {
   const entries = layouts.filter(item => (isChip(item) ? 'chips' : 'layouts') === group);
   return `<div class="nav-section">${t(group)}</div>${entries.map(item => `<button class="board-nav-item ${item.id === layout.id ? 'active' : ''}" data-layout="${item.id}" ${item.id === layout.id ? 'aria-current="page"' : ''}>${icon(isChip(item) ? 'chip' : 'board')}<span>${esc(layoutTitle(item))}<small>${esc(layoutSubtitle(item))}</small></span></button>`).join('')}`;
 }).join('');
}
function renderFilters() {
 const available = new Set(board.pins.flatMap(p => p.functions.map(f => f.group)));
 const disclosure = $('#filter-options');
 disclosure.hidden = !groups.some(group => available.has(group));
 if (disclosure.hidden) disclosure.open = false;
 $('#active-filter-count').hidden = !filters.size;
 $('#active-filter-count').textContent = filters.size;
 $('#filters').innerHTML = groups.filter(g => available.has(g)).map(g => `<button class="filter ${filters.has(g) ? 'active' : ''}" data-filter="${g}" style="--color:${colors[g]}" aria-pressed="${filters.has(g)}"><i></i>${g === 'I2C' ? 'I²C' : g}</button>`).join('');
}
function choosePin(number, reveal = true) {
 selected = Number(number); const p = pinByNumber(selected);
 selectedFn = assignments[selected]?.function || options(p)[0].name;
 renderMap(); renderDetail();
 if (reveal) showDetails('pin');
 history.replaceState(null, '', `#${new URLSearchParams({board:layout.id,profile:board.id,pin:selected})}`);
}
function pinGroup(pin, x, y, side, opts = {}) {
 const active = pin.number === selected, match = matches(pin), assigned = assignments[pin.number];
 const color = colors[pin.type] || colors.SYSTEM;
 const matchingFunctions = pin.functions.filter(f => filters.has(f.group) || (search.trim() && f.name.toLowerCase().includes(search.trim().toLowerCase())));
 const fn = matchingFunctions[0];
 const label = opts.showConnectorLabel && pin.boardLabel ? pin.boardLabel : pin.name.replace('_ADC', '/A');
 const func = assigned?.label || assigned?.function || matchingFunctions.slice(0,2).map(f=>f.name).join(' · ') || (label !== pin.name && opts.showConnectorLabel ? pin.name : '');
 const left = side === 'left';
 const xSign = left ? -1 : 1;
 let body = `<rect class="pin-hit" x="${left ? -222 : 10}" y="-10" width="212" height="20" rx="4" fill="transparent"/><path d="M0 0h${xSign * 24}" stroke="${active ? 'var(--accent)' : 'var(--line)'}" stroke-width="1"/><circle class="pin-node" r="4.4" fill="${pin.type === 'GPIO' ? '#e2eccc' : '#f2eee6'}" stroke="${color}" stroke-width="1.3"/><text class="pin-number" x="${xSign * 17}" y="3" text-anchor="middle">${esc(pin.connectorPin ?? pin.physicalLabel ?? pin.number)}</text><rect x="${left ? -99 : 30}" y="-8.5" width="69" height="17" rx="3" fill="${color}" fill-opacity="${active ? '.2' : '.09'}"/><text class="pin-label" x="${xSign * 64}" y="3.7" fill="${color}" text-anchor="middle">${esc(label)}</text>${func ? `<text class="pin-function" x="${xSign * 111}" y="3" text-anchor="${left ? 'end' : 'start'}" fill="${assigned ? 'var(--success)' : colors[fn?.group] || color}">${esc(func.length > 24 ? func.slice(0,23)+'…' : func)}</text>` : ''}${assigned ? `<circle r="2" cx="${xSign * 215}" fill="var(--success)"/>` : ''}`;
 if (opts.compact) {
   const w=opts.padWidth;
   body=`<rect class="pin-hit" x="${-w/2}" y="-17" width="${w}" height="54" rx="4" fill="var(--surface)" stroke="var(--line)"/><circle class="pin-node" cy="-7" r="4.4" stroke="${color}" stroke-width="1.3"/><text class="pad-number" y="13" text-anchor="middle">${esc(pin.connectorPin)}</text><text class="pad-label" y="28" fill="${color}" text-anchor="middle">${esc(pin.name)}</text>`;
 }
 return `<g class="pin-group ${opts.connected ? 'net-contact' : ''} ${active ? 'selected' : ''} ${match ? '' : 'dimmed'} ${assigned ? 'assigned' : ''}" data-pin="${pin.number}" role="button" tabindex="0" aria-label="${esc(t('selectPin', { pin: physicalLabel(pin), name: label !== pin.name && opts.showConnectorLabel ? `${label} · ${pin.name}` : pin.name }))}${func ? ', '+esc(func) : ''}"${active ? ' aria-current="true"' : ''} transform="translate(${x} ${y})${opts.angle ? ` rotate(${opts.angle})` : ''}"><title>Pin ${esc(pin.physicalLabel || pin.number)} · ${esc(pin.name)}${func ? ' · '+esc(func) : ''}</title><g aria-hidden="true">${body}</g></g>`;
}
function picoArt() {
 const pads=Array.from({length:20},(_,i)=>[278,402].map(x=>`<circle cx="${x}" cy="${48+i*23}" r="5" fill="var(--paper)" stroke="var(--accent)" stroke-width="1.2"/>`).join('')).join('');
 return `<g class="board-art"><rect x="273" y="32" width="134" height="475" rx="6" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.3"/><rect x="288" y="43" width="104" height="452" rx="2" fill="none" stroke="var(--line)" stroke-dasharray="3 4"/>${pads}<rect x="314" y="19" width="52" height="39" rx="2" fill="var(--paper)" stroke="var(--accent)"/><path d="M322 19v8h36v-8" fill="none" stroke="var(--line)"/><text x="340" y="44" fill="var(--accent)" text-anchor="middle" font-size="9">USB</text><text x="340" y="87" fill="var(--ink)" text-anchor="middle" font-size="9">${esc(t('picoFamily').toUpperCase())}</text><text x="340" y="104" fill="var(--muted)" text-anchor="middle" font-size="6">40-PIN / 3.3 V IO</text><path d="M340 122v36m0 87v48m0 70v39" stroke="var(--line)" stroke-width="1.3"/><rect x="302" y="158" width="76" height="87" fill="var(--paper)" stroke="var(--accent)"/><text x="340" y="190" fill="var(--ink)" text-anchor="middle" font-size="11">${esc(board.mcu)}</text><text x="340" y="210" fill="var(--muted)" text-anchor="middle" font-size="7">MCU / BANK 0</text><path d="M313 224h54" stroke="var(--line)"/><rect x="302" y="293" width="76" height="70" fill="var(--paper)" stroke="var(--line)"/><text x="340" y="321" fill="var(--ink)" text-anchor="middle" font-size="9">QSPI FLASH</text><text x="340" y="340" fill="var(--muted)" text-anchor="middle" font-size="7">STORAGE</text><path d="M340 402v15m-17-12 17 12 17-12m-27 2 10 7 10-7" fill="none" stroke="var(--accent)"/><text x="340" y="461" fill="var(--muted)" text-anchor="middle" font-size="7">${t('schematic')}</text><text x="340" y="477" fill="var(--muted)" text-anchor="middle" font-size="5.5">${t('notToScale')}</text></g>`;
}
function renderPico() {
 let pins = '';
 for (const pin of board.pins) {
   let side = pin.number <= 20 ? 'left' : 'right';
   let x = side === 'left' ? 278 : 402, y = 48 + (side === 'left' ? pin.number - 1 : 40-pin.number)*23;
   if (rotated) { x=680-x; y=539-y; side=side==='left'?'right':'left'; }
   if (flipped) { x=680-x; side=side==='left'?'right':'left'; }
   pins += pinGroup(pin,x,y,side);
 }
 return `<svg role="group" viewBox="0 0 680 540" aria-label="${esc(t('diagramLabel', { board: layoutTitle(layout) }))}"><g transform="${flipped ? 'translate(680 0) scale(-1 1)' : ''}"><g transform="${rotated ? 'rotate(180 340 269.5)' : ''}">${picoArt()}</g></g>${pins}</svg>`;
}
function renderHeader() {
 let pins = '';
 for (const pin of board.pins) {
   let side = pin.number % 2 ? 'left' : 'right';
   let x = side==='left'?325:355, y = 48 + Math.floor((pin.number-1)/2)*23;
   if (rotated) { x=680-x; y=533-y; side=side==='left'?'right':'left'; }
   if (flipped) { x=680-x; side=side==='left'?'right':'left'; }
   pins += pinGroup(pin,x,y,side);
 }
 return `<svg role="group" viewBox="0 0 680 540" aria-label="${esc(t('diagramLabel', { board: layoutTitle(layout) }))}"><rect x="308" y="29" width="64" height="480" rx="6" fill="#26372c"/><rect x="315" y="37" width="50" height="464" rx="3" fill="#384c3a"/>${pins}<text x="340" y="530" fill="#869b75" font-family="var(--mono)" font-size="7" text-anchor="middle">${board.headerLabel ? esc(board.headerLabel)+' · ' : ''}${t('headerLegend')}</text></svg>`;
}
function renderDip() {
 const total=board.packagePins, half=total/2, h=160+(half-1)*28;
 let pins='';
 for(const pin of board.pins){
   let left=pin.number<=half,x=left?305:495,y=80+(left?pin.number-1:total-pin.number)*28,side=left?'left':'right';
   if(rotated){x=800-x;y=h-y;side=side==='left'?'right':'left';}
   if(flipped){x=800-x;side=side==='left'?'right':'left';}
   pins+=pinGroup(pin,x,y,side);
 }
 return `<svg role="group" viewBox="0 0 800 ${h}" aria-label="${esc(t('diagramLabel',{board:board.name}))}"><g class="board-art" transform="${flipped?'translate(800 0) scale(-1 1)':''}"><g transform="${rotated?`rotate(180 400 ${h/2})`:''}"><rect x="312" y="48" width="176" height="${h-96}" rx="7" fill="#34433a" stroke="#7f9175"/><path d="M382 48a18 18 0 0 0 36 0" fill="var(--paper)" stroke="#7f9175"/><circle cx="327" cy="79" r="5" fill="#a9b796"/><text x="400" y="${h/2-10}" text-anchor="middle" fill="#dce6d0" font-size="19">${esc(board.mcu)}</text><text x="400" y="${h/2+20}" text-anchor="middle" fill="#9db08f" font-size="13">${esc(board.packageName)}</text></g></g>${pins}</svg>`;
}
function renderQfn() {
 const n=board.packagePins/4,size=board.packagePins>=100?1056:800,c=size/2,end=size-220,span=size-464,pitch=span/(n-1),body=size-434;
 const packageName=board.packageName || `${board.layout==='lqfp'?'LQFP':'QFN'}-${board.packagePins}`;
 let pins='';
 for(const pin of board.pins){
   const sideIndex=Math.floor((pin.number-1)/n),i=(pin.number-1)%n;
   let pos={x:220,y:232+i*pitch,side:'left',angle:0};
   if(sideIndex===1)pos={x:232+i*pitch,y:end,side:'right',angle:90};
   if(sideIndex===2)pos={x:end,y:size-232-i*pitch,side:'right',angle:0};
   if(sideIndex===3)pos={x:size-232-i*pitch,y:220,side:'left',angle:90};
   if(rotated){pos.x=size-pos.x;pos.y=size-pos.y;pos.side=pos.side==='left'?'right':'left';}
   if(flipped){pos.x=size-pos.x;if(!pos.angle)pos.side=pos.side==='left'?'right':'left';}
   pins+=pinGroup(pin,pos.x,pos.y,pos.side,{angle:pos.angle});
 }
 return `<svg role="group" viewBox="0 0 ${size} ${size}" ${size>800?'style="min-width:1000px;max-height:none"':''} aria-label="${esc(t('diagramLabel',{board:`${board.mcu} ${packageName}`}))}"><g class="board-art" transform="${flipped?`translate(${size} 0) scale(-1 1)`:''}"><g transform="${rotated?`rotate(180 ${c} ${c})`:''}"><rect x="217" y="217" width="${body}" height="${body}" rx="9" fill="#34433a" stroke="#26352b" stroke-width="3"/><rect x="231" y="231" width="${body-28}" height="${body-28}" rx="5" fill="none" stroke="#7f9175" stroke-width=".6"/><circle cx="246" cy="247" r="6" fill="#a9b796"/>${board.layout==='qfn'?`<rect x="${c-97}" y="${c-97}" width="194" height="194" rx="5" fill="#3b4d40" stroke="#637a58" stroke-dasharray="4 5"/>`:''}<text x="${c}" y="${c-23}" text-anchor="middle" fill="#dce6d0" font-size="${board.layout==='lqfp'?21:29}">${esc(board.mcu)}</text><text x="${c}" y="${c+6}" text-anchor="middle" fill="#9db08f" font-size="12" letter-spacing="3">${esc(packageName)}</text>${board.layout==='qfn'?`<text x="${c}" y="${c+43}" text-anchor="middle" fill="#819975" font-size="9">EP · GND</text>`:''}<text x="${c}" y="${size-268}" text-anchor="middle" fill="#839b76" font-size="8" letter-spacing="3">${esc(board.family.toUpperCase())}</text></g></g>${pins}</svg>`;
}
function renderCustom() {
 const {width,height,artwork} = board.diagram;
 const image = /^(?:\.\/|\/)?assets\/[a-zA-Z0-9_./-]+\.svg$/.test(artwork || '') ? `<image href="${esc(new URL(artwork.replace(/^\//,''), appBase).href)}" width="${width}" height="${height}"/>` : '';
 const showConnectorLabel = board.id.startsWith('nucleo-');
 const selectedPin = pinByNumber(selected);
 const connected = new Set(selectedPin?.sharedWith || []);
 if (connected.size) connected.add(selectedPin.physicalLabel);
 const pins = board.pins.map(pin => {
   let {x,y,side,angle=0,compact=false,padWidth=62} = pin.position;
   if(rotated){ x=width-x;y=height-y;side=side==='left'?'right':'left'; }
   if(flipped){x=width-x;if(!angle)side=side==='left'?'right':'left';}
   return pinGroup(pin,x,y,side,{angle,compact,padWidth,showConnectorLabel,connected:connected.has(pin.physicalLabel)});
 }).join('');
 return `<svg role="group" viewBox="0 0 ${width} ${height}" ${board.diagram.minWidth ? `style="min-width:${board.diagram.minWidth}px;max-height:none"` : ''} aria-label="${esc(t('diagramLabel', { board: layoutTitle(layout) }))}"><g transform="${flipped?`translate(${width} 0) scale(-1 1)`:''}"><g transform="${rotated?`rotate(180 ${width/2} ${height/2})`:''}">${image}</g></g>${pins}</svg>`;
}
const renderers = {pico:renderPico,qfn:renderQfn,lqfp:renderQfn,dip:renderDip,header:renderHeader,custom:renderCustom};
function renderMap() {
 $('#flip-button').setAttribute('aria-pressed',flipped); $('#rotate-button').setAttribute('aria-pressed',rotated);
 $('.desktop-hint').textContent=t(board.diagram?.minWidth || board.packagePins>=100 ? 'panPin' : 'clickPin');
 $('#orientation').innerHTML = `${t(flipped ? 'bottomView' : 'topView')} <span>${board.layout==='pico' || board.orientation?.startsWith('usb') ? `USB ${board.orientation==='usb-bottom' ? (rotated?'↑':'↓') : (rotated?'↓':'↑')}` : rotated ? '180°' : '0°'}</span>`;
 $('#diagram').classList.toggle('qfn-diagram',isChip(board));
 $('#diagram').classList.toggle('board-diagram',board.layout === 'custom');
 const oldScroll = $('#diagram').scrollLeft;
 $('#diagram').innerHTML = renderers[board.layout]();
 if(innerWidth<=640) $('#diagram').scrollLeft = oldScroll || ($('#diagram').scrollWidth - $('#diagram').clientWidth)/2;
 const count=board.pins.filter(matches).length;
 $('#match-count').textContent = (search || filters.size) ? t('matchCount', { count, total: board.pins.length }) : '';
 $('#no-matches').hidden = count!==0;
 renderTable();
}
function renderTable() {
 const pins=board.pins.filter(matches);
 $('#table-content').innerHTML = `<table class="pin-table"><thead><tr><th>${t('physical')}</th><th>${t('pinName')}</th><th>${t('functions')}</th><th>${t('label')}</th><th><span class="sr-only">${t('details')}</span></th></tr></thead><tbody>${pins.map(p=>`<tr data-pin="${p.number}" class="${p.number===selected?'selected':''}" aria-current="${p.number===selected?'true':'false'}"><td>${esc(physicalLabel(p))}</td><td class="table-name" style="color:${colors[p.type]}">${esc(p.name)}</td><td>${p.functions.filter(f=>!filters.size||filters.has(f.group)).map(f=>`<span style="--color:${colors[f.group]||colors.SYSTEM}">${esc(f.name)}${f.selector ? ' · '+esc(f.selector) : ''}</span>`).join('')||'—'}</td><td>${esc(assignments[p.number]?.label||'—')}</td><td><button class="table-details" data-pin="${p.number}" aria-label="${esc(t('selectPin', {pin:physicalLabel(p),name:p.name}))}">${t('details')} →</button></td></tr>`).join('')}</tbody>${!pins.length?`<caption>${t('noMatch')}</caption>`:''}</table>`;
}
function renderDetail() {
 const pin=pinByNumber(selected), opts=options(pin);
 const descriptions = { GPIO: 'gpioDescription', GND: 'groundDescription', POWER: 'powerDescription', SYSTEM: 'systemDescription', ADC: 'analogDescription' };
 const noteBoard = board.layout === 'pico' ? 'pico2w' : board.id;
 let description = pin.noteKey ? t(pin.noteKey) : pin.reserved ? t('reservedNote') : t(`note.${noteBoard}.${pin.number}`, {}, pin.note || t(descriptions[pin.type] || 'systemDescription'));
 description += [pin.strapping ? t('espStrappingNote') : '',pin.boardCircuitKey ? t(pin.boardCircuitKey) : '',pin.analogCautionKey ? t(pin.analogCautionKey) : ''].filter(Boolean).map(note=>' '+note).join('');
 if (board.mcu === 'RP2040' && pin.number === 30) description = description.replace('RP2350', 'RP2040');
 const query = search.trim().toLowerCase();
 const relevant = f => filters.has(f.group) || (query && f.name.toLowerCase().includes(query));
 const primary = opts.filter((f,i) => i === 0 || f.name === selectedFn || relevant(f) || (!filters.size && !query && i <= 3));
 const more = opts.filter(f => !primary.includes(f));
 const sharedNote = pin.sharedWith?.length ? `<p class="pin-description shared-pin-note">${esc(t(['GPIO','ADC'].includes(pin.type) ? 'sharedPinNote' : 'sharedContactNote', {pins:pin.sharedWith.join(', ')}))}</p>` : '';
 const option = f => {
   let note = '';
   if (pin.reserved) note = t(pin.reservedLabel || (pin.name === 'NC' ? 'unconnected' : 'reserved'));
   else if (f.configuration?.field) note = `${f.selector || f.configuration.field} · ${t('remap')}`;
   else if (f.selector) note = f.selector;
   else if (f === opts[0]) note = t('default');
   return `<label class="function-option" style="--color:${colors[f.group]||colors.SYSTEM}"><input type="radio" name="pin-function" value="${esc(f.name)}" ${selectedFn===f.name?'checked':''} ${pin.reserved?'disabled':''}>${esc(f.name)}<small>${esc(note)}</small></label>`;
 };
 const hasPlan=!!assignments[selected];
 $('#selected-pin-label').textContent = `${pin.name} · ${t('details')}`;
 $('#pin-detail').innerHTML=`<div class="pin-detail-body"><div class="pin-hero"><div class="pin-identity"><h2>${esc(pin.name.replace('_ADC',' / A'))}</h2><span class="physical-pin">${t('physicalPin')} <strong>${esc(physicalLabel(pin))}</strong>${pin.boardLabel && pin.boardLabel!==pin.name ? `<span class="mcu-pin-label"> · ${esc(t('boardLabel',{label:pin.boardLabel}))}</span>` : ''}${pin.mcuPort ? `<span class="mcu-pin-label"> · Arduino D${pin.arduinoPin} · ${t('mcuPort', {port:pin.mcuPort})}</span>` : ''}${pin.mcuPin ? `<span class="mcu-pin-label"> · ${t('mcuPin', {pin:pin.mcuPin})}</span>` : ''}</span></div><span class="pin-type" style="color:${colors[pin.type]}">${familyName(pin.type)} · ${esc(pin.type === 'GPIO' ? board.voltage : '')}</span>${referenceLink(pin.evidence[0], t('pinSource'), 'pin-source')}<p class="pin-description">${esc(description)}${pin.fiveVoltTolerant !== undefined ? ' '+esc(t(pin.fiveVoltTolerant ? 'stm32FTNote' : 'stm32NonFTNote')) : ''}</p>${sharedNote}</div><fieldset class="function-section"><legend class="small-label">${t(opts.length>1 ? 'chooseFunction' : 'pinFunction')}</legend>${filters.size || query ? `<p class="function-hint">${t('matchingFunctions')}</p>` : ''}<div class="function-list">${primary.map(option).join('')}</div>${more.length ? `<details class="more-functions"><summary>${t('allFunctions', {count:more.length})}</summary><div class="function-list">${more.map(option).join('')}</div></details>` : ''}<div id="function-source"></div></fieldset><div class="label-section"><label class="small-label" for="custom-label">${t('projectLabel')} <span>${t('optional')}</span></label><input id="custom-label" maxlength="40" placeholder="${esc(t('labelExample'))}" value="${esc(assignments[selected]?.label||'')}"></div>${renderPinEvidence(pin)}</div><div class="detail-action"><button id="add-plan" class="add-plan" ${pin.reserved ? 'disabled' : ''}>${icon(hasPlan?'check':'plus')}${t(pin.reserved ? (pin.reservedLabel || (pin.name==='NC' ? 'unconnected' : 'reserved')) : hasPlan ? 'updatePin' : 'addPin')}</button><div class="pin-save-feedback"><span id="pin-save-status" role="status"></span><button id="view-saved-plan" hidden>${t('viewPlan')}</button></div></div>`;
 renderFunctionSource(pin);
}
function referenceLink(key, label, className) {
 const source = evidence.references[key];
 if (!source) return '';
 const page = source.page ? ` · ${t('pdfPage', { page: source.page })}` : '';
 return `<a class="${className}" href="${esc(source.url)}" target="_blank" rel="noopener" aria-label="${esc(label + ' · ' + source.title + page)}">${esc(source.title + page)} ↗</a>`;
}
function renderFunctionSource(pin) {
 const fn = pin.functions.find(fn => fn.name === selectedFn);
 const source = fn?.configurationEvidence || fn?.evidence;
 const remap = fn?.configuration?.field ? t('remapNote') : '';
 $('#function-source').innerHTML = (source ? referenceLink(source, t('functionSource'), 'function-source-link') : '') +
   (remap ? `<p>${esc(remap)}</p>` : '');
}
function renderPinEvidence(pin) {
 const keys = [...new Set([...pin.evidence, ...pin.functions.flatMap(f=>[f.evidence,f.configurationEvidence].filter(Boolean))])];
 return `<details class="pin-evidence"><summary>${t('pinEvidence')}</summary><ul>${keys.map(key=>{const r=evidence.references[key];return `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)} ↗</a><small>${esc(r.locator)}${r.page ? ` · ${t('pdfPage', { page: r.page })}` : ''}</small></li>`;}).join('')}</ul><p>${esc(t('verifiedOn', { date: board.verifiedOn }))} · <a href="${verificationUrl()}" target="_blank" rel="noopener">${t('method')}</a></p></details>`;
}
let detailTab = 'pin';
const compactLayout = matchMedia('(max-width: 970px)');
function setDetailTab(tab) {
 detailTab = tab;
 $('#pin-detail').hidden = tab !== 'pin'; $('#plan-panel').hidden = tab !== 'plan';
 for (const [id,value] of [['detail-tab','pin'],['plan-tab','plan']]) {
  $(`#${id}`).setAttribute('aria-selected', tab === value);
  $(`#${id}`).tabIndex = tab === value ? 0 : -1;
 }
}
function syncDetailsLayout() {
 if ($('#details-dialog').open) $('#details-dialog').close();
 const panel = $('.details-panel');
 (compactLayout.matches ? $('#details-dialog') : $('#details-home')).append(panel);
}
function showDetails(tab) {
 setDetailTab(tab);
 if (compactLayout.matches && !$('#details-dialog').open) $('#details-dialog').showModal();
}
compactLayout.addEventListener('change', syncDetailsLayout);
syncDetailsLayout();
$('#detail-tab').addEventListener('click', () => setDetailTab('pin'));
$('#plan-tab').addEventListener('click', () => setDetailTab('plan'));
$('.detail-tabs').addEventListener('keydown', e => {
 if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
 e.preventDefault(); setDetailTab(e.key === 'Home' ? 'pin' : e.key === 'End' ? 'plan' : detailTab === 'pin' ? 'plan' : 'pin');
 $(detailTab === 'pin' ? '#detail-tab' : '#plan-tab').focus();
});
$('#close-details').addEventListener('click', () => $('#details-dialog').close());
$('#details-dialog').addEventListener('close', () => {
 const target = view === 'map' ? $(`#diagram [data-pin="${selected}"]`) : $(`#table-content button.table-details[data-pin="${selected}"]`);
 target?.focus({preventScroll:true});
});
$('#open-pin').addEventListener('click', () => showDetails('pin'));
$('#open-plan').addEventListener('click', () => showDetails('plan'));
function planEntry(pin, assignment) {
 const phys = pin ? physicalLabel(pin) : '';
 const name = pin?.name || '';
 return `<span class="plan-line"><span class="plan-phys">${t('physicalPin')} ${esc(phys)}</span> · <strong>${esc(name)}</strong> · <span class="plan-fn">${esc(assignment.function)}</span></span>${assignment.label ? `<small class="plan-label">${esc(assignment.label)}</small>` : ''}`;
}
function renderPlan() {
 const entries = Object.entries(assignments);
 for (const id of ['plan-count','plan-tab-count','mobile-plan-count']) $(`#${id}`).textContent = entries.length;
 $('#plan-reference').textContent = planReference(board, t);
 $('#plan-feedback').textContent = '';
 $('#plan-list').innerHTML = entries.length ? entries.map(([n, assignment]) => {
   const pin = pinByNumber(n);
   return `<div class="plan-row"><button data-select-pin="${n}">${planEntry(pin, assignment)}</button><button class="remove-plan" data-remove-pin="${n}" aria-label="${esc(t('removePin', { pin: physicalLabel(pin) }))}">×</button></div>`;
 }).join('') : `<p class="empty-plan">${t('emptyPlan')}<br>${t('emptyPlanHint')}</p>`;
}
function addToPlan() {
 const functionName = $('input[name="pin-function"]:checked')?.value;
 if (!functionName) return;
 const candidate = { ...assignments, [selected]: { function: functionName, label: $('#custom-label').value.trim() } };
 try {
   assignments = validatePlan(candidate, board, t);
 } catch (error) {
   $('#pin-save-status').textContent = error.message;
   return;
 }
 const stored = persist();
 selectedFn = functionName;
 renderMap(); renderDetail(); renderPlan();
 if ($('#details-dialog').open) {
   $('#pin-save-status').textContent = t(stored ? 'pinSaved' : 'storageUnavailable');
   $('#view-saved-plan').hidden = false;
   $('#view-saved-plan').focus({ preventScroll: true });
 } else {
   toast(t(stored ? 'pinSaved' : 'storageUnavailable'));
   $('#add-plan').focus({ preventScroll: true });
 }
}
const boardFamilies = [
  {
    id: 'raspberry-pi',
    nameKey: 'familyRaspberryPi',
    items: [
      { type: 'layout', id: 'pico-family' },
      { type: 'layout', id: 'raspberry-pi-40' },
      {
        type: 'package-group',
        id: 'rp2350',
        name: 'RP2350',
        subtitleKey: 'rp2350Subtitle',
        defaultLayout: 'rp2350a',
        packages: [
          { id: 'rp2350a', label: 'QFN-60' },
          { id: 'rp2350b', label: 'QFN-80' }
        ]
      }
    ]
  },
  {
    id: 'arduino',
    nameKey: 'familyArduino',
    items: [
      { type: 'layout', id: 'arduino-uno' },
      { type: 'layout', id: 'arduino-nano' },
      { type: 'layout', id: 'arduino-mega-2560' },
      { type: 'layout', id: 'arduino-micro' }
    ]
  },
  {
    id: 'espressif',
    nameKey: 'familyEspressif',
    items: [
      { type: 'layout', id: 'esp32-devkitc-v4' },
      { type: 'layout', id: 'esp32-s3-devkitc-1' },
      { type: 'layout', id: 'esp32-c3-devkitm-1' }
    ]
  },
  {
    id: 'stm32',
    nameKey: 'familyStm32',
    items: [
      { type: 'layout', id: 'blue-pill' },
      { type: 'layout', id: 'stm32f103c8t6' }
    ]
  },
  {
    id: 'microchip',
    nameKey: 'familyMicrochip',
    items: [
      {
        type: 'package-group',
        id: 'atmega328p',
        name: 'ATmega328P',
        subtitleKey: 'atmega328pSubtitle',
        defaultLayout: 'atmega328p-pdip28',
        packages: [
          { id: 'atmega328p-pdip28', label: 'PDIP-28' },
          { id: 'atmega328p-tqfp32', label: 'TQFP-32' },
          { id: 'atmega328p-qfn32', label: 'QFN-32' },
          { id: 'atmega328p-qfn28', label: 'QFN-28' }
        ]
      },
      { type: 'layout', id: 'atmega2560-tqfp100' }
    ]
  },
  {
    id: 'nvidia',
    nameKey: 'familyNvidia',
    items: [
      { type: 'layout', id: 'jetson-orin-nano' }
    ]
  }
];

function showCatalog() {
  $('#catalog-search').value = '';
  renderCatalog();
  $('#library-dialog').showModal();
  $('#catalog-search').focus();
}

function renderCatalog() {
  const query = $('#catalog-search').value.toLocaleLowerCase().trim();
  const grid = $('#catalog-grid');

  if (!query) {
    grid.innerHTML = `<div class="catalog-families">${boardFamilies.map(family => {
      const cardsHtml = family.items.map(entry => {
        if (entry.type === 'layout') {
          const item = layouts.find(l => l.id === entry.id);
          if (!item) return '';
          const isActive = layout && layout.id === item.id;
          return `<div class="catalog-card ${isActive ? 'active' : ''}" data-layout="${esc(item.id)}" role="button" tabindex="0" ${isActive ? 'aria-current="true"' : ''}>
            <div class="catalog-card-icon" aria-hidden="true">${icon(isChip(item) ? 'chip' : 'board')}</div>
            <div class="catalog-card-body">
              <div class="catalog-card-header">
                <b class="catalog-card-title">${esc(layoutTitle(item))}</b>
              </div>
              <small class="catalog-card-desc">${esc(item.compatibleKey ? t(item.compatibleKey) : layoutSubtitle(item))}</small>
            </div>
          </div>`;
        } else if (entry.type === 'package-group') {
          const isGroupActive = entry.packages.some(p => layout && layout.id === p.id);
          const activePkg = entry.packages.find(p => layout && layout.id === p.id);
          const activeId = activePkg ? activePkg.id : entry.defaultLayout;
          return `<div class="catalog-card ${isGroupActive ? 'active' : ''}" data-layout="${esc(activeId)}" role="button" tabindex="0">
            <div class="catalog-card-icon" aria-hidden="true">${icon('chip')}</div>
            <div class="catalog-card-body">
              <div class="catalog-card-header">
                <b class="catalog-card-title">${esc(entry.name)}</b>
                <span class="catalog-card-count">${t('packageCount', { count: entry.packages.length })}</span>
              </div>
              <small class="catalog-card-desc">${esc(t(entry.subtitleKey))}</small>
              <div class="catalog-packages" role="group" aria-label="${esc(entry.name)} ${esc(t('packagesHeading'))}">
                ${entry.packages.map(p => `
                  <button type="button" class="catalog-package-btn ${layout && layout.id === p.id ? 'active' : ''}" data-layout="${esc(p.id)}" title="${esc(entry.name)} · ${esc(p.label)}" aria-label="${esc(entry.name)} ${esc(p.label)}">${esc(p.label)}</button>
                `).join('')}
              </div>
            </div>
          </div>`;
        }
        return '';
      }).join('');

      return `<section class="catalog-family">
        <h3 class="catalog-family-title">${esc(t(family.nameKey))}</h3>
        <div class="catalog-family-cards">${cardsHtml}</div>
      </section>`;
    }).join('')}</div>`;
    return;
  }

  const matches = [];

  for (const family of boardFamilies) {
    for (const entry of family.items) {
      if (entry.type === 'package-group') {
        const groupText = `${entry.name} ${t(entry.subtitleKey)} ${entry.packages.map(p => `${p.label} ${p.id}`).join(' ')}`.toLocaleLowerCase();
        if (groupText.includes(query)) {
          const matchedPkgs = entry.packages.filter(p => `${p.label} ${p.id}`.toLocaleLowerCase().includes(query));
          if (matchedPkgs.length && matchedPkgs.length < entry.packages.length) {
            for (const p of matchedPkgs) {
              const pkgLayout = layouts.find(l => l.id === p.id);
              matches.push({
                id: p.id,
                name: `${entry.name} (${p.label})`,
                detail: pkgLayout ? (pkgLayout.compatibleKey ? t(pkgLayout.compatibleKey) : layoutSubtitle(pkgLayout)) : t(entry.subtitleKey),
                isChip: true
              });
            }
          } else {
            matches.push({
              id: entry.defaultLayout,
              name: entry.name,
              detail: t(entry.subtitleKey),
              packages: entry.packages,
              isChip: true
            });
          }
        }
      }
    }
  }

  for (const item of layouts) {
    const alreadyMatched = matches.some(m => m.id === item.id || (m.packages && m.packages.some(p => p.id === item.id)));
    if (alreadyMatched) continue;

    const models = filterCompatibleModels(compatibleModels(item), query, model => `${model.name} ${model.id}`);
    if (models.length) {
      for (const model of models) {
        matches.push({
          id: item.id,
          profile: model.profileId,
          name: model.name,
          detail: model.detailKey ? t(model.detailKey) : model.detail,
          isChip: isChip(item)
        });
      }
    } else {
      const familyText = [
        layoutTitle(item),
        layoutSubtitle(item),
        item.compatibleKey ? t(item.compatibleKey) : '',
        ...item.profiles.map(profile => `${profile.name} ${profile.mcu} ${profile.searchTerms || ''}`)
      ].join(' ').toLocaleLowerCase();

      if (familyText.includes(query)) {
        matches.push({
          id: item.id,
          name: layoutTitle(item),
          detail: item.compatibleKey ? t(item.compatibleKey) : layoutSubtitle(item),
          isChip: isChip(item)
        });
      }
    }
  }

  if (!matches.length) {
    grid.innerHTML = `<p class="catalog-note">${t('noBoard')}</p>`;
    return;
  }

  grid.innerHTML = `<div class="catalog-search-results">${matches.map(m => {
    const isActive = layout && layout.id === m.id && (!m.profile || board.id === m.profile);
    if (m.packages) {
      return `<div class="catalog-card ${isActive ? 'active' : ''}" data-layout="${esc(m.id)}" role="button" tabindex="0">
        <div class="catalog-card-icon" aria-hidden="true">${icon('chip')}</div>
        <div class="catalog-card-body">
          <div class="catalog-card-header">
            <b class="catalog-card-title">${esc(m.name)}</b>
            <span class="catalog-card-count">${t('packageCount', { count: m.packages.length })}</span>
          </div>
          <small class="catalog-card-desc">${esc(m.detail)}</small>
          <div class="catalog-packages" role="group" aria-label="${esc(m.name)} ${esc(t('packagesHeading'))}">
            ${m.packages.map(p => `
              <button type="button" class="catalog-package-btn ${layout && layout.id === p.id ? 'active' : ''}" data-layout="${esc(p.id)}" title="${esc(m.name)} · ${esc(p.label)}" aria-label="${esc(m.name)} ${esc(p.label)}">${esc(p.label)}</button>
            `).join('')}
          </div>
        </div>
      </div>`;
    }
    return `<div class="catalog-card ${isActive ? 'active' : ''}" data-layout="${esc(m.id)}"${m.profile ? ` data-profile="${esc(m.profile)}"` : ''} role="button" tabindex="0">
      <div class="catalog-card-icon" aria-hidden="true">${icon(m.isChip ? 'chip' : 'board')}</div>
      <div class="catalog-card-body">
        <div class="catalog-card-header">
          <b class="catalog-card-title">${esc(m.name)}</b>
        </div>
        <small class="catalog-card-desc">${esc(m.detail)}</small>
      </div>
    </div>`;
  }).join('')}</div>`;
}
function planPayload() { return {version:1,board:board.id,pins:assignments}; }
function encode(value) { return btoa(Array.from(new TextEncoder().encode(JSON.stringify(value)),b=>String.fromCharCode(b)).join('')); }
function decode(value) { if(value.length>16000) throw new Error(t('linkTooLong')); return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(value),c=>c.charCodeAt(0)))); }
async function share() {
 const params=new URLSearchParams({board:layout.id,profile:board.id,pin:String(selected),plan:encode(planPayload())});
 const url=new URL(location.href);
 url.searchParams.set('lang', document.documentElement.lang);
 url.hash=params.toString();
 $('#share-url').value=url.href;$('#share-dialog').showModal();
 try { await navigator.clipboard.writeText(url.href); toast(t('planLinkCopied')); } catch { $('#share-url').focus();$('#share-url').select(); }
}
function setView(value) {
 view=value;$('#view-options').open=false;$('#view-options').hidden=view!=='map';$('#map-content').hidden=view!=='map';$('#table-content').hidden=view!=='table';
 for(const v of ['map','table']) { $(`#${v}-view`).classList.toggle('active',view===v);$(`#${v}-view`).setAttribute('aria-pressed',view===v); }
}
let pendingPlan;
const previewDialog = $('#incoming-plan-dialog');

function renderIncomingPlan() {
 const { target, pins, existing } = pendingPlan;
 const replaces = Object.keys(existing).length > 0 && !samePlan(existing, pins);
 $('#incoming-plan-reference').textContent = planReference(target, t);
 $('#incoming-plan-message').textContent = t(replaces ? 'replacePlanMessage' : 'incomingPlanMessage');
 $('#incoming-plan-list').innerHTML = Object.entries(pins).map(([n, assignment]) =>
   `<li>${planEntry(target.pins.find(pin => String(pin.number) === n), assignment)}</li>`
 ).join('') || `<li>${t('emptyIncomingPlan')}</li>`;
 $('#save-incoming-plan').textContent = t(replaces ? 'replacePlan' : 'saveIncomingPlan');
}
function previewPlan(target, pins, pin) {
 savedPlans = readSavedPlans(savedPlans);
 pendingPlan = { target, pins, pin, existing: savedPlans[target.id] || {} };
 renderIncomingPlan();
 if (!previewDialog.open) previewDialog.showModal();
}
previewDialog.addEventListener('close', () => {
 if (!previewDialog.open) pendingPlan = undefined;
});
$('#save-incoming-plan').addEventListener('click', () => {
 if (!pendingPlan) return;
 const { target, pins, pin, existing } = pendingPlan;
 savedPlans = readSavedPlans(savedPlans);
 const latest = savedPlans[target.id] || {};
 if (!samePlan(existing, latest) && !samePlan(pins, latest)) {
   previewPlan(target, pins, pin);
   $('#incoming-plan-message').textContent = t('previewPlanChanged');
   return;
 }
 previewDialog.close();
 setBoard(target.id, false, target.id);
 if (pin && pinByNumber(pin)) selected = Number(pin);
 assignments = pins;
 selectedFn = assignments[selected]?.function || options(pinByNumber(selected))[0].name;
 const stored = persist();
 renderMap(); renderDetail(); renderPlan();
 showDetails('plan');
 $('#plan-feedback').textContent = t(stored ? 'planImported' : 'storageUnavailable');
 $('#plan-tab').focus();
});

function loadHash() {
 const params = new URLSearchParams(location.hash.slice(1));
 const pin = params.get('pin');
 let target = params.get('board'), payload;
 if (params.has('plan')) {
   try {
     const data = decode(params.get('plan'));
     const profile = boards.find(item => item.id === data?.board);
     if (data?.version !== 1 || !profile) throw new Error(t('unsupportedFormat'));
     payload = { target: profile, pins: validatePlan(data.pins, profile, t) };
     target = profile.id;
   } catch (error) {
     toast(t('shareFailed', { error: error.message }));
   }
 }
 setBoard(target || layouts[0].id, true, payload ? payload.target.id : params.get('profile'));
 if (pin && pinByNumber(pin)) choosePin(pin, false);
 if (params.has('plan')) {
   params.delete('plan');
   params.set('board', layout.id);
   params.set('profile', board.id);
   history.replaceState(null, '', `#${params}`);
 }
 if (payload) previewPlan(payload.target, payload.pins, pin);
 else if (previewDialog.open) previewDialog.close();
}
$('#board-nav')?.addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(b)openLayout(b.dataset.layout);});
$('#library-button')?.addEventListener('click',showCatalog);
$('#function-reference').addEventListener('change', e => setBoard(layout.id, false, e.target.value));
$('#compatibility-search').addEventListener('input',e=>{compatibilityQuery=e.target.value;renderCompatibilityList();});
$('#compatibility-list').addEventListener('click',e=>{
 const link=e.target.closest('[data-compatible-model]');
 if(!link || e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)return;
 e.preventDefault();
 const model=link.dataset.compatibleModel,profile=link.dataset.profile;
 setBoard(layout.id,false,profile);
 $('#compatibility-list').querySelector(`[data-compatible-model="${CSS.escape(model)}"]`)?.focus({preventScroll:true});
});
$('#catalog-grid').addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(b){openLayout(b.dataset.layout, b.dataset.profile);$('#library-dialog').close();}});
$('#catalog-grid').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-layout]')){e.preventDefault();const b=e.target.closest('[data-layout]');openLayout(b.dataset.layout, b.dataset.profile);$('#library-dialog').close();}});
$('#catalog-search').addEventListener('input',renderCatalog);
$('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}));
$('#menu-button').addEventListener('click',showCatalog);
$('#main').addEventListener('click',()=>$('#sidebar')?.classList.remove('open'));
$('#filters').addEventListener('click', e => {
 const button = e.target.closest('[data-filter]');
 if (!button) return;
 const group = button.dataset.filter;
 if (filters.has(group)) filters.delete(group);
 else filters.add(group);
 renderFilters(); renderMap(); renderDetailPreservingDraft();
 $(`[data-filter="${group}"]`, $('#filters')).focus({ preventScroll: true });
});
const disclosures = [$('#filter-options'), $('#view-options')];
for (const disclosure of disclosures) {
 disclosure.addEventListener('toggle', () => {
   if (disclosure.open) for (const other of disclosures) if (other !== disclosure) other.open = false;
 });
 disclosure.addEventListener('keydown', e => {
   if (e.key !== 'Escape' || !disclosure.open) return;
   disclosure.open = false;
   $('summary', disclosure).focus();
 });
}
document.addEventListener('click', e => {
 for (const disclosure of disclosures) if (!e.composedPath().includes(disclosure)) disclosure.open = false;
});
$('#reset-filters').addEventListener('click', () => {
 filters.clear(); search = ''; $('#pin-search').value = '';
 renderFilters(); renderMap(); renderDetailPreservingDraft();
});
$('#pin-search').addEventListener('input',e=>{search=e.target.value;renderMap();renderDetailPreservingDraft();});
$('#flip-button').addEventListener('click',()=>{flipped=!flipped;renderMap();});
$('#rotate-button').addEventListener('click',()=>{rotated=!rotated;renderMap();});
$('#reset-view').addEventListener('click',()=>{flipped=rotated=false;renderMap();});
$('#map-view').addEventListener('click',()=>setView('map'));$('#table-view').addEventListener('click',()=>setView('table'));
for(const element of [$('#diagram'),$('#table-content')]) {
 element.addEventListener('click',e=>{const p=e.target.closest('[data-pin]');if(p)choosePin(p.dataset.pin);});
 element.addEventListener('keydown',e=>{const p=e.target.closest('[data-pin]');if(p&&p.tagName.toLowerCase()!=='button'&&['Enter',' '].includes(e.key)){e.preventDefault();choosePin(p.dataset.pin); if(!$('#details-dialog').open) $(`[data-pin="${p.dataset.pin}"]`,element)?.focus();}});
}
function renderDetailPreservingDraft() {
 const label = $('#custom-label')?.value;
 renderDetail();
 if (label !== undefined) $('#custom-label').value = label;
}
$('#pin-detail').addEventListener('change', e => {
 if (e.target.name !== 'pin-function') return;
 selectedFn = e.target.value;
 renderFunctionSource(pinByNumber(selected));
 $('#pin-save-status').textContent = '';
 $('#view-saved-plan').hidden = true;
});
$('#pin-detail').addEventListener('click', e => {
 if (e.target.closest('#add-plan')) addToPlan();
 if (e.target.closest('#view-saved-plan')) {
   showDetails('plan');
   $('#plan-tab').focus();
 }
});
$('#plan-list').addEventListener('click',e=>{const remove=e.target.closest('[data-remove-pin]'),select=e.target.closest('[data-select-pin]');if(remove){delete assignments[remove.dataset.removePin];const stored=persist();renderPlan();renderMap();renderDetail();$('#plan-feedback').textContent=t(stored?'pinRemoved':'storageUnavailable');}else if(select)choosePin(select.dataset.selectPin);});
$('#share-button').addEventListener('click',share);
$('#copy-share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#share-url').value);toast(t('linkCopied'));$('#share-dialog').close();}catch{$('#share-url').focus();$('#share-url').select();toast(t('manualCopy'));}});
$('#export-button').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(planPayload(),null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`pin-atlas-${board.id}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);toast(t('planDownloaded'));});
$('#import-button').addEventListener('click',()=>$('#import-file').click());
$('#import-file').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{
  if(file.size>100000)throw new Error(t('fileTooLarge'));
  const payload=JSON.parse(await file.text());const target=boards.find(b=>b.id===payload?.board);
  if(payload?.version!==1||!target)throw new Error(t('unsupportedFile'));
  previewPlan(target, validatePlan(payload.pins, target, t));
 }catch(error){$('#plan-feedback').textContent=error.message||t('importFailed');}finally{e.target.value='';}
});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('dialog[open]')){e.preventDefault();$('#pin-search').focus();}if(e.key==='Escape')$('#sidebar')?.classList.remove('open');});
window.addEventListener('zaryob:language', () => {
 if (!board) return;
 const draftLabel = $('#custom-label')?.value;
 renderBoard();
 if (draftLabel !== undefined) $('#custom-label').value = draftLabel;
 if ($('#library-dialog').open) renderCatalog();
 if (previewDialog.open) renderIncomingPlan();
});
window.addEventListener('hashchange',()=>{if(boards && location.hash!=='#main')loadHash();});
try {
 const [boardResult, evidenceResult] = await Promise.all(['boards.json','evidence.json'].map(name=>fetch(new URL('./data/'+name,appBase))));
 if(!boardResult.ok || !evidenceResult.ok)throw new Error(t('loadFailed'));
 [boards,evidence] = await Promise.all([boardResult.json(),evidenceResult.json()]);layouts=buildLayouts(boards);loadHash();
} catch(error) { $('#diagram').innerHTML=`<p data-i18n="reloadHint" style="padding:40px;line-height:2">${t('reloadHint')}</p>`;toast(error.message); }
