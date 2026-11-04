# Pin Atlas

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
- **NUCLEO-F103RB / F401RE / F411RE**, 108 Arduino ve ST Morpho kontağını MCU paket pinleri ve lehim köprüsü notlarıyla gösterir.
- **Arduino UNO başlık düzeni:** UNO R3, Leonardo, UNO R4 Minima ve UNO R4 WiFi tek kayıtta; 32 ortak başlık kontağı ve referansa özgü işlemci işlevleri. Her referansta altı SPI/ICSP kontağı bulunur. R4’te NC yerine BOOT vardır.
- **Arduino Nano başlık düzeni:** klasik Nano ve Nano Every tek kayıtta 30 ortak yan konumu paylaşır. Klasik Nano altı ICSP kontağı ekler; A6/A7 yalnızca analogdur. Every’de A6/A7 dijital I/O da destekler; PWM ve programlama bağlantıları farklıdır.
- **Arduino Mega 2560 Rev3:** uç başlık ve ana işlemci ICSP dahil 92 kontak, 70 bağımsız GPIO ve 16 analog giriş.
- **Arduino Micro:** kendine özgü 34 yan kontak ve altı ICSP; ATmega32U4 için 24 bağımsız GPIO ve 12 ADC kanalı.
- **ESP32-DevKitC V4:** 38 kontak; WROOM-32E/WROVER referansları tek kayıtta. Flash/PSRAM kısıtlamaları ve girişe özel pinler korunur.
- **ESP32-C3-DevKitM-1:** MINI-1/1U için resmî 30 kontak ve 15 GPIO; USB/RGB LED paylaşımları belirtilir.
- **ESP32-S3-DevKitC-1 v1.1:** 44 kontak; WROOM-1-N8/N8R8 bellek referansları. N8R8 GPIO35–37’yi belleğe ayırır; v1.1 RGB LED GPIO38’dedir.
- **ATmega328P paketleri:** PDIP-28, TQFP-32, QFN/MLF-28 ve QFN/MLF-32 ayrı fiziksel görünümler; 23 GPIO olanağı, reset/saat sigortası koşulları ve yalnızca 32-pin paketlerde ADC6/7.
- **ATmega2560 ve ATmega2561 paketleri:** Ayrı TQFP-100 (86 GPIO'lu ATmega2560 / ATmega1280) ve TQFP-64 (54 GPIO'lu ATmega2561 / ATmega1281) görünümleri; Mega kartının Arduino pin numaralarından bağımsız gerçek MCU paket pinleri.
- **RP2350A:** QFN-60, 30 Bank 0 GPIO.
- **RP2350B:** QFN-80, 48 Bank 0 GPIO.

Pico çizimi ortak başlığı gösterir; modellerin kablosuz, LED ve dahili bağlantılarının aynı olduğunu iddia etmez. İşlev referansı değişince fiziksel pinler aynı kalır. Planlar referans bazında saklanır. Eski model bağlantıları, JSON dosyaları ve kayıtlı planlar desteklenir; aynı işlemci için birden fazla eski plan varsa birleştirilmeden referans seçicisinde erişilebilir kalır.

MCU paketi doğrulanmış kartlarda iki çizimden de pin seçilebilir. Paket görünümü eşleşen kart kontaklarını açar. Birden çok konnektörü olan kart çizimlerinde başlıklar ayrı ayrı büyütülebilir.

Yirmi sekiz kütüphane düzeninin otuz dokuz kaynak profili boyunca toplam 2.052 fiziksel pin kaydı ve 6.401 pin/alternatif işlev kaydı bulunur. RP2040 ve RP2350 paketlerinin merkez GND pedi çevre pin sayısına dahil değildir. Çizimler şematiktir; mekanik CAD yerleşimi veya gerçek komponent konumları olarak kullanılmaz.

## Kullanım

Pin seçimi, arayüz filtreleri, metin araması, tablo, aynalama, 180° döndürme, özel etiketler, karta özel bağlantı planları, JSON aktarımı ve bağlantıyla paylaşım desteklenir. Filtreler VEYA mantığıyla çalışır. Haritada ilk iki eşleşen işlev, tabloda tüm eşleşen işlevler görünür.

Her pinin detayında, fiziksel bağlantıyı ve alternatif işlevlerini destekleyen **resmî belge, PDF sayfası ve tablo/şekil numarası** bulunur. `F0…F11` RP2350 işlev seçicilerini, `ALT0…ALT5` BCM2711 seçicilerini belirtir. ADC kaydı bir dijital işlev seçici değildir. `GPIO` seçeneği uygulamanın genel giriş/çıkış planlama etiketidir; ayrıca bir üretici seçici numarası olarak sayılmaz.

Filtreler başlangıçta kapalıdır. Pin detayında ilgili işlevler öne çıkarılır; diğer işlevler ve kaynaklar açılır bölümlerdedir. Planın ayrı sekmesi vardır. Küçük ekranlarda pine dokunmak, kaydetme düğmesi sabit kalan bir detay paneli açar.

Jetson çevre birimleri uygun pinmux/Jetson-IO yapılandırması ve yazılım desteği gerektirir; plan kaydetmek cihazı yapılandırmaz. Sinyaller 3.3 V seviyesindedir; açık drenajlı I²C ve zayıf TXB0108 sürüşü için pin detayındaki elektriksel notlara bakın. Jetson adları taşıyıcı kart sinyalleridir; Linux veri yolu numaraları veya F/ALT seçicileri değildir.

STM32F1 için uydurma AF0–AF15 seçicileri kullanılmaz; RM0008’deki AFIO remap alanları ve değerleri gösterilir. Remap çevre birimi genelindedir; tüm sinyaller birlikte yapılandırılmalı, gereken JTAG pinleri bırakılmalıdır. Plan tüm yazmaç ve kart devresi kısıtlamalarını doğrulamaz.

Planlar tarayıcıda `pin-atlas:plans:v1` anahtarında saklanır. Paylaşım bağlantısı kaydedilmiş planı URL fragment içinde taşır. Bağlantılar ve JSON dosyaları önce önizlenir. Mevcut plan yalnızca değiştirmeyi seçtiğinde güncellenir. GPIO0/GPIO1 (Pi 4 fiziksel 27/28) HAT EEPROM için ayrıldığı için normal proje planına eklenmez. Uygulama elektriksel tasarım veya firmware doğrulaması yapmaz.

## Yerel çalıştırma

```sh
git clone https://github.com/Zaryob/pin-atlas.git
cd pin-atlas
npm run dev
# http://127.0.0.1:4173
npm run check
```

Uygulamanın çalışması için paket kurulumu veya build gerekmez. Yayımlanacak dosyalar `dist/` içindedir. Fontlar yereldir. Açık/koyu/sistem teması ve TR/EN dil tercihi `zaryob.github.io` ile paylaşılır. İngilizce arayüz `?lang=en`, Türkçe arayüz `?lang=tr` ile doğrudan açılabilir. Dil değiştiğinde açık kart, filtreler ve bağlantı planı korunur.

## Üretici belgelerinden tekrar doğrulama

```sh
python3 -m pip install -r requirements-source-verification.txt
python3 scripts/verify-official-sources.py
```

Bu komut elli kilitli kaynağı (kırk yedi üretici belgesi veya kaynak dosyası ve açıkça işaretlenmiş üç Blue Pill topluluk referansı) indirir, SHA-256 değerlerini kontrol eder, PDF ve kaynak tablolarını yeniden okur ve yayımlanan veriyle karşılaştırır. Kaynaklar `.cache/primary-sources/` altında tutulur; PDF’ler depoda dağıtılmaz. Bir hash veya pin kaydı değişirse kontrol başarısız olur.

GitHub Actions, ST CDN’i yayın sunucularında zaman aşımına düşebildiği için `python3 scripts/verify-official-sources.py --table-snapshots` komutunu kullanır. Bu mod ST PDF’lerinden çıkarılıp `sources/extracted/` altında kaydedilen ham tablo hücrelerini kullanır. Kayıtların ve özgün PDF’lerin hash’leri manifestte kilitlidir. Bütün pin ve işlevler yine yeniden üretilip karşılaştırılır; diğer kırk sekiz kaynak indirilir. Yukarıdaki varsayılan komut doğrudan özgün ST PDF’lerini kontrol eder.

Şekil olarak yayımlanan ve metin hücresi içermeyen fiziksel pinler, `sources/manual-observations.json` içindeki açıkça işaretlenmiş görsel gözlemlerle kontrol edilir. Bu bölüm otomatik OCR veya bağımsız donanım ölçümü olarak sunulmaz. RP2350 Release 8 içindeki IOVDD tablo/şekil tutarsızlığı da aynı kayıtta gerekçelendirilir. Tam yöntem [doğrulama kaydında](docs/VERIFICATION.tr.md).

Kaynak incelemesinden sonra bilinçli bir güncelleme yapmak için:

```sh
python3 scripts/verify-official-sources.py --write
npm run check
```

`--write`, geçerli üretici girdilerinden `dist/data/boards.json`, `evidence.json`, `verification.json` ve pin bazındaki CSV’yi yeniden üretir. Kaynak revizyonunu değiştirmek önce üretici belgesini yeniden incelemeyi, manifest hash’lerini ve ilgili görsel gözlemleri güncellemeyi gerektirir.

## Yeni kart ekleme

Blue Pill ve STM32F103C8/CB LQFP48 işlemcisi desteklenir; diğer STM32 kartları ve paketleri ayrı kaynak kayıtları gerektirir. Yeni kart eklerken üretici/model/revizyon, fiziksel bağlantılar, alternatif işlevler ve bunların resmî belge konumları birlikte eklenmelidir. Mevcut profillerin üretilmiş JSON dosyasını tek başına elle değiştirmek kaynak doğrulamasından geçmez; veri üreticisini ve ilgili kaynak kayıtlarını birlikte güncelleyin.

Çizici türleri `pico`, `header`, `qfn`, `lqfp` ve `custom` olarak ayrılır. `custom` kartlar yerel bir SVG tuvali ve `pins[].position` koordinatları ile tanımlanabilir. SVG yolu uygulamanın tabanına göre çözülür; `/pin-atlas/` gibi bir alt yol desteklenir. Pin koordinatları bağlantı merkezini, `side` etiket yönünü, `angle` isteğe bağlı dönüşü belirtir.

## GitHub Pages

`main` dalına gönderilen değişiklikler önce üretici belgeleriyle karşılaştırılır, ardından statik dosya kontrolleri çalıştırılır. Yalnızca kontroller başarılıysa `dist/` GitHub Pages’e yayımlanır. İş akışı `.github/workflows/pages.yml` içindedir.

## Lisans

Uygulama GPL-3.0-or-later lisanslıdır. Ortak tema ve IBM Plex Mono için gerçek yazılım/font bildirimleri `THIRD_PARTY_NOTICES.md` içindedir. Donanım doğrulamasında kullanılan üretici belgeleri ise ayrı olarak `sources/manifest.json` ve `docs/VERIFICATION.tr.md` içinde belgelenir.

Arduino haritaları resmî tam pin şemaları, bağlantı tabloları ve sabitlenmiş Arduino AVR çekirdeğiyle doğrulanır. Listelenen AVR ve Renesas modellerinde her işlemci referansı kendi işlevlerini ve ek bağlantı kapsamını korur. Başlık konumları Arduino pin numaralarından ve MCU portlarından ayrıdır. Aynı GPIO hattının tekrar eden kontakları belirtilir; plan ve JSON içe aktarma aynı GPIO’nun iki kez kullanımını reddeder. USB köprüsünün programlama başlıkları ve işlemcinin bütün ham alternatif işlevleri bu haritaların kapsamında değildir.

ESP GPIO matrix seçenekleri etkin yazılım atamasını değil, yapılandırılabilir yönlendirme olanağını gösterir. Girişe özel pinlere çıkış/PWM verilmez; flash/PSRAM’a ayrılmış kontaklar plana eklenemez. ESP çizimlerinde USB alttadır.

**Uyumlu kartlar** bölümü numaralı bir model indeksi açar. İşlemci/referans, seçili model ve kayıtlı plan bilgisi gösterilir; uzun listeler aranabilir. Model seçimi doğru referansı açar. Yalnızca fiziksel uyumluluğu doğrulanan modeller ortak pin düzenine gider; başka kartın alternatif işlevleri atanmaz.
