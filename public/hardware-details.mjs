/* SPDX-License-Identifier: GPL-3.0-or-later */
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;
const localized = (value, language) => typeof value === 'string' ? value : value?.[language] || value?.en || '';

// These are exhaustive, sourced alternatives, not fabricated default bus routes.
export function connectionGroups(board) {
  const groups = [{id:'power', label:'researchPowerPins', rows:board.pins.filter(pin => ['POWER','GND','SYSTEM'].includes(pin.type)).map(pin => ({pin, functions:[]}))}];
  const preferred = ['I2C','SPI','UART','CAN','SWD','JTAG','USB','ADC','DAC','PWM'];
  const available = [...new Set(board.pins.flatMap(pin => pin.functions.map(fn => fn.group)))];
  for (const id of [...preferred,...available.filter(id => !preferred.includes(id)).sort()]) {
    const rows = board.pins.flatMap(pin => {
      const functions = pin.functions.filter(fn => fn.group === id);
      return functions.length ? [{pin, functions}] : [];
    });
    if (rows.length) groups.push({id, label:id, rows});
  }
  return groups.filter(group => group.rows.length);
}

export function renderHardwareDetails(board, evidence, t, language = 'en') {
  const research = board.research;
  if (!research) return '';
  const sourceKeys = Object.keys(research.sources);
  const cite = keys => `<span class="research-citations">${keys.map(key => `<a href="${esc(research.sources[key].url)}" target="_blank" rel="noopener" aria-label="${esc(t('researchSourceNumber',{number:sourceKeys.indexOf(key)+1})+' · '+research.sources[key].title)}">[${sourceKeys.indexOf(key)+1}]</a>`).join(' ')}</span>`;
  const date = research.date;
  const dateText = date.kind === 'unverified' ? t('researchDateUnknown') : date.value;
  const fact = (label, value, refs) => `<div><dt>${esc(label)}</dt><dd>${esc(value)} ${cite(refs)}</dd></div>`;
  const facts = fact(t('researchDate.'+date.kind),dateText,date.sources) + research.facts.map(item => fact(t('researchFact.'+item.key),localized(item.value,language),item.sources)).join('');
  const groups = connectionGroups(board);
  const pinSources = (pin, functions) => [...new Set([...pin.evidence,...functions.flatMap(fn => [fn.evidence,fn.configurationEvidence].filter(Boolean))])].map(key => evidence.references[key]).filter(Boolean);
  const mapping = groups.map(group => `<details class="research-pin-group"><summary>${esc(t(group.label,{},group.label))} <span>${group.rows.length} ${esc(t('researchContacts'))}</span></summary>
    <div class="research-table-scroll" tabindex="0" role="region" aria-label="${esc(t('researchPinTable',{group:t(group.label,{},group.label)}))}"><table><caption>${esc(t('researchPinTable',{group:t(group.label,{},group.label)}))}</caption><thead><tr><th scope="col">${esc(t('researchContact'))}</th><th scope="col">${esc(t('researchNet'))}</th><th scope="col">${esc(t('researchMcuPad'))}</th><th scope="col">${esc(t('researchFunctions'))}</th><th scope="col">${esc(t('researchEvidence'))}</th></tr></thead><tbody>${group.rows.map(({pin,functions}) => {
      const refs = pinSources(pin,functions);
      const flags = [pin.reserved ? t('researchReserved') : '',pin.hardwareBlocked ? t('researchBlocked') : '',pin.inputOnly ? t('researchInputOnly') : '',pin.strapping ? t('researchStrapping') : ''].filter(Boolean);
      return `<tr><th scope="row">${esc(pin.physicalLabel || pin.number)}</th><td>${esc(pin.boardLabel && pin.boardLabel !== pin.name ? pin.boardLabel+' · '+pin.name : pin.name)}${flags.length?`<small>${esc(flags.join(' · '))}</small>`:''}</td><td>${esc(pin.mcuPin ?? (['qfn','lqfp','dip'].includes(board.layout)?pin.number:'—'))}</td><td>${functions.length?functions.map(fn => `${esc(fn.name)}${fn.selector?` <small>${esc(fn.selector)}</small>`:''}${fn.configuration?` <small>${esc(fn.configuration.field)}: ${esc(fn.configuration.values.join(' / '))}</small>`:''}`).join('<br>'):esc(pin.type)}</td><td>${refs.map((ref,index) => link(ref.url,t('researchSourceNumber',{number:index+1}))).join('<br>')}</td></tr>`;
    }).join('')}</tbody></table></div></details>`).join('');
  return `<header class="research-heading"><div><p class="research-eyebrow">${esc(t('researchEyebrow'))}</p><h2 id="hardware-details-title">${esc(t('researchTitle',{name:board.name}))}</h2></div><p>${esc(t('researchReviewed',{date:research.reviewedOn}))}<br>${esc(t('researchPinsReviewed',{date:board.verifiedOn}))}</p></header>
    <dl class="research-facts">${facts}</dl>
    ${date.reason?`<p class="research-date-note">${esc(localized(date.reason,language))}</p>`:''}
    <p class="research-memory-note">${esc(t('researchMemoryNote'))}</p>
    ${research.notes.length?`<section class="research-notes"><h3>${esc(t('researchNotes'))}</h3><ul>${research.notes.map(note => `<li>${esc(localized(note.text,language))} ${cite(note.sources)}</li>`).join('')}</ul></section>`:''}
    <section class="research-connections"><h3>${esc(t('researchConnections'))}</h3><p>${esc(t('researchConnectionNote'))}</p>
      <div class="research-wiring"><div><b>I²C</b><code>SCL ↔ SCL<br>SDA ↔ SDA<br>GND ↔ GND</code><p>${esc(t('researchI2cRule'))}</p></div><div><b>UART</b><code>TX → RX<br>RX ← TX<br>GND ↔ GND</code><p>${esc(t('researchUartRule'))}</p></div><div><b>SPI</b><code>SCK → SCK<br>MOSI → SDI<br>MISO ← SDO<br>CS → CS<br>GND ↔ GND</code><p>${esc(t('researchSpiRule'))}</p></div></div>
      <p>${esc(t('researchWiringScope'))}</p><nav class="research-document-links" aria-label="${esc(t('researchDocuments'))}">${link(board.source,t('researchPinReference'))}${link(board.datasheet,t('datasheet'))}${research.documents.map(key => link(research.sources[key].url,research.sources[key].title)).join('')}</nav>
      ${mapping}
    </section>
    <details class="research-sources"><summary>${esc(t('researchSources',{count:sourceKeys.length}))}</summary><ol>${sourceKeys.map(key => {const source=research.sources[key];return `<li id="research-source-${esc(key)}">${link(source.url,source.title)}<small>${esc(source.publisher)} · ${esc(source.locator)}</small></li>`;}).join('')}</ol></details>`;
}
