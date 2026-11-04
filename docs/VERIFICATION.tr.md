# Pin verilerinin doğrulanması

[English](VERIFICATION.md) · [Türkçe](VERIFICATION.tr.md)

Kontrol tarihi: **4 Kasım 2026**. Kapsam: on dört kart, başlık ve çip profili, **678 fiziksel pin kaydı ve 2.350 alternatif işlev ataması**. Ortak bağlantılar profil başına sayılır. Sayımda uygulamanın soyut `GPIO` seçeneği ve numarasız QFN merkez GND pedi yoktur. Aynı sinyalin farklı pinlerde bulunması ayrı bir atamadır.

## Her haritanın dayanağı

### Raspberry Pi Pico 2 W

- Fiziksel 1–40: [üreticinin Pico 2 W pin şeması](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008305-DS-1-pico-2-w-pinout.pdf#page=1), tek sayfa. USB yukarıdayken sol kenar 1–20, sağ kenar 40–21. Tüm pin adları görsel olarak karşılaştırıldı.
- Kartın özel besleme/sistem bağlantıları: [Pico 2 W Datasheet, §2.1](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf#page=8), basılı s. 7–8 / PDF s. 8–9. VBUS, VSYS, 3V3_EN, 3V3, ADC_VREF, AGND ve RUN eşlemeleri PDF metniyle de karşılaştırıldı.
- Dışarı çıkarılan GPIO’ların dijital alternatifleri: [RP2350 Datasheet, §1.2.3, Table 3](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=18), basılı s. 17–19 / PDF s. 18–20. Yalnızca kartın başlığında bulunan GPIO’lar kullanılır; kablosuz çipe ayrılmış GPIO23/24/25/29 başlık pini olarak eklenmez.
- ADC0/1/2: üreticinin pin şeması ve veri sayfası Figure 2. GP26/27/28’e aittir. HSTX kaydı Table 3’ün `HSTX` adı ve F0 seçicisiyle gösterilir; belgeye dayanmayan özel kanal adı türetilmez.

### Raspberry Pi 4 Model B / J8

- Fiziksel pinler: [resmî GPIO dokümantasyonunun sabit commit’i](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc), “Pin names, types, and typical functions” tablosundaki 40 satır.
- Bağımsız kart bağlantısı kontrolü: [Pi 4 Model B Reduced Schematics, Rev 4, J8](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf#page=1). GPIO net etiketleri koordinatlarıyla pin satırlarına eşleştirilerek kontrol edilir. Güç ve GND bağlantıları şema üzerinden ayrıca görsel incelendi.
- Alternatif işlevler: [BCM2711 ARM Peripherals, §5.3, Table 94](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008248-DS-1-bcm2711-peripherals.pdf#page=78), basılı s. 77–78 / PDF s. 78–79. GPIO0–27 üzerindeki ALT0–ALT5 hücreleri okunur; boş ve `<reserved>` hücreler işlev olarak sunulmaz.
- `GPx` dokümantasyon adları uygulamada `GPIOx` olarak açılır. `SDA1 → I2C1 SDA`, `TXD0 → UART0 TX` gibi okunabilir ad dönüşümlerinde üretici sinyali ayrıca `functions[].signal` içinde korunur. `PWM0_0` ve `PWM0_1` isimleri aynen korunur.
- Fiziksel 27/28, GPIO0/GPIO1 ve ID_SD/ID_SC hatlarıdır; HAT EEPROM’a ayrılmıştır. Bu haritanın BCM2711 alternatifleri Pi 5/RP1’e genellenmez. Fiziksel header çizimi, kartın tüm bileşenlerini gösteren bir çizim değildir.

### RP2350A / QFN-60

- GPIO, QSPI, osilatör, debug, USB ve güç pinleri: [RP2350 Datasheet, §14.8.2.2, Tables 1674–1679](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=1333), basılı s. 1332–1335 / PDF s. 1333–1336.
- Fiziksel yerleşim ve IOVDD kontrolü: [§1.2.1.1, Figure 2](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=16), basılı s. 15 / PDF s. 16. Merkez GND pedi çevredeki 60 pine dahil değildir.
- Bank 0: Table 3, PDF s. 18–20. Bank 1 USB/QSPI: [Table 5, PDF s. 21](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=21).
- ADC0–ADC3, GPIO26–GPIO29’dadır; Table 1674’ün paket adlarıyla doğrulanır.

### RP2350B / QFN-80

- Pin listesi ve dijital işlev tabloları RP2350A ile aynı üretici belgesindeki **QFN-80 sütunundan** alınır.
- Yerleşim: [§1.2.1.2, Figure 3](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=17), basılı s. 16 / PDF s. 17.
- GPIO0–47 ve paket pin numaraları Table 1674; USB/QSPI Bank 1 işlevleri Table 5. ADC0–ADC7, bu pakette GPIO40–GPIO47’dedir. RP2350A’nın GPIO26–29 ADC varsayımı bu pakete taşınmaz.

## Üretici belgesindeki bir tutarsızlık

İncelenen **RP2350 Release 8** belgesinde Table 1679, QFN-60 IOVDD satırında `11,20,30,38,45,54` yazıyor. Aynı tablonun QSPI_IOVDD satırı pin 54’ü QSPI_IOVDD olarak tanımlıyor. Figure 2 ve Figure 152 ise pin 1’i IOVDD, pin 54’ü QSPI_IOVDD gösteriyor.

Bu yüzden IOVDD eşlemesi tablo satırından körlemesine alınmadı. Şekillerle doğrulanan QFN-60 IOVDD kümesi **1,11,20,30,38,45** olarak kaydedildi. QFN-80 IOVDD kümesi de Figure 3 ile görsel karşılaştırıldı. Bu istisnanın kaynağı ve gerekçesi `sources/manual-observations.json` içindedir. Bu, üreticiden alınmış bir düzeltme bildirimi değildir; aynı belgenin tutarlı iki şekline dayanan açık bir çözümlemedir.

## Tekrar üretilebilir kontrol

1. `sources/manifest.json`, her kaynağın sürümünü, değişmez belge adresini/commit’ini ve SHA-256 değerini kilitler.
2. `scripts/verify-official-sources.py` kaynakları indirip hash doğrular. PDF tablo hücrelerini yeniden okur; satır sarımlarını yalnızca boşluk düzeyinde normalleştirir.
   CI, ST CDN zaman aşımlarından etkilenmemek için `--table-snapshots` ile `sources/extracted/` içindeki ST tablo kayıtlarını kullanır. Her kaydın hash’i ve özgün PDF hash’i kilitlidir. Aynı ayrıştırıcı her iki girdiden STM32 verisini yeniden üretir; diğer yirmi iki kaynak her iki modda da indirilip doğrulanır. Varsayılan komut özgün ST PDF’lerini yeniden okur.
3. Fiziksel pin numarası, pin adı, pin türü, alternatif işlev, üretici sinyal adı ve F/ALT seçicisi uygulamadaki kayıtla eşleşmelidir.
4. Şekillerden alınan gözlemler ayrı işaretlenir. Bir sonraki doğrulamada aynı görsel gözlemlerin kullanılması **yeni ve bağımsız bir insan incelemesi sayılmaz**. Hash değişirse kaynak yeniden incelenmeden kabul edilmez.
5. Oluşturulan bütün pin/işlev satırları [`sources/pin-verification.csv`](../sources/pin-verification.csv) içindedir. Referans kimlikleri `dist/data/evidence.json` içinde belge, sayfa ve tabloya çözülür. Kaynak özeti `dist/data/verification.json` içindedir.
6. GitHub Actions, aynı kaynak karşılaştırmasını yayından önce çalıştırır. Yalnızca uygulama JSON’unu kontrol eden bir tutarlılık testiyle yetinmez.

PDF’lerin kopyaları, üretici çizimleri veya belge metinleri uygulama varlığı olarak dağıtılmaz. Çizimler uygulama için yazılmış SVG şemalarıdır. Belge konumları kanıt bağlantılarıdır; yazılım/font lisans bildirimi değildir.

## Eklenen kart aileleri

Pico, Pico W ve Pico 2’nin fiziksel pinleri, her modelin veri sayfasının PDF 5. sayfasındaki Şekil 2 üzerinden ayrı ayrı incelendi. Gözlemler `sources/manual-observations.json` içindedir. Pico / Pico W alternatif işlevleri RP2040 §1.4.3, Tablo 2 (PDF 13–14) üzerinden yeniden çıkarılır; RP2350 işlevleri kopyalanmaz. Pico 2, RP2350A tablosunu kullanır. Özel besleme ve RUN pinleri her veri sayfasının §2.1 metniyle de karşılaştırılır.

Ortak Raspberry Pi 40-pin profili, üreticinin GPIO tablosunu kullanır: B+ ve sonrası, Zero ailesi ve klavyeli modellerin fiziksel düzenini kapsar. Klavyeli modellerde yön ters olabilir; bazı Zero başlıkları lehimli değildir. Eski 26-pin kartlar ve Compute Module dahil değildir. Bu profil işlemciye özgü alternatif işlev içermez; BCM2711 için Pi 4 profili ayrı tutulur.

Yirmi bir üretici belgesi veya kaynak dosyası ve üç Blue Pill topluluk referansı SHA-256 ile kilitlidir. 678 fiziksel pin kaydı ortak bağlantıları profil başına sayar. Ayrıntılı model kaynakları [İngilizce doğrulama kaydında](VERIFICATION.md) bulunur.

## Ortak düzen kütüphanesi

On dört kaynak profili on fiziksel düzende sunulur: Pico ailesi, Raspberry Pi 40-pin başlığı, NVIDIA Jetson Orin Nano J12, Blue Pill, STM32F103C8/CB LQFP48, üç Arduino AVR kartı ve iki farklı RP2350 paketi. Gruplanan profillerin pin numaraları, adları ve türleri uygulama tarafından karşılaştırılır. İşlemci işlevleri ve kaynakları aynı ekrandaki referans seçicisinde korunur. Eski profil kimlikleri kayıtlı plan ve paylaşımlarda desteklenir.

## NVIDIA Jetson Orin Nano · J12

NVIDIA P3768 taşıyıcı kartının J12 başlığı, **SP-11324-001_v1.3 (Aralık 2024)** belgesinden çıkarılır; 260-pin modül veya üçüncü taraf taşıyıcılar kapsamda değildir. Şekil 3-1 (PDF s. 25) üzerindeki 40 bağlantı, Tablo 3-3 (PDF s. 26–27) satırlarıyla karşılaştırılır. I²S, PWM ve saat işlevleri yalnızca tabloda belirtilen pinlere eklenir. GPIO12’nin SoC adındaki PWM ifadesinden yeni bir başlık işlevi türetilmez.

Tablodaki 16/18 numaralı `SPI1_CSI1*` / `SPI1_CSI0*` yazımları; Şekil 3-1 ve aynı satırların CS1_N/CS0_N SoC adlarıyla karşılaştırılarak `SPI1_CS1*` / `SPI1_CS0*` olarak gösterilir. İşlev adları taşıyıcı kart sinyalleridir; Linux veri yolu/gpiochip numaraları değildir. İşlevin kullanımı pinmux/Jetson-IO ve hedef yazılım sürümüne bağlıdır.

Elektriksel notlar tablonun dipnotlarından gelir: 3.3 V sinyaller; açık drenajlı I²C hatlarında ±2 mA, 3/5 pinlerinde 2.2 kΩ ve 27/28 pinlerinde 1.5 kΩ pull-up; diğer hatlarda zayıf TXB0108 sürüşü (±20 µA), harici pull dirençleri için 50 kΩ üzeri. Jetson 27/28 pinlerine Raspberry Pi HAT EEPROM kısıtlaması uygulanmaz. Üretici PDF’si dağıtılmaz; SHA-256 kilidiyle doğrulama için indirilir.

## STM32F103C8/CB ve Blue Pill

İşlemcinin 48-pin LQFP bağlantıları, işlevleri ve FT bilgileri ST DS5319 Rev 20, Tablo 5 (PDF s. 28–33) üzerinden çıkarılır. Fiziksel düzen Şekil 8 (PDF s. 26) ile incelendi; merkez GND pedi yoktur. AFIO remap koşulları RM0008 Rev 21, §9.3 tablolarından yeniden okunur; birleştirilmiş hücreler açılır ve 48-pin pakette bulunmayan remap uçları eklenmez. AF0–AF15 numaraları uydurulmaz.

Blue Pill’in tek üreticisi yoktur. 44 bağlantı (H1:20, H2:20, SWD:4) STM32-base topluluk tablosundan alınır; referans şema ve üstten fotoğraf incelendi. Bu üç kaynak ST üretici belgesi olarak sunulmaz. USB üstteyken H2 solda, H1 sağda; her iki başlıkta 20 USB ucunda, 1 SWD ucundadır. SWD soldan sağa GND, PA14, PA13, 3V3’tür. H1/H2/SWD konumları çip pinlerinden ayrıdır; MCU pin eşlemesi ayrıca gösterilir.

Şemadaki RESET/NRST etiket tutarsızlığı belgelendi; reset başlığı için topluluk bağlantı tablosu ve R yazısı kullanılır. PB2 boot jumperında, PD0/PD1 kristal devresindedir; yan başlıklarda gösterilmez. LED, LSE, USB ve debug paylaşımı pin notlarında belirtilir. Klon MCU ve kartlar için koşulsuz uyumluluk iddiası yoktur. Toplam 16 kilitli kaynakta 13 üretici belgesi ve 3 topluluk referansı bulunur.

ST belgeleri önce resmî `www.st.com.cn`, ardından `www.st.com` adresinden indirilir. İki adresten gelen dosyalar aynı kilitli SHA-256 değerleriyle karşılaştırıldı. İndirme hatasında kaynak hash veya pin doğrulaması atlanmaz.

## Arduino AVR

UNO R3 için A000066, klasik Nano için A000005 ve Mega 2560 Rev3 için A000067 resmî tam pin şemaları kullanılır. UNO/Mega bağlantı tabloları da yeniden okunur. Ana işlemcinin ICSP başlığı dahildir; USB köprüsünün programlama başlığı kapsam dışıdır. Başlık sırası ve ICSP yönü görsel gözlemlerde kayıtlıdır. UNO 38 kontak/20 bağımsız GPIO, Nano 36 kontak/20 GPIO ve 8 ADC, Mega 92 kontak/70 GPIO içerir.

ArduinoCore-avr `11b9130371e8447920edb65a75706a6c951e51fc` revizyonunun `standard`, `mega` ve `eightanaloginputs` dosyaları commit ve hash ile kilitlidir. GPIO port/bit dizileri, zamanlayıcı dizileri, analog takma adları ve SPI/Wire sabitleri yeniden ayrıştırılır. UART ve donanım INT adları tam pin şemasından okunur. Nano A6/A7 yalnızca analog giriş kabul edilir; mevcut Nano veri sayfasındaki numaralandırma/GPIO etiket hataları kullanılmaz. Mega D0/D1’in PWM işaretleri çekirdekle çelişir; PWM yalnızca D2–D13 ve D44–D46’da sunulur. UNO tablosundaki A4/SD4, A5/SD5 hataları SDA/A4 ve SCL/A5 olarak çözülür.

Arayüzde GPIO sayısı bağımsız hatları, fiziksel pin sayısı tekrarlanan kontaklar dahil bağlantıları sayar. SDA/SCL ve ICSP tekrarları belirtilir; planlama ve içe aktarma aynı GPIO hattını iki kez kullanmayı reddeder. Ayrıntılı kaynak sayfaları ve yön bilgisi İngilizce kayıtta bulunur.
