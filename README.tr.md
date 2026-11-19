# Pin Atlas

Yeni profil eklemek için [kart ve MCU doğrulama adımlarını](docs/ADDING-BOARDS.md) izleyin.

[English](README.md) · [Türkçe](README.tr.md)

[Canlı site](https://zaryob.github.io/pin-atlas/?lang=tr) · [Doğrulama kaydı](docs/VERIFICATION.tr.md) · [Pin bazında karşılaştırma](sources/pin-verification.csv)

Üretici belgelerinden ve kimliği belirlenmiş kart referanslarından derlenen, İngilizce ve Türkçe bir pin rehberi. Fiziksel pin konumlarını, alternatif işlevleri ve bağlantı planlarını aynı çalışma alanında gösterir. Arayüz, şematik çizimler ve uygulama kodu bu proje için hazırlanmıştır. Konsol teması kişisel sitemle ortaktır.

Katalogda 99 kart, başlık ve yonga profili var. 169 hash kilitli kaynak, 6.546 fiziksel pin kaydını ve 30.045 işlev atamasını kapsıyor. Katalog genelindeki doğrulama tarihi 5 Kasım 2026. Sonradan eklenen veya yeniden denetlenen profiller kendi doğrulama tarihlerini taşır.

## Pin düzenleri

Katalog belgelenmiş her donanım modelini **Geliştirme kartları**, **MCU paketleri** veya **Ortak başlıklar** altında ayrı listeler, ardından modelleri platforma/üreticiye göre gruplar. Tür ve platform filtreleri model, işlemci, seri ve paket aramasıyla birlikte çalışır. Ortak geometri içeride yeniden kullanılır; örneğin NUCLEO-L432KC seçimi genel bir Nucleo-32 girdisini değil, bu modeli ve kendi işlevlerini açar. Yalnızca fiziksel uyumluluğu bilinen adlar, yeni bir MCU işlev haritası iddia etmeden, etiketli bir referansa gider.

Altyapıdaki pin düzenleri:

- **Raspberry Pi Pico ailesi:** Pico, Pico W, Pico 2 ve Pico 2 W, 26 GPIO'lu tek bir 40 pinlik düzeni paylaşır. Bu düzen içinde Pico / Pico W için RP2040, Pico 2 / Pico 2 W için RP2350A işlev referansını seçin.
- **Raspberry Pi 40 pinlik GPIO:** B+, A+, Pi 2/3/4/5, Zero modelleri ve 400/500 tek başlık kaydını paylaşır. Aynı görünümde ortak GPIO/güç/toprak bağlantılarını, Pi 4 için doğrulanmış BCM2711 alternatif işlevlerini veya Pi 5 için doğrulanmış RP1 alternatif işlevlerini seçin. Eski 26 pinlik kartlar ve Compute Module'ler dahil değildir; bazı Zero başlıkları lehimli değildir ve klavyeli modellerde başlık döndürülmüştür.
- **NVIDIA Jetson Orin Nano:** NVIDIA P3768 geliştirme kiti taşıyıcı kartının 40 pinlik J12 başlığı; SPI, I²C, UART, I²S, PWM ve saat yetenekleri taşıyıcı kart belgesinden alınır. Raspberry Pi'den ayrı bir pin haritasıdır; başlık sinyal adları ve pinmux gereksinimleri farklıdır.
- **STM32 Blue Pill:** STM32-base topluluk referansı; iki 20 pinlik yan başlık ve dört SWD bağlantısı. H1/H2/SWD konumları MCU paket pinlerinden ayrıdır; çizim MCU pin eşlemesini ve ortak LED, kristal, USB ve hata ayıklama bağlantılarını içerir. Klon kartların bağlantılarını ve yonga üzerindeki yazıları kontrol edin.
- **STM32F103 paketleri:** ayrı LQFP-48 (37 GPIO'lu STM32F103C8T6 / STM32F103CBT6), LQFP-64 (51 GPIO'lu STM32F103RBT6 / STM32F103R8T6) ve LQFP-100 (80 GPIO'lu STM32F103VBT6 / STM32F103V8T6) görünümleri; ham MCU işlevleri ve RM0008'deki eksiksiz AFIO remap koşullarıyla.
- **STM32 Nucleo-32 ailesi:** F042K6 ve L432KC, 30 MB1180 CN3/CN4 temasını paylaşır; ayrı LQFP-32 / UFQFPN-32 MCU referansları ve I²C, VCP ve osilatör köprüsü notları vardır.
- **STM32 Nucleo-64 ailesi:** on model tek bir 108 temaslı Arduino/ST Morpho kaydını paylaşır: NUCLEO-F103RB, F401RE, F411RE, F446RE, F303RE, L476RG, F072RB, L053R8 ve L152RE (MB1136, ST UM1724 Rev 17) ile NUCLEO-G474RE (MB1367, ST UM2505 Rev 7). MCU işlevlerini, paket bağlantılarını ve lehim köprüsü notlarını korumak için tam modeli seçin. G474RE'de D0/D1, UM2505'in varsayılanını izler (PC5/PC4 üzerinde USART1).
- **STM32 Nucleo-144 ailesi:** F767ZI, H743ZI2 ve H723ZG, CN7–CN12 üzerindeki doğrulanmış 240 fiziksel ST Zio/Morpho konumunu paylaşır. Model referansları kendi MCU'sunu, güç hatlarını ve devre kısıtlarını korur; düzeltilmiş H723 eşlemesi mevcut atama kimliklerini korur.
- **WeAct Black Pill v3.x:** F401CC ve F411CE, dört SWD teması dahil 44 temaslı tek bir kaydı paylaşır. Elektriksel adlar ve konumlar üreticinin sabitlenmiş KiCad sembolünden ve ayak izinden ayrıştırılır; paket referansları, USB, boot, düğme, LED ve isteğe bağlı flash notları açıkça korunur.
- **Nucleo-64 kaynakları:** her model kendi STM32 paketine bağlıdır. Konektör tabloları UM1724 Rev 17'den (Eylül 2025, resmî st.com adresi) veya UM2505 Rev 7'den (Mayıs 2026), paket bacakları ve seçiciler sabitlenmiş ST XML'inden gelir. CI, kılavuz PDF'lerini indirmeden kaydedilmiş UM1724/UM2505 tablo hücrelerini denetler.
- **STM32 paket görünümleri:** STM32F401RET6, F411RET6, G474RET6, F446RET6, F303RET6, L476RGT6, F072RBT6, L053R8T6 ve L152RET6 (LQFP-64), STM32H723ZGT6 (LQFP-144), ayrıca bağımsız STM32F405RGT6 (LQFP-64) ve STM32F407VGT6 (LQFP-100). Paket bacak numaraları ve GPIO alternatif işlev seçicileri ST'nin sabitlenmiş XML kaynaklarından alınır.
- **Ek STM32 paketleri:** F042K6T6 (LQFP-32), L432KCU6 (UFQFPN-32), F767ZIT6 / H743ZIT6 (LQFP-144) ve F401CCU6 / F411CEU6 (UFQFPN-48); her biri tam kart referansına bağlıdır. UFQFPN çizimleri kaynak XML'in numaraladığı çevre bacaklarını kapsar.
- **Arduino UNO biçimli başlıklar:** UNO R3, Leonardo, UNO R4 Minima ve UNO R4 WiFi tek kayıtta 32 ana başlık konumunu paylaşır. Doğru I²C, SPI, ADC, PWM, DAC ve CAN sinyalleri için MCU referansını seçin. Her referans altı temaslı ana MCU SPI/ICSP konektörünü içerir; R4'te NC yerine BOOT vardır.
- **Arduino Nano başlıkları:** klasik Nano, Nano Every, Nano 33 BLE Sense Rev2 ve Nano ESP32 tek kayıtta 30 yan temas paylaşır. Klasik Nano altı ICSP teması ekler ve A6/A7 yalnızca analogdur; Every'de A6/A7 dijital olarak da kullanılabilir, PWM desteği farklıdır ve bu haritada ICSP yoktur. Nano 33 BLE Sense Rev2 (nRF52840, 22 GPIO) ve Nano ESP32 (u-blox NORA-W106 modülünde ESP32-S3, 24 GPIO) 3,3 V G/Ç kullanır ve 5 V toleranslı değildir. Nano ESP32'de B0, B1 ve A2, ESP32-S3 strapping pinleridir.
- **Arduino Mega 2560 Rev3:** uç başlık ve ana MCU ICSP dahil 92 başlık teması, 70 bağımsız GPIO, 16 analog giriş ve 15 PWM çıkışı. SPI, D50–D53'ü kullanır.
- **Arduino Micro:** kendine özgü 34 temaslı yan ayak izi ve altı ICSP teması. ATmega32U4, 24 bağımsız GPIO sunar; SPI ve 12 ADC kanalı kendi çekirdek eşlemesini izler.
- **Seeed Studio XIAO başlıkları:** 14 temaslı XIAO ayak izini XIAO RP2040 (RP2040 QFN-56 paketine bağlı), XIAO ESP32C3 (RISC-V, Wi-Fi/BLE) ve XIAO SAMD21 (ATSAMD21G18A) paylaşır. Harita, D0–D10'un her işlemcide hangi GPIO'lara ve çevre birimlerine gittiğini gösterir. XIAO SAMD21 zamanlayıcı adları Microchip veri sayfasından alınır (TCC0/TCC1/TC4).
- **BBC micro:bit V2:** P3 ucundan başlayarak fiziksel sırasıyla 25 ön kenar konektörü şeridi. Büyük halkalar 0, 1, 2, 3V ve GND'dir; 3V ve GND halkalarının her biri iki şerit arasındadır. nRF52833 GPIO'larını, dokunmatik algılamayı, analog girişleri ve paylaşılan devreleri (LED matrisi, A/B düğmeleri, I²C) kapsar; kenar konektörünün akım bütçesi için bir uyarı içerir. Yeniden sıralamadan önce kaydedilmiş planların pin kimlikleri değişmemiştir.
- **ESP32-DevKitC V4:** WROOM-32E ve WROVER bellek referanslarıyla 38 temaslı tek kayıt. Flash ve modüle özgü PSRAM pinleri planlara alınmaz; GPIO34/35/36/39 yalnızca giriştir.
- **ESP32-C3-DevKitM-1:** MINI-1/1U için resmî 30 temaslı ayak izi, USB ve RGB LED paylaşımı dahil 15 açık GPIO.
- **ESP32-S3-DevKitC-1 v1.1:** WROOM-1-N8 ve N8R8 referanslarıyla 44 temaslı tek kayıt. Octal PSRAM GPIO35–37'yi ayırır; v1.1 RGB LED GPIO38'i kullanır. Diğer kart revizyonları ve modül bellek gerilimleri ayrıca doğrulanmalıdır.
- **ESP32-C6-DevKitC-1 v1.2:** ESP32-C6-WROOM-1 modülü ve 23 GPIO ile 32 temas. GPIO4/5/8/9/15 strapping pinleridir; GPIO8 RGB LED ile paylaşılır, GPIO12/13 USB Serial/JTAG'i, GPIO16/17 USB-UART köprüsünü taşır.
- **Adafruit Feather RP2040:** RP2040 QFN-56 paketine bağlı, 21 GPIO'lu 28 başlık teması. Sağ başlık, Adafruit pin şemasında basıldığı gibi USB ucundan sıralanır (VBAT … SDA); 3. pin AREF değil, ikinci 3,3 V çıkışıdır.
- **PJRC Teensy 4.1:** 67 temas: 48 kenar pini, 5 pinlik USB Host başlığı, 6 pinlik Ethernet başlığı ve microSD yuvası pedleri. 48 GPIO'su vardır (0–47); alttaki 48–54 bellek pedleri haritalanmamıştır. i.MX RT1062 G/Ç'si 3,3 V'tur ve 5 V toleranslı değildir.
- **BeagleBone Black:** iki 46 pinlik P8/P9 başlığı (92 temas); GPIO olarak kullanılabilen 67 adet 3,3 V temas ve 7 analog giriş (en fazla 1,8 V). P8.3–6 ve P8.20–25 (eMMC) ile P8.27–46 (HDMI) varsayılan olarak kart üstü aygıtlarca kullanılır. P9.41/P9.42'nin her biri iki AM3358 topuna bağlıdır. Kart için bir güç sıralaması uyarısı vardır.
- **RP2040:** QFN-56, 30 GPIO; Pico/Pico W, XIAO RP2040 ve Feather RP2040'ın kullandığı paket görünümü.
- **ATmega328P paketleri:** ayrı PDIP-28, TQFP-32, QFN/MLF-28 ve QFN/MLF-32 görünümleri. Paket pinleri ve ham MCU işlevleri Arduino numaralandırmasından bağımsızdır. Reset/saat sigortaları GPIO olarak kullanılabilen 23 pini koşullandırır; ADC6/ADC7 yalnızca 32 pinlik paketlerde vardır.
- **ATmega2560 ve ATmega2561 paketleri:** ham MCU işlevleriyle ayrı TQFP-100 (86 GPIO'lu ATmega2560 / ATmega1280) ve TQFP-64 (54 GPIO'lu ATmega2561 / ATmega1281) görünümleri; Mega kartının başlıkları paket numaralandırmasından farklıdır.
- **RP2350A:** QFN-60, 30 Bank 0 GPIO.
- **RP2350B:** QFN-80, 48 Bank 0 GPIO.
- **Seeed Studio XIAO ESP32C6 ve XIAO RP2350.** İkisi de XIAO yan başlık düzenini paylaşır. RP2350, arka yüzdeki sekiz D11–D18 pedini gösterir ve RP2350A paketine bağlanır.
- **Arduino Nano R4 (ABX00142).** Harita 5 V yan başlıkları, 3,3 V Qwiic konektörünü ve VBATT temasını kapsar. Arduino çekirdeği, takılı RA4M1 portlarını ve çevre birimi yollarını tanımlar.
- **LOLIN D1 mini v4.0.0 ve Ai-Thinker ESP32-CAM Rev 1.6.** D1 mini, J2/J3, P1 ve A0 gerilim bölücüsünü gösterir. ESP32-CAM, yan başlıklar, kamera konektörü ve microSD temaslarının paylaştığı hatları işaretler.
- **Adafruit Feather RP2350 with HSTX.** Harita 22 temaslı HSTX konektörünü ve STEMMA QT’yi kapsar. 8 MB PSRAM’li varyant GPIO8’i belleğe ayırır.
- **NUCLEO-H563ZI ve STM32H563ZIT6.** MB1404-C01 haritası 240 Zio/Morpho temasını LQFP-144 pakete bağlar. A4/A5 ayarı belgelenmiş analog veya I²C yolunu seçer.
- **Texas Instruments MSPM0G3507SPT.** LQFP-48 haritasında 44 GPIO, 314 kaynaklı işlev ataması ve TI PINCM.PF değerleri bulunur.

Pico çizimi ortak başlığı gösterir; kablosuz bağlantının, LED'in veya kart içi kablolamanın aynı olduğunu iddia etmez. İşlemci referansları fiziksel pin konumlarını değil, alternatif işlevleri değiştirir. Planlar referans başına kaydedilir; eski model bağlantıları, dışa aktarılmış JSON dosyaları ve kayıtlı planlar desteklenmeye devam eder. Aynı işlemci için birden çok eski model planı varsa birleştirilmeden Uyumlu kartlar bölümünde ayrı ayrı erişilebilir kalır.

Doğrulanmış MCU paket bağlantısı olan kartlarda bir temas veya paket pini iki çizimden de seçilebilir. Paket görünümü eşleşen kart temaslarını da açar. Birden çok konektörlü kart çizimleri tek bir başlığa yakınlaşabilir.

[Doğrulama özeti](public/data/verification.json) veri kümesinin toplamlarını ve kaynak profillerini listeler. RP2040 ve RP2350 paketlerinin merkez GND pedi çevre pin sayısının dışındadır. Şematik çizimler pin konumlarını gösterir; mekanik CAD yerleşimi değildir.

## Kullanım

**Kart yapılandırması**, desteklenen STM32 referanslarında kaynağa dayanan lehim köprülerini, hata ayıklama bağlantısını, saatleri ve takılı bileşenleri belirtir. Nucleo-32 SB16/SB18, A5/A4'ün MCU yollarını ve işlevlerini değiştirir, bağlıyken D5/D4'ü ayırır ve özgün analog bacakların yüzer giriş olarak kalmasını gerektirir. MB1364 Nucleo-144 A4/A5 ön ayarları, SB14/SB15 temasları, ST-LINK VCP ve WeAct isteğe bağlı flash kendi kısıtlarına sahiptir. Belirtilmeyen ayarlar etkilenen temasları ihtiyatlı biçimde ayırır. Haritayı, bağlantı seçeneklerini ve çakışma denetimlerini güncellemek için yapılandırmayı uygulayın; mevcut atamalar çakışsalar bile görünür kalır. Bu bildirimler fiziksel kartı veya firmware'i değiştirmez.

**Uyumlu pin öner**, toplam SPI, I²C, UART ve CAN bağlantılarını alır (örneğin bir SPI ve iki UART). CAN önerileri, belgelenmiş tek bir CAN veya FDCAN biriminin TX/RX sinyallerini eşler; veri yolu yine de harici bir alıcı-verici gerektirir. Mevcut işlevler ve etiketler kilitlenir; tamamlanmış bağlantılar istenen toplamlara sayılır. Plana eklemeden önce en çok üç alternatifi veri yolu birimleri, fiziksel temaslar, seçiciler, devre notları ve kaynaklarla karşılaştırın. SPI için doğrulanmış donanımsal CS/NSS yolu istenebilir veya aygıtın chip select bağlantısı elle atanmak üzere bırakılabilir. Arama yapılandırılmış kablolamayı, paylaşılan MCU bacaklarını, ayrılmış belleği ve AFIO koşullarını gözetir. İptal edilebilir bir worker içinde çalışır ve arama sınırına ulaşılmasını imkânsız bir istekten ayrı bildirir. Belgelenmemiş veri yolu birimleri veya elektriksel zamanlama uyumluluğu çıkarsamaz.

Bağlantı planındaki **Çevre birimi ekle**, tek bir çevre birimi biriminin doğrulanmış SPI, I²C, UART/USART veya CAN sinyal rollerini seçer. Mevcut atamaları korur ve seçili pinlerin devre notlarını ve kaynaklarını gösterir. Yinelenen yollar ve uyumsuz STM32 AFIO remap ayarları reddedilir; çakışan eski tarayıcı kayıtları bir uyarıyla görünür kalır.

**Yazdır / PDF kaydet**, tarayıcının yazdırma penceresiyle kaynaklı bir bağlantı tablosu oluşturur. **SVG indir**, tam üstten görünüm pin haritasını, seçili işlevleri, etiketleri, uygulanan kart yapılandırmasını ve kaynak konumlarını içerir; renkler ve çizim çevrimdışı kullanım için dosyaya gömülür.

Ana sayfa yaklaşık 56 KB'lık bir katalog özeti yükler. Pin haritaları ve kanıtları, içerik adresli profil dosyaları, önbellekli gezinme ve seçili modeli ve kayıtlı planları koruyan kalıcı bir yeniden deneme ile gerektiğinde yüklenir.

Pinleri seçin, arayüzleri filtreleyin, arayın, tabloya geçin, çizimi aynalayın veya 180° döndürün, özel etiketler ekleyin ve her kart için bir bağlantı planı kaydedin. Filtresiz bir haritayla başlayın. Pin ayrıntıları eşleşen veya yaygın işlevleri öne alır; geri kalanı için **Daha fazla işlev** bölümünü açın. Kaynaklar açılabilir bölümlerdedir ve bağlantı planının kendi sekmesi vardır. Kart başlıkları ve çıplak MCU paketleri aynı seçim davranışını paylaşır: küçük ekranlarda bir pine dokunmak, kaydetme düğmesi sabit kalan tam genişlikte bir ayrıntı paneli açar; masaüstünde yan panel güncellenir. Panel kapanınca odak seçili pine veya paneli açan düğmeye döner. Haritanın kaydırma konumu, en sol konum dahil, seçim ve filtreleme sırasında korunur; aynalama/döndürme/sıfırlama seçili pini görünür alana getirir. Planları JSON olarak içe ve dışa aktarın veya bir bağlantıyla paylaşın. Filtreler seçili arayüzlerden herhangi biriyle eşleşir. Harita ilk iki eşleşen işlevi, tablo tüm eşleşmeleri gösterir.

Her pin ayrıntısı, fiziksel bağlantıyı ve alternatif işlevleri destekleyen üretici belgesine, PDF sayfasına ve tablo veya şekle bağlanır. `F0`–`F11` RP2350 işlev seçicileridir. RP2040, F1–F9 kullanır. Jetson adları Linux veri yolu numaralarını değil, taşıyıcı kart sinyallerini izler; Jetson işlevlerine F/ALT seçicisi atanmaz. `ALT0`–`ALT5` BCM2711 seçicileridir. ADC kayıtları analog girişleri tanımlar. Uygulamanın `GPIO` seçeneği genel bir giriş/çıkış planlama etiketidir ve üretici seçici numarası taşımaz.

Jetson'da çevre birimi kullanımı uygun bir pinmux / Jetson-IO yapılandırması ve yazılım desteği gerektirir; plan kaydetmek aygıtı yapılandırmaz. NVIDIA 3,3 V sinyal seviyeleri, açık drenajlı I²C ve TXB0108 tamponlu zayıf çıkışlar belgeler. Donanım bağlamadan önce pin başına elektriksel notları kontrol edin.

STM32F1 işlevleri, uydurma AF0–AF15 seçicileri yerine RM0008'deki gerçek AFIO remap alanlarını ve izin verilen değerleri listeler. Remap tüm çevre birimine uygulanır; seçili bütün sinyalleri tutarlı biçimde yapılandırın ve gerektiğinde JTAG pinlerini serbest bırakın. Plan her ortak yazmacı veya kart devresi kısıtını doğrulamaz.

Arduino haritaları resmî tam pin şemalarını, konektör tablolarını ve sabitlenmiş bir Arduino AVR çekirdek revizyonunu kullanır. Listelenen AVR ve Renesas kartlarını kapsar; her MCU referansı kendi yeteneklerini ve isteğe bağlı konektör kapsamını korur. Kart başlığı temasları Arduino dijital pin numaralarından ve MCU portlarından ayrıdır. Tekrarlanan GPIO temasları ortak hatlarını gösterir; plan ve JSON içe aktarıcı aynı GPIO'nun iki kez kullanılmasını reddeder. USB köprüsünün programlama başlıkları ve çıplak MCU'nun eksiksiz alternatif işlev haritası bu kapsamın dışındadır.

ESP GPIO matrix seçenekleri varsayılan firmware pin atamalarını değil, yapılandırılabilir çevre birimi yollarını tanımlar. Seçili referans strapping, yalnızca giriş, USB/LED ve flash/PSRAM kısıtlarını korur. Yalnızca giriş olan bacaklara asla çıkış/PWM yolu sunulmaz; ayrılmış bellek temasları planlara giremez. Espressif kart yönlendirmesinde USB alttadır.

**Uyumlu kartlar**, işlemci/referans ayrıntıları, etkin referans ve kayıtlı plan göstergeleriyle numaralı bir model dizini açar. Bir modeli doğrudan seçin; uzun listeler aranabilir. Yalnızca fiziksel uyumluluk bağlantıları başka bir kartın alternatif işlev haritasını değil, ortak pin düzenini açar.

Ana sayfa ve kütüphane aramaları aynı model kataloğunu ve filtreleri kullanır. Her model kartı ortak fiziksel düzen içinde kendi işlemci referansını açar ve çalışma alanı başlığı tam model adını korur. Nucleo-32/64/144 seri etiketleridir. MCU paketleri ayrı ayrı seçilebilir kalır ve ortak Raspberry Pi başlığı açıkça yalnızca fizikseldir. Öne çıkan adlar, GPIO sayıları ve G/Ç gerilimleri doğrulanmış profillerden gelir. Kütüphane yüklenemezse **Tekrar dene** düğmesini kullanın; tarayıcıda kayıtlı planlar korunur.

Site kullanım analitiği için Umami kullanır. Bağlantı planları tarayıcıda yerel olarak saklanır.

Tarayıcı, yapılandırılmış planları donanım ayarlarıyla birlikte `pin-atlas:plans:v2` altında atomik olarak saklar. Eski `pin-atlas:plans:v1` kayıtları yedek olarak kalır; yapılandırması olmayan profiller v1 biçimini korur. İndirilen JSON dosyaları [plan biçimi sürüm 3](docs/PLAN-FORMAT.md)'ü kullanır: satırlar fiziksel temasları, sinyalleri, MCU bacaklarını ve seçicileri tanımlar; profil paketinin revizyonunu ve kaynak belge hash'lerini kaydeder. Sürüm 1 ve 2 dosyaları içe aktarılabilir kalır ve kısa paylaşım bağlantıları v1/v2 kayıtlarını kullanmaya devam eder. Her içe aktarma aynı katı doğrulamadan geçer. Bir dilim kanalını paylaşan RP2040/RP2350 PWM atamaları açık `sharedPWM` onayı gerektirir. Paylaşım bağlantıları kayıtlı planı URL fragment'ı içinde taşır. Bağlantılar ve JSON içe aktarmaları önce bir önizleme açar. Kaydetme, mevcut bir planı yalnızca siz değiştirmeyi seçtikten sonra değiştirir. Pi 4'ün 27 ve 28 numaralı fiziksel pinleri HAT EEPROM'a ayrılmıştır ve normal bağlantı planlarına alınmaz. Elektriksel uyumluluğu ve firmware yapılandırmasını üretici belgelerine göre kontrol edin.

## Yerel çalıştırma

Node.js (npm ile), Python 3 ve Ruby 3.3 veya üzerini (Bundler ile) kullanın. Yerel sunucuyu başlatmadan önce Jekyll bağımlılıklarını kurun.

```sh
git clone https://github.com/Zaryob/pin-atlas.git
cd pin-atlas
python3 scripts/jekyll.py install
npm run dev
```

`http://127.0.0.1:4173` adresini açın. `npm run build` ile `public/` içeriğinden `_site/` üretin ve derlenmiş dosya yollarını denetleyin. Depo kontrolleri `requirements-source-verification.txt` içindeki Python paketlerini (profil şema doğrulayıcısı dahil) gerektirir; `npm run check` öncesinde bunları Python ortamınıza kurun.

Tarayıcı regresyon kontrolleri için test bağımlılıklarını ve Chromium'u kurun, ardından GitHub Pages proje yolu önizlemesini derleyin:

```sh
npm ci
npx playwright install chromium
npm run build:ui
npm run test:ui
```

Tarayıcı testleri masaüstü ve mobil koyu görünümleri, modele özgü aramayı, konektör yakınlaştırmasını, klavyeyle gezinmeyi, yükleme hatasından kurtarmayı ve kayıtlı/içe aktarılmış/paylaşılmış planları denetler. CI bunları dağıtımdan önce çalıştırır ve son derlenmiş dosya yollarını kontrol eder. Test raporları ve iz kayıtları yayımlanan sitenin dışında kalır.

Fontlar yerel olarak paketlenmiştir. Arayüz dili şu sırayla seçilir: `?lang=en` veya `?lang=tr` URL parametresi, sonra daha önce kaydedilmiş dil, sonra tarayıcının ilk tercih ettiği dil (`tr` ile başlıyorsa Türkçe, aksi hâlde İngilizce). Tema ve EN/TR dil tercihleri `zaryob.github.io` ile paylaşılır. Dil değiştirmek açık kartı, filtreleri ve bağlantı planını korur.

## Üretici belgelerine karşı yeniden denetim

```sh
python3 -m pip install -r requirements-source-verification.txt
python3 scripts/verify-official-sources.py
```

Betik, üretici belgelerini ve kaynak dosyalarını, ayrıca kimliği belirlenmiş Blue Pill topluluk referanslarını içeren [kaynak listesini](sources/manifest.json) okur. Eksik dosyaları `.cache/primary-sources/` altına indirir, kilitli SHA-256 hash'lerini kontrol eder, her profili yeniden üretir ve sonucu depodaki dosyalarla karşılaştırır. Değişmiş bir hash veya pin kaydında denetim başarısız olur. `www.st.com` ve `www.st.com.cn` aynası için indirici sıkıştırma isteyen, Safari tarzı kullanıcı aracısı gönderen bir HTTP/2 isteği yapar, ardından HTTP/1.1'e geri döner. Kasım 2026'daki yeniden denetimde bu yolla indirilen yedi ST PDF'inin tamamı kilitli hash'leriyle eşleşti.

GitHub Actions, önbelleğe alınmış bir kaynak klasörüyle `python3 scripts/verify-official-sources.py --table-snapshots` komutunu çalıştırır. Bu kipte **hiçbir ST PDF'i açılmaz**: ST verisi `sources/extracted/` içindeki ham tablo hücrelerinden yeniden üretilir ve manifest her kayıt dosyasının hash'ini denetler. Bir kayıt, geldiği PDF'in hash'ini de taşır, ancak CI onu o PDF ile karşılaştırmaz. Diğer kaynaklar bu kipte de hash ile denetlenir ve üretilen her pin ve işlev karşılaştırılır. ST PDF'lerinin kendisini yalnızca yukarıdaki varsayılan komut veya `python3 scripts/record-st-tables.py` denetler. Kilitli iki Espressif veri sayfası (ESP32-C3 v2.4 ve ESP32-C6 v1.5) artık kayıtlı adreslerinde sunulmuyor; bu adresler daha yeni revizyonlar döndürüyor. Bu yüzden bu iki dosyanın önbellekte kopyası olmayan bir çalıştırma, yeni revizyonlar incelenene kadar başarısız olur.

**"Doğrulanmış" ne demek?** SHA-256 kilidi, atıf yapılan belgenin incelenen belge olduğunu ve değişmediğini kanıtlar. Her değerin o belgeden bir programla okunduğunu kanıtlamaz. Profiller üç yolla oluşturuldu:

- **Belgeden ayrıştırılmış.** Üretici betik, kilitli kopyadan PDF tablolarını, XML, KiCad veya kaynak dosyalarını okur. STM32, Raspberry Pi, Espressif, Arduino çekirdeği, Jetson, BeagleBone Black ve micro:bit verisinin çoğu böyledir.
- **Elle kaydedilmiş tablolar.** Adafruit Feather RP2040 ve Teensy 4.1 üretici betikleri, atıf yapılan pin şemasından elle girilmiş tablolar içerir ve kilitli belgeyi açmaz. Teensy'de PWM, ADC ve port verisi, kilitli bir belge olmayan Teensy çekirdek kaynak koduyla çapraz denetlendi.
- **Görsel okuma.** Bazı temas konumları ve etiketleri çizim veya fotoğraftan aktarıldı. Eski gözlemler `sources/manual-observations.json` dosyasında, yeni profillerin okumaları ise kaynak çıkarıcılarında kayıtlıdır. [Üretilmiş doğrulama kaydında](public/data/verification.json) 99 profilin 64’ü görsel kanıta başvurur. 6.546 pin kaydının 608’inde (%9,3) fiziksel temas kanıtı görsel okumadan gelir.

Aynı kayıt RP2350 Release 8'deki IOVDD tutarsızlığını da açıklar. Tam yöntem için [doğrulama kaydına](docs/VERIFICATION.tr.md) bakın.

Kaynakları inceledikten sonra veri kümesini yeniden üretmek için şunu çalıştırın:

```sh
python3 scripts/verify-official-sources.py --write
npm run build:data
npm run check
```

`--write`, `public/data/` içindeki `boards.json`, `evidence.json` ve `verification.json` dosyalarını ve `sources/` içindeki pin bazında CSV'yi yeniden üretir. Bir belge revizyonunu değiştirirken üretici belgesini inceleyin ve hash'ini ve etkilenen görsel gözlemleri güncelleyin.

`npm run build:data`, tam ortak geometriyi doğruladıktan sonra küçük çalışma zamanı kataloğunu ve profil/kanıt paketlerini üretir. Aynı veriden arama motorlarının okuyabildiği pin haritası sayfalarını (`public/boards/` İngilizce, `public/tr/boards/` Türkçe), `public/sitemap.xml` ve `public/search.json` dosyalarını da üretir; dağıtım işi yalnızca Jekyll çalıştırdığı için bunlar da `public/data/` gibi depoya eklenir. Elle düzenlemeyin. `npm run check`, bu dosyaların kaynak veri kümesiyle eşleştiğini doğrular. Ayrı [haftalık kaynak denetimi](.github/workflows/source-audit.yml) kayıtlı adresleri önbelleksiz indirip hash'lerini kontrol eder; böylece dış CDN erişimi dağıtım yolunun dışında kalır.

## Kart ekleme

[Doğrulanmış kart veya MCU ekleme](docs/ADDING-BOARDS.md) adımlarını izleyin. Profiller ortak JSON şemasını, kart/paket hat sözleşmelerini ve kaynak kilitlerini sağlamalıdır. Üreticiyi, tam model/revizyonu, fiziksel bağlantıları, işlevleri ve kaynak konumlarını birlikte ekleyin; üretici betiği, çalışma zamanı paketlerini ve regresyon kontrollerini veri kümesiyle birlikte güncelleyin.

Çizim türleri `pico`, `header`, `dip`, `qfn`, `lqfp` ve `custom`'dır. Dörtlü çizici TQFP/LQFP için doğrulanmış `packageName` değerini kullanır ve yoğun 100 pinlik paketleri etiketleri ayrık kalacak biçimde genişletir. `custom` bir kart yerel bir SVG ve `pins[].position` koordinatları kullanabilir. SVG yolları, `/pin-atlas/` altındaki dağıtımlar dahil, uygulama tabanına göre çözülür. Koordinatlar bağlantı merkezini işaretler, `side` etiket yönünü belirler ve `angle` isteğe bağlı dönüşü denetler.

## GitHub Pages

`main` dalına yapılan gönderimler kaynak doğrulamasını ve depo kontrollerini başlatır. Bunlar geçtikten sonra GitHub Actions siteyi Jekyll ile derler ve `_site/` dizinini GitHub Pages'e dağıtır. [Pages iş akışına](.github/workflows/pages.yml) bakın.

## Lisans

Uygulama GPL-3.0-or-later ile lisanslanmıştır. Paketlenen IBM Plex Sans ve IBM Plex Mono fontları SIL Open Font License 1.1, Font Awesome Free simgeleri CC BY 4.0 kapsamındadır. Bu bildirimler, ortak tema ve `sources/extracted/` içinde yeniden dağıtılan ST tablo hücreleri [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) içinde açıklanır. Donanım doğrulama kaynakları ayrıca `sources/manifest.json` ve `docs/VERIFICATION.tr.md` içinde belgelenir.

## Markalar

Pin Atlas bağımsız bir projedir. Tanımladığı donanımın hiçbir üreticisiyle, vakfıyla veya topluluğuyla bağlantılı değildir; onlar tarafından desteklenmez veya onaylanmaz. Arduino, Raspberry Pi, STM32, Nucleo, ESP32, BBC micro:bit, BeagleBone, Teensy, Feather, XIAO, Jetson, WeAct ve diğer ürün ve şirket adları sahiplerinin ticari markaları veya tescilli ticari markalarıdır ve yalnızca donanımı tanımlamak için kullanılır.
