/* SPDX-License-Identifier: GPL-3.0-or-later */
(() => {
  const messages = {
    "homeLabel": ["Zaryob ana sayfa", "Zaryob home"],
    "switchProject": ["Proje değiştir", "Switch project"],
    "projectsLabel": ["Zaryob projeleri", "Zaryob projects"],
    "home": ["Ana sayfa", "Home"],
    "guides": ["Kılavuzlar", "Guides"],
    "Open menu": ["Menüyü aç", "Open menu"],
    "Close menu": ["Menüyü kapat", "Close menu"],
    "navigation": ["Pin Atlas gezinme", "Pin Atlas navigation"],
    "sourceCode": ["Kaynak kodu ↗", "Source code ↗"],
    "theme": ["Renk teması", "Color theme"],
    "themeSystem": ["Sistem", "System"],
    "themeDark": ["Koyu", "Dark"],
    "themeLight": ["Açık", "Light"],
    "language": ["Dil", "Language"],
    "skip": ["İçeriğe geç", "Skip to content"],
    "atlasHome": ["Pin Atlas ana sayfa", "Pin Atlas home"],
    "boardsAndChips": ["kartlar ve mikrodenetleyiciler", "boards and microcontrollers"],
    "boardLibrary": ["Kart kütüphanesi", "Board library"],
    "boardsPath": ["kartlar/", "boards/"],
    "nextPath": ["sonraki/", "next/"],
    "stm32Family": ["STM32 ailesi", "STM32 family"],
    "libraryGrowing": ["Atlas, yeni kartlarla büyüyor.", "The atlas will grow as more boards are added."],
    "planned": ["PLANLANIYOR", "PLANNED"],
    "help": ["Nasıl kullanılır?", "How to use"],
    "library": ["Kütüphane", "Library"],
    "edition": ["pinout / Türkçe", "pinout / English"],
    "guide": ["interaktif pin rehberi", "interactive pin guide"],
    "start": ["Pinleri keşfet. Bağlantılarını planla. Üretmeye başla.", "Explore pins and plan your connections."],
    "datasheet": ["Veri sayfası", "Datasheet"],
    "share": ["Paylaş", "Share"],
    "workspace": ["Pinout çalışma alanı", "Pinout workspace"],
    "pinMap": ["Pin haritası", "Pin map"],
    "view": ["Görünüm", "View"],
    "map": ["Harita", "Map"],
    "table": ["Tablo", "Table"],
    "interfaces": ["ARAYÜZLER", "INTERFACES"],
    "clearFilters": ["Filtreleri temizle", "Clear filters"],
    "searchPlaceholder": ["Pin veya işlev ara…", "Search for a pin or function…"],
    "search": ["Pin veya işlev ara", "Search for a pin or function"],
    "mirror": ["Yatay aynala", "Mirror horizontally"],
    "rotate": ["180° döndür", "Rotate 180°"],
    "rotateLabel": ["180 derece döndür", "Rotate 180 degrees"],
    "resetView": ["Görünümü sıfırla", "Reset view"],
    "topView": ["ÜSTTEN GÖRÜNÜM", "TOP VIEW"],
    "bottomView": ["ALT GÖRÜNÜM (AYNALI)", "BOTTOM VIEW (MIRRORED)"],
    "noMatch": ["Bu aramayla eşleşen pin yok.", "No pins match this search."],
    "clickPin": ["Detayları görmek için bir pine tıkla.", "Click a pin to see its details."],
    "tapPin": ["Haritayı kaydır; bir pine dokun.", "Scroll the map and tap a pin."],
    "power": ["Güç", "Power"],
    "system": ["Sistem", "System"],
    "physicalNumbers": ["Fiziksel pin numaraları", "Physical pin numbers"],
    "selectedDetails": ["Seçili pin detayları", "Selected pin details"],
    "pinDetails": ["PİN DETAYI", "PIN DETAILS"],
    "myPlan": ["Bağlantı planım", "My wiring plan"],
    "downloadJson": ["JSON indir", "Download JSON"],
    "importPlan": ["Bağlantı planı içe aktar", "Import a wiring plan"],
    "autosave": ["Bu tarayıcıda otomatik kaydedilir.", "Saved automatically in this browser."],
    "orientationNote": ["Küçük bir hatırlatma", "Reading the diagram"],
    "schematicNote": ["Kart üzerindeki çizim şematiktir. Pin numarası fiziksel bağlantıyı gösterir; alternatif işlevler seçilen kart ve işlemciye özgüdür.", "The board illustration is schematic. Pin numbers identify physical connections. Alternate functions depend on the selected board and processor."],
    "officialSource": ["Resmî pin kaynağı", "Official pin reference"],
    "explore": ["KEŞFETMEYE BAŞLA", "EXPLORE"],
    "closeLibrary": ["Kütüphaneyi kapat", "Close library"],
    "catalogIntro": ["Masandaki kartı bul, bir sonraki bağlantıyı keşfet.", "Find your board and explore its pins."],
    "catalogPlaceholder": ["Kart, çip veya aile ara…", "Search boards, chips, or families…"],
    "catalogSearch": ["Kart kütüphanesinde ara", "Search the board library"],
    "catalogNote": ["Sıradaki durak: STM32. Yeni kartlar aynı atlasta buluşacak.", "STM32 boards are planned for a future release."],
    "helpTitle": ["Bir pinle başla.", "Start with a pin"],
    "closeHelp": ["Yardımı kapat", "Close help"],
    "helpChoose": ["Kartını seç.", "Choose a board."],
    "helpChooseDetail": ["Kütüphaneden kart veya mikrodenetleyiciyi aç.", "Open a board or microcontroller from the library."],
    "helpFind": ["İşlevini bul.", "Find a function."],
    "helpFindDetail": ["Arayüz filtreleriyle uygun pinleri vurgula.", "Use the interface filters to highlight compatible pins."],
    "helpShortcut": ["tuşuyla aramaya geç.", "opens search."],
    "helpPlan": ["Bağlantını planla.", "Plan your connection."],
    "helpPlanDetail": ["Bir pine tıkla, işlevini seç ve projendeki adını yaz.", "Click a pin, select a function, and give it a label."],
    "helpShare": ["Yanında götür.", "Share your plan."],
    "helpShareDetail": ["Planını JSON olarak indir veya Paylaş düğmesiyle bağlantısını kopyala.", "Download a JSON file or use Share to copy a link."],
    "helpStorage": ["Planlar bu tarayıcıda saklanır. Paylaşım bağlantısı seçili kartı, pinleri ve etiketlerini içerir. Bu araç elektriksel tasarım doğrulaması yapmaz.", "Plans are stored in this browser. A share link includes the selected board, pins, and labels. Check electrical compatibility against the manufacturer’s documentation."],
    "manufacturerDocs": ["Üretici belgeleri:", "Manufacturer documentation"],
    "picoDatasheet": ["Pico 2 W veri sayfası ↗", "Pico 2 W datasheet ↗"],
    "rpDatasheet": ["RP2350 veri sayfası ↗", "RP2350 datasheet ↗"],
    "piSchematic": ["Pi 4 şeması ↗", "Pi 4 schematic ↗"],
    "verification": ["Doğrulama kaydı ↗", "Verification record ↗"],
    "shareTitle": ["Plan bağlantın hazır.", "Your plan link is ready"],
    "closeShare": ["Paylaşımı kapat", "Close sharing dialog"],
    "shareDescription": ["Bağlantıyı açan kişi kartını ve bağlantı planını görebilir.", "Anyone who opens this link can see your board and wiring plan."],
    "shareLink": ["Paylaşım bağlantısı", "Share link"],
    "copyLink": ["Bağlantıyı kopyala", "Copy link"],
    "pageTitle": ["Pin Atlas — Üretici belgeleriyle doğrulanmış pin rehberi.", "Pin Atlas — Pin guide verified against manufacturer documentation"],
    "description": ["Raspberry Pi, Pico ve RP2350 için interaktif pinout rehberi. Pinleri keşfedin, arayüzleri filtreleyin ve bağlantı planınızı kaydedin.", "Interactive pinout guide for Raspberry Pi, Pico, and RP2350. Explore pins, filter interfaces, and save wiring plans."],
    "generalIO": ["Genel amaçlı I/O", "General-purpose I/O"],
    "ground": ["Toprak", "Ground"],
    "analog": ["Analog", "Analog"],
    "invalidPlan": ["Plan verisi okunamadı.", "Could not read the plan data."],
    "invalidAssignment": ["Plandaki pin veya işlev bu kartla uyuşmuyor.", "A pin or function in the plan is not available for this board."],
    "storageUnavailable": ["Tarayıcı kaydı kullanılamıyor. Planını JSON olarak indirebilirsin.", "Browser storage is unavailable. You can download your plan as JSON."],
    "pinCount": ["{count} pin", "{count} pins"],
    "gpioHeader": ["GPIO başlığı", "GPIO header"],
    "microcontroller": ["mikrodenetleyici", "microcontroller"],
    "reservedCount": ["{count} ayrılmış", "{count} reserved"],
    "bcmNumbering": ["BCM numaralandırma", "BCM numbering"],
    "schematic": ["ŞEMATİK", "SCHEMATIC"],
    "notToScale": ["MEKANİK ÖLÇEK DEĞİLDİR", "NOT TO SCALE"],
    "diagramLabel": ["{board} fiziksel pin haritası", "{board} physical pin map"],
    "headerLegend": ["2 × 20 · 2.54 mm GPIO BAŞLIĞI", "2 × 20 · 2.54 mm GPIO HEADER"],
    "matchCount": ["{count} / {total} eşleşme", "{count} / {total} matches"],
    "physical": ["Fiziksel", "Physical"],
    "pinName": ["Pin adı", "Pin name"],
    "functions": ["İşlevler", "Functions"],
    "label": ["Etiket", "Label"],
    "physicalPin": ["Fiziksel pin", "Physical pin"],
    "gpioDescription": ["Dijital giriş veya çıkış olarak kullanılabilir. Alternatif işlevlerden birini seçerek bağlantını planla.", "Use this pin as a digital input or output, or select an alternate function for your plan."],
    "groundDescription": ["Devrenin ortak toprak referansı. Kartlar arasındaki sinyaller için ortak referans sağlar.", "Common ground reference for the circuit and for signals between boards."],
    "powerDescription": ["Güç bağlantısı. Besleme yönü ve izin verilen gerilim aralığı için kartın veri sayfasına bak.", "Power connection. See the datasheet for the supply direction and voltage range."],
    "systemDescription": ["Kart veya çipin özel sistem bağlantısı. Kullanım koşulları için veri sayfasına bak.", "Dedicated board or chip connection. See the datasheet for operating conditions."],
    "analogDescription": ["Analog referans bağlantısı. Analog devreye bağlamadan önce veri sayfasını kontrol et.", "Analog reference connection. Check the datasheet before wiring it to an analog circuit."],
    "logicLevel": ["LOJİK SEVİYE", "LOGIC LEVEL"],
    "connection": ["BAĞLANTI", "CONNECTION"],
    "functionCount": ["İŞLEV SAYISI", "FUNCTION COUNT"],
    "options": ["{count} seçenek", "{count} options"],
    "oneOption": ["1 seçenek", "1 option"],
    "chooseFunction": ["BİR İŞLEV SEÇ", "SELECT A FUNCTION"],
    "pinFunction": ["PİN İŞLEVİ", "PIN FUNCTION"],
    "default": ["VARSAYILAN", "DEFAULT"],
    "projectLabel": ["PROJENDEKİ ADI", "PROJECT LABEL"],
    "optional": ["(İSTEĞE BAĞLI)", "(OPTIONAL)"],
    "labelExample": ["Örn. sıcaklık sensörü", "e.g. temperature sensor"],
    "reserved": ["HAT EEPROM için ayrılmış", "Reserved for HAT EEPROM"],
    "updatePin": ["Plandaki pini güncelle", "Update pin in plan"],
    "addPin": ["Planıma ekle", "Add to my plan"],
    "pinSources": ["Bu pinin resmî kaynakları", "Official references for this pin"],
    "pinEvidence": ["BU PİNİN DAYANAĞI", "REFERENCES FOR THIS PIN"],
    "pdfPage": ["PDF s. {page}", "PDF p. {page}"],
    "verifiedOn": ["Kontrol: {date}", "Verified: {date}"],
    "method": ["Yöntem ve kapsam ↗", "Method and scope ↗"],
    "selectPlanPin": ["Plandaki {pin} pinini seç", "Select {pin} in the plan"],
    "removePin": ["Pin {pin} plandan çıkar", "Remove pin {pin} from the plan"],
    "emptyPlan": ["Bir pin seç, işlevini belirle.", "Select a pin and choose its function."],
    "emptyPlanHint": ["Bir sonraki projen burada başlasın.", "Add it here to start your plan."],
    "duplicateSignal": ["{name}, pin {pin} üzerinde planlanmış. Önce o atamayı kaldır.", "{name} is already assigned to pin {pin}. Remove that assignment first."],
    "pinSaved": ["Pin bağlantı planına kaydedildi.", "Pin saved to the wiring plan."],
    "noBoard": ["Henüz bu kart yok. STM32 ailesi sonraki sürümler için sırada.", "No matching board. STM32 boards are planned for a future release."],
    "linkTooLong": ["Paylaşım bağlantısı çok uzun.", "The share link is too long."],
    "planLinkCopied": ["Plan bağlantısı kopyalandı.", "Plan link copied."],
    "unsupportedFormat": ["Bu plan biçimi desteklenmiyor.", "This plan format is unsupported."],
    "shareFailed": ["Paylaşım planı açılamadı: {error}", "Could not open the shared plan. {error}"],
    "pinRemoved": ["Pin plandan çıkarıldı.", "Pin removed from the plan."],
    "linkCopied": ["Bağlantı kopyalandı.", "Link copied."],
    "manualCopy": ["Bağlantıyı seçtim. Kopyalamak için Ctrl/Cmd+C kullan.", "The link is selected. Press Ctrl/Cmd+C to copy it."],
    "planDownloaded": ["Bağlantı planı JSON olarak indirildi.", "Wiring plan downloaded as JSON."],
    "fileTooLarge": ["Dosya 100 KB sınırını aşıyor.", "The file exceeds the 100 KB limit."],
    "unsupportedFile": ["Desteklenen bir Pin Atlas planı seç.", "Choose a supported Pin Atlas plan."],
    "planImported": ["Bağlantı planı içe aktarıldı.", "Wiring plan imported."],
    "importFailed": ["Dosya içe aktarılamadı.", "Could not import the file."],
    "loadFailed": ["Kart verileri ve kaynak kayıtları yüklenemedi.", "Could not load the board data and references."],
    "reloadHint": ["Kart verileri yüklenemedi. Sayfayı yenileyerek tekrar deneyin.", "Could not load the board data. Reload the page to try again."],
    "board.pico2w": ["RP2350A · 40-pin geliştirme kartı", "RP2350A · 40-pin development board"],
    "board.raspberry-pi-4": ["J8 · 40 pin · BCM2711 alternatif işlevleri", "J8 · 40 pins · BCM2711 alternate functions"],
    "reservedNote": ["HAT kimlik EEPROM hattına ayrılmıştır; normal proje GPIO’su olarak planlamayın.", "Reserved for HAT identification EEPROM."],
    "note.pico2w.30": ["RUN düşük seviyeye çekildiğinde RP2350 sıfırlanır.", "Pull RUN low to reset the RP2350."],
    "note.pico2w.33": ["ADC devresinin analog toprak referansı.", "Analog ground reference for the ADC."],
    "note.pico2w.35": ["ADC besleme / referans bağlantısı; GPIO değildir.", "Dedicated ADC supply and reference connection."],
    "note.pico2w.36": ["Kartın regüle 3.3 V çıkışı.", "Regulated 3.3 V output from the board."],
    "note.pico2w.37": ["Regülatör etkinleştirme girişidir; genel amaçlı GPIO değildir.", "Dedicated regulator enable input."],
    "note.pico2w.39": ["Ana besleme girişi: 1.8–5.5 V.", "Main supply input, rated for 1.8–5.5 V."],
    "note.pico2w.40": ["USB VBUS hattı; USB ile beslenirken nominal 5 V.", "USB VBUS, nominally 5 V when powered over USB."]
  };
  const supported = ['tr', 'en'];
  const storageKey = 'zaryob-language';
  const query = new URLSearchParams(location.search).get('lang');
  let language = 'tr';
  try {
    const saved = localStorage.getItem(storageKey);
    if (supported.includes(saved)) language = saved;
  } catch { /* Language preference is optional. */ }
  if (supported.includes(query)) language = query;
  document.documentElement.lang = language;

  const t = (key, values = {}, fallback = key) => {
    const message = Object.hasOwn(messages, key) ? messages[key][language === 'en' ? 1 : 0] : fallback;
    return message.replace(/\{(\w+)\}/g, (placeholder, name) => values[name] ?? placeholder);
  };
  const verificationUrl = () => `https://github.com/Zaryob/pin-atlas/blob/main/docs/VERIFICATION${language === 'en' ? '.en' : ''}.md`;
  function apply(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    for (const attribute of ['aria-label', 'placeholder', 'title', 'content']) {
      root.querySelectorAll(`[data-i18n-${attribute}]`).forEach(node => {
        node.setAttribute(attribute, t(node.getAttribute(`data-i18n-${attribute}`)));
      });
    }
    root.querySelectorAll('[data-console-language]').forEach(select => { select.value = language; });
    root.querySelectorAll('[data-verification-link]').forEach(link => { link.href = verificationUrl(); });
  }
  function renderLanguage() {
    document.documentElement.lang = language;
    apply();
    window.dispatchEvent(new CustomEvent('zaryob:language', { detail: { language } }));
  }
  function setLanguage(next, updateUrl = true) {
    if (!supported.includes(next)) return;
    language = next;
    try { localStorage.setItem(storageKey, language); } catch { /* Page-local fallback. */ }
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(history.state, '', url);
    }
    renderLanguage();
  }
  window.ZaryobI18n = { t, apply, verificationUrl };
  document.addEventListener('DOMContentLoaded', () => {
    if (supported.includes(query)) setLanguage(query, false);
    else renderLanguage();
    document.querySelectorAll('[data-console-language]').forEach(select => {
      select.addEventListener('change', () => setLanguage(select.value));
    });
  });
})();
