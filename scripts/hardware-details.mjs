/* SPDX-License-Identifier: GPL-3.0-or-later */
// Compile reviewed facts separately from the pin extractor. This keeps new
// research reproducible without changing the locked pin evidence or its date.
export function compileHardwareDetails(data, boards) {
  if (data.version !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(data.reviewedOn)) throw new Error('Invalid hardware research version/date');
  const ids = boards.map(board => board.id);
  if (JSON.stringify(Object.keys(data.profiles).sort()) !== JSON.stringify([...ids].sort())) throw new Error('Hardware research must cover exactly the catalog profiles');
  const localized = value => typeof value === 'string' && value.length > 0 || value && typeof value.tr === 'string' && value.tr.length > 0 && typeof value.en === 'string' && value.en.length > 0;
  for (const [id, source] of Object.entries(data.sources)) {
    if (!source.title || !source.publisher || !source.locator || !/^https:\/\//.test(source.url)) throw new Error(`Invalid research source: ${id}`);
  }
  return new Map(boards.map(board => {
    const record = data.profiles[board.id], chip = record.chip ? data.chips[record.chip] : {};
    const reviewedOn = record.reviewedOn ?? data.reviewedOn;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedOn)) throw new Error(`Invalid hardware review date: ${board.id}`);
    if (!chip) throw new Error(`Unknown research chip: ${board.id}`);
    const keys = new Set();
    const sources = list => {
      if (!list?.length || list.some(key => !data.sources[key])) throw new Error(`Missing fact provenance: ${board.id}`);
      list.forEach(key => keys.add(key));
      return [...new Set(list)];
    };
    const facts = ['cpu', 'clock', 'ram', 'flash', 'rom', 'eeprom', 'psram', 'power', 'firstDocument'].flatMap(key => {
      const own = record[key] !== undefined, value = own ? record[key] : chip[key];
      if (value === undefined) return [];
      if (!localized(value)) throw new Error(`Invalid bilingual fact: ${board.id}.${key}`);
      return [{key, value, sources: sources(key === 'firstDocument' ? chip.documentSources : own ? record.sources : chip.sources)}];
    });
    if (!['cpu', 'clock', 'ram', 'flash', 'power'].every(key => facts.some(fact => fact.key === key))) throw new Error(`Incomplete facts: ${board.id}`);
    const date = record.date;
    if (!date || !['launch', 'siliconLaunch', 'announcement', 'documented', 'unverified'].includes(date.kind) ||
      (date.kind === 'unverified' ? date.value !== null || !localized(date.reason) : !/^\d{4}(-\d{2}-\d{2})?$/.test(date.value))) throw new Error(`Invalid historical date: ${board.id}`);
    sources(date.sources);
    const notes = [...(chip.notes || []), ...(record.notes || [])].map(note => {
      if (!localized(note.text)) throw new Error(`Invalid research note: ${board.id}`);
      return {...note, sources: sources(note.sources)};
    });
    (record.documents || []).forEach(key => sources([key]));
    return [board.id, {reviewedOn, chip: record.chip, date, facts, notes,
      documents: record.documents || [], sources: Object.fromEntries([...keys].map(key => [key, data.sources[key]]))}];
  }));
}

export function hardwareResearchReport(details, boards, layouts, language) {
  const tr=language==='tr',local=value=>typeof value==='string'?value:value[language];
  const labels=tr?{cpu:'İşlemci',clock:'Saat hızı / üst sınır',ram:'RAM',flash:'Program Flash’ı / depolama',rom:'Sabit ROM',eeprom:'EEPROM / kalıcı veri',psram:'Harici PSRAM',power:'Besleme / mantık',firstDocument:'MCU veri sayfasının ilk yayını'}
    :{cpu:'Processor',clock:'Clock / maximum',ram:'RAM',flash:'Program Flash / storage',rom:'Fixed ROM',eeprom:'EEPROM / persistent data',psram:'External PSRAM',power:'Power / logic',firstDocument:'MCU datasheet initial publication'};
  const dateLabels=tr?{launch:'İlk satış / çıkış',siliconLaunch:'Yonga tanıtımı',announcement:'Duyuru',documented:'Belgelenmiş olduğu tarih',unverified:'İlk üretim / çıkış'}
    :{launch:'Initial sale / release',siliconLaunch:'Silicon introduction',announcement:'Announcement',documented:'Documented by',unverified:'First production / release'};
  const unknown=[...details.values()].filter(d=>d.date.kind==='unverified').length;
  let text=tr?`# Donanım araştırması ve teknik referans\n\nİnceleme: ${details.values().next().value.reviewedOn}. ${boards.length} profil ayrı ayrı kapsanır. ${boards.length-unknown} profil için nitelendirilmiş tarih bilgisi vardır; ${unknown} profilin kesin ilk üretim/satış tarihi doğrulanmamıştır. MCU veri sayfasının ilk yayını, kartın üretim yılı olarak sunulmaz.\n\n`
    :`# Hardware research and technical reference\n\nReviewed: ${details.values().next().value.reviewedOn}. All ${boards.length} profiles are covered individually. ${boards.length-unknown} have a qualified historical date; exact first production/sale dates remain unverified for ${unknown}. An MCU datasheet’s initial publication is not presented as a board’s production year.\n\n`;
  text+=tr?'Bu dosya `sources/hardware-details.json` kayıtlarından `npm run build:data` ile üretilir. Her özellik ve notun kaynak bağlantısı yanındadır. Canlı üretici sayfalarının içeriği değişebilir; pin kanıtlarının kilitli sürüm ve SHA-256 bilgileri ayrı `sources/manifest.json` kaydında korunur. Yeni teknik bilgi incelemesi, önceki pin doğrulama tarihini değiştirmez.\n\n'
    :'Generated from `sources/hardware-details.json` by `npm run build:data`. Each fact and note carries source links. Live manufacturer pages may change; the locked versions and SHA-256 values for pin evidence remain in `sources/manifest.json`. The technical review does not change the previous pin-verification date.\n\n';
  text+=tr?'Flash, sabit boot ROM, EEPROM, SRAM ve PSRAM ayrı tutulur. Bellek kapasiteleri toplam fiziksel kapasitedir; kullanılabilir uygulama alanı daha küçük olabilir. Bağlantı tabloları Pin Atlas sayfasının altında kaynaklı tüm alternatifleri listeler; aynı anda kullanılabilecek varsayılan bağlantılar oldukları iddia edilmez.\n\n'
    :'Flash, fixed boot ROM, EEPROM, SRAM and PSRAM are kept separate. Memory capacities are physical totals; usable application space may be smaller. Connection tables below each Pin Atlas workspace list all sourced alternatives, without asserting that they are default routes or simultaneously usable.\n\n';
  text+=tr?'## Düzeltilen mevcut ifadeler\n\n- Pi 4: saat alanındaki “BCM numaralandırma” → 1.8 GHz (ilk kartlarda 1.5 GHz); işlemci çekirdeği Cortex-A72 olarak açıklandı.\n- Pi 5: aynı hatalı saat ifadesi → 2.4 GHz; Cortex-A76 işlemcisi ve RP1 I/O denetleyicisi ayrıldı.\n- Her iki düzeltme kaynak pin çıkarıcısında ve üretilen profillerde birlikte uygulandı. Pin kimlikleri ve kayıtlı planlar korundu.\n\n## Model kayıtları\n\n'
    :'## Corrected existing statements\n\n- Pi 4: “BCM numbering” in the clock field → 1.8 GHz (original boards 1.5 GHz); processor core clarified as Cortex-A72.\n- Pi 5: the same incorrect clock text → 2.4 GHz; Cortex-A76 processor distinguished from the RP1 I/O controller.\n- Both corrections were applied to the pin-source extractor and generated profiles. Pin identities and saved plans were preserved.\n\n## Individual model records\n\n';
  for(const board of boards){
    const r=details.get(board.id),layout=layouts.find(l=>l.profileIds.includes(board.id));
    const citation=keys=>keys.map(key=>`[${r.sources[key].title}](${r.sources[key].url})`).join(', ');
    text+=`### ${board.name}\n\n[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=${layout.id}&profile=${board.id}) · [${tr?'Pin referansı':'Pin reference'}](${board.source}) · [Datasheet](${board.datasheet})\n\n`;
    if (r.reviewedOn !== details.values().next().value.reviewedOn)
      text += tr ? `Teknik bilgi incelemesi ${r.reviewedOn}.\n\n` : `Technical review ${r.reviewedOn}.\n\n`;
    text+=`- **${dateLabels[r.date.kind]}:** ${r.date.value || (tr?'Doğrulanamadı':'Unverified')}. ${citation(r.date.sources)}\n`;
    for(const fact of r.facts)text+=`- **${labels[fact.key]}:** ${local(fact.value)}. ${citation(fact.sources)}\n`;
    if(r.date.reason)text+=`\n${local(r.date.reason)}\n`;
    for(const note of r.notes)text+=`\n${local(note.text)} ${citation(note.sources)}\n`;
    if(r.documents.length)text+=`\n${tr?'Devre / kart belgeleri':'Circuit / board documents'}: ${citation(r.documents)}\n`;
    text+='\n';
  }
  return text;
}
