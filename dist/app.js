import { buildLayouts, resolveProfile } from './layouts.mjs';
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
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.chip}</svg>`;
function hydrateIcons(root = document) { $$('[data-icon]', root).forEach(el => el.innerHTML = icon(el.dataset.icon)); }
hydrateIcons();
const colors = Object.fromEntries(['GPIO','POWER','GND','SYSTEM','SPI','I2C','UART','PWM','ADC','HSTX','PIO','USB','QMI','SIO','PCM','CLOCK','JTAG','DPI','SDIO','SMI'].map(group => [group, `var(--pin-${group.toLowerCase()})`]));
const appBase = new URL('./', import.meta.url);
const familyKeys = { GPIO: 'generalIO', POWER: 'power', GND: 'ground', SYSTEM: 'system', ADC: 'analog' };
const familyName = type => t(familyKeys[type] || type);
const subtitle = item => t(`board.${item.id}`, {}, item.subtitle);
const groups = ['SPI','I2C','UART','PWM','ADC','HSTX','PIO','PCM','CLOCK','JTAG','DPI','SDIO','SMI'];
let evidence = {references:{}};
let boards, layouts, layout, board, selected = 1, selectedFn, filters = new Set(), search = '', flipped = false, rotated = false, view = 'map', assignments = {}, toastTimer;
const storageKey = 'pin-atlas:plans:v1';
const rememberedProfiles = new Map();
const layoutTitle = item => item.nameKey ? t(item.nameKey) : item.name;
const layoutSubtitle = item => item.subtitleKey ? t(item.subtitleKey) : subtitle(item);
let savedPlans = {};
try { savedPlans = JSON.parse(localStorage.getItem(storageKey) || '{}'); if (!savedPlans || typeof savedPlans !== 'object' || Array.isArray(savedPlans)) savedPlans = {}; } catch { savedPlans = {}; }
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500); }
function options(pin) { return [{name:pin.type === 'GPIO' ? 'GPIO' : pin.name, group:pin.type}, ...pin.functions]; }
function validatePlan(data, target) {
 if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(t('invalidPlan'));
 const clean = {};
 for (const [key, value] of Object.entries(data)) {
   const p = target.pins.find(p => String(p.number) === key);
   if (!p || p.reserved || !value || typeof value !== 'object' || !options(p).some(f => f.name === value.function) || typeof value.label !== 'string' || value.label.length > 40) throw new Error(t('invalidAssignment'));
   clean[key] = {function:value.function, label:value.label};
 }
 return clean;
}
function persist() { savedPlans[board.id] = assignments; try { localStorage.setItem(storageKey, JSON.stringify(savedPlans)); } catch { toast(t('storageUnavailable')); } }
function pinByNumber(n) { return board.pins.find(p => p.number === Number(n)); }
function matches(pin) { const text = [pin.number, pin.name, ...pin.functions.map(f => f.name), assignments[pin.number]?.label].join(' ').toLowerCase(); return text.includes(search.toLowerCase().trim()) && (!filters.size || pin.functions.some(f => filters.has(f.group))); }
function setBoard(id, initial = false, preferredProfile) {
 const next = resolveProfile(layouts, id, preferredProfile);
 const sameLayout = layout?.id === next.layout.id;
 const previousPin = selected;
 layout = next.layout; board = next.profile;
 rememberedProfiles.set(layout.id, board.id);
 selected = sameLayout && board.pins.some(pin => pin.number === previousPin) ? previousPin : board.pins.find(p => p.type === 'GPIO')?.number || 1;
 try { assignments = validatePlan(savedPlans[board.id] || {}, board); } catch { assignments = {}; }
 selectedFn = assignments[selected]?.function || options(pinByNumber(selected))[0].name;
 if (!sameLayout) { filters = new Set(); search = ''; $('#pin-search').value = ''; flipped = rotated = false; }
 const available = new Set(board.pins.flatMap(pin => pin.functions.map(fn => fn.group)));
 filters = new Set([...filters].filter(group => available.has(group)));
 renderBoard();
 if (!initial) history.replaceState(null, '', `#${new URLSearchParams({board:layout.id,profile:board.id})}`);
 if ($('#details-dialog').open) $('#details-dialog').close();
 setDetailTab('pin');
}
function openLayout(id) {
 const target = layouts.find(item => item.id === id);
 if (!target) return;
 // Reopen the last function reference, including legacy saved model plans.
 const savedProfile = target.profiles.find(profile => Object.keys(savedPlans[profile.id] || {}).length)?.id;
 setBoard(id, false, rememberedProfiles.get(id) || savedProfile);
}
function renderBoard() {
 document.title = `${layoutTitle(layout)} Pinout — Pin Atlas`;
 $('#board-title').textContent = layoutTitle(layout);
 const scope = layout.scopeKey ? t(layout.scopeKey) : '';
 $('#board-scope').hidden = !scope;
 $('#board-scope').textContent = scope;
 $('#compatible-boards').hidden = !layout.compatibleKey;
 $('#compatible-boards').textContent = layout.compatibleKey ? `${t('compatibleBoards')}: ${t(layout.compatibleKey)}` : '';
 $('#library-count').textContent = layouts.length;
 $('#board-subtitle').textContent = layoutSubtitle(layout);
 $('#crumb').textContent = layoutTitle(layout);
 $('#board-family').textContent = board.family;
 $('#datasheet').href = board.datasheet;
 $('#reference-link').href = board.source;
 $('#reference-link').innerHTML = `${t('officialSource')} <span>↗</span>`;
 $('#pin-count').textContent = t('pinCount', { count: board.packagePins });
 $('#specs').innerHTML = `<span>${icon('board')}<b>${board.packagePins}</b>${t('physicalPins')}</span><span>${icon('chip')}<b>${board.gpioCount}</b>GPIO${board.reservedGPIOCount ? ` (${t('reservedCount', { count: board.reservedGPIOCount })})` : ''}</span><span>${icon('bolt')}<b>${esc(board.voltage)}</b></span>`;
 renderNav(); renderFunctionReference(); renderFilters(); renderMap(); renderDetail(); renderPlan();
}
function renderFunctionReference() {
 $('#function-reference-bar').hidden = !layout.references.length;
 $('#reference-note').textContent = layout.id === 'raspberry-pi-40' ? t(board.id === 'raspberry-pi-4' ? 'pi4ReferenceNote' : 'commonReferenceNote') : t('picoReferenceNote');
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
 $('#board-nav').innerHTML = ['layouts','chips'].map(group => {
   const entries = layouts.filter(item => (item.layout === 'qfn' ? 'chips' : 'layouts') === group);
   return `<div class="nav-section">${t(group)}</div>${entries.map(item => `<button class="board-nav-item ${item.id === layout.id ? 'active' : ''}" data-layout="${item.id}" ${item.id === layout.id ? 'aria-current="page"' : ''}>${icon(item.layout === 'qfn' ? 'chip' : 'board')}<span>${esc(layoutTitle(item))}<small>${esc(layoutSubtitle(item))}</small></span></button>`).join('')}`;
 }).join('');
}
function renderFilters() {
 const available = new Set(board.pins.flatMap(p => p.functions.map(f => f.group)));
 $('.filter-bar').hidden = !groups.some(group => available.has(group));
 $('#filters').innerHTML = groups.filter(g => available.has(g)).map(g => `<button class="filter ${filters.has(g) ? 'active' : ''}" data-filter="${g}" style="--color:${colors[g]}" aria-pressed="${filters.has(g)}"><i></i>${g === 'I2C' ? 'I²C' : g}</button>`).join('');
}
function choosePin(number, reveal = true) {
 selected = Number(number); const p = pinByNumber(selected);
 selectedFn = assignments[selected]?.function || options(p)[0].name;
 renderMap(); renderDetail();
 if (reveal) showDetails('pin');
}
function pinGroup(pin, x, y, side, opts = {}) {
 const active = pin.number === selected, match = matches(pin), assigned = assignments[pin.number];
 const color = colors[pin.type] || colors.SYSTEM;
 const matchingFunctions = pin.functions.filter(f => filters.has(f.group) || (search.trim() && f.name.toLowerCase().includes(search.trim().toLowerCase())));
 const fn = matchingFunctions[0];
 const label = pin.name.replace('_ADC', '/A');
 const func = assigned?.label || assigned?.function || matchingFunctions.slice(0,2).map(f=>f.name).join(' · ') || '';
 const left = side === 'left';
 const xSign = left ? -1 : 1;
 const body = `<rect class="pin-hit" x="${left ? -222 : 10}" y="-10" width="212" height="20" rx="4" fill="transparent"/><path d="M0 0h${xSign * 24}" stroke="${active ? 'var(--accent)' : 'var(--line)'}" stroke-width="1"/><circle class="pin-node" r="4.4" fill="${pin.type === 'GPIO' ? '#e2eccc' : '#f2eee6'}" stroke="${color}" stroke-width="1.3"/><text class="pin-number" x="${xSign * 17}" y="3" text-anchor="middle">${pin.number}</text><rect x="${left ? -99 : 30}" y="-8.5" width="69" height="17" rx="3" fill="${color}" fill-opacity="${active ? '.2' : '.09'}"/><text class="pin-label" x="${xSign * 64}" y="3.7" fill="${color}" text-anchor="middle">${esc(label)}</text>${func ? `<text class="pin-function" x="${xSign * 111}" y="3" text-anchor="${left ? 'end' : 'start'}" fill="${assigned ? 'var(--success)' : colors[fn?.group] || color}">${esc(func.length > 24 ? func.slice(0,23)+'…' : func)}</text>` : ''}${assigned ? `<circle r="2" cx="${xSign * 215}" fill="var(--success)"/>` : ''}`;
 return `<g class="pin-group ${active ? 'selected' : ''} ${match ? '' : 'dimmed'} ${assigned ? 'assigned' : ''}" data-pin="${pin.number}" role="button" tabindex="0" aria-label="Pin ${pin.number}: ${esc(pin.name)}${func ? ', '+esc(func) : ''}" aria-pressed="${active}" transform="translate(${x} ${y})${opts.angle ? ` rotate(${opts.angle})` : ''}"><title>Pin ${pin.number} · ${esc(pin.name)}${func ? ' · '+esc(func) : ''}</title>${body}</g>`;
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
 return `<svg viewBox="0 0 680 540" aria-label="${esc(t('diagramLabel', { board: layoutTitle(layout) }))}"><g transform="${flipped ? 'translate(680 0) scale(-1 1)' : ''}"><g transform="${rotated ? 'rotate(180 340 269.5)' : ''}">${picoArt()}</g></g>${pins}</svg>`;
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
 return `<svg viewBox="0 0 680 540" aria-label="${esc(t('diagramLabel', { board: layoutTitle(layout) }))}"><rect x="308" y="29" width="64" height="480" rx="6" fill="#26372c"/><rect x="315" y="37" width="50" height="464" rx="3" fill="#384c3a"/>${pins}<text x="340" y="530" fill="#869b75" font-family="var(--mono)" font-size="7" text-anchor="middle">${t('headerLegend')}</text></svg>`;
}
function renderQfn() {
 const n=board.packagePins/4, pitch=336/(n-1);
 let pins='';
 for(const pin of board.pins) {
   const sideIndex=Math.floor((pin.number-1)/n), i=(pin.number-1)%n;
   let pos={x:220,y:232+i*pitch,side:'left',angle:0};
   if(sideIndex===1) pos={x:232+i*pitch,y:580,side:'right',angle:90};
   if(sideIndex===2) pos={x:580,y:568-i*pitch,side:'right',angle:0};
   if(sideIndex===3) pos={x:568-i*pitch,y:220,side:'left',angle:90};
   if(rotated) { pos.x=800-pos.x; pos.y=800-pos.y; pos.side=pos.side==='left'?'right':'left'; }
   if(flipped) { pos.x=800-pos.x; if(!pos.angle) pos.side=pos.side==='left'?'right':'left'; }
   pins+=pinGroup(pin,pos.x,pos.y,pos.side,{angle:pos.angle});
 }
 // The central exposed pad is separate from numbered perimeter pins.
 return `<svg viewBox="0 0 800 800" aria-label="${esc(t('diagramLabel', { board: `${board.name} QFN-${board.packagePins}` }))}"><g class="board-art" transform="${flipped?'translate(800 0) scale(-1 1)':''}"><g transform="${rotated?'rotate(180 400 400)':''}"><rect x="217" y="217" width="366" height="366" rx="9" fill="#34433a" stroke="#26352b" stroke-width="3"/><rect x="231" y="231" width="338" height="338" rx="5" fill="none" stroke="#7f9175" stroke-width=".6"/><circle cx="246" cy="247" r="6" fill="#a9b796"/><rect x="303" y="303" width="194" height="194" rx="5" fill="#3b4d40" stroke="#637a58" stroke-dasharray="4 5"/><text x="400" y="377" text-anchor="middle" fill="#dce6d0" font-size="29">${board.name}</text><text x="400" y="406" text-anchor="middle" fill="#9db08f" font-size="12" letter-spacing="3">QFN-${board.packagePins}</text><text x="400" y="443" text-anchor="middle" fill="#819975" font-size="9">EP · GND</text><text x="400" y="532" text-anchor="middle" fill="#839b76" font-size="8" letter-spacing="3">RASPBERRY PI</text></g></g>${pins}</svg>`;
}
function renderCustom() {
 const {width,height,artwork} = board.diagram;
 const image = /^(?:\.\/|\/)?assets\/[a-zA-Z0-9_./-]+\.svg$/.test(artwork || '') ? `<image href="${esc(new URL(artwork.replace(/^\//,''), appBase).href)}" width="${width}" height="${height}"/>` : '';
 const pins = board.pins.map(pin => {
   let {x,y,side,angle=0} = pin.position;
   if(rotated){ x=width-x;y=height-y;side=side==='left'?'right':'left'; }
   if(flipped){x=width-x;if(!angle)side=side==='left'?'right':'left';}
   return pinGroup(pin,x,y,side,{angle});
 }).join('');
 return `<svg viewBox="0 0 ${width} ${height}" aria-label="${esc(t('diagramLabel', { board: layoutTitle(layout) }))}"><g transform="${flipped?`translate(${width} 0) scale(-1 1)`:''}"><g transform="${rotated?`rotate(180 ${width/2} ${height/2})`:''}">${image}</g></g>${pins}</svg>`;
}
const renderers = {pico:renderPico,qfn:renderQfn,header:renderHeader,custom:renderCustom};
function renderMap() {
 $('#flip-button').setAttribute('aria-pressed',flipped); $('#rotate-button').setAttribute('aria-pressed',rotated);
 $('#orientation').innerHTML = `${t(flipped ? 'bottomView' : 'topView')} <span>${board.layout==='pico' ? `USB ${rotated?'↓':'↑'}` : rotated ? '180°' : '0°'}</span>`;
 $('#diagram').classList.toggle('qfn-diagram',board.layout==='qfn');
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
 $('#table-content').innerHTML = `<table class="pin-table"><thead><tr><th>${t('physical')}</th><th>${t('pinName')}</th><th>${t('functions')}</th><th>${t('label')}</th><th><span class="sr-only">${t('details')}</span></th></tr></thead><tbody>${pins.map(p=>`<tr class="${p.number===selected?'selected':''}" aria-current="${p.number===selected?'true':'false'}"><td>${p.number}</td><td class="table-name" style="color:${colors[p.type]}">${esc(p.name)}</td><td>${p.functions.filter(f=>!filters.size||filters.has(f.group)).map(f=>`<span style="--color:${colors[f.group]||colors.SYSTEM}">${esc(f.name)}${f.selector ? ' · '+esc(f.selector) : ''}</span>`).join('')||'—'}</td><td>${esc(assignments[p.number]?.label||'—')}</td><td><button class="table-details" data-pin="${p.number}" aria-label="${esc(t('selectPin', {pin:p.number,name:p.name}))}">${t('details')} →</button></td></tr>`).join('')}</tbody>${!pins.length?`<caption>${t('noMatch')}</caption>`:''}</table>`;
}
function renderDetail() {
 const pin=pinByNumber(selected), opts=options(pin);
 const descriptions = { GPIO: 'gpioDescription', GND: 'groundDescription', POWER: 'powerDescription', SYSTEM: 'systemDescription', ADC: 'analogDescription' };
 const noteBoard = board.layout === 'pico' ? 'pico2w' : board.id;
 let description = pin.reserved ? t('reservedNote') : t(`note.${noteBoard}.${pin.number}`, {}, pin.note || t(descriptions[pin.type] || 'systemDescription'));
 if (board.mcu === 'RP2040' && pin.number === 30) description = description.replace('RP2350', 'RP2040');
 const query = search.trim().toLowerCase();
 const relevant = f => filters.has(f.group) || (query && f.name.toLowerCase().includes(query));
 const primary = opts.filter((f,i) => i === 0 || f.name === selectedFn || relevant(f) || (!filters.size && !query && i <= 3));
 const more = opts.filter(f => !primary.includes(f));
 const option = f => `<label class="function-option" style="--color:${colors[f.group]||colors.SYSTEM}"><input type="radio" name="pin-function" value="${esc(f.name)}" ${selectedFn===f.name?'checked':''}>${esc(f.name)}<small>${f.selector ? esc(f.selector) : f === opts[0] ? t('default') : ''}</small></label>`;
 const hasPlan=!!assignments[selected];
 $('#selected-pin-label').textContent = `${pin.name} · ${t('details')}`;
 $('#pin-detail').innerHTML=`<div class="pin-detail-body"><div class="pin-hero"><div class="pin-identity"><h2>${esc(pin.name.replace('_ADC',' / A'))}</h2><span class="physical-pin">${t('physicalPin')} <strong>${String(pin.number).padStart(2,'0')}</strong></span></div><span class="pin-type" style="color:${colors[pin.type]}">${familyName(pin.type)} · ${esc(pin.type === 'GPIO' ? board.voltage : '')}</span><p class="pin-description">${esc(description)}</p></div><fieldset class="function-section"><legend class="small-label">${t(opts.length>1 ? 'chooseFunction' : 'pinFunction')}</legend>${filters.size || query ? `<p class="function-hint">${t('matchingFunctions')}</p>` : ''}<div class="function-list">${primary.map(option).join('')}</div>${more.length ? `<details class="more-functions"><summary>${t('allFunctions', {count:more.length})}</summary><div class="function-list">${more.map(option).join('')}</div></details>` : ''}</fieldset><div class="label-section"><label class="small-label" for="custom-label">${t('projectLabel')} <span>${t('optional')}</span></label><input id="custom-label" maxlength="40" placeholder="${esc(t('labelExample'))}" value="${esc(assignments[selected]?.label||'')}"></div>${renderPinEvidence(pin)}</div><div class="detail-action"><button id="add-plan" class="add-plan" ${pin.reserved ? 'disabled' : ''}>${icon(hasPlan?'check':'plus')}${t(pin.reserved ? 'reserved' : hasPlan ? 'updatePin' : 'addPin')}</button></div>`;
}
function renderPinEvidence(pin) {
 const keys = [...new Set([...pin.evidence, ...pin.functions.map(f=>f.evidence)])];
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
const narrowLayout = matchMedia('(max-width: 640px)');
function syncViewOptions() { $('#view-options').open = !narrowLayout.matches; }
narrowLayout.addEventListener('change', syncViewOptions);
syncViewOptions();
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
 const target = view === 'map' ? $(`#diagram [data-pin="${selected}"]`) : $(`#table-content [data-pin="${selected}"]`);
 target?.focus({preventScroll:true});
});
$('#open-pin').addEventListener('click', () => showDetails('pin'));
$('#open-plan').addEventListener('click', () => showDetails('plan'));
function renderPlan() {
 const entries=Object.entries(assignments).sort((a,b)=>Number(a[0])-Number(b[0]));
 for (const id of ['plan-count','plan-tab-count','mobile-plan-count']) $(`#${id}`).textContent=entries.length;
 $('#plan-list').innerHTML=entries.length?entries.map(([n,a])=>`<div class="plan-row"><button data-select-pin="${n}" aria-label="${esc(t('selectPlanPin', { pin: pinByNumber(n)?.name }))}"><strong>${esc(pinByNumber(n)?.name)}</strong> <span>· ${esc(a.function)}</span>${a.label?`<small>${esc(a.label)}</small>`:''}</button><button class="remove-plan" data-remove-pin="${n}" aria-label="${t('removePin', { pin: n })}">×</button></div>`).join(''):`<p class="empty-plan">${t('emptyPlan')}<br>${t('emptyPlanHint')}</p>`;
}
function addToPlan() {
 if(pinByNumber(selected).reserved)return;
 const functionName=$('input[name="pin-function"]:checked')?.value;
 if(!functionName) return;
 const duplicate=Object.entries(assignments).find(([n,a])=>Number(n)!==selected && a.function===functionName && /^(SPI|I2C|UART)\d/.test(functionName));
 if(duplicate) { toast(t('duplicateSignal', { name: functionName, pin: duplicate[0] })); return; }
 assignments[selected]={function:functionName,label:$('#custom-label').value.trim()}; persist(); selectedFn=functionName; renderMap();renderDetail();renderPlan();toast(t('pinSaved'));if ($('#details-dialog').open) $('#details-dialog').close();
}
function showCatalog() { $('#catalog-search').value=''; renderCatalog(); $('#library-dialog').showModal(); }
function renderCatalog() {
 const query=$('#catalog-search').value.toLowerCase().trim();
 const results=layouts.filter(item => [layoutTitle(item),layoutSubtitle(item),item.compatibleKey ? t(item.compatibleKey) : '',...item.profiles.map(profile => `${profile.name} ${profile.mcu} ${profile.searchTerms || ''}`)].join(' ').toLowerCase().includes(query));
 $('#catalog-grid').innerHTML=results.length?results.map(item=>`<button class="catalog-card" data-layout="${item.id}"><span class="mini-art">${icon(item.layout==='qfn'?'chip':'board')}</span><span class="card-arrow">↗</span><b>${esc(layoutTitle(item))}</b><small>${esc(item.compatibleKey ? t(item.compatibleKey) : layoutSubtitle(item))}</small><span class="card-meta">${item.packagePins} PIN <span> / </span> ${item.gpioCount} GPIO</span></button>`).join(''):`<p class="catalog-note">${t('noBoard')}</p>`;
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
 view=value;$('#view-options').hidden=view!=='map';$('#map-content').hidden=view!=='map';$('#table-content').hidden=view!=='table';
 for(const v of ['map','table']) { $(`#${v}-view`).classList.toggle('active',view===v);$(`#${v}-view`).setAttribute('aria-pressed',view===v); }
}
function loadHash() {
 const params=new URLSearchParams(location.hash.slice(1)); let target=params.get('board'), payload;
 if(params.has('plan')) {
   try { payload=decode(params.get('plan'));if(payload.version!==1||!boards.some(b=>b.id===payload.board)) throw new Error(t('unsupportedFormat'));target=payload.board; const b=boards.find(b=>b.id===target);payload.pins=validatePlan(payload.pins,b); }
   catch(error){toast(t('shareFailed', { error: error.message }));payload=null;}
 }
 setBoard(target||layouts[0].id,true,payload ? payload.board : params.get('profile'));
 if(payload){assignments=payload.pins;persist();renderPlan();}
 if(params.has('pin')&&pinByNumber(params.get('pin'))) selected=Number(params.get('pin'));
 selectedFn=assignments[selected]?.function||options(pinByNumber(selected))[0].name;renderDetail();renderMap();
}
$('#board-nav').addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(b)openLayout(b.dataset.layout);});
$('#library-button').addEventListener('click',showCatalog);
$('#function-reference').addEventListener('change', e => setBoard(layout.id, false, e.target.value));
$('#catalog-grid').addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(b){openLayout(b.dataset.layout);$('#library-dialog').close();}});
$('#catalog-search').addEventListener('input',renderCatalog);
$('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}));
$('#menu-button').addEventListener('click',showCatalog);
$('#main').addEventListener('click',()=>$('#sidebar').classList.remove('open'));
$('#filters').addEventListener('click',e=>{const f=e.target.closest('[data-filter]');if(!f)return;filters.has(f.dataset.filter)?filters.delete(f.dataset.filter):filters.add(f.dataset.filter);renderFilters();renderMap();renderDetailPreservingDraft();});
$('#reset-filters').addEventListener('click',()=>{filters.clear();search='';$('#pin-search').value='';renderFilters();renderMap();renderDetailPreservingDraft();});
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
$('#pin-detail').addEventListener('change',e=>{if(e.target.name==='pin-function')selectedFn=e.target.value;});
$('#pin-detail').addEventListener('click',e=>{if(e.target.closest('#add-plan'))addToPlan();});
$('#plan-list').addEventListener('click',e=>{const remove=e.target.closest('[data-remove-pin]'),select=e.target.closest('[data-select-pin]');if(remove){delete assignments[remove.dataset.removePin];persist();renderPlan();renderMap();renderDetail();toast(t('pinRemoved'));}else if(select)choosePin(select.dataset.selectPin);});
$('#share-button').addEventListener('click',share);
$('#copy-share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#share-url').value);toast(t('linkCopied'));$('#share-dialog').close();}catch{$('#share-url').focus();$('#share-url').select();toast(t('manualCopy'));}});
$('#export-button').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(planPayload(),null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`pin-atlas-${board.id}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);toast(t('planDownloaded'));});
$('#import-button').addEventListener('click',()=>$('#import-file').click());
$('#import-file').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{
  if(file.size>100000)throw new Error(t('fileTooLarge'));
  const payload=JSON.parse(await file.text());const target=boards.find(b=>b.id===payload.board);
  if(payload.version!==1||!target)throw new Error(t('unsupportedFile'));
  const plan=validatePlan(payload.pins,target);setBoard(target.id);assignments=plan;persist();selectedFn=assignments[selected]?.function||options(pinByNumber(selected))[0].name;renderDetail();renderMap();renderPlan();toast(t('planImported'));
 }catch(error){toast(error.message||t('importFailed'));}finally{e.target.value='';}
});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('dialog[open]')){e.preventDefault();$('#pin-search').focus();}if(e.key==='Escape')$('#sidebar').classList.remove('open');});
window.addEventListener('zaryob:language', () => {
 if (!board) return;
 const draftLabel = $('#custom-label')?.value;
 renderBoard();
 if (draftLabel !== undefined) $('#custom-label').value = draftLabel;
 if ($('#library-dialog').open) renderCatalog();
});
window.addEventListener('hashchange',()=>{if(boards && location.hash!=='#main')loadHash();});
try {
 const [boardResult, evidenceResult] = await Promise.all(['boards.json','evidence.json'].map(name=>fetch(new URL('./data/'+name,appBase))));
 if(!boardResult.ok || !evidenceResult.ok)throw new Error(t('loadFailed'));
 [boards,evidence] = await Promise.all([boardResult.json(),evidenceResult.json()]);layouts=buildLayouts(boards);loadHash();
} catch(error) { $('#diagram').innerHTML=`<p data-i18n="reloadHint" style="padding:40px;line-height:2">${t('reloadHint')}</p>`;toast(error.message); }
