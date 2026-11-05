import { buildLayouts, resolveProfile } from './layouts.mjs';
import { compatibleModels, filterCompatibleModels } from './compatibility.mjs';
import { connectorGroupsFor } from './connectors.mjs';
import { boardFamilies, homeFilterChips, featuredCards, catalogTypes, buildCatalog, filterCatalog } from './catalog.mjs';
import { options, physicalLabel, planReference, samePlan, validatePlan } from './plans.mjs';
import { availablePeripherals, assemblePeripheral } from './peripherals.mjs';
import {ProfileLibrary} from './profile-library.mjs';
import {planReport,reportHTML,reportSVG,standaloneDiagram} from './plan-output.mjs';
import {configureBoard,normalizeHardware,sameHardware,hardwareSummary} from './hardware-config.mjs';
import {readPlanRecords,writePlanRecord,planPayload as createPlanPayload,decodePlanPayload} from './plan-records.mjs';
import {applySuggestion} from './pin-solver.mjs';
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
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/>'
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
let currentView = 'home', homeActiveFilter = 'all', homeSearchQuery = '', homeCatalogType = 'all';
let libraryCatalogType = 'all', libraryFamily = 'all';
let dataState = 'loading', dataLoading = false;
let library, navigationSequence=0;
let sourceBoard,hardwareSettings={},hardwareRestoreError='';
let suggestionWorker,suggestionSequence=0,suggestionResult,suggestionSnapshot;
const rememberedProfiles = new Map();
let compatibilityModels = [], compatibilityQuery = '';
let connectorGroups = [];
let connectorZoom = '';
const layoutTitle = item => item.nameKey ? t(item.nameKey) : item.name;
const layoutSubtitle = item => item.subtitleKey ? t(item.subtitleKey) : subtitle(item);
let savedRecords=readPlanRecords(localStorage);
function readSavedPlans() {
 savedRecords=readPlanRecords(localStorage,savedRecords);
 return Object.fromEntries(Object.entries(savedRecords).map(([id,record])=>[id,record.pins]));
}
function savedHardware(profile){return normalizeHardware(profile,savedRecords[profile.id]?.hardware||{},t);}
function configuredProfile(profile){try{return configureBoard(profile,savedHardware(profile),t);}catch{return configureBoard(profile,{},t);}}
let savedPlans = readSavedPlans();
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500); }
function persist() {
 invalidateSuggestions();
 savedPlans = { ...readSavedPlans(savedPlans), [board.id]: assignments };
 savedRecords[board.id]={version:sourceBoard.hardware?2:1,pins:assignments,...(sourceBoard.hardware?{hardware:hardwareSettings}:{})};
 renderCompatibilityList();
 try {
   writePlanRecord(localStorage,sourceBoard,assignments,hardwareSettings);
   return true;
 } catch {
   return false;
 }
}
function pinByNumber(n) { return board.pins.find(p => p.number === Number(n)); }
function inConnectorZoom(pin) { return !connectorZoom || connectorGroups.find(group => group.id === connectorZoom)?.contacts.includes(pin.connector); }
function matches(pin) { const text = [pin.number, pin.name, pin.physicalLabel, pin.boardLabel, pin.mcuPort, pin.arduinoPin !== undefined ? `D${pin.arduinoPin}` : '', ...pin.functions.flatMap(f => [f.name,f.signal]), assignments[pin.number]?.label].join(' ').toLowerCase(); return text.includes(search.toLowerCase().trim()) && (!filters.size || (!pin.hardwareBlocked && pin.functions.some(f => filters.has(f.group)))); }
async function setBoard(id, initial = false, preferredProfile,preferredHardware) {
 invalidateSuggestions();
 const next = resolveProfile(layouts, id, preferredProfile);
 const sequence=++navigationSequence, wasHome=currentView==='home';
 if(!initial){
   const hash='#'+new URLSearchParams({board:next.layout.id,profile:next.profile.id});
   if(wasHome)history.pushState(null,'',hash);else history.replaceState(null,'',hash);
 }
 dataState='loading';renderDataState();
 try {await library.workspace(next.profile.id);}
 catch {if(sequence===navigationSequence){dataState='error';renderDataState();}return false;}
 if(sequence!==navigationSequence)return false;
 dataState='ready';
 const sameLayout = layout?.id === next.layout.id;
 const previousPin = selected;
 const previousPhysical=board?.pins?.find(pin=>pin.number===selected)?.physicalLabel;
 layout = next.layout;sourceBoard=next.profile;hardwareRestoreError='';
 savedPlans=readSavedPlans();
 try{hardwareSettings=normalizeHardware(sourceBoard,preferredHardware??savedRecords[sourceBoard.id]?.hardware??{},t);}
 catch(error){hardwareSettings=normalizeHardware(sourceBoard,{},t);hardwareRestoreError=error.message;}
 board=configureBoard(sourceBoard,hardwareSettings,t);
 connectorGroups = connectorGroupsFor(board);
 if (!connectorGroups.some(group => group.id === connectorZoom)) connectorZoom = '';
 rememberedProfiles.set(layout.id, board.id);
 const physicalMatch=sameLayout && previousPhysical && board.pins.find(pin=>pin.physicalLabel===previousPhysical);
 selected = physicalMatch ? physicalMatch.number : sameLayout && board.pins.some(pin => pin.number === previousPin) ? previousPin : board.pins.find(p => p.type === 'GPIO')?.number || 1;
 try {
   assignments = validatePlan(savedPlans[board.id] || {}, board, t, { allowDuplicateSignals: true, allowConflictingRemaps: true, allowSharedNets:true, allowRetiredFunctions:true,allowHardwareConflicts:true, ignoreLegacyHseAssignments: true });
 } catch { assignments = {}; }
 selectedFn = assignments[selected]?.function || options(pinByNumber(selected))[0].name;
 if (!sameLayout) { filters = new Set(); search = ''; $('#pin-search').value = ''; flipped = rotated = false; connectorZoom = ''; compatibilityQuery=''; $('#compatible-boards').open=false; }
 const available = new Set(board.pins.flatMap(pin => pin.functions.map(fn => fn.group)));
 filters = new Set([...filters].filter(group => available.has(group)));
 showWorkspaceView();
 renderBoard();
 renderDataState();
 if (!initial) {
   const hash = `#${new URLSearchParams({board:layout.id,profile:board.id,pin:selected})}`;
   history.replaceState(null, '', hash);
 }
 if ($('#details-dialog').open) $('#details-dialog').close();
 setDetailTab('pin');
 return true;
}
async function openLayout(id, profile) {
 if (dataState !== 'ready') return;
 const target = layouts.find(item => item.id === id);
 if (!target) return;
 const wasHome = currentView === 'home';
 // Reopen the last function reference, including legacy saved model plans.
 const savedProfile = target.profiles.find(profile => Object.keys(savedPlans[profile.id] || {}).length)?.id;
 const opened=await setBoard(id, false, profile || rememberedProfiles.get(id) || savedProfile);
 if (opened && wasHome && !$('#library-dialog').open) focusWorkspace();
}
function focusWorkspace() {
 window.scrollTo(0, 0);
 $('#board-title').focus({preventScroll:true});
}
function renderBoard() {
 document.title = `${board.name} Pinout — Pin Atlas`;
 $('#board-title').textContent = board.name;
 const entry=buildCatalog(layouts,t).find(item=>item.profile===board.id);
 $('#board-reference').textContent = [entry?.series, board.mcu, isChip(board)?board.packageName:''].filter(Boolean).join(' · ');
 const scope = board.scopeKey ? t(board.scopeKey) : layout.scopeKey ? t(layout.scopeKey) : '';
 $('#board-scope').hidden = !scope;
 $('#board-scope').textContent = scope;
 renderCompatibilityIndex();
 renderHardware();
 updateLibraryCount();
 $('#crumb').textContent = board.shortName || board.name;
 $('#board-family').textContent = entry?.familyName || board.family;
 $('#datasheet').href = board.datasheet;
 $('#reference-link').href = board.source;
 $('#reference-link').innerHTML = `${t('officialSource')} <span>↗</span>`;
 $('#pin-count').textContent = t('pinCount', { count: board.packagePins });
 $('#specs').innerHTML = `<span>${icon('chip')}<b>${board.uniqueGPIOCount ?? board.gpioCount}</b>GPIO${board.reservedGPIOCount ? ` (${t('reservedCount', { count: board.reservedGPIOCount })})` : ''}</span><span>${icon('bolt')}<b>${esc(board.voltage)}</b></span>`;
 renderNav(); renderReferenceNote(); renderFilters(); renderMap(); renderDetail(); renderPlan();
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
function renderReferenceNote() {
 $('#reference-note').hidden = !layout.references.length;
 $('#reference-note').textContent = layout.id === 'raspberry-pi-40' ? t(board.id === 'raspberry-pi-4' ? 'pi4ReferenceNote' : 'commonReferenceNote') : layout.id === 'pico-family' ? t('picoReferenceNote') : t('headerReferenceNote');
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
 if (!inConnectorZoom(p)) connectorZoom = '';
 selectedFn = assignments[selected]?.function || options(p)[0].name;
 renderMap(); renderDetail();
 if (reveal) showDetails('pin');
 history.replaceState(null, '', `#${new URLSearchParams({board:layout.id,profile:board.id,pin:selected})}`);
}
function pinGroup(pin, x, y, side, opts = {}) {
 const active = pin.number === (opts.preview ? opts.activePin : selected);
 const match = opts.preview || matches(pin), assigned = opts.preview ? null : assignments[pin.number];
 const color = colors[pin.type] || colors.SYSTEM;
 const matchingFunctions = opts.preview ? [] : pin.functions.filter(f => filters.has(f.group) || (search.trim() && f.name.toLowerCase().includes(search.trim().toLowerCase())));
 const fn = matchingFunctions[0];
 const label = opts.showConnectorLabel && pin.boardLabel ? pin.boardLabel : pin.name.replace('_ADC', '/A');
 const func = assigned?.label || assigned?.function || matchingFunctions.slice(0,2).map(f=>f.name).join(' · ') || (label !== pin.name && opts.showConnectorLabel ? pin.name : '');
 const left = side === 'left';
 const xSign = left ? -1 : 1;
 // Include the terminal and its lead in the same target as the label. The
 // previous target stopped short of the terminal, leaving a dead area at it.
 let body = `<rect class="pin-hit" x="${left ? -222 : -10}" y="-10" width="232" height="20" rx="4" fill="transparent"/><path d="M0 0h${xSign * 24}" stroke="${active ? 'var(--accent)' : 'var(--line)'}" stroke-width="1"/><circle class="pin-node" r="4.4" fill="${pin.type === 'GPIO' ? '#e2eccc' : '#f2eee6'}" stroke="${color}" stroke-width="1.3"/><text class="pin-number" x="${xSign * 17}" y="3" text-anchor="middle">${esc(pin.connectorPin ?? pin.physicalLabel ?? pin.number)}</text><rect x="${left ? -99 : 30}" y="-8.5" width="69" height="17" rx="3" fill="${color}" fill-opacity="${active ? '.2' : '.09'}"/><text class="pin-label" x="${xSign * 64}" y="3.7" fill="${color}" text-anchor="middle">${esc(label)}</text>${func ? `<text class="pin-function" x="${xSign * 111}" y="3" text-anchor="${left ? 'end' : 'start'}" fill="${assigned ? 'var(--success)' : colors[fn?.group] || color}">${esc(func.length > 24 ? func.slice(0,23)+'…' : func)}</text>` : ''}${assigned ? `<circle r="2" cx="${xSign * 215}" fill="var(--success)"/>` : ''}`;
 if (opts.connector) {
   const contactLabel = label === pin.name ? pin.name : `${label} · ${pin.name}`;
   body = `<rect class="pin-hit" x="${left ? -111 : -12}" y="-10" width="123" height="20" rx="3" fill="transparent"/>
     <rect class="pin-node" x="-10" y="-9" width="20" height="18" rx="3" stroke="${color}" stroke-width="1.4"/>
     <text class="connector-pin-number" x="0" y="3.5" text-anchor="middle">${pin.connectorPin}</text>
     <text class="connector-signal" x="${xSign * 15}" y="4" text-anchor="${left ? 'end' : 'start'}" fill="var(--ink)">${esc(contactLabel)}</text>`;
 } else if (opts.compact) {
   const w=opts.padWidth;
   body=`<rect class="pin-hit" x="${-w/2}" y="-17" width="${w}" height="54" rx="4" fill="var(--surface)" stroke="var(--line)"/><circle class="pin-node" cy="-7" r="4.4" stroke="${color}" stroke-width="1.3"/><text class="pad-number" y="13" text-anchor="middle">${esc(pin.connectorPin)}</text><text class="pad-label" y="28" fill="${color}" text-anchor="middle">${esc(pin.name)}</text>`;
 }
 if (opts.preview) {
   const action = opts.contacts?.length
     ? `data-mcu-pin="${pin.number}" role="button" tabindex="${opts.tabStop ? '0' : '-1'}" aria-label="${esc(t('selectMcuPad', {pin: pin.number, name: pin.name, contacts: opts.contacts.map(physicalLabel).join(', ')}))}"${active ? ' aria-current="true"' : ''}`
     : 'aria-hidden="true"';
   return `<g class="pin-group ${active ? 'selected package-pad' : ''}" ${action} transform="translate(${x} ${y})${opts.angle ? ` rotate(${opts.angle})` : ''}">${body}</g>`;
 }
 return `<g class="pin-group ${pin.hardwareBlocked?'hardware-unavailable':''} ${opts.connected ? 'net-contact' : ''} ${active ? 'selected' : ''} ${match ? '' : 'dimmed'} ${assigned ? 'assigned' : ''}" data-pin="${pin.number}" role="button" tabindex="${active ? '0' : '-1'}" aria-label="${esc(t('selectPin', { pin: physicalLabel(pin), name: label !== pin.name && opts.showConnectorLabel ? `${label} · ${pin.name}` : pin.name }))}${func && !opts.connector ? ', '+esc(func) : ''}${pin.hardwareBlocked?', '+esc(t('hwUnavailable')):''}"${active ? ' aria-current="true"' : ''} transform="translate(${x} ${y})${opts.angle ? ` rotate(${opts.angle})` : ''}"><title>Pin ${esc(pin.physicalLabel || pin.number)} · ${esc(pin.name)}${func ? ' · '+esc(func) : ''}${pin.hardwareBlocked?' · '+esc(t('hwUnavailable')):''}</title><g aria-hidden="true">${body}</g></g>`;
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
 return `<svg role="group" viewBox="0 0 680 540" aria-label="${esc(t('diagramLabel', { board: board.name }))}"><g transform="${flipped ? 'translate(680 0) scale(-1 1)' : ''}"><g transform="${rotated ? 'rotate(180 340 269.5)' : ''}">${picoArt()}</g></g>${pins}</svg>`;
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
 return `<svg role="group" viewBox="0 0 680 540" aria-label="${esc(t('diagramLabel', { board: board.name }))}"><rect x="308" y="29" width="64" height="480" rx="6" fill="#26372c"/><rect x="315" y="37" width="50" height="464" rx="3" fill="#384c3a"/>${pins}<text x="340" y="530" fill="#869b75" font-family="var(--mono)" font-size="7" text-anchor="middle">${board.headerLabel ? esc(board.headerLabel)+' · ' : ''}${t('headerLegend')}</text></svg>`;
}
function renderDip(profile = board, activePin = selected, contactsByPad = new Map()) {
 const preview = profile !== board;
 const tabPad = contactsByPad.has(activePin) ? activePin : profile.pins.find(pin => contactsByPad.has(pin.number))?.number;
 const total=profile.packagePins, half=total/2, h=160+(half-1)*28;
 let pins='';
 for(const pin of profile.pins){
   let left=pin.number<=half,x=left?305:495,y=80+(left?pin.number-1:total-pin.number)*28,side=left?'left':'right';
   if(!preview && rotated){x=800-x;y=h-y;side=side==='left'?'right':'left';}
   if(!preview && flipped){x=800-x;side=side==='left'?'right':'left';}
   pins+=pinGroup(pin,x,y,side,{preview,activePin,contacts:contactsByPad.get(pin.number),tabStop:pin.number===tabPad});
 }
 return `<svg role="group" viewBox="0 0 800 ${h}" aria-label="${esc(t('diagramLabel',{board:profile.name}))}"><g class="board-art" transform="${!preview && flipped?'translate(800 0) scale(-1 1)':''}"><g transform="${!preview && rotated?`rotate(180 400 ${h/2})`:''}"><rect x="312" y="48" width="176" height="${h-96}" rx="7" fill="#34433a" stroke="#7f9175"/><path d="M382 48a18 18 0 0 0 36 0" fill="var(--paper)" stroke="#7f9175"/><circle cx="327" cy="79" r="5" fill="#a9b796"/><text x="400" y="${h/2-10}" text-anchor="middle" fill="#dce6d0" font-size="19">${esc(profile.mcu)}</text><text x="400" y="${h/2+20}" text-anchor="middle" fill="#9db08f" font-size="13">${esc(profile.packageName)}</text></g></g>${pins}</svg>`;
}
function renderQfn(profile = board, activePin = selected, contactsByPad = new Map()) {
 const preview = profile !== board;
 const tabPad = contactsByPad.has(activePin) ? activePin : profile.pins.find(pin => contactsByPad.has(pin.number))?.number;
 const n=profile.packagePins/4,size=profile.packagePins>=100?1056:800,c=size/2,end=size-220,span=size-464,pitch=span/(n-1),body=size-434;
 const packageName=profile.packageName || `${profile.layout==='lqfp'?'LQFP':'QFN'}-${profile.packagePins}`;
 let pins='';
 for(const pin of profile.pins){
   const sideIndex=Math.floor((pin.number-1)/n),i=(pin.number-1)%n;
   let pos={x:220,y:232+i*pitch,side:'left',angle:0};
   if(sideIndex===1)pos={x:232+i*pitch,y:end,side:'right',angle:90};
   if(sideIndex===2)pos={x:end,y:size-232-i*pitch,side:'right',angle:0};
   if(sideIndex===3)pos={x:size-232-i*pitch,y:220,side:'left',angle:90};
   if(!preview && rotated){pos.x=size-pos.x;pos.y=size-pos.y;pos.side=pos.side==='left'?'right':'left';}
   if(!preview && flipped){pos.x=size-pos.x;if(!pos.angle)pos.side=pos.side==='left'?'right':'left';}
   pins+=pinGroup(pin,pos.x,pos.y,pos.side,{angle:pos.angle,preview,activePin,contacts:contactsByPad.get(pin.number),tabStop:pin.number===tabPad});
 }
 return `<svg role="group" viewBox="0 0 ${size} ${size}" ${!preview && size>800?'style="min-width:1000px;max-height:none"':''} aria-label="${esc(t('diagramLabel',{board:`${profile.mcu} ${packageName}`}))}"><g class="board-art" transform="${!preview && flipped?`translate(${size} 0) scale(-1 1)`:''}"><g transform="${!preview && rotated?`rotate(180 ${c} ${c})`:''}"><rect x="217" y="217" width="${body}" height="${body}" rx="9" fill="#34433a" stroke="#26352b" stroke-width="3"/><rect x="231" y="231" width="${body-28}" height="${body-28}" rx="5" fill="none" stroke="#7f9175" stroke-width=".6"/><circle cx="246" cy="247" r="6" fill="#a9b796"/>${profile.layout==='qfn' && profile.exposedPad!==false?`<rect x="${c-97}" y="${c-97}" width="194" height="194" rx="5" fill="#3b4d40" stroke="#637a58" stroke-dasharray="4 5"/>`:''}<text x="${c}" y="${c-23}" text-anchor="middle" fill="#dce6d0" font-size="${profile.layout==='lqfp'?21:29}">${esc(profile.mcu)}</text><text x="${c}" y="${c+6}" text-anchor="middle" fill="#9db08f" font-size="12" letter-spacing="3">${esc(packageName)}</text>${profile.layout==='qfn' && profile.exposedPad!==false?`<text x="${c}" y="${c+43}" text-anchor="middle" fill="#819975" font-size="9">EP · GND</text>`:''}<text x="${c}" y="${size-268}" text-anchor="middle" fill="#839b76" font-size="8" letter-spacing="3">${esc(profile.family.toUpperCase())}</text></g></g>${pins}</svg>`;
}
function renderCustom() {
 const {width,height,artwork} = board.diagram;
 const image = /^(?:\.\/|\/)?assets\/[a-zA-Z0-9_./-]+\.svg$/.test(artwork || '') ? `<image href="${esc(new URL(artwork.replace(/^\//,''), appBase).href)}" width="${width}" height="${height}"/>` : '';
 const showConnectorLabel = board.id.startsWith('nucleo-');
 const selectedPin = pinByNumber(selected);
 const connected = new Set(selectedPin.sharedWith || []);
 if (selectedPin.mcuPin) {
   for (const pin of board.pins) {
     if (pin !== selectedPin && pin.mcuPin === selectedPin.mcuPin) connected.add(physicalLabel(pin));
   }
 }
 if (connected.size) connected.add(physicalLabel(selectedPin));
 const contacts = board.pins.filter(inConnectorZoom).map(pin => {
   let {x,y,side,angle=0,compact=false,padWidth=62} = pin.position;
   if(rotated){ x=width-x;y=height-y;side=side==='left'?'right':'left'; }
   if(flipped){x=width-x;if(!angle)side=side==='left'?'right':'left';}
   return {pin,x,y,side,angle,compact,padWidth};
 });
 const pins = contacts.map(({pin,x,y,side,angle,compact,padWidth}) =>
   pinGroup(pin,x,y,side,{angle,compact,padWidth,showConnectorLabel,connector:showConnectorLabel,connected:connected.has(physicalLabel(pin))})
 ).join('');
 let viewBox = [0, 0, width, height];
 if (connectorZoom && contacts.length) {
   const bounds = contacts.map(({x,y,side,angle,compact,padWidth}) => {
     if (compact) return [x - padWidth / 2 - 8, y - 25, x + padWidth / 2 + 8, y + 38];
     const lead = showConnectorLabel ? 122 : 230;
     const before = side === 'left' ? lead : 22;
     const after = side === 'right' ? lead : 22;
     return angle ? [x - 18, y - before, x + 18, y + after] : [x - before, y - 18, x + after, y + 18];
   });
   const left = Math.max(0, Math.min(...bounds.map(b => b[0])));
   const right = Math.min(width, Math.max(...bounds.map(b => b[2])));
   const top = Math.max(0, Math.min(...bounds.map(b => b[1])) - 20);
   const bottom = Math.min(height, Math.max(...bounds.map(b => b[3])) + 6);
   viewBox = [left, top, right - left, bottom - top];
 }
 const minWidth = connectorZoom ? Math.min(820, Math.max(300, Math.ceil(viewBox[2] * 1.2))) : board.diagram.minWidth;
 return `<svg role="group" viewBox="${viewBox.join(' ')}" ${minWidth ? `style="min-width:${minWidth}px;max-height:none"` : ''} aria-label="${esc(t('diagramLabel', { board: board.name }))}"><g transform="${flipped?`translate(${width} 0) scale(-1 1)`:''}"><g transform="${rotated?`rotate(180 ${width/2} ${height/2})`:''}">${image}</g></g>${pins}</svg>`;
}
const renderers = {pico:renderPico,qfn:renderQfn,lqfp:renderQfn,dip:renderDip,header:renderHeader,custom:renderCustom};
function renderMap() {
 const nucleo = board.id.startsWith('nucleo-');
 const pin = pinByNumber(selected);
 $('#connector-tools').hidden = board.layout !== 'custom' || connectorGroups.length < 2;
 const zoom = $('#connector-zoom');
 const choices = `<option value="">${esc(t('wholeBoard'))}</option>` +
   connectorGroups.map(group => `<option value="${esc(group.id)}">${esc(group.label)}</option>`).join('');
 if (zoom.innerHTML !== choices) zoom.innerHTML = choices;
 zoom.value = connectorZoom;
 const bridgeNote = $('#connector-bridge-note');
 bridgeNote.hidden = !pin.boardCircuitKey;
 bridgeNote.textContent = bridgeNote.hidden ? '' : `${physicalLabel(pin)} · ${t(nucleo ? 'bridgeNote' : 'boardCircuit')} · ${t(pin.boardCircuitKey)}`;
 renderPackageBoards(pin);
 $('#flip-button').setAttribute('aria-pressed',flipped); $('#rotate-button').setAttribute('aria-pressed',rotated);
 $('.desktop-hint').textContent=t(board.diagram?.minWidth || board.packagePins>=100 ? 'panPin' : 'clickPin');
 $('#orientation').innerHTML = `${t(flipped ? 'bottomView' : 'topView')} <span>${board.layout==='pico' || board.orientation?.startsWith('usb') ? `USB ${board.orientation==='usb-bottom' ? (rotated?'↑':'↓') : (rotated?'↓':'↑')}` : rotated ? '180°' : '0°'}</span>`;
 $('#diagram').classList.toggle('qfn-diagram',isChip(board));
 $('#diagram').classList.toggle('board-diagram',board.layout === 'custom');
 const diagram = $('#diagram');
 const oldBoardScroll = $('.board-pin-map', diagram)?.scrollLeft;
 const oldScroll = diagram.scrollLeft;
 const drawing = renderers[board.layout]();
 const mcu = boards.find(profile => profile.id === board.mcuProfile);
 const pad = mcu?.pins.find(candidate => candidate.number === pin.mcuPin);
 $('#mobile-mcu').hidden = !mcu;
 $('#open-mcu').hidden = !pad;
 const contact = pin.boardLabel || pin.name;
 $('#mobile-mcu-label').textContent = pad
   ? [contact, pad.name === contact ? '' : pad.name, t('mcuPin', {pin: pad.number})].filter(Boolean).join(' · ')
   : `${contact} · ${t('noMcuPadShort')}`;
 diagram.classList.toggle('board-with-package', Boolean(mcu));
 if (nucleo || mcu || connectorZoom) {
   const contactsByPad = new Map();
   if (mcu) {
     for (const contact of board.pins) {
       if (!contact.mcuPin) continue;
       if (!contactsByPad.has(contact.mcuPin)) contactsByPad.set(contact.mcuPin, []);
       contactsByPad.get(contact.mcuPin).push(contact);
     }
   }
   const selection = pad ? `${pad.name} · ${t('mcuPin', {pin:pad.number})} · ${contactsByPad.get(pad.number).map(physicalLabel).join(' / ')}` : t('noMcuPad');
   diagram.innerHTML = `<div class="board-pin-map${board.layout === 'pico' ? ' pico-board-map' : ''}${connectorZoom ? ' connector-zoom' : ''}">${drawing}</div>${mcu ? `
     <section class="mcu-package-map" aria-label="${esc(mcu.name)}">
       <h3>${esc(mcu.mcu)} · ${esc(mcu.packageName || (mcu.layout === 'qfn' ? 'QFN-' : 'LQFP-') + mcu.packagePins)}</h3>
       <p aria-live="polite">${esc(selection)}</p>
       ${bridgeNote.hidden ? '' : `<p class="connector-bridge-note">${esc(bridgeNote.textContent)}</p>`}
       ${renderers[mcu.layout](mcu, pad?.number ?? 0, contactsByPad)}
     </section>` : ''}`;
   const boardMap = $('.board-pin-map', diagram);
   if (oldBoardScroll !== undefined) boardMap.scrollLeft = oldBoardScroll;
 } else {
   diagram.innerHTML = drawing;
   if(innerWidth<=640) diagram.scrollLeft = oldScroll || (diagram.scrollWidth - diagram.clientWidth)/2;
 }
 const visiblePins = board.pins.filter(inConnectorZoom);
 const count=visiblePins.filter(matches).length;
 $('#match-count').textContent = (search || filters.size || connectorZoom) ? t('matchCount', { count, total: visiblePins.length }) : '';
 $('#no-matches').hidden = count!==0;
 renderTable();
}
function renderPackageBoards(pad) {
 const links = $('#package-boards');
 const related = isChip(board) ? boards.filter(item => item.mcuProfile === board.id) : [];
 links.hidden = !related.length;
 links.innerHTML = related.length ? `<span>${esc(t('packageBoards'))}</span>` + related.map(item => {
   const contacts = configuredProfile(item).pins.filter(pin => !pin.hardwareBlocked && pin.mcuPin === pad.number);
   const labels = contacts.map(physicalLabel).join(' / ');
   return `<button type="button" class="catalog-package-btn" data-package-board="${esc(item.id)}"${contacts.length ? ` data-board-pin="${contacts[0].number}"` : ''}>${esc(item.shortName || item.name)}${labels ? ` · ${esc(labels)}` : ''}</button>`;
 }).join('') : '';
}
function renderTable() {
 const pins=board.pins.filter(pin => inConnectorZoom(pin) && matches(pin));
 const caption=[connectorGroups.find(group => group.id === connectorZoom)?.label, !pins.length ? t('noMatch') : ''].filter(Boolean).join(' · ');
 $('#table-content').innerHTML = `<table class="pin-table">${caption ? `<caption>${esc(caption)}</caption>` : ''}<thead><tr><th>${t('physical')}</th><th>${t('pinName')}</th><th>${t('functions')}</th><th>${t('label')}</th><th><span class="sr-only">${t('details')}</span></th></tr></thead><tbody>${pins.map(p=>`<tr data-pin="${p.number}" class="${p.number===selected?'selected':''} ${p.hardwareBlocked?'hardware-unavailable':''}" aria-current="${p.number===selected?'true':'false'}"><td>${esc(physicalLabel(p))}</td><td class="table-name" style="color:${colors[p.type]}">${esc(p.name)}${p.hardwareBlocked?`<small>${esc(t('hwUnavailable'))}</small>`:''}</td><td>${p.functions.filter(f=>!filters.size||filters.has(f.group)).map(f=>`<span style="--color:${colors[f.group]||colors.SYSTEM}">${esc(f.name)}${f.selector ? ' · '+esc(f.selector) : ''}</span>`).join('')||'—'}</td><td>${esc(assignments[p.number]?.label||'—')}</td><td><button class="table-details" data-pin="${p.number}" aria-label="${esc(t('selectPin', {pin:physicalLabel(p),name:p.name}))}">${t('details')} →</button></td></tr>`).join('')}</tbody></table>`;
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
   return `<label class="function-option" style="--color:${colors[f.group]||colors.SYSTEM}"><input type="radio" name="pin-function" value="${esc(f.name)}" ${selectedFn===f.name?'checked':''} ${pin.reserved || pin.hardwareBlocked?'disabled':''}>${esc(f.name)}<small>${esc(note)}</small></label>`;
 };
 const hasPlan=!!assignments[selected];
 $('#selected-pin-label').textContent = `${pin.name} · ${t('details')}`;
 $('#pin-detail').innerHTML=`<div class="pin-detail-body"><div class="pin-hero"><div class="pin-identity"><h2>${esc(pin.name.replace('_ADC',' / A'))}</h2><span class="physical-pin">${t('physicalPin')} <strong>${esc(physicalLabel(pin))}</strong>${pin.boardLabel && pin.boardLabel!==pin.name ? `<span class="mcu-pin-label"> · ${esc(t('boardLabel',{label:pin.boardLabel}))}</span>` : ''}${pin.mcuPort ? `<span class="mcu-pin-label"> · Arduino D${pin.arduinoPin} · ${t('mcuPort', {port:pin.mcuPort})}</span>` : ''}${pin.mcuPin ? `<span class="mcu-pin-label"> · ${t('mcuPin', {pin:pin.mcuPin})}</span>` : ''}</span></div><span class="pin-type" style="color:${colors[pin.type]}">${familyName(pin.type)} · ${esc(pin.type === 'GPIO' ? board.voltage : '')}</span>${referenceLink(pin.evidence[0], t('pinSource'), 'pin-source')}<p class="pin-description">${esc(description)}${pin.fiveVoltTolerant !== undefined ? ' '+esc(t(pin.fiveVoltTolerant ? 'stm32FTNote' : 'stm32NonFTNote')) : ''}</p>${sharedNote}${pinHardwareHTML(pin)}</div><fieldset class="function-section"><legend class="small-label">${t(opts.length>1 ? 'chooseFunction' : 'pinFunction')}</legend>${filters.size || query ? `<p class="function-hint">${t('matchingFunctions')}</p>` : ''}<div class="function-list">${primary.map(option).join('')}</div>${more.length ? `<details class="more-functions"><summary>${t('allFunctions', {count:more.length})}</summary><div class="function-list">${more.map(option).join('')}</div></details>` : ''}<div id="function-source"></div></fieldset><div class="label-section"><label class="small-label" for="custom-label">${t('projectLabel')} <span>${t('optional')}</span></label><input id="custom-label" maxlength="40" placeholder="${esc(t('labelExample'))}" value="${esc(assignments[selected]?.label||'')}"></div>${renderPinEvidence(pin)}</div><div class="detail-action"><button id="add-plan" class="add-plan" ${pin.reserved || pin.hardwareBlocked ? 'disabled' : ''}>${icon(hasPlan?'check':'plus')}${t(pin.hardwareBlocked ? 'hwUnavailable' : pin.reserved ? (pin.reservedLabel || (pin.name==='NC' ? 'unconnected' : 'reserved')) : hasPlan ? 'updatePin' : 'addPin')}</button><div class="pin-save-feedback"><span id="pin-save-status" role="status"></span><button id="view-saved-plan" hidden>${t('viewPlan')}</button></div></div>`;
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
$('#open-mcu').addEventListener('click', () => {
 setView('map');
 const pad = $('.mcu-package-map [aria-current="true"]');
 pad?.focus({preventScroll:true});
 pad?.scrollIntoView({block:'center', inline:'nearest'});
});
function planEntry(pin, assignment) {
 const phys = pin ? physicalLabel(pin) : '';
 const name = pin?.name || '';
 return `<span class="plan-line"><span class="plan-phys">${t('physicalPin')} ${esc(phys)}</span> · <strong>${esc(name)}</strong> · <span class="plan-fn">${esc(assignment.function)}</span></span>${assignment.label ? `<small class="plan-label">${esc(assignment.label)}</small>` : ''}`;
}
function pinHardwareHTML(pin){
 const controls=board.hardware?.controls||[];
 const blocked=pin.hardwareBlocks?.map(id=>t(controls.find(control=>control.id===id).labelKey))||[];
 return (blocked.length?`<p class="hardware-note">${esc(t('hwPinUnavailable',{pin:physicalLabel(pin),controls:blocked.join(', ')}))}</p>`:'')+
  (pin.hardwareRoutes||[]).map(route=>`<p class="hardware-note">${esc(t('hwRoute',{from:route.from,to:route.to,control:route.control}))}${route.floating.length?' '+esc(t('hwFloat',{pins:route.floating.join(', ')})):''}</p>`).join('');
}
function readHardwareDraft(){return Object.fromEntries($$('[data-hardware]').map(el=>[el.dataset.hardware,el.value]));}
function renderHardware(){
 const controls=sourceBoard?.hardware?.controls||[];
 $('#hardware-config').hidden=!controls.length;
 $('#hardware-controls').innerHTML=controls.map(control=>`<div class="hardware-control"><label>${esc(t(control.labelKey))}<select data-hardware="${esc(control.id)}">${control.options.map(option=>`<option value="${esc(option.value)}" ${hardwareSettings[control.id]===option.value?'selected':''}>${esc(t(option.key))}</option>`).join('')}</select></label><p>${esc(t(control.helpKey))}</p><details><summary>${esc(t('outputSources'))}</summary>${control.evidence.map(key=>referenceLink(key,t('functionSource'),'')).join('<br>')}</details></div>`).join('');
 renderHardwareImpact();
}
function renderHardwareImpact(){
 if(!sourceBoard?.hardware)return;
 const draft=readHardwareDraft(),target=configureBoard(sourceBoard,draft,t);
 const available=target.pins.filter(pin=>pin.type==='GPIO'&&!pin.reserved&&!pin.hardwareBlocked).length;
 const unknown=Object.values(draft).filter(value=>value==='unknown').length;
 $('#hardware-impact').textContent=t('hwAvailability',{count:available,unknown});
 const pending=!sameHardware(draft,hardwareSettings)||!!hardwareRestoreError;
 $('#apply-hardware').disabled=!pending;
 $('#hardware-pending').textContent=hardwareRestoreError|| (pending?t('hwPending'):'');
 if(typeof invalidateSuggestions==='function')invalidateSuggestions();
}
$('#hardware-controls').addEventListener('change',renderHardwareImpact);
$('#hardware-form').addEventListener('submit',event=>{
 event.preventDefault();
 try{hardwareSettings=normalizeHardware(sourceBoard,readHardwareDraft(),t);board=configureBoard(sourceBoard,hardwareSettings,t);}
 catch(error){$('#hardware-pending').textContent=error.message;return;}
 hardwareRestoreError='';const stored=persist();
 renderBoard();$('#hardware-pending').textContent=t(stored?'hwApplied':'storageUnavailable');
 $('#hardware-config summary').focus();
});
function invalidateSuggestions(){
 ++suggestionSequence;suggestionWorker?.terminate();suggestionWorker=undefined;
 suggestionResult=suggestionSnapshot=undefined;
 $('#suggest-results').innerHTML='';$('#suggest-feedback').textContent='';
 $('#suggest-run').disabled=false;$('#suggest-cancel').hidden=true;
}
function suggestionRequests(){return Object.fromEntries($$('[data-suggest-count]').map(input=>[input.dataset.suggestCount,Number(input.value)]));}
$('#suggest-form').addEventListener('input',invalidateSuggestions);
$('#suggest-cancel').addEventListener('click',()=>{invalidateSuggestions();$('#suggest-feedback').textContent=t('suggestCancelled');});
$('#suggest-form').addEventListener('submit',event=>{
 event.preventDefault();invalidateSuggestions();
 if(hardwareRestoreError||!sameHardware(readHardwareDraft(),hardwareSettings)){$('#suggest-feedback').textContent=t('suggestApplyHardware');return;}
 try{validatePlan(assignments,board,t);}catch(error){$('#suggest-feedback').textContent=t('savedPlanConflict',{error:error.message});return;}
 const id=suggestionSequence;
 suggestionSnapshot={profile:board.id,pins:structuredClone(assignments),hardware:{...hardwareSettings},
  stored:JSON.stringify(readPlanRecords(localStorage,savedRecords)[board.id]??null)};
 $('#suggest-run').disabled=true;$('#suggest-cancel').hidden=false;$('#suggest-feedback').textContent=t('suggestSearching');
 const fail=()=>{if(id!==suggestionSequence)return;suggestionWorker?.terminate();suggestionWorker=undefined;$('#suggest-run').disabled=false;$('#suggest-cancel').hidden=true;$('#suggest-feedback').textContent=t('suggestFailed');};
 try{
  suggestionWorker=new Worker(new URL('./solver-worker.mjs',import.meta.url),{type:'module'});
  suggestionWorker.onerror=fail;
  suggestionWorker.onmessage=({data})=>{
   if(data.id!==suggestionSequence)return;
   if(data.error){fail();return;}
   suggestionWorker.terminate();suggestionWorker=undefined;
   $('#suggest-run').disabled=false;$('#suggest-cancel').hidden=true;suggestionResult=data.result;
   renderSuggestions();
  };
  suggestionWorker.postMessage({id,board,requests:suggestionRequests(),pins:assignments,options:{includeSPIChipSelect:$('#suggest-cs').checked}});
 }catch{fail();}
});
function renderSuggestions(){
 const result=suggestionResult;if(!result)return;
 $('#suggest-feedback').textContent=t(({ready:'suggestReady',blocked:'suggestBlocked',invalid:'suggestInvalid',impossible:'suggestImpossible',limited:'suggestLimited'})[result.status]||'suggestFailed')+(result.truncated&&result.status==='ready'?' '+t('suggestBounded'):'');
 $('#suggest-results').innerHTML=result.alternatives.map((alternative,index)=>`<article class="suggestion"><h3>${esc(t('suggestOption',{n:index+1}))}</h3><p>${esc(t('suggestStats',{added:alternative.addedPins,kept:Object.keys(suggestionSnapshot.pins).length,warnings:alternative.warnings}))}</p>${alternative.connections.map(connection=>`<h4>${esc(connection.id)}</h4><ul>${connection.signals.map(signal=>{
  const pin=pinByNumber(signal.pin),locked=!!suggestionSnapshot.pins[signal.pin];
  return `<li title="${esc(signal.function)}"><b>${esc(signal.role)}</b> · ${esc(physicalLabel(pin))} · ${esc(pin.name)}${signal.selector?' · '+esc(signal.selector):''}${locked?`<small>${esc(t('suggestLocked'))}</small>`:''}</li>`;
 }).join('')}</ul>`).join('')}<details class="suggestion-evidence"><summary>${esc(t('suggestEvidence'))}</summary>${alternative.connections.flatMap(connection=>connection.signals.map(signal=>{
  const pin=pinByNumber(signal.pin);
  return `<p><b>${esc(physicalLabel(pin)+' · '+signal.function)}</b>${[...new Set([pin.boardCircuitKey,pin.noteKey].filter(Boolean))].map(key=>`<small>${esc(t(key))}</small>`).join('')}${signal.evidence?referenceLink(signal.evidence,t('functionSource'),''):''}</p>`;
 })).join('')}</details><button type="button" class="button secondary" data-apply-suggestion="${index}">${esc(t('suggestUse'))}</button></article>`).join('');
}
$('#suggest-results').addEventListener('click',event=>{
 const button=event.target.closest('[data-apply-suggestion]');if(!button||!suggestionResult||!suggestionSnapshot)return;
 const alternative=suggestionResult.alternatives[Number(button.dataset.applySuggestion)],snapshot=suggestionSnapshot;
 try{
  const stored=JSON.stringify(readPlanRecords(localStorage,savedRecords)[board.id]??null);
  if(snapshot.profile!==board.id||!samePlan(snapshot.pins,assignments)||!sameHardware(snapshot.hardware,hardwareSettings)||
     snapshot.stored!==stored||!sameHardware(readHardwareDraft(),hardwareSettings))throw new Error(t('suggestStale'));
  assignments=applySuggestion(assignments,alternative,board,t);
  const saved=persist();renderMap();renderDetail();renderPlan();$('#plan-feedback').textContent=t(saved?'suggestApplied':'storageUnavailable');$('#plan-feedback').focus();
 }catch(error){invalidateSuggestions();$('#suggest-feedback').textContent=error.message;}
});
function renderPlan() {
 const entries = Object.entries(assignments);
 for (const id of ['plan-count','plan-tab-count','mobile-plan-count']) $(`#${id}`).textContent = entries.length;
 $('#plan-reference').textContent = planReference(board, t);
 $('#plan-feedback').textContent = '';
 $('#print-plan-button').disabled=!entries.length;$('#export-svg').disabled=!entries.length;
 try { validatePlan(assignments,board,t);$('#plan-validation').textContent=''; }
 catch(error) { $('#plan-validation').textContent=t('savedPlanConflict',{error:error.message}); }
 renderPeripheral();
 $('#plan-list').innerHTML = entries.length ? entries.map(([n, assignment]) => {
   const pin = pinByNumber(n);
   return `<div class="plan-row"><button data-select-pin="${n}">${planEntry(pin, assignment)}</button><button class="remove-plan" data-remove-pin="${n}" aria-label="${esc(t('removePin', { pin: physicalLabel(pin) }))}">×</button></div>`;
 }).join('') : `<p class="empty-plan">${t('emptyPlan')}<br>${t('emptyPlanHint')}</p>`;
}
function renderPeripheral() {
 const buses=availablePeripherals(board);
 $('#peripheral-builder').hidden=!buses.length;
 $('#peripheral-bus').innerHTML=buses.map(bus=>`<option value="${esc(bus.id)}">${esc(bus.id)} · ${bus.roles.join(' / ')}</option>`).join('');
 renderPeripheralPins();
}
function renderPeripheralPins() {
 const bus=availablePeripherals(board).find(bus=>bus.id===$('#peripheral-bus').value);
 $('#peripheral-fields').innerHTML=bus?bus.roles.map(role=>`<label>${role}<select data-peripheral-role="${role}" required><option value="">${esc(t('peripheralChoosePin'))}</option>${bus.candidates.filter(c=>c.role===role).map(c=>{
   const occupied=assignments[c.pin.number] && assignments[c.pin.number].function!==c.fn.name;
   return `<option value="${esc(c.key)}" ${occupied?'disabled':''}>${esc(physicalLabel(c.pin)+' · '+c.pin.name+' · '+c.fn.name+(c.fn.selector?' · '+c.fn.selector:''))}${occupied?' · '+esc(t('peripheralOccupiedShort')):''}</option>`;
 }).join('')}</select></label>`).join(''):'';
 $('#peripheral-feedback').textContent='';renderPeripheralNotes();
}
function renderPeripheralNotes() {
 const bus=availablePeripherals(board).find(bus=>bus.id===$('#peripheral-bus').value);
 const chosen=$$('[data-peripheral-role]').map(el=>bus?.candidates.find(c=>c.key===el.value)).filter(Boolean);
 $('#peripheral-notes').innerHTML=`<p>${esc(t('peripheralElectrical',{voltage:board.voltage}))}</p>${bus?.group==='SPI'?`<p>${esc(t('peripheralChipSelect'))}</p>`:''}`+chosen.map(({pin,fn})=>{
   const notes=[pin.noteKey?t(pin.noteKey):pin.note, pin.strapping?t('espStrappingNote'):'',pin.boardCircuitKey?t(pin.boardCircuitKey):'',pin.analogCautionKey?t(pin.analogCautionKey):'',pin.fiveVoltTolerant!==undefined?t(pin.fiveVoltTolerant?'stm32FTNote':'stm32NonFTNote'):'',fn.configuration?t('remapNote'):''].filter(Boolean);
   return `<p><strong>${esc(physicalLabel(pin)+' · '+pin.name)}</strong> ${esc(notes.join(' '))} ${referenceLink(fn.configurationEvidence || fn.evidence,t('functionSource'),'')}</p>`;
 }).join('');
}
$('#peripheral-bus').addEventListener('change',renderPeripheralPins);
$('#peripheral-fields').addEventListener('change',renderPeripheralNotes);
$('#peripheral-form').addEventListener('submit',event=>{
 event.preventDefault();
 const bus=availablePeripherals(board).find(bus=>bus.id===$('#peripheral-bus').value);
 try {
   const selections=Object.fromEntries($$('[data-peripheral-role]').map(el=>[el.dataset.peripheralRole,el.value]));
   const candidate=assemblePeripheral(bus,selections,assignments,t);
   assignments=validatePlan(candidate,board,t);
 } catch(error) { $('#peripheral-feedback').textContent=error.message;return; }
 const stored=persist();renderMap();renderDetail();renderPlan();
 $('#plan-feedback').textContent=t(stored?'peripheralSaved':'storageUnavailable');
 $('#peripheral-builder summary').focus();
});
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

function showCatalog() {
 if (dataState !== 'ready') return;
  $('#catalog-search').value = '';
  libraryCatalogType='all';libraryFamily='all';
  renderCatalog();
  $('#library-dialog').showModal();
  $('#catalog-search').focus();
}

function renderCatalogCard(entry) {
  const {id,profile,name,detail,specs,series,type,mcuProfile}=entry;
  const active=layout?.id===id && board?.id===profile;
  const card=`<button type="button" class="catalog-card ${active?'active':''}" data-layout="${esc(id)}" data-profile="${esc(profile)}"${active?' aria-current="true"':''}>
    <span class="catalog-card-icon" aria-hidden="true">${icon(type==='chips'?'chip':type==='headers'?'grid':'board')}</span>
    <span class="catalog-card-body">
      ${series?`<span class="catalog-card-series">${esc(series)}</span>`:''}
      <span class="catalog-card-header"><b class="catalog-card-title">${esc(name)}</b><span class="catalog-card-arrow" aria-hidden="true">↗</span></span>
      <span class="catalog-card-desc">${esc(type==='headers'?t('catalogHeaderNote'):detail)}</span>
      <span class="catalog-card-specs">${esc(specs)}</span>
      ${entry.matchedAlias?`<span class="catalog-alias-note">${esc(t('catalogPhysicalMatch',{name:entry.matchedAlias}))}</span>`:''}
    </span></button>`;
  const related=type==='chips'?boards.filter(item=>item.mcuProfile===profile):boards.filter(item=>item.id===mcuProfile);
  const links=related.map(item=>{
    const target=layouts.find(candidate=>candidate.profileIds.includes(item.id));
    return `<button type="button" class="catalog-package-btn" data-layout="${esc(target.id)}" data-profile="${esc(item.id)}">${esc(t(type==='chips'?'catalogOpenBoard':'catalogOpenMcu',{name:item.name}))}</button>`;
  }).join('');
  const relatedHTML=related.length>1?`<details class="catalog-related"><summary>${esc(t('catalogUsedOn',{count:related.length}))}</summary><div>${links}</div></details>`:related.length?`<div class="catalog-related">${links}</div>`:'';
  return `<div class="catalog-entry" data-catalog-type="${type}">${card}${relatedHTML}</div>`;
}

function catalogMatches(query='',family='all',type='all') {
  return filterCatalog(buildCatalog(layouts,t),{query,family,type});
}

function renderCatalogResults(entries,compact=false) {
  if(!entries.length)return `<div class="catalog-empty"><p>${esc(t('catalogEmpty'))}</p><button type="button" class="button secondary" data-reset-catalog>${esc(t('catalogReset'))}</button></div>`;
  return catalogTypes.filter(type=>type.id!=='all').map(type=>{
    const models=entries.filter(entry=>entry.type===type.id);
    if(!models.length)return '';
    const families=boardFamilies.map(family=>{
      const items=models.filter(entry=>entry.family===family.id);
      if(!items.length)return '';
      const cards=`<div class="catalog-model-grid">${items.map(renderCatalogCard).join('')}</div>`;
      if(compact)return `<details class="catalog-platform"><summary><span>${esc(t(family.nameKey))}</span><span class="catalog-platform-count">${items.length}</span><span class="catalog-platform-chevron" aria-hidden="true">⌄</span></summary>${cards}</details>`;
      return `<section class="catalog-family"><h4 class="catalog-family-title">${esc(t(family.nameKey))}<span>${items.length}</span></h4>${cards}</section>`;
    }).join('');
    return `<section class="catalog-type-section" data-type-section="${type.id}"><div class="catalog-type-heading"><h3>${esc(t(type.labelKey))}</h3><span>${models.length}</span></div>${type.id==='headers'?`<p class="catalog-type-note">${esc(t('catalogHeaderNote'))}</p>`:''}${families}</section>`;
  }).join('');
}

function renderTypeControls(container,type,family,query='') {
  const entries=catalogMatches(query,family);
  if(!container.children.length)container.innerHTML=catalogTypes.map(item=>`<button type="button" class="catalog-type-button" data-catalog-type-filter="${item.id}"><span></span><small></small></button>`).join('');
  for(const button of container.children){
    const item=catalogTypes.find(item=>item.id===button.dataset.catalogTypeFilter),active=type===item.id;
    button.querySelector('span').textContent=t(item.filterKey || item.labelKey);
    button.querySelector('small').textContent=item.id==='all'?entries.length:entries.filter(entry=>entry.type===item.id).length;
    button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  }
}

function renderCatalog() {
  const query=$('#catalog-search').value.trim();
  renderTypeControls($('#library-types'),libraryCatalogType,libraryFamily,query);
  const select=$('#library-platform');
  select.innerHTML=homeFilterChips.map(item=>`<option value="${item.id}">${esc(t(item.labelKey))}</option>`).join('');
  select.value=libraryFamily;
  const entries=catalogMatches(query,libraryFamily,libraryCatalogType);
  $('#catalog-grid').innerHTML=renderCatalogResults(entries);
  $('#library-result-count').textContent=t(entries.length===1?'catalogSingleResult':'catalogResultCount',{count:entries.length});
}

function updateLibraryCount() {
  const el = $('#library-count');
  if (el && boards) el.textContent = boards.length;
}

function showHomeView() {
 invalidateSuggestions();
  currentView = 'home';
  $('.mobile-workbar').hidden = true;
  $('#home-view').hidden = false;
  $('#workspace-view').hidden = true;
  $('#home-breadcrumb-link').classList.add('active');
  $('#home-breadcrumb-link').setAttribute('aria-current', 'page');
  $('#crumb-sep-1').hidden = true;
  $('#board-family').hidden = true;
  $('#crumb-sep-2').hidden = true;
  $('#crumb').hidden = true;
  document.title = `Pin Atlas — ${t('homeBadge')}`;
  updateLibraryCount();
  renderHome();
}

function showWorkspaceView() {
  currentView = 'workspace';
  $('.mobile-workbar').hidden = dataState !== 'ready';
  $('#home-view').hidden = true;
  $('#workspace-view').hidden = false;
  $('#home-breadcrumb-link').classList.remove('active');
  $('#home-breadcrumb-link').removeAttribute('aria-current');
  $('#crumb-sep-1').hidden = false;
  $('#board-family').hidden = false;
  $('#crumb-sep-2').hidden = false;
  $('#crumb').hidden = false;
}

function renderHome() {
  renderHomeStats();
  renderHomeFilterChips();
  renderHomeFeatured();
  renderHomeCatalog();
  hydrateIcons($('#home-view'));
}

function renderHomeStats() {
  if (!boards) return;
  updateLibraryCount();
  const lang = document.documentElement.lang || 'tr';
  const {pins:totalPins,functions:totalFns,sources:totalSources}=library.index.totals;
  if ($('#home-stat-boards')) $('#home-stat-boards').textContent = buildCatalog(layouts,t).filter(entry=>entry.type==='boards').length;
  if ($('#home-stat-families')) $('#home-stat-families').textContent = buildCatalog(layouts,t).filter(entry=>entry.type==='chips').length;
  if ($('#home-stat-pins')) $('#home-stat-pins').textContent = new Intl.NumberFormat(lang).format(totalPins);
  if ($('#home-stat-functions')) $('#home-stat-functions').textContent = new Intl.NumberFormat(lang).format(totalFns);
  if ($('#home-stat-sources')) $('#home-stat-sources').textContent = totalSources;
  if ($('#browse-all-boards-desc')) $('#browse-all-boards-desc').textContent = t('browseAllBoardsDesc');
}

function renderHomeFilterChips() {
  const container = $('#home-filter-chips');
  if (!container) return;
  if (!container.children.length) container.innerHTML = homeFilterChips.map(chip =>
    `<button type="button" class="home-chip" data-home-filter="${esc(chip.id)}"></button>`).join('');
  for (const button of container.children) {
    const chip = homeFilterChips.find(item => item.id === button.dataset.homeFilter);
    const active = homeActiveFilter === chip.id;
    button.textContent = t(chip.labelKey);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}

function renderHomeFeatured() {
  $('#featured-grid').innerHTML = featuredCards(layouts, t).map(item => `
    <div class="featured-card" data-layout="${esc(item.layoutId)}" data-profile="${esc(item.profileId)}" role="button" tabindex="0" aria-label="${esc(item.name)}">
      <div class="featured-card-top"><span class="featured-badge">${esc(item.family)}</span><span class="tiny-dot" aria-hidden="true"></span></div>
      <h3 class="featured-title">${esc(item.name)}</h3>
      <p class="featured-desc">${esc(item.description)}</p>
      <div class="featured-footer"><span class="featured-specs">${esc(item.specs)}</span><span class="featured-action">${esc(t('featuredOpen'))}</span></div>
    </div>
  `).join('');
}

function renderHomeCatalog() {
  if(!layouts)return;
  const searching=Boolean(homeSearchQuery)||homeActiveFilter!=='all'||homeCatalogType!=='all';
  $('#home-view').classList.toggle('is-searching',searching);
  $('#catalog-title').textContent=t(homeSearchQuery?'catalogSearchResults':'browseAllBoards');
  renderTypeControls($('#home-catalog-types'),homeCatalogType,homeActiveFilter,homeSearchQuery);
  const entries=catalogMatches(homeSearchQuery,homeActiveFilter,homeCatalogType);
  $('#home-catalog-container').innerHTML=renderCatalogResults(entries,!searching);
  $('#home-search-status').textContent=searching?t(entries.length===1?'catalogSingleResult':'catalogResultCount',{count:entries.length}):'';
  $('#home-reset-catalog').hidden=!searching;
}

function planPayload() { return createPlanPayload(sourceBoard,assignments,hardwareSettings); }
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
 const {target,pins,existing,hardware,existingHardware}=pendingPlan;
 const replaces=Object.keys(existing).length>0 && !samePlan(existing,pins) || !sameHardware(existingHardware,hardware);
 $('#incoming-plan-reference').textContent=planReference(target,t);
 $('#incoming-plan-message').textContent=t(replaces?'replacePlanMessage':'incomingPlanMessage');
 const rows=hardwareSummary(target,hardware,t);
 $('#incoming-plan-configuration').innerHTML=rows.length?`<p>${esc(t('hwIncoming'))}</p><dl>${rows.map(row=>`<div><dt>${esc(row.label)}</dt><dd>${esc(row.value)}</dd></div>`).join('')}</dl>`:'';
 $('#incoming-plan-list').innerHTML=Object.entries(pins).map(([n,assignment])=>`<li>${planEntry(target.pins.find(pin=>String(pin.number)===n),assignment)}</li>`).join('')||`<li>${t('emptyIncomingPlan')}</li>`;
 $('#save-incoming-plan').textContent=t(replaces?'replacePlan':'saveIncomingPlan');
}
function previewPlan(decoded,pin) {
 savedPlans=readSavedPlans();
 pendingPlan={...decoded,pin,existing:savedPlans[decoded.target.id]||{},existingHardware:savedHardware(decoded.source)};
 renderIncomingPlan();if(!previewDialog.open)previewDialog.showModal();
}
previewDialog.addEventListener('close',()=>{if(!previewDialog.open)pendingPlan=undefined;});
$('#save-incoming-plan').addEventListener('click',async()=>{
 if(!pendingPlan)return;
 const incoming=pendingPlan,{source,target,pins,pin,hardware,existing,existingHardware}=incoming;
 const changed=()=>{
  savedPlans=readSavedPlans();const latest=savedPlans[target.id]||{},latestHardware=savedHardware(source);
  return !(samePlan(existing,latest)&&sameHardware(existingHardware,latestHardware)) && !(samePlan(pins,latest)&&sameHardware(hardware,latestHardware));
 };
 if(changed()){previewPlan(incoming,pin);$('#incoming-plan-message').textContent=t('previewPlanChanged');return;}
 if(!await setBoard(target.id,false,target.id,hardware))return;
 if(changed()){await setBoard(target.id,false,target.id);previewPlan(incoming,pin);$('#incoming-plan-message').textContent=t('previewPlanChanged');return;}
 previewDialog.close();
 if(pin && pinByNumber(pin))selected=Number(pin);
 assignments=pins;
 selectedFn=assignments[selected]?.function||options(pinByNumber(selected))[0].name;
 const stored=persist();renderMap();renderDetail();renderPlan();showDetails('plan');
 $('#plan-feedback').textContent=t(stored?'planImported':'storageUnavailable');$('#plan-tab').focus();
});

async function loadHash() {
  const hash = location.hash.slice(1);
  if (!hash || hash === 'home') {
    ++navigationSequence;dataState='ready';
    if (!layout) {
      const next = resolveProfile(layouts, layouts[0].id);
      layout = next.layout; board = next.profile;
    }
    showHomeView();
    renderDataState();
    return;
  }
  const params = new URLSearchParams(hash);
  const pin = params.get('pin');
  let target = params.get('board'), payload;
  if (!target && !params.has('plan')) {
    ++navigationSequence;dataState='ready';
    if (!layout) {
      const next = resolveProfile(layouts, layouts[0].id);
      layout = next.layout; board = next.profile;
    }
    showHomeView();
    renderDataState();
    return;
  }
  if (params.has('plan')) {
    try {
      const data = decode(params.get('plan'));
      const profile = boards.find(item => item.id === data?.board);
      if (![1,2].includes(data?.version) || !profile) throw new Error(t('unsupportedFormat'));
      payload = { target:profile, raw:data };
      target = profile.id;
    } catch (error) {
      toast(t('shareFailed', { error: error.message }));
    }
  }
  if(!await setBoard(target || layouts[0].id, true, payload ? payload.target.id : params.get('profile')))return;
  if(payload)try{payload=decodePlanPayload(payload.raw,payload.target,savedHardware(payload.target),t);}
  catch(error){toast(t('shareFailed',{error:error.message}));payload=undefined;}
  if (pin && pinByNumber(pin)) choosePin(pin, false);
  if (params.has('plan')) {
    params.delete('plan');
    params.set('board', layout.id);
    params.set('profile', board.id);
    history.replaceState(null, '', `#${params}`);
  }
  if (payload) previewPlan(payload,pin);
  else if (previewDialog.open) previewDialog.close();
}
$('#board-nav')?.addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(b)openLayout(b.dataset.layout);});
$('#library-button')?.addEventListener('click',showCatalog);
$('#compatibility-search').addEventListener('input',e=>{compatibilityQuery=e.target.value;renderCompatibilityList();});
$('#compatibility-list').addEventListener('click',async e=>{
 const link=e.target.closest('[data-compatible-model]');
 if(!link || e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)return;
 e.preventDefault();
 const model=link.dataset.compatibleModel,profile=link.dataset.profile;
 if(!await setBoard(layout.id,false,profile))return;
 $('#compatibility-list').querySelector(`[data-compatible-model="${CSS.escape(model)}"]`)?.focus({preventScroll:true});
});
$('#catalog-grid').addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(b){openLayout(b.dataset.layout, b.dataset.profile);$('#library-dialog').close();focusWorkspace();}});
$('#catalog-search').addEventListener('input',renderCatalog);
function resetHomeCatalog(){
  homeSearchQuery='';homeActiveFilter='all';homeCatalogType='all';$('#home-search').value='';
  renderHomeFilterChips();renderHomeCatalog();$('#home-search').focus({preventScroll:true});
}
$('#home-reset-catalog').addEventListener('click',resetHomeCatalog);
$('#home-catalog-container').addEventListener('click',e=>{if(e.target.closest('[data-reset-catalog]'))resetHomeCatalog();});
$('#home-catalog-types').addEventListener('click',e=>{
  const button=e.target.closest('[data-catalog-type-filter]');if(!button)return;
  homeCatalogType=button.dataset.catalogTypeFilter;renderHomeCatalog();
});
$('#library-types').addEventListener('click',e=>{
  const button=e.target.closest('[data-catalog-type-filter]');if(!button)return;
  libraryCatalogType=button.dataset.catalogTypeFilter;renderCatalog();
});
$('#library-platform').addEventListener('change',e=>{libraryFamily=e.target.value;renderCatalog();});
$('#catalog-grid').addEventListener('click',e=>{
  if(!e.target.closest('[data-reset-catalog]'))return;
  libraryCatalogType='all';libraryFamily='all';$('#catalog-search').value='';renderCatalog();$('#catalog-search').focus();
});

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
$('#reset-view').addEventListener('click',()=>{flipped=rotated=false;connectorZoom='';renderMap();});
$('#package-boards').addEventListener('click', async e => {
 const button = e.target.closest('[data-package-board]');
 if (!button) return;
 if(!await setBoard(button.dataset.packageBoard))return;
 setView('map');
 if (button.dataset.boardPin) choosePin(button.dataset.boardPin, false);
});
$('#connector-zoom').addEventListener('change', e => {
 connectorZoom = e.target.value;
 const next = board.pins.find(pin => inConnectorZoom(pin) && matches(pin)) || board.pins.find(inConnectorZoom);
 if (!inConnectorZoom(pinByNumber(selected)) && next) choosePin(next.number, false);
 else renderMap();
 const map = $('.board-pin-map');
 if (map) map.scrollLeft = 0;
});
$('#map-view').addEventListener('click',()=>setView('map'));$('#table-view').addEventListener('click',()=>setView('table'));
function selectPackagePad(number) {
 const contacts = board.pins.filter(pin => pin.mcuPin === Number(number));
 const contact = contacts.find(pin => pin.number === selected && inConnectorZoom(pin))
   || contacts.find(inConnectorZoom) || contacts[0];
 if (!contact) return;
 choosePin(contact.number, false);
 $(`#diagram [data-mcu-pin="${number}"]`)?.focus({preventScroll:true});
}
$('#diagram').addEventListener('click', e => {
 const pad = e.target.closest('[data-mcu-pin]');
 if (pad) selectPackagePad(pad.dataset.mcuPin);
});
$('#diagram').addEventListener('keydown', e => {
 const pad = e.target.closest('[data-mcu-pin]');
 if (!pad) return;
 const pads = $$('[data-mcu-pin]', $('#diagram'));
 const index = pads.indexOf(pad);
 const step = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key];
 const target = step ? pads[(index+step+pads.length)%pads.length]
   : e.key === 'Home' ? pads[0] : e.key === 'End' ? pads.at(-1)
   : ['Enter',' '].includes(e.key) ? pad : null;
 if (target) {
   e.preventDefault();
   selectPackagePad(target.dataset.mcuPin);
 }
});
for(const element of [$('#diagram'),$('#table-content')]) {
 element.addEventListener('click',e=>{const p=e.target.closest('[data-pin]');if(p)choosePin(p.dataset.pin, element !== $('#diagram') || !board.mcuProfile);});
 element.addEventListener('keydown', e => {
   if (e.altKey || e.ctrlKey || e.metaKey) return;
   const pin = e.target.closest('[data-pin]');
   if (!pin || pin.tagName.toLowerCase() === 'button') return;
   const step = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key];
   if (element.id === 'diagram' && (step || ['Home','End'].includes(e.key))) {
     e.preventDefault();
     const pins = $$('[data-pin]', element);
     const index = pins.indexOf(pin);
     const next = e.key === 'Home' ? pins[0] : e.key === 'End' ? pins.at(-1) : pins[(index + step + pins.length) % pins.length];
     choosePin(next.dataset.pin, false);
     const target = $(`[data-pin="${next.dataset.pin}"]`, element);
     target?.focus({preventScroll:true});
     target?.scrollIntoView({block:'nearest', inline:'nearest'});
   } else if (['Enter',' '].includes(e.key)) {
     e.preventDefault();
     choosePin(pin.dataset.pin, element !== $('#diagram') || !board.mcuProfile);
     if (!$('#details-dialog').open) $(`[data-pin="${pin.dataset.pin}"]`, element)?.focus();
   }
 });
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
function preparePrint(){
 if(currentView!=='workspace'||!board?.pins)return;
 $('#print-plan').innerHTML=reportHTML(planReport(board,assignments,evidence,t),t);
 document.body.classList.add('printing-plan');
}
window.addEventListener('beforeprint',preparePrint);
window.addEventListener('afterprint',()=>document.body.classList.remove('printing-plan'));
$('#print-plan-button').addEventListener('click',()=>{preparePrint();window.print();});
$('#export-svg').addEventListener('click',async()=>{
 const button=$('#export-svg');button.disabled=true;
 const outputBoard=board,report=planReport(board,assignments,evidence,t);
 const state={filters,search,connectorZoom,flipped,rotated};let markup;
 try {filters=new Set();search='';connectorZoom='';flipped=rotated=false;markup=renderers[board.layout]();}
 finally {({filters,search,connectorZoom,flipped,rotated}=state);}
 const host=document.createElement('div');host.className='output-diagram'+(isChip(board)?' qfn-diagram':'');
 host.style.cssText='position:absolute;left:-20000px;top:0;width:1000px;pointer-events:none;--paper:#fff;--surface:#f4f6f2;--ink:#17221d;--muted:#53645a;--line:#ced8d0;--accent:#286449;--pin-gpio:#246a43;--pin-power:#9c4c13;--pin-gnd:#4b5b62;--pin-system:#745291;--pin-adc:#8c5518';host.innerHTML=markup;
 host.querySelectorAll('.selected,.net-contact').forEach(node=>node.classList.remove('selected','net-contact'));
 document.body.append(host);
 try {
  const diagram=await standaloneDiagram(host.querySelector('svg'));
  const blob=new Blob([reportSVG(report,diagram,t)],{type:'image/svg+xml;charset=utf-8'});
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`pin-atlas-${outputBoard.id}.svg`;link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
 } catch(error){toast(t('outputFailed'));}
 finally{host.remove();button.disabled=!Object.keys(assignments).length;}
});
$('#import-button').addEventListener('click',()=>$('#import-file').click());
$('#import-file').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{
  if(file.size>100000)throw new Error(t('fileTooLarge'));
  const payload=JSON.parse(await file.text());const target=boards.find(b=>b.id===payload?.board);
  if(![1,2].includes(payload?.version)||!target)throw new Error(t('unsupportedFile'));
  await library.workspace(target.id);
  previewPlan(decodePlanPayload(payload,target,savedHardware(target),t));
 }catch(error){$('#plan-feedback').textContent=error.message||t('importFailed');}finally{e.target.value='';}
});
document.addEventListener('keydown', e => {
  if (dataState !== 'ready') return;
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$('dialog[open]')) {
    e.preventDefault();
    if (currentView === 'home') $('#home-search')?.focus();
    else $('#pin-search')?.focus();
  }
  if (e.key === 'Escape') $('#sidebar')?.classList.remove('open');
});
$('#home-breadcrumb-link')?.addEventListener('click', e => {
  e.preventDefault();
  location.hash = '#home';
  if (dataState !== 'ready') return;
  showHomeView();
  window.scrollTo(0, 0);
  $('#home-search').focus({preventScroll:true});
});
$('#home-search')?.addEventListener('input', e => {
  homeSearchQuery = e.target.value.toLowerCase().trim();
  renderHomeCatalog();
});
$('#home-filter-chips')?.addEventListener('click', e => {
  const btn = e.target.closest('[data-home-filter]');
  if (!btn) return;
  homeActiveFilter = btn.dataset.homeFilter;
  renderHomeFilterChips();
  renderHomeCatalog();
});
$('#featured-grid')?.addEventListener('click', e => {
  const card = e.target.closest('[data-layout]');
  if (card) openLayout(card.dataset.layout, card.dataset.profile);
});
$('#featured-grid')?.addEventListener('keydown', e => {
  if (['Enter', ' '].includes(e.key)) {
    const card = e.target.closest('[data-layout]');
    if (card) {
      e.preventDefault();
      openLayout(card.dataset.layout, card.dataset.profile);
    }
  }
});
$('#home-catalog-container')?.addEventListener('click', e => {
  const card = e.target.closest('[data-layout]');
  if (card) openLayout(card.dataset.layout, card.dataset.profile);
});
window.addEventListener('zaryob:language', () => {
  renderDataState();
  if (dataState !== 'ready') return;
  if (currentView === 'home') renderHome();
  if ($('#library-dialog').open) renderCatalog();
  if (!board?.pins) return;
  const draftLabel = $('#custom-label')?.value;
  const hardwareDraft=readHardwareDraft();
  renderBoard();
  for(const select of $$('[data-hardware]'))if(hardwareDraft[select.dataset.hardware])select.value=hardwareDraft[select.dataset.hardware];
  renderHardwareImpact();
  if (draftLabel !== undefined) $('#custom-label').value = draftLabel;
  if ($('#library-dialog').open) renderCatalog();
  if (previewDialog.open) renderIncomingPlan();
});
window.addEventListener('hashchange',()=>{if(library && location.hash!=='#main')loadHash();});
function renderDataState() {
 const ready = dataState === 'ready', failed = dataState === 'error';
 $('#main').setAttribute('aria-busy', String(dataState === 'loading'));
 $('#app-status').hidden = ready;
 $('#app-status').setAttribute('role', failed ? 'alert' : 'status');
 $('#app-status-title').textContent = t(library ? (failed?'profileLoadFailed':'profileLoading') : (failed?'libraryLoadFailed':'libraryLoading'));
 $('#app-status-message').textContent = t(failed ? 'libraryLoadRecovery' : 'libraryLoadingDetail');
 $('#retry-data').textContent = t('retryData');
 $('#retry-data').hidden = !failed;
 $('#menu-button').disabled = !ready;
 $('#library-count').hidden = !ready;
 $('#home-search').disabled = !ready;
 $('#catalog-search').disabled = !ready;
 $('#home-view').hidden = !ready || currentView !== 'home';
 $('#workspace-view').hidden = !ready || currentView !== 'workspace';
 $('.mobile-workbar').hidden = !ready || currentView !== 'workspace';
}
async function fetchDataJSON(name,retry=false) {
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
 try {
   const response=await fetch(new URL('./data/'+name,appBase),{signal:controller.signal,cache:retry?'reload':'default'});
   if(!response.ok)throw new Error('Data request failed');
   return await response.json();
 } finally {clearTimeout(timer);}
}
async function loadData(retry = false) {
 if (dataLoading) return;
 dataLoading = true;
 ++navigationSequence;
 dataState = 'loading';
 renderDataState();
 if (retry) $('#app-status').focus({preventScroll:true});
 try {
   const index=await fetchDataJSON('catalog.json',retry);
   const nextLibrary=new ProfileLibrary(index,name=>fetchDataJSON(name,retry),nextEvidence=>{
     if(library!==nextLibrary)return;
     Object.assign(evidence.references,nextEvidence.references);
   });
   const nextLayouts=buildLayouts(nextLibrary.profiles);
   library=nextLibrary;boards=library.profiles;evidence={references:{}};layouts=nextLayouts;
   updateLibraryCount();
   await loadHash();
   if(dataState!=='ready')return;
   renderDataState();
   if (retry) {
     if (currentView === 'home') $('#home-search').focus({preventScroll:true});
     else focusWorkspace();
   }
 } catch {
   dataState = 'error';
   renderDataState();
 } finally {
   dataLoading = false;
 }
}
$('#retry-data').addEventListener('click', () => loadData(true));
loadData();
