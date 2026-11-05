# Pin Atlas

Yeni profil eklemek için [kart ve MCU doğrulama adımlarını](docs/ADDING-BOARDS.md) izleyin.

[English](README.md) · [Türkçe](README.tr.md)

[Canlı site](https://zaryob.github.io/pin-atlas/?lang=tr) · [Doğrulama kaydı](docs/VERIFICATION.tr.md) · [Pin bazında karşılaştırma](sources/pin-verification.csv)

Üretici belgelerinden derlenen, İngilizce öncelikli ve Türkçe destekli pin rehberi. Fiziksel pin düzenini, alternatif işlevleri ve bağlantı planlarını aynı çalışma alanında gösterir. Arayüz, çizimler ve uygulama kodu bu proje için hazırlanmıştır. Konsol teması kişisel sitemin ortak temasıdır.

## Pin düzenleri

Kütüphanede her fiziksel düzen bir kez listelenir; uyumlu kartlar aynı kayıtta belirtilir:

- **Raspberry Pi Pico ailesi:** Pico, Pico W, Pico 2 ve Pico 2 W için ortak 40-pin düzeni ve 26 GPIO. Aynı ekrandan Pico / Pico W için RP2040, Pico 2 / Pico 2 W için RP2350A işlev referansı seçilir.
- **Raspberry Pi 40-pin GPIO:** B+, A+, Pi 2/3/4/5, Zero ailesi ve 400/500 tek başlık kaydını paylaşır. Ortak GPIO/güç/toprak, Pi 4 için doğrulanmış BCM2711 veya Pi 5 için doğrulanmış RP1 alternatif işlevleri aynı ekrandan seçilir. 26-pin kartlar ve Compute Module dahil değildir. Bazı Zero başlıkları lehimli değildir; klavyeli modellerde yönü kontrol edin.
- **NVIDIA Jetson Orin Nano:** NVIDIA P3768 geliştirme kiti taşıyıcı kartının J12 40-pin başlığı. SPI, I²C, UART, I²S, PWM ve saat işlevleri taşıyıcı kart belgesinden alınır. Raspberry Pi’den farklı sinyal adları ve pinmux gereksinimleri olduğundan ayrı haritadır.
- **STM32 Blue Pill:** STM32-base topluluk referansı; iki 20-pin yan başlık ve dört SWD bağlantısı. H1/H2/SWD konumları MCU paket pinlerinden ayrıdır; LED, kristal, USB ve debug bağlantıları belirtilir. Klon yongaları ve bağlantıları kontrol edilmelidir.
- **STM32F103 paketleri** için RM0008 kaynaklı AFIO remap koşullarıyla LQFP-48 (37 GPIO'lu STM32F103C8T6 / STM32F103CBT6), LQFP-64 (51 GPIO'lu STM32F103RBT6 / STM32F103R8T6) ve LQFP-100 (80 GPIO'lu STM32F103VBT6 / STM32F103V8T6) görünümleri.
- **STM32 Nucleo-32 ailesi:** F042K6 ve L432KC, 30 MB1180 CN3/CN4 kontağını paylaşır; LQFP-32 / UFQFPN-32 işlemci referansları ve I²C/VCP/osilatör köprü notları modele özgüdür.
- **STM32 Nucleo-64 ailesi:** uyumlu MB1136 ve MB1367 referansları, 108 Arduino/ST Morpho kontağını tek fiziksel kayıtta paylaşır. Tam model seçimi işlemci işlevlerini, paket bağlantılarını ve lehim köprüsü notlarını korur.
- **STM32 Nucleo-144 ailesi:** F767ZI, H743ZI2 ve H723ZG, CN7–CN12 üzerindeki doğrulanmış 240 fiziksel ST Zio/Morpho konumunu paylaşır. İşlemci, güç hatları ve devre koşulları model bazında kalır. Düzeltilmiş H723 eşlemesi eski atama kimliklerini korur.
- **WeAct Black Pill v3.x:** F401CC ve F411CE, dört SWD dahil 44 kontaklı tek kayıttadır. Elektriksel adlar ve konumlar üreticinin sabitlenmiş KiCad sembolünden ve ayak izinden ayrıştırılır; MCU, USB, boot, düğme, LED ve isteğe bağlı flash notları korunur.
- **Ek Nucleo modelleri:** F446RE, F303RE, L476RG, F072RB, L053R8 ve L152RE; her biri kendi STM32 paketine bağlıdır. Pin haritaları sabitlenmiş UM1724 tablolarına ve üretici XML kaynaklarına dayanır; CI, kılavuz PDF'sini indirmeden kaydedilmiş tabloları doğrular.
- **STM32 paket görünümleri:** STM32F446RET6, F303RET6, L476RGT6, F072RBT6, L053R8T6 ve L152RET6 (LQFP-64); ayrıca bağımsız STM32F405RGT6 (LQFP-64) ve STM32F407VGT6 (LQFP-100). Paket bacak numaraları ve GPIO alternatif işlev seçicileri ST'nin sabitlenmiş XML kaynaklarından alınır.
- **Ek STM32 paketleri:** F042K6T6 (LQFP-32), L432KCU6 (UFQFPN-32), F767ZIT6 / H743ZIT6 (LQFP-144), F401CCU6 / F411CEU6 (UFQFPN-48); her biri tam kart referansına bağlıdır. UFQFPN çizimleri kaynak XML'de numaralanan çevre bacaklarını kapsar.
- **Arduino UNO başlık düzeni:** UNO R3, Leonardo, UNO R4 Minima ve UNO R4 WiFi tek kayıtta; 32 ortak başlık kontağı ve referansa özgü işlemci işlevleri. Her referansta altı SPI/ICSP kontağı bulunur. R4’te NC yerine BOOT vardır.
- **Arduino Nano başlık düzeni:** klasik Nano ve Nano Every tek kayıtta 30 ortak yan konumu paylaşır. Klasik Nano altı ICSP kontağı ekler; A6/A7 yalnızca analogdur. Every’de A6/A7 dijital I/O da destekler; PWM ve programlama bağlantıları farklıdır.
- **Arduino Mega 2560 Rev3:** uç başlık ve ana işlemci ICSP dahil 92 kontak, 70 bağımsız GPIO ve 16 analog giriş.
- **Arduino Micro:** kendine özgü 34 yan kontak ve altı ICSP; ATmega32U4 için 24 bağımsız GPIO ve 12 ADC kanalı.
- **Seeed Studio XIAO başlıkları:** Seeed Studio XIAO RP2040 (RP2040 QFN paket bacak köprüsüyle) ve Seeed Studio XIAO ESP32C3 (RISC-V Wi-Fi/BLE) tarafından paylaşılan 14 kontaklı kompakt XIAO biçimi; D0–D10 pinlerinin işlemciler arasında farklı GPIO ve çevre birimlerine nasıl eşlendiğini karşılaştırmalı olarak sunar.
- **BBC micro:bit V2:** 5 büyük timsah/muz halka kontağı (0, 1, 2, 3V, GND) ve 16 genişletme kenar kontağını (P3–P16, P19, P20) içeren 21 kontaklı kenar konnektörü biçimi. nRF52833 GPIO'larını, dokunmatik algılamayı, analog girişleri; 5×5 LED matris sütunları, A/B butonları ve I²C pull-up devreleriyle paylaşılan hatları ve RING ile EDGE arasında konnektör yakınlaştırmasını destekler.
- **ESP32-DevKitC V4:** 38 kontak; WROOM-32E/WROVER referansları tek kayıtta. Flash/PSRAM kısıtlamaları ve girişe özel pinler korunur.
- **ESP32-C3-DevKitM-1:** MINI-1/1U için resmî 30 kontak ve 15 GPIO; USB/RGB LED paylaşımları belirtilir.
- **ESP32-S3-DevKitC-1 v1.1:** 44 kontak; WROOM-1-N8/N8R8 bellek referansları. N8R8 GPIO35–37’yi belleğe ayırır; v1.1 RGB LED GPIO38’dedir.
- **ATmega328P paketleri:** PDIP-28, TQFP-32, QFN/MLF-28 ve QFN/MLF-32 ayrı fiziksel görünümler; 23 GPIO olanağı, reset/saat sigortası koşulları ve yalnızca 32-pin paketlerde ADC6/7.
- **ATmega2560 ve ATmega2561 paketleri:** Ayrı TQFP-100 (86 GPIO'lu ATmega2560 / ATmega1280) ve TQFP-64 (54 GPIO'lu ATmega2561 / ATmega1281) görünümleri; Mega kartının Arduino pin numaralarından bağımsız gerçek MCU paket pinleri.
- **RP2350A:** QFN-60, 30 Bank 0 GPIO.
- **RP2350B:** QFN-80, 48 Bank 0 GPIO.

Pico çizimi ortak başlığı gösterir; modellerin kablosuz, LED ve dahili bağlantılarının aynı olduğunu iddia etmez. İşlev referansı değişince fiziksel pinler aynı kalır. Planlar referans bazında saklanır. Eski model bağlantıları, JSON dosyaları ve kayıtlı planlar desteklenir; aynı işlemci için birden fazla eski plan varsa birleştirilmeden referans seçicisinde erişilebilir kalır.

MCU paketi doğrulanmış kartlarda iki çizimden de pin seçilebilir. Paket görünümü eşleşen kart kontaklarını açar. Birden çok konnektörü olan kart çizimlerinde başlıklar ayrı ayrı büyütülebilir.

Toplam kayıt sayıları ve kaynak profilleri [doğrulama özetinde](public/data/verification.json) listelenir. RP2040 ve RP2350 paketlerinin merkez GND pedi çevre pin sayısına dahil değildir. Çizimler şematiktir ve mekanik CAD yerleşimi veya gerçek komponent konumları olarak kullanılmaz.

## Kullanım

Bağlantı planındaki **Çevrebirim ekle**, aynı SPI, I²C veya UART/USART biriminin doğrulanmış sinyallerini birlikte seçtirir. Mevcut atamalar korunur; seçili pinlerin devre notları ve kaynakları gösterilir. Tekrarlanan sinyaller ve çelişen STM32 AFIO remap koşulları reddedilir; eski tarayıcı kayıtları çakışma uyarısıyla görünür kalır.

**Yazdır / PDF kaydet**, tarayıcının yazdırma penceresinde kaynaklı bağlantı tablosu oluşturur. **SVG indir**, tam üstten pin haritasını, seçili işlevleri, etiketleri ve kaynak konumlarını içerir; renkler ve kart çizimi çevrimdışı kullanım için dosyaya gömülür.

Ana sayfa yaklaşık 56 KB katalog özeti yükler. Pinler ve kaynaklar model açıldığında gelir; önbellekli geçiş ve kalıcı yeniden deneme, seçili modeli ve tarayıcı planlarını korur.

Pin seçimi, arayüz filtreleri, metin araması, tablo, aynalama, 180° döndürme, özel etiketler, karta özel bağlantı planları, JSON aktarımı ve bağlantıyla paylaşım desteklenir. Filtreler VEYA mantığıyla çalışır. Haritada ilk iki eşleşen işlev, tabloda tüm eşleşen işlevler görünür.

Her pinin detayında, fiziksel bağlantıyı ve alternatif işlevlerini destekleyen **resmî belge, PDF sayfası ve tablo/şekil numarası** bulunur. `F0…F11` RP2350 işlev seçicilerini, `ALT0…ALT5` BCM2711 seçicilerini belirtir. ADC kaydı bir dijital işlev seçici değildir. `GPIO` seçeneği uygulamanın genel giriş/çıkış planlama etiketidir; ayrıca bir üretici seçici numarası olarak sayılmaz.

Filtreler başlangıçta kapalıdır. Pin detayında ilgili işlevler öne çıkarılır; diğer işlevler ve kaynaklar açılır bölümlerdedir. Planın ayrı sekmesi vardır. Küçük ekranlarda pine dokunmak, kaydetme düğmesi sabit kalan bir detay paneli açar.

Jetson çevre birimleri uygun pinmux/Jetson-IO yapılandırması ve yazılım desteği gerektirir; plan kaydetmek cihazı yapılandırmaz. Sinyaller 3.3 V seviyesindedir; açık drenajlı I²C ve zayıf TXB0108 sürüşü için pin detayındaki elektriksel notlara bakın. Jetson adları taşıyıcı kart sinyalleridir; Linux veri yolu numaraları veya F/ALT seçicileri değildir.

STM32F1 için uydurma AF0–AF15 seçicileri kullanılmaz; RM0008’deki AFIO remap alanları ve değerleri gösterilir. Remap çevre birimi genelindedir; tüm sinyaller birlikte yapılandırılmalı, gereken JTAG pinleri bırakılmalıdır. Plan, seçili AFIO koşullarının ortak bir değerde çalışabildiğini denetler; firmware ve kalan devre koşulları ayrıca yapılandırılmalıdır.

Planlar tarayıcıda `pin-atlas:plans:v1` anahtarında saklanır. Paylaşım bağlantısı kaydedilmiş planı URL fragment içinde taşır. Bağlantılar ve JSON dosyaları önce önizlenir. Mevcut plan yalnızca değiştirmeyi seçtiğinde güncellenir. GPIO0/GPIO1 (Pi 4 fiziksel 27/28) HAT EEPROM için ayrıldığı için normal proje planına eklenmez. Uygulama elektriksel tasarım veya firmware doğrulaması yapmaz.

## Yerel çalıştırma

Node.js (npm ile), Python 3 ve Ruby 3.3 veya üzeri (Bundler ile) gerekir. Yerel sunucuyu başlatmadan önce Jekyll bağımlılıklarını kurun.

```sh
git clone https://github.com/Zaryob/pin-atlas.git
cd pin-atlas
python3 scripts/jekyll.py install
npm run dev
```

Tarayıcıda `http://127.0.0.1:4173` adresini açın. `npm run build`, siteyi `public/` içeriğinden `_site/` altında üretir ve çıktıdaki dosya yollarını denetler. Depo kontrolleri ortak şema doğrulayıcısı dahil `requirements-source-verification.txt` paketlerini gerektirir; `npm run check` öncesinde bunları Python ortamınıza kurun.

Tarayıcı regresyon kontrolleri için test bağımlılıklarını ve Chromium'u kurup GitHub Pages proje yolu altında bir önizleme oluşturun:

```sh
npm ci
npx playwright install chromium
npm run build:ui
npm run test:ui
```

Tarayıcı testleri masaüstü ve mobil koyu görünümü, modele özel aramayı, konektör yakınlaştırmasını, klavye kullanımını, yükleme hatasından kurtarmayı ve kayıtlı/içe aktarılan/paylaşılan planları denetler. CI bunları dağıtımdan önce çalıştırır ve derlenmiş dosya yollarını kontrol eder. Test raporları ve iz kayıtları yayımlanan siteye eklenmez.

Fontlar yereldir. Açık/koyu/sistem teması ve TR/EN dil tercihi `zaryob.github.io` ile paylaşılır. İngilizce arayüz `?lang=en`, Türkçe arayüz `?lang=tr` ile doğrudan açılabilir. Dil değiştiğinde açık kart, filtreler ve bağlantı planı korunur.

## Üretici belgelerinden tekrar doğrulama

```sh
python3 -m pip install -r requirements-source-verification.txt
python3 scripts/verify-official-sources.py
```

Komut, üretici belgeleri ve kaynak dosyalarıyla birlikte Blue Pill topluluk referanslarını da içeren [kaynak listesini](sources/manifest.json) okur. Eksik dosyaları `.cache/primary-sources/` altına indirir, kilitli SHA-256 değerlerini kontrol eder, PDF ve kaynak tablolarını yeniden okur ve depodaki veriyle karşılaştırır. Bir hash veya pin kaydı değişirse kontrol başarısız olur.

GitHub Actions, ST CDN’i yayın sunucularında zaman aşımına düşebildiği için `python3 scripts/verify-official-sources.py --table-snapshots` komutunu kullanır. Bu mod ST PDF’lerinden çıkarılıp `sources/extracted/` altında kaydedilen ham tablo hücrelerini kullanır. Kayıtların ve özgün PDF’lerin hash’leri manifestte kilitlidir. Kalan kaynaklar doğrulanır, bütün pin ve işlevler yeniden üretilip karşılaştırılır. Yukarıdaki varsayılan komut doğrudan özgün ST PDF’lerini kontrol eder.

Şekil olarak yayımlanan ve metin hücresi içermeyen fiziksel pinler, `sources/manual-observations.json` içindeki açıkça işaretlenmiş görsel gözlemlerle kontrol edilir. Bu bölüm otomatik OCR veya bağımsız donanım ölçümü olarak sunulmaz. RP2350 Release 8 içindeki IOVDD tablo/şekil tutarsızlığı da aynı kayıtta gerekçelendirilir. Tam yöntem [doğrulama kaydında](docs/VERIFICATION.tr.md).

Kaynak incelemesinden sonra bilinçli bir güncelleme yapmak için:

```sh
python3 scripts/verify-official-sources.py --write
npm run build:data
npm run check
```

`--write`, `public/data/` altındaki `boards.json`, `evidence.json` ve `verification.json` dosyalarını ve `sources/` altındaki pin bazında karşılaştırma CSV’sini yeniden üretir. Kaynak revizyonunu değiştirirken önce belgeyi yeniden inceleyin, ardından manifestteki hash’i ve ilgili görsel gözlemleri güncelleyin.

`npm run build:data`, tam fiziksel geometriyi doğrulayıp küçük çalışma zamanı kataloğunu ve profil/kaynak dosyalarını üretir. `npm run check`, bunların kaynak veriyle eşleşmesini denetler. Ayrı [haftalık kaynak denetimi](.github/workflows/source-audit.yml), kayıtlı adresleri önbelleksiz indirip hash karşılaştırması yapar; dış CDN erişimi dağıtımı durdurmaz.

## Yeni kart ekleme

[Kart ve MCU ekleme adımlarını](docs/ADDING-BOARDS.md) izleyin. Profiller ortak JSON şemasını, kart/paket hat eşleşmelerini ve kaynak kilitlerini sağlamalıdır. Üretici, tam model/revizyon, fiziksel bağlantılar, işlevler ve kaynak konumlarını birlikte ekleyin; veri üreticisini, çalışma zamanı dosyalarını ve regresyon kontrollerini veriyle birlikte güncelleyin.

Çizici türleri `pico`, `header`, `dip`, `qfn`, `lqfp` ve `custom` olarak ayrılır. `custom` kartlar yerel bir SVG tuvali ve `pins[].position` koordinatları ile tanımlanabilir. SVG yolu uygulamanın tabanına göre çözülür ve `/pin-atlas/` gibi bir alt yol desteklenir. Pin koordinatları bağlantı merkezini, `side` etiket yönünü, `angle` isteğe bağlı dönüşü belirtir.

## GitHub Pages

`main` dalına gönderilen değişiklikler kaynak doğrulamasını ve depo kontrollerini başlatır. Kontroller başarılı olduğunda GitHub Actions siteyi Jekyll ile derler ve `_site/` dizinini GitHub Pages’e yayımlar. Ayrıntılar [Pages iş akışında](.github/workflows/pages.yml) yer alır.

## Lisans

Uygulama GPL-3.0-or-later lisanslıdır. Ortak tema ve IBM Plex Mono için gerçek yazılım/font bildirimleri `THIRD_PARTY_NOTICES.md` içindedir. Donanım doğrulamasında kullanılan üretici belgeleri ise ayrı olarak `sources/manifest.json` ve `docs/VERIFICATION.tr.md` içinde belgelenir.

Arduino haritaları resmî tam pin şemaları, bağlantı tabloları ve sabitlenmiş Arduino AVR çekirdeğiyle doğrulanır. Listelenen AVR ve Renesas modellerinde her işlemci referansı kendi işlevlerini ve ek bağlantı kapsamını korur. Başlık konumları Arduino pin numaralarından ve MCU portlarından ayrıdır. Aynı GPIO hattının tekrar eden kontakları belirtilir; plan ve JSON içe aktarma aynı GPIO’nun iki kez kullanımını reddeder. USB köprüsünün programlama başlıkları ve işlemcinin bütün ham alternatif işlevleri bu haritaların kapsamında değildir.

ESP GPIO matrix seçenekleri etkin yazılım atamasını değil, yapılandırılabilir yönlendirme olanağını gösterir. Girişe özel pinlere çıkış/PWM verilmez; flash/PSRAM’a ayrılmış kontaklar plana eklenemez. ESP çizimlerinde USB alttadır.

**Uyumlu kartlar** bölümü numaralı bir model indeksi açar. İşlemci/referans, seçili model ve kayıtlı plan bilgisi gösterilir; uzun listeler aranabilir. Model seçimi doğru referansı açar. Yalnızca fiziksel uyumluluğu doğrulanan modeller ortak pin düzenine gider; başka kartın alternatif işlevleri atanmaz.

Ana sayfa ve kütüphane araması aynı kataloğu kullanır. Belirli bir modeli aramak, ortak fiziksel düzen içinde o modelin işlemci referansını açar. Öne çıkan kartların adları, GPIO sayıları ve I/O gerilimleri doğrulanmış profillerden alınır. Kütüphane yüklenemezse **Tekrar dene** kullanılabilir; tarayıcıdaki kayıtlı planlar korunur.

Site kullanım analitiği için Umami kullanır. Bağlantı planları tarayıcıda yerel olarak saklanır.
