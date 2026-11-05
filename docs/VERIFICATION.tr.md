# Pin verilerinin doğrulanması

[English](VERIFICATION.md) · [Türkçe](VERIFICATION.tr.md)

**4 Kasım 2026** tarihli inceleme, kırk bir kart, başlık ve çip profilindeki **2.080 fiziksel pin kaydını ve 6.619 alternatif işlev atamasını** kapsar. Ortak bağlantılar profil başına sayılır. Sayımda uygulamanın soyut `GPIO` seçeneği ve numarasız QFN merkez GND pedi yoktur. Aynı sinyalin farklı pinlerde bulunması ayrı bir atamadır.

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

### Raspberry Pi 5 / J8

- Fiziksel 40 pin: [resmî GPIO dokümantasyonundaki](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc) standart 40-pin başlık tablosu.
- Alternatif işlevler: GPIO0–27 için ALT0–ALT8 (a0–a8) seçicileriyle [Raspberry Pi RP1 Peripherals, §3.1.1, Tablo 4, PDF s. 16–17](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf#page=16).
- 27 ve 28 numaralı pinler HAT kimlik EEPROM hattı için ayrılmıştır.
- RP1 G/Ç denetleyicisinin sunduğu UART, SPI, I2C, I2S, PWM, PIO, DPI, SDIO ve PCM ses seçenekleri BCM2711'den bağımsız olarak doğrulanır.

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

1. [Kaynak listesi](../sources/manifest.json) her kaynağın sürümünü, değişmez belge adresini veya commit’ini ve SHA-256 değerini kaydeder. Blue Pill için kullanılan üç topluluk referansı da bu listededir.
2. `scripts/verify-official-sources.py` kaynakları indirip hash doğrular. PDF tablo hücrelerini yeniden okur; satır sarımlarını yalnızca boşluk düzeyinde normalleştirir.
   CI, ST CDN zaman aşımlarından etkilenmemek için `--table-snapshots` ile `sources/extracted/` içindeki ST tablo kayıtlarını kullanır. Her kaydın hash’i ve özgün PDF hash’i kilitlidir. Aynı ayrıştırıcı her iki girdiden STM32 verisini yeniden üretir ve kalan kaynaklar her iki modda da doğrulanır. Varsayılan komut özgün ST PDF’lerini yeniden okur.
3. Fiziksel pin numarası, pin adı, pin türü, alternatif işlev, üretici sinyal adı ve F/ALT seçicisi uygulamadaki kayıtla eşleşmelidir.
4. Şekillerden alınan gözlemler ayrı işaretlenir. Bir sonraki doğrulamada aynı görsel gözlemlerin kullanılması **yeni ve bağımsız bir insan incelemesi sayılmaz**. Hash değişirse kaynak yeniden incelenmeden kabul edilmez.
5. Oluşturulan bütün pin/işlev satırları [`sources/pin-verification.csv`](../sources/pin-verification.csv) içindedir. [`public/data/evidence.json`](../public/data/evidence.json) referans kimliklerini belge, sayfa ve tablolarla eşler. [`public/data/verification.json`](../public/data/verification.json) toplam kayıt sayılarını ve kaynak özetini içerir.
6. GitHub Actions, aynı kaynak karşılaştırmasını yayından önce çalıştırır. Yalnızca uygulama JSON’unu kontrol eden bir tutarlılık testiyle yetinmez.

PDF’lerin kopyaları, üretici çizimleri veya belge metinleri uygulama varlığı olarak dağıtılmaz. Çizimler uygulama için yazılmış SVG şemalarıdır. Belge konumları kanıt bağlantılarıdır; yazılım/font lisans bildirimi değildir.

## Eklenen kart aileleri

Pico, Pico W ve Pico 2’nin fiziksel pinleri, her modelin veri sayfasının PDF 5. sayfasındaki Şekil 2 üzerinden ayrı ayrı incelendi. Gözlemler `sources/manual-observations.json` içindedir. Pico / Pico W alternatif işlevleri RP2040 §1.4.3, Tablo 2 (PDF 13–14) üzerinden yeniden çıkarılır; RP2350 işlevleri kopyalanmaz. Pico 2, RP2350A tablosunu kullanır. Özel besleme ve RUN pinleri her veri sayfasının §2.1 metniyle de karşılaştırılır.

Ortak Raspberry Pi 40-pin profili, üreticinin GPIO tablosunu kullanır: B+ ve sonrası, Zero ailesi ve klavyeli modellerin fiziksel düzenini kapsar. Klavyeli modellerde yön ters olabilir; bazı Zero başlıkları lehimli değildir. Eski 26-pin kartlar ve Compute Module dahil değildir. Bu profil işlemciye özgü alternatif işlev içermez; BCM2711 için Pi 4 profili ayrı tutulur.

Ayrıntılı model kaynakları [İngilizce doğrulama kaydında](VERIFICATION.md) bulunur.

## Ortak düzen kütüphanesi

Kütüphane kaynak profillerini fiziksel düzene göre gruplar. UNO biçimindeki kartların 32 ana kontağı, Nano ailesinin 30 yan kontağı ve ESP32/S3 bellek varyantlarının ortak başlıkları tek kayıtta gruplanır. İsteğe bağlı bağlantılar ve işlemci işlevleri seçilen referansa aittir. Gruplama fiziksel konumları karşılaştırır ve BOOT/NC ile analog giriş/GPIO farklarını korur. Eski bağlantılar ve planlar özgün işlemci referansına açılır.

## NVIDIA Jetson Orin Nano · J12

NVIDIA P3768 taşıyıcı kartının J12 başlığı, **SP-11324-001_v1.3 (Aralık 2024)** belgesinden çıkarılır; 260-pin modül veya üçüncü taraf taşıyıcılar kapsamda değildir. Şekil 3-1 (PDF s. 25) üzerindeki 40 bağlantı, Tablo 3-3 (PDF s. 26–27) satırlarıyla karşılaştırılır. I²S, PWM ve saat işlevleri yalnızca tabloda belirtilen pinlere eklenir. GPIO12’nin SoC adındaki PWM ifadesinden yeni bir başlık işlevi türetilmez.

Tablodaki 16/18 numaralı `SPI1_CSI1*` / `SPI1_CSI0*` yazımları; Şekil 3-1 ve aynı satırların CS1_N/CS0_N SoC adlarıyla karşılaştırılarak `SPI1_CS1*` / `SPI1_CS0*` olarak gösterilir. İşlev adları taşıyıcı kart sinyalleridir; Linux veri yolu/gpiochip numaraları değildir. İşlevin kullanımı pinmux/Jetson-IO ve hedef yazılım sürümüne bağlıdır.

Elektriksel notlar tablonun dipnotlarından gelir: 3.3 V sinyaller; açık drenajlı I²C hatlarında ±2 mA, 3/5 pinlerinde 2.2 kΩ ve 27/28 pinlerinde 1.5 kΩ pull-up; diğer hatlarda zayıf TXB0108 sürüşü (±20 µA), harici pull dirençleri için 50 kΩ üzeri. Jetson 27/28 pinlerine Raspberry Pi HAT EEPROM kısıtlaması uygulanmaz. Üretici PDF’si dağıtılmaz; SHA-256 kilidiyle doğrulama için indirilir.

## STM32F103 paketleri ve Blue Pill

LQFP‑48, LQFP‑64 ve LQFP‑100 pinleri, işlevleri ve FT bilgileri ST DS5319 Rev 20, Tablo 5’ten (PDF s. 28–33) alınır. Fiziksel düzenler Şekil 6–8’de gösterilir. Tablo 5’in 7. dipnotuna göre LQFP‑48 ve LQFP‑64’te `PD01_REMAP`, PD0 ve PD1’i OSC_IN ve OSC_OUT pinlerine yönlendirir. LQFP‑100’de 12 ve 13 numaralı pinler HSE osilatörüne ayrılmıştır. PD0 ve PD1, 81 ve 82 numaralı pinlerdedir. AFIO remap koşulları RM0008 Rev 21, §9.3 tablolarından alınır ve ilgili paketteki pinlerle eşleştirilir. Örneğin LQFP‑100’de PE7–PE15 üzerindeki TIM1 işlevleri için Tablo 46’daki `TIM1_REMAP=11` gerekir.

Blue Pill’in tek üreticisi yoktur. 44 bağlantı (H1:20, H2:20, SWD:4) STM32-base topluluk tablosundan alınır; referans şema ve üstten fotoğraf incelendi. Bu üç kaynak ST üretici belgesi olarak sunulmaz. USB üstteyken H2 solda, H1 sağda; her iki başlıkta 20 USB ucunda, 1 SWD ucundadır. SWD soldan sağa GND, PA14, PA13, 3V3’tür. H1/H2/SWD konumları çip pinlerinden ayrıdır; MCU pin eşlemesi ayrıca gösterilir.

Şemadaki RESET/NRST etiket tutarsızlığı belgelendi; reset başlığı için topluluk bağlantı tablosu ve R yazısı kullanılır. PB2 boot jumperında, PD0/PD1 kristal devresindedir; yan başlıklarda gösterilmez. LED, LSE, USB ve debug paylaşımı pin notlarında belirtilir. Klon MCU ve kartlar için koşulsuz uyumluluk iddiası yoktur.

ST belgeleri önce resmî `www.st.com.cn`, ardından `www.st.com` adresinden indirilir. İki adresten gelen dosyalar aynı kilitli SHA-256 değerleriyle karşılaştırıldı. İndirme hatasında kaynak hash veya pin doğrulaması atlanmaz.

## NUCLEO-F103RB / F401RE / F411RE · MB1136

Arduino ve ST Morpho kontakları, SHA-256 ile kilitlenen ST UM1724 Rev 14 belgesinin 12 ve 27 numaralı tablolarından alınır. MCU pinleri ve işlevleri STM32F103RB LQFP64 profilinden gelir. Haritada A4/A5 için analog yönlendirme gösterilir. Alternatif I²C bağlantısı ile saat, seri port ve LED köprüleri Tablo 10’a göre açıklanır. Kart çizimi Şekil 14, 18 ve 19’daki konnektör yerleşimi ve sıra numaralarını izler. NUCLEO-F103RB’de bir kontak seçildiğinde ayrı STM32F103RBT6 LQFP-64 çizimindeki karşılık gelen bacak vurgulanır. F401RE ve F411RE konnektörleri için Tablo 16 ve 29, paket pinleri ve AF seçicileri için kilitli STM32CubeMX verisi kullanılır.

## Kart ve MCU paketi eşlemesi

Arduino A000066, ATmega328P PDIP-28 ile, Nano A000005, ATmega328P QFN/MLF-32 ile, Mega A000067 ise ATmega2560 TQFP-100 ile eşleşir. Pico ve Pico W için RP2040 Şekil 3, Pico 2 ve Pico 2 W için RP2350A paket haritası GPIO ve RUN kontaklarını belirler. Blue Pill mevcut STM32F103C8T6 paket numaralarını kullanır. Nucleo F401RE ve F411RE kendi CubeMX LQFP-64 paketlerine bağlanır. Tek bir bacağı olmayan ortak besleme ve toprak hatları kart etiketiyle gösterilir.

## Arduino AVR

UNO R3 için A000066, klasik Nano için A000005 ve Mega 2560 Rev3 için A000067 resmî tam pin şemaları kullanılır. UNO/Mega bağlantı tabloları da yeniden okunur. Ana işlemcinin ICSP başlığı dahildir; USB köprüsünün programlama başlığı kapsam dışıdır. Başlık sırası ve ICSP yönü görsel gözlemlerde kayıtlıdır. UNO 38 kontak/20 bağımsız GPIO, Nano 36 kontak/20 GPIO ve 8 ADC, Mega 92 kontak/70 GPIO içerir.

ArduinoCore-avr `11b9130371e8447920edb65a75706a6c951e51fc` revizyonunun `standard`, `mega` ve `eightanaloginputs` dosyaları commit ve hash ile kilitlidir. GPIO port/bit dizileri, zamanlayıcı dizileri, analog takma adları ve SPI/Wire sabitleri yeniden ayrıştırılır. UART ve donanım INT adları tam pin şemasından okunur. Nano A6/A7 yalnızca analog giriş kabul edilir; mevcut Nano veri sayfasındaki numaralandırma/GPIO etiket hataları kullanılmaz. Mega D0/D1’in PWM işaretleri çekirdekle çelişir; PWM yalnızca D2–D13 ve D44–D46’da sunulur. UNO tablosundaki A4/SD4, A5/SD5 hataları SDA/A4 ve SCL/A5 olarak çözülür.

Arayüzde GPIO sayısı bağımsız hatları, fiziksel pin sayısı tekrarlanan kontaklar dahil bağlantıları sayar. SDA/SCL ve ICSP tekrarları belirtilir; planlama ve içe aktarma aynı GPIO hattını iki kez kullanmayı reddeder. Ayrıntılı kaynak sayfaları ve yön bilgisi İngilizce kayıtta bulunur.

## Yeni referanslar ve paketler

Leonardo/Micro ATmega32U4 eşlemeleri resmî tam pin şemaları ve aynı revizyona kilitli Arduino AVR çekirdeğinden yeniden çıkarılır. Leonardo’da I²C D2/D3, SPI ise ICSP D14–D16 üzerindedir. Micro’nun ek SPI yan kontakları nedeniyle ayrı fiziksel düzeni vardır. USB Serial ve donanım Serial1 farklı bağlantılardır.

Nano Every için ArduinoCore-megaavr `e8edb4ef2e8ab5c98544c3884a653f0b9c1318dc` kullanılır. A6/A7 dijital I/O da destekler; A4/A5 iki MCU portuna bağlıdır. Beş Arduino PWM pini klasik Nano’dan farklıdır. Yalnızca 30 yan kontak dahil edilir.

UNO R4 Minima/WiFi için ArduinoCore-renesas `424e86eff92d37f72123c2b641dd8bbf06a38b47` port dizileri, PWM başlangıçları ve çevre birimi sabitleri okunur. İlk güç başlığı kontağı BOOT’tur; A0 DAC destekler. CAN Minima’da D4/D5, WiFi’da D10/D13’tedir. Ana 5 V başlıklar ve altı SPI kontağı kapsam dahilindedir; SWD, ESP32-S3/Qwiic, matris ve ek güç bağlantıları dahil değildir.

Espressif kılavuz ve görselleri `esp-dev-kits` commit `5c06bf1835329d6525f316475f7218aab6acfe79` ile kilitlidir. RST başlık tabloları yeniden ayrıştırılır. USB alttadır. DevKitC V4 WROOM/WROVER, C3 DevKitM-1 ve S3 DevKitC-1 v1.1 N8/N8R8 tam modelleri belirtilir. Flash/PSRAM kontakları plana kapalıdır; girişe özel pinlerde çıkış/PWM seçenekleri sunulmaz. GPIO matrix seçenekleri yazılımın varsayılan pin ataması değildir. S3 v1.1 RGB GPIO38’dedir; S3 GPIO46 giriş/çıkış destekler. ADC2, Wi-Fi, USB, strapping ve LED paylaşımları ayrıca açıklanır.

ATmega328P’nin PDIP-28, TQFP-32, QFN/MLF-28 ve QFN/MLF-32 paketleri Atmel 42735B Tablo 6-1’den çıkarılıp Şekil 5-1–5-4 ile karşılaştırılır. PDIP PC0 pin 23’tür; tablonun 13 yazan hatası şekille çözülür. ADC6/7 yalnızca 32-pin paketlerde vardır. PC6 reset sigortasına, PB6/PB7 saat ayarına bağlıdır. QFN merkez GND pedi çevre pin sayısına dahil edilmez.

ATmega2560 TQFP-100 için DS40002211A Şekil 1-1’deki 100 bacak ve 86 GPIO kullanılır. PDF s. 75–94 port tabloları yeniden okunur. 64-pin parçalara özgü PDI/PDO işlevleri PE0/PE1’e kopyalanmaz; CLK0 yazımı CLKO olarak şekil ve açıklamayla çözülür. JTAG/ADC ve osilatör koşulları korunur. Bu numaralar Mega D0–D69 veya CBGA topları değildir. Ayrıntılı belge sayfaları İngilizce kayıtta bulunur.

## Seeed Studio XIAO başlıkları

Seeed Studio XIAO düzeni, 14 kontaklı standart lehimlenebilir/castellated XIAO biçimini (yedi sol, yedi sağ pin) paylaşan kompakt kartları gruplar.

- **Seeed Studio XIAO RP2040:** Resmî Seeed Studio şeması v1.3 (Haziran 2022) üzerinden doğrulandı. Sol 1–7 pinleri D0–D6 (4 ADC kanallı RP2040 GPIO26–29, GPIO6, GPIO7, GPIO0); sağ pinler 5V, GND, 3V3 ve D10–D7 (RP2040 GPIO3, GPIO4, GPIO2, GPIO1) bağlantılarına karşılık gelir. RP2040 QFN-56 paket görünümüne doğrudan çift yönlü bağlanır.
- **Seeed Studio XIAO ESP32C3:** Resmî Seeed Studio şeması v1.3 (Ocak 2026) ve pinout tablosu üzerinden doğrulandı. Sol 1–7 pinleri D0–D6 (ESP32-C3 GPIO2–7 ve GPIO21); sağ pinler 5V, GND, 3V3 ve D10–D7 (ESP32-C3 GPIO10, GPIO9, GPIO8, GPIO20) olarak eşlenir. Başlatma/strapping pinleri (GPIO2, GPIO8, GPIO9), ADC1/ADC2 uyarıları ve GPIO matrisi yönlendirmeleri Espressif belgeleriyle doğrulanmıştır.

## Genişletilmiş Nucleo-64 referansları

Ortak Nucleo-64 kaydı yalnızca konektör konumlarını gruplar. Her modelin MCU paketi, GPIO seçicileri, güç bağlantıları ve kayıtlı planları ayrıdır. Yeni STM32 paketleri üreticinin `STM32_open_pin_data` paket XML dosyası ve bu dosyada belirtilen GPIO Modes XML kaynağından alınır. İkisi de tam commit ve SHA-256 ile kilitlenir; GPIO bağımlılığının dosya adı önbellek kullanılırken de denetlenir.

- **NUCLEO-F446RE / STM32F446RET6:** UM1724 Rev 14 Tablo 19 (s. 47–48) ve Tablo 29 (s. 58); LQFP-64, 50 GPIO bacağı, Cortex-M4, en fazla 180 MHz. AF seçicileri F446 GPIO Modes kaynağından alınır.

UM1724 ham tablo hücreleri `sources/extracted/nucleo-um1724-r14.json` içinde hash ile kilitlidir. CI aynı ayrıştırıcıyı bu hücrelere uygular; PDF önbelleği veya erişilebilir bir PDF sunucusu gerektirmez. Bağımsız karşılaştırma için özgün PDF yolu korunur.

- **NUCLEO-F303RE / STM32F303RET6:** UM1724 Tablo 14 (s. 41–42) ve Tablo 26 (s. 55); Cortex-M4, 72 MHz, LQFP-64 ve 51 GPIO bacağı. Tablo 14, D0 satırını atlar: CN9.1 ortak MB1136 konumundan, D0 → PA3 eşlemesi sabit sürümlü resmî STM32duino F303RE varyantından doğrulanır. Ek kaynak ilgili temas noktasına bağlanır.

- **NUCLEO-L476RG / STM32L476RGT6:** UM1724 Rev 14 tabloları 23 (pp. 52–53) / 32 (p. 61); Cortex-M4, 80 MHz, LQFP-64 ve 51 GPIO bacağı. Paket pinleri ve AF seçicileri sabit sürümlü üretici XML dosyalarından bağımsız olarak çıkarılır.

- **NUCLEO-F072RB / STM32F072RBT6:** UM1724 Rev 14 tabloları 11 (pp. 37–38) / 26 (p. 55); Cortex-M0, 48 MHz, LQFP-64 ve 51 GPIO bacağı. Paket pinleri ve AF seçicileri sabit sürümlü üretici XML dosyalarından bağımsız olarak çıkarılır.

- **NUCLEO-L053R8 / STM32L053R8T6:** UM1724 Rev 14 tabloları 17 (p. 45) / 30 (p. 59); Cortex-M0+, 32 MHz, LQFP-64 ve 51 GPIO bacağı. Paket pinleri ve AF seçicileri sabit sürümlü üretici XML dosyalarından bağımsız olarak çıkarılır.

- **NUCLEO-L152RE / STM32L152RET6:** UM1724 Rev 14 tabloları 21 (pp. 50–51) / 30 (p. 59); Cortex-M3, 32 MHz, LQFP-64 ve 51 GPIO bacağı. Paket pinleri ve AF seçicileri sabit sürümlü üretici XML dosyalarından bağımsız olarak çıkarılır.

- **STM32F407VGT6:** ayrı LQFP-100 paket görünümü, 82 GPIO bacağı ve en fazla 168 MHz Cortex-M4. Paket XML dosyası üreticinin ortak `STM32F417_gpio_v1_0` GPIO tablosunu belirtir; ayrıştırıcı yalnızca bu işlemci/paket XML kaynağında bulunan sinyalleri kullanır. Bu bağımsız MCU görünümüne Nucleo konektör numaraları atanmaz.
