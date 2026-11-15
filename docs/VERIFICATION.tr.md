# Pin verilerinin doğrulanması

[English](VERIFICATION.md) · [Türkçe](VERIFICATION.tr.md)

Üretilmiş veriden katalog özeti: **89 kart, başlık ve yonga profili; 5.865 fiziksel pin kaydı ve 25.613 işlev ataması**. Bunlar [`sources/manifest.json`](../sources/manifest.json) içindeki **hash ile kilitlenmiş 151 kaynak kaydından** alınır. Verinin `verifiedOn` tarihi bilerek **5 Kasım 2026** olarak bırakıldı: 14–15 Kasım 2026'da kataloğun tamamı değil, yalnızca o günlerde değişen profiller yeniden denetlendi. Toplamlar [`public/data/verification.json`](../public/data/verification.json) içinde kayıtlıdır; bu sayılar her pinin bağımsız olarak incelendiğini belgelemez. Ortak fiziksel pinler profil başına bir kez sayılır. Sayıma uygulamanın genel `GPIO` planlama seçeneği ve numarasız QFN merkez GND pedleri dahil değildir. Bir sinyalin farklı bir pine her yerleşimi ayrı sayılır.

## Pin haritalarına göre kaynaklar

### Raspberry Pi Pico 2 W

- Fiziksel pinler 1–40, tek sayfalık [üretici pin şemasıyla](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008305-DS-1-pico-2-w-pinout.pdf#page=1) görsel olarak karşılaştırıldı. USB yukarıdayken sol kenar 1'den 20'ye, sağ kenar 40'tan 21'e gider.
- VBUS, VSYS, 3V3_EN, 3V3, ADC_VREF, AGND ve RUN ayrıca [Pico 2 W Datasheet, §2.1, basılı s. 7–8, PDF s. 8–9](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf#page=8) metniyle karşılaştırıldı.
- Dışarı açılan GPIO'ların dijital alternatif işlevleri [RP2350 Datasheet, §1.2.3, Table 3, PDF s. 18–20](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=18) kaynağından gelir. GPIO23, GPIO24, GPIO25 ve GPIO29 kablosuz modüle giden iç bağlantılardır ve 40 pinlik başlığın dışındadır.
- ADC0, ADC1 ve ADC2, pin şemasında ve veri sayfasının Figure 2'sinde GP26, GP27 ve GP28'e eşlenir. HSTX, Table 3'teki `HSTX` sinyal adını ve F0 seçicisini kullanır.

### Pico, Pico W ve Pico 2

- 40 fiziksel etiket ve ADC0/1/2 eşlemeleri, her modelin veri sayfasında PDF 5. sayfadaki Figure 2 üzerinde ayrı ayrı incelendi: [Pico](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf#page=5), [Pico W](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf#page=5) ve [Pico 2](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf#page=5). Her gözlem `sources/manual-observations.json` içinde ayrı kayıtlıdır.
- Özel besleme, analog ve RUN bağlantıları ayrıca her veri sayfasının §2.1 metniyle karşılaştırılır.
- Pico ve Pico W dijital işlevleri [RP2040 Datasheet §1.4.3, Table 2, PDF s. 13–14](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf#page=13) kaynağından çıkarılır. F1–F9 seçicileri korunur; yalnızca RP2350'de bulunan HSTX, PIO2 ve QMI yoktur.
- Pico 2, Pico 2 W için zaten kullanılan RP2350A işlev tablosunu kullanır. Kart bilgileri ve çizim RP2040 / RP2350A ile kablolu / kablosuz modelleri ayırır.
- Hata ayıklama pedleri ve iç GPIO'lar 40 pinlik başlık kapsamının dışındadır. Bu profiller iç LED, kablosuz bağlantı veya gerilim ölçüm devresinin aynı olduğunu ima etmez.

### Ortak Raspberry Pi 40 pinlik başlık

Ortak profil yalnızca sabitlenmiş Raspberry Pi GPIO dokümantasyonundaki fiziksel pin tablosunu kullanır. Bu belge B+ ve sonrası ile bütün Zero modellerinin standart düzenini ve klavyeli bilgisayarlardaki döndürülmüş yönü açıkça tanımlar. Bazı Zero başlıkları lehimli değildir. Profil eski 26 pinlik kartları ve Compute Module'leri kapsamaz. Bilerek hiçbir alternatif işlev kaydı veya kart şeması kanıtı taşımaz: bu işlevler için Pi 3 Model B+, Pi 4, Pi 5, Zero W, Zero 2 W veya Pi 500 profilini seçin. HAT EEPROM pinleri 27/28 ayrılmış kalır.

### Raspberry Pi 4 Model B / J8

- 40 fiziksel pinin tamamı [sabitlenmiş Raspberry Pi GPIO dokümantasyonundaki](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc) “Pin names, types, and typical functions” tablosundan gelir.
- Her GPIO hat etiketi, [Pi 4 Model B Reduced Schematics, Rev 4, J8](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf#page=1) üzerinde koordinatlarıyla pin satırına eşlendi. Güç ve toprak bağlantıları şema üzerinde görsel olarak kontrol edildi.
- Alternatif işlev verisi [BCM2711 ARM Peripherals, §5.3, Table 94, PDF s. 78–79](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008248-DS-1-bcm2711-peripherals.pdf#page=78) içindeki GPIO0–27, ALT0–ALT5 hücrelerinden gelir. Çıkarım boş ve `<reserved>` hücreleri atlar.
- Uygulama `GPx` adlarını `GPIOx` olarak açar. `SDA1` için `I2C1 SDA` veya `TXD0` için `UART0 TX` gibi görünen adlar, özgün üretici sinyalini `functions[].signal` içinde korur. `PWM0_0` ve `PWM0_1` kaynak adlarını korur.
- Fiziksel 27 ve 28 numaralı pinler, ID_SD ve ID_SC olarak da bilinen GPIO0 ve GPIO1'i taşır. HAT kimlik EEPROM'una ayrılmıştır. Bu pin haritası Pi 4'teki BCM2711 alternatif işlevlerini tanımlar.

### Raspberry Pi 5 / J8

- 40 fiziksel pinin tamamı [sabitlenmiş Raspberry Pi GPIO dokümantasyonundaki](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc) standart fiziksel düzeni paylaşır.
- Alternatif işlevler [Raspberry Pi RP1 Peripherals, §3.1.1, Table 4, PDF s. 16–17](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf#page=16) içindeki GPIO0–27, ALT0–ALT8 (a0–a8) hücrelerinden gelir.
- Fiziksel 27 ve 28 numaralı pinler, HAT kimlik EEPROM'una ayrılmış GPIO0 ve GPIO1'i taşır.
- RP1 alternatif işlevleri BCM2711'den ayrı UART, SPI, I2C, I2S, PWM, PIO, DPI, SDIO ve PCM ses seçenekleri sunar.

### Raspberry Pi Zero W, Zero 2 W ve 3 Model B+ / J8

- 40 fiziksel pin, ortak başlıkla aynı GPIO dokümantasyonu tablosunu kullanır. Her kartta 28 GPIO hat etiketi (ID_SD/ID_SC dahil), kartın kendi basitleştirilmiş şemasında koordinatlarla J8 temaslarına eşlendi: [Zero W, RP-008368-DS-1](https://pip-assets.raspberrypi.com/categories/592-raspberry-pi-zero-w/documents/RP-008368-DS-1-raspberry-pi-zero-w-reduced-schematics.pdf#page=1), [Zero 2 W, RP-008360-DS-1](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008360-DS-1-raspberry-pi-zero-2-w-reduced-schematics.pdf#page=1) ve [3 Model B+, RP-008339-DS-1](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008339-DS-1-raspberry-pi-3-b-plus-reduced-schematics.pdf#page=1). Güç ve toprak görsel olarak kontrol edildi. İki Zero şemasında da J8 DNF (takılmaz) olarak işaretlidir.
- Alternatif işlevler [BCM2835 ARM Peripherals, §6.2, PDF s. 102](https://pip-assets.raspberrypi.com/categories/579-raspberry-pi-zero/documents/RP-008249-DS-1-bcm2835-peripherals.pdf#page=102) içindeki GPIO0–27, ALT0–ALT5 hücrelerinden gelir; boş ve `<reserved>` hücreler atlanır (kart başına 83 atama). [GPIO dokümantasyonu](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc) eski aileler ve Zero modelleri için bu tabloyu gösterir.
- Zero W BCM2835 kullanır ([işlemci belgesi](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2835.adoc); bu belge çevre birimi dokümanında bilinen hatalar olduğunu da belirtir). 3 Model B+ (BCM2837B0) ve Zero 2 W (BCM2710A1 kalıplı RP3A0) için aynı tablo kullanılır; Raspberry Pi işlemci belgelerine göre BCM2710A1, BCM2837'nin kalıbıdır, BCM2837B0 ile BCM2837 aynı mimaridedir, BCM2837 ve BCM2836 ise farklı Arm çekirdekli BCM2835'tir ([rp3a0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/rp3a0.adoc), [bcm2837b0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2837b0.adoc), [bcm2837](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2837.adoc), [bcm2836](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2836.adoc)). İşlevler bu dayanağı açıkça yazan ayrı bir kanıt kaydı taşır.
- Yalnızca BCM2711'de bulunan seçimler kopyalanmaz: bu kartlarda UART2–5, SPI3–6, I2C3–6 veya ALT2 DPI kaydı yoktur (BCM2835 tablosu GPIO0–27 için ALT2'yi ayrılmış gösterir). PWM, BCM2835 adlarını (`PWM0`/`PWM1`) korur; GPIO14/15'teki ALT5 mini UART'tır (`TXD1`/`RXD1`).
- Uyarılar: lehimsiz Zero başlığı ([Zero modelleri belgesi](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/zero/zero-intro.adoc), [Zero 2 W ürün özeti](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf#page=2) ve DNF işareti); GPIO dokümantasyonundaki BCM2835/BCM2836/BCM2837/RP3A0 gerilim tablosu (V_IL ≤ 0,9 V, V_IH ≥ 1,6 V, varsayılan 8 mA / en fazla 16 mA sürüş, 50–65 kΩ pull dirençleri); 3 Model B+ için GPIO başlığından 5 V DC giriş ([ürün özeti, Specification](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008338-DS-2-raspberry-pi-3-b-plus-product-brief.pdf#page=3)).

### Raspberry Pi 500 / arka 40 pinlik başlık

- [Klavyeli bilgisayarlar belgesi](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/keyboard-computers/intro.adoc) yatay 40 pinlik GPIO başlığını ve RP1 G/Ç denetleyicili BCM2712'yi listeler; [Pi 500 ürün özeti, RP-008349-DS-4](https://pip-assets.raspberrypi.com/categories/1115-raspberry-pi-500/documents/RP-008349-DS-4-raspberry-pi-500-product-brief.pdf#page=2) Pi 500'ün Pi 5 ile aynı işlemciye ve RP1 G/Ç denetleyicisine sahip olduğunu belirtir. Bu nedenle profil, standart 40 pin numaralandırmasında Pi 5'in RP1 işlevlerini (RP1 Peripherals, Table 4) yeniden kullanır.
- Pi 500 için yayımlanmış şema olmadığından hat etiketi karşılaştırması yapılamadı. GPIO dokümantasyonu klavyeli bilgisayar başlığının arka yüzde ve 180° döndürülmüş olduğunu, 1 ve 40 numaralı pinlerin etiketli olduğunu belirtir; profil bunu uyarı olarak kaydeder ve arka panel görünümü çizmez. Pi 500'ü adıyla anan RP1 gerilim tablosu da uyarı olarak eklenmiştir.

### RP2350A / QFN-60

- GPIO, QSPI, osilatör, hata ayıklama, USB ve güç pinleri [RP2350 Datasheet, §14.8.2.2, Tables 1674–1679, PDF s. 1333–1336](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=1333) kaynağını kullanır.
- Fiziksel yerleşim ve IOVDD pedleri [§1.2.1.1, Figure 2, PDF s. 16](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=16) ile karşılaştırıldı. Merkez GND pedi 60 pinlik sayımın dışındadır.
- Bank 0, PDF s. 18–20'deki Table 3'ü kullanır. Bank 1 USB ve QSPI işlevleri [Table 5, PDF s. 21](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=21) kaynağını kullanır.
- Table 1674, bu pakette GPIO26–GPIO29'u ADC0–ADC3 olarak tanımlar.

### RP2350B / QFN-80

- Pin listesi RP2350 veri sayfasının QFN-80 sütununu kullanır. Yerleşim [§1.2.1.2, Figure 3, PDF s. 17](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=17) ile karşılaştırıldı.
- Table 1674 GPIO0–47'nin fiziksel konumlarını, Table 5 Bank 1 USB ve QSPI işlevlerini verir. Bu pakette ADC0–ADC7, GPIO40–GPIO47'ye eşlenir.

## Üretici belgesindeki IOVDD tutarsızlığı

RP2350 Release 8'de Table 1679, QFN-60 IOVDD pedleri olarak `11,20,30,38,45,54` listeler. Aynı tablo pin 54'ü QSPI_IOVDD'ye de atar. Figure 2 ve Figure 152'nin ikisi de pin 1'i IOVDD, pin 54'ü QSPI_IOVDD olarak gösterir. [RP2350 Datasheet, Figure 2](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=16)

Doğrulanmış QFN-60 IOVDD listesi iki şekle dayanarak **1,11,20,30,38,45** değerini kullanır. QFN-80 IOVDD listesi Figure 3 ile görsel olarak karşılaştırıldı. Kanıt ve gerekçe `sources/manual-observations.json` içinde kayıtlıdır.

## Doğrulamayı yeniden üretme

1. [Kaynak listesi](../sources/manifest.json) her kaynağın revizyonunu, belge adresini veya commit'ini ve SHA-256 hash'ini kaydeder. Kimliği belirlenmiş üç Blue Pill topluluk referansını da içerir.
2. `scripts/verify-official-sources.py` bu kaynakları indirip denetler, her profili yeniden üretir ve sonucu depodaki veriyle karşılaştırır. Bir üretici betik belgeyi ayrıştırıyorsa PDF tablolarını veya commit'e sabitlenmiş üretici Markdown konektör tablolarını yeniden okur ve satır sarımı olan hücrelerde boşlukları normalleştirir.
3. Fiziksel pin numarası, ad, tür, alternatif işlev, üretici sinyali ve F/ALT seçicisi yayımlanan kayıtla eşleşmelidir.
4. Yalnızca şekilden alınan gözlemler ayrı işaretlenir. Otomatik bir çalıştırmada yeniden kullanılmaları önceki görsel incelemeyi korur; yeni bir inceleme sayılmaz. Değişen bir hash, kaynağın yeniden incelenmesini gerektirir.
5. [`sources/pin-verification.csv`](../sources/pin-verification.csv) her pin ve işlev kaydını listeler. [`public/data/evidence.json`](../public/data/evidence.json) referans kimliklerini belgelere, sayfalara ve tablolara çözer. [`public/data/verification.json`](../public/data/verification.json) doğrulama toplamlarını ve kaynak özetini içerir.
6. GitHub Actions karşılaştırmayı dağıtımdan önce, aşağıda açıklanan tablo kaydı kipinde çalıştırır.

### İki doğrulama kipi

- **`--table-snapshots` (CI'ın çalıştırdığı kip).** Hiçbir ST PDF'i açılmaz. Yedi ST belgesi yalnızca `sources/extracted/*.json` içindeki kaydedilmiş tablo hücreleri olarak denetlenir. Manifest her kayıt dosyasının hash'ini kilitler ve her kayıt geldiği PDF'in hash'ini taşır, ancak bu kip kaydı o PDF ile karşılaştırmaz. Diğer bütün kaynaklar yine indirilir veya önbellekten okunur ve hash ile denetlenir; üretilen her pin ve işlev karşılaştırılır.
- **Varsayılan kip (bayraksız).** Yedi ST PDF'i dahil özgün PDF'ler yeniden okunur. `python3 scripts/record-st-tables.py` ayrıca her kaydın PDF'iyle hâlâ eşleştiğini denetler. Bu kip yerelde yeniden çalışıyor: 14 Kasım 2026'da yedi ST PDF'inin tamamı kayıtlı adreslerinden indirildi ve kilitli hash'leriyle eşleşti, çünkü indirici artık `www.st.com`'un kabul ettiği isteği gönderiyor (HTTP/2, sıkıştırmalı, Safari tarzı kullanıcı aracısıyla; olmazsa HTTP/1.1). GitHub'ın barındırdığı CI çalıştırıcılarının `www.st.com`'a bu yolla erişip erişemediği denenmedi.
- **Aynalar.** Manifestte yalnızca DS5319 ve RM0008, `www.st.com`'dan önce `www.st.com.cn` aynasını listeler. UM1724 ve UM2505 dahil diğer bütün ST belgeleri yalnızca `www.st.com`'dan indirilir. Bir belgenin her iki adresi de aynı kilitli SHA-256'yı vermelidir.
- **Canlı adresin artık sunmadığı kaynaklar.** ESP32-C3 veri sayfası v2.4'e kilitlidir, adresi ise artık v2.5 sunuyor; ESP32-C6 veri sayfası v1.5'e kilitlidir, adresi v1.6 sunuyor. Bu yüzden iki dosyadan birinin soğuk indirilmesi, yeni revizyon incelenene kadar hash uyuşmazlığıyla başarısız olur. Haftalık soğuk indirme denetimi böyle bir uyuşmazlığı gösterir; kilit hiçbir zaman otomatik güncellenmez.

### Hash kilidi neyi kanıtlar?

SHA-256 kilidi, atıf yapılan belgenin incelenen belge olduğunu ve değişmediğini kanıtlar. Elle kaydedilmiş bir tablonun o belgeyle eşleştiğini kanıtlamaz. [`public/data/verification.json`](../public/data/verification.json) içindeki `physicalSourceMethods`, her profilin fiziksel pinlerinin nasıl elde edildiğini gösterir:

- **Belgeden ayrıştırılmış:** kilitli kopyadan okunan PDF tabloları, üretici XML'i, KiCad dosyaları, Markdown/RST tabloları veya kaynak kod. STM32, Raspberry Pi, Espressif, Arduino çekirdeği, Jetson, BeagleBone Black ve micro:bit verisinin çoğu böyledir.
- **Elle kaydedilmiş tablolar:** Adafruit Feather RP2040 ve Teensy 4.1 üretici betikleri, atıf yapılan pin şemasından elle girilmiş tablolar içerir ve kilitli belgeyi açmaz. Teensy'nin PWM, ADC ve port verisi Teensy çekirdek kaynak koduyla çapraz denetlendi.
- **Görsel okumalar:** 89 profilden 56'sı yöntemleri arasında `visual-diagram` (veya `visual-photo`) listeler. 5.865 pin kaydından 510'unda (%8,7) bütün fiziksel kanıt başvuruları görsel okumadır. RP2040 (QFN-56), ATmega2560 (TQFP-100), ATmega2561 (TQFP-64) ve Seeed Studio XIAO RP2040 tümüyle görsel okumalara dayanır.

### Kaynaklı uyarılar

Pinler `warnings` (ek uyarı anahtarları) ve `noteEvidence` (her notun veya uyarının dayandığı referans kimlikleri) taşıyabilir; kartlar her biri kendi kanıtıyla birlikte `cautions` taşıyabilir. `scripts/warning_sources.py` bunları ekler ve bir uyarıda geçen her sayıyı kilitli belgeye karşı doğrular. `scripts/validate-data.py`, her uyarının ve kart uyarısının var olan bir referansı gösterdiğini ve başvurulan her çeviri anahtarının hem İngilizce hem Türkçe bulunduğunu denetler. Arayüz her uyarının yanında kaynak bağlantısını gösterir.

### Sabitlenmiş adresler

GitHub kaynakları tam commit'lere sabitlenmiştir: NUCLEO-G474RE paket ve GPIO kip XML'i (`STM32_open_pin_data` `7d1f1514…`), Feather RP2040 pin şeması (`be3f4b32…`), micro:bit V2 şeması (`17aae030…`) ve `arduino/docs-content` içindeki 15 Arduino PDF'i ile 5 Markdown veri sayfası (`cb938e96…`) bunlara dahildir. Arduino'nun yayımladığı kaynaklardan yalnızca ATmega328P veri sayfası hâlâ yerinde değiştirilebilen bir `docs.arduino.cc` adresinden gelir; hash kilidi böyle bir değişikliği yakalar. `st.com`, `espressif.com`, `raspberrypi.com` ve benzeri sitelerdeki üretici PDF'leri commit'e sabitlenemez; bunlardaki değişikliği hash kilitleri yakalar.

Uygulama kendi SVG şemalarını kullanır. Üretici belgelerine kanıt kayıtlarından bağlantı verilir ve belgeler pakete eklenmez. Tek istisna `sources/extracted/*.json` dosyalarıdır: bu dosyalar yedi ST belgesinden çıkarılmış ham tablo hücrelerini, ST tablolarındaki bazı tam cümleler dahil, yeniden dağıtır (bkz. [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)). Yazılım ve font lisans bildirimleri ayrıca tutulur.

## Ortak düzen kataloğu

Katalog kaynak profillerini fiziksel düzene göre gruplar. UNO biçimli kartlar 32 ana başlık konumunu, Nano referansları 30 yan konumu paylaşır ve iki Espressif modül çiftinin her biri tek kayıt olarak kalır. İsteğe bağlı konektörler ve elektriksel/MCU yetenekleri seçili referansa aittir. Gruplama, belgelenmiş BOOT/NC ve yalnızca analog/GPIO farklarına izin vererek konektör etiketlerini ve konumlarını denetler. Eski Pico/Pi grupları daha katı numara/ad/tür karşılaştırmasını korur. Eski model kimlikleri, kayıtlı planlar ve paylaşılan bağlantılar hâlâ özgün referansa çözülür.

## NVIDIA Jetson Orin Nano · J12

Kaynak, NVIDIA'nın SHA-256 ile kilitlenmiş **Jetson Orin Nano Developer Kit Carrier Board Specification, SP-11324-001_v1.3 (Aralık 2024)** belgesidir. Bu harita NVIDIA P3768 taşıyıcı kartındaki J12'yi kapsar; modülün 260 pinlik konektörünü veya üçüncü taraf taşıyıcıları kapsamaz.

- 40 konumun tamamı Figure 3-1'den (basılı s. 21 / PDF s. 25) çıkarılır ve Table 3-3 (basılı s. 22–23 / PDF s. 26–27) ile bağımsız olarak eşleştirilir. Besleme pinleri ve sekiz toprağın tamamı tablo açıklamalarıyla denetlenir. §3.3'e göre 28 sinyal pininin tamamı GPIO olarak yapılandırılabilir.
- Çevre birimi sinyalleri bu kaynaklardaki taşıyıcı/modül adlarını kullanır. GPIO09'un ses ana saati, GPIO01/GPIO11'in genel amaçlı saatleri ve GPIO07/GPIO13'ün PWM girdileri alternatif işlev sütunundan gelir. GPIO12 GPIO olarak kalır; SoC ped adında PWM geçmesi, başlıkta desteklenen bir PWM işlevi olduğunu göstermez.
- Table 3-3, 16/18 numaralı pinleri `SPI1_CSI1*` / `SPI1_CSI0*` olarak yazar. Figure 3-1'deki karşılık gelen etiketler `SPI1_CS1*` / `SPI1_CS0*`'dır ve aynı tablo satırlarındaki CS1_N/CS0_N SoC adlarıyla tutarlıdır. Üretici betik, şekil adlarını kullanmadan önce bu tutarsızlıkları birebir denetler. Alternatif açıklama hücresinde UART #2 yazmasına rağmen UART1_RTS* modül/SoC etiketi korunur; Linux veri yolu ve gpiochip eşlemeleri bu kaydın dışındadır.
- İşlev kayıtları belgelenmiş yetenekleri tanımlar; yüklü pinmux'u veya sürücü yapılandırmasını tanımlamaz. PWM girdileri, her JetPack imajının bu pinlerde donanımsal PWM'i etkinleştirdiğini iddia etmez. Hedef yazılım sürümü için NVIDIA'nın [Jetson-IO yapılandırma kılavuzunu](https://docs.nvidia.com/jetson/archives/r36.4.3/DeveloperGuide/HR/ConfiguringTheJetsonExpansionHeaders.html) ve uygun pinmux'u kullanın.
- Elektriksel notlar Table 3-3'e dayanır: 3,3 V sinyaller; 3/5 ve 27/28'de 2,2 kΩ / 1,5 kΩ pull-up ve ±2 mA listelenmiş sürüşle doğrudan açık drenajlı I²C; diğer sinyal pinleri ±20 µA listelenmiş zayıf sürüşlü TXB0108 dönüştürücüleri kullanır ve harici pull dirençleri 50 kΩ'dan büyük olmalıdır. Bunlar Raspberry Pi GPIO elektriksel özellikleri değildir.
- J12 pinleri 27/28, I2C0_SDA/SCL'dir ve Raspberry Pi HAT EEPROM ayırması uygulanmaz. ADC veya doğrulanmamış sayısal mux seçicileri eklenmez.

Üretici PDF'i doğrulama için önbelleğe alınır ve depoda dağıtılmaz.

## STM32F103 paketleri · LQFP48, LQFP64, LQFP100

ST **DS5319 Rev 20 (Temmuz 2025)** Table 5, PDF s. 28–33, LQFP48, LQFP64 ve LQFP100 pin konumlarını, G/Ç toleransını ve işlevlerini verir. Fiziksel çevre düzenleri için Figure 6–8, PDF s. 24–26 incelendi. Bu LQFP paketlerinde açıkta merkez ped yoktur. LQFP48 ve LQFP64, Table 5'in 7. dipnotunda ve RM0008'de anlatıldığı gibi PD0 ve PD1'i OSC_IN ve OSC_OUT üzerine çıkarmak için `PD01_REMAP` kullanır. LQFP100'de 12 ve 13 numaralı pinler osilatöre ayrılmıştır; PD0 ve PD1 81 ve 82'dedir.

**RM0008 Rev 21**, §9.3, Tables 34, 43–46 ve 52–56, CAN, zamanlayıcı, USART, I²C1 ve SPI1 remap koşullarını verir. Çıkarıcı birleşik hücreleri açar ve her remap hedefini seçili paketteki bir pinle eşler. Örneğin Table 46, LQFP100'de TIM1'i `TIM1_REMAP=11` ile PE7–PE15'e eşler. Tables 36–37 JTAG/SWD eşlemesini kapsar. İşlev kayıtları AFIO alanını, izin verilen değerleri ve bir yapılandırma referansını taşır. Her remap değeri çevre biriminin tamamına uygulanır.

FT durumu ve PC13–PC15 kısıtları Table 5 dipnotlarına dayanır: yedek alan (backup domain) pinlerinin 3 mA / 2 MHz / 30 pF sınırları vardır ve akım kaynağı olarak kullanılmamalıdır. FT koşullu bir dijital kip özelliğidir; analog girişlere veya her pine 5 V uygulama izni değildir.

## Blue Pill · topluluk kart referansı

Blue Pill'in tek bir yetkili üreticisi yoktur. Konektör konumları **STM32-base topluluk kart sayfasını**, yansıtılmış 2016 referans şemasını ve incelenmiş bir üstten görünüm fotoğrafını kullanır. Üç belgenin üçü de hash ile kilitlidir ve açıkça topluluk kaynağı olarak işaretlenmiştir; STM32-base'in ST ile bağlantısı yoktur. MCU işlevleri ve yonga pin kimlikleri ayrıca ST belgelerinden gelir.

- Kart 44 bağlantı sunar: H1 (20), H2 (20) ve SWD (4); 34'ü GPIO olarak kullanılabilir. İç kayıt kimlikleri 1–44, uydurma paket pin numaraları olarak değil, H1.n/H2.n/SWD.n olarak gösterilir. Her sinyal gerçek MCU paket pinine bağlanır.
- USB yukarıdayken H2 solda, H1 sağdadır; ikisi de USB ucundaki 20. konumdan SWD ucundaki 1. konuma gider. Alttaki dört SWD pini soldan sağa GND, PA14, PA13, 3V3'tür. Bu yön kilitli referans fotoğrafıyla karşılaştırıldı.
- H1/H2 şemadaki P3/P4'e, SWD P2'ye karşılık gelir. Şema reset düğmesi/MCU hattını RESET, başlık hattını NRST olarak etiketler. Konektör sayfası ve R baskısı reset bağlantısını destekler; şema kendi içinde tutarlı bir hat listesi sayılmak yerine bu tutarsızlık belgelenmiştir.
- PB2/BOOT1 bir boot köprüsündedir, PD0/PD1 8 MHz kristale bağlıdır; ikisi de yan başlık dökümünde yoktur. PC13 aktif LOW bir LED'i sürer; PC14/PC15 LSE kristalini, PA11/PA12 USB'yi paylaşır; PA13/PA14 SWD'de görünür.
- Topluluk referansı USB VBUS ile 5 V hattının yalıtılmadığını uyarır; bu yüzden USB ve harici 5 V beslemenin aynı anda kullanımı bu haritada desteklenmez. Klonların regülatörleri, USB pull-up'ları, MCU'ları ve bağlantıları farklı olabilir ve kartın incelenmesini gerektirir. Harita GD32/CS32 klonları için uyumluluk iddia etmez.

DS5319 ve RM0008 indirmeleri önce resmî `www.st.com.cn` aynasını dener, sonra `www.st.com`'a döner; iki adres de aynı kilitli SHA-256 değerleriyle eşleşmelidir. Aktarım yeniden denemeleri sınırlıdır; bir CDN erişilemez olduğunda hiçbir kaynak hash'i veya pin verisi denetimi atlanmaz.

## NUCLEO-F103RB / F401RE / F411RE · MB1136

Konektör haritası, resmî `www.st.com` adresinden indirilen ve hash ile kilitlenen ST **UM1724 Rev 17 (Eylül 2025)** belgesini kullanır. (Kasım 2026'ya kadar kilit, üçüncü taraf bir aynadan indirilmiş Rev 14 idi.) NUCLEO-F103RB, Table 12'yi (s. 40) ve Table 27'yi (s. 56–57) kullanır. MCU pin numaraları ve işlevleri STM32F103RB LQFP64 profilinden gelir. Harita analog A4/A5 yönlendirmesini gösterir ve Table 10'a (s. 27–28) göre alternatif I²C yolunu ve yapılandırılabilir saat, seri port ve LED bağlantılarını etiketler. Kart çizimi F103RB için Figure 13'teki (s. 31), F401RE/F411RE için Figures 17/18'deki (s. 33) konektör konumlarını ve sıra numaralarını izler. NUCLEO-F103RB'de bir temas seçmek, ayrı STM32F103RBT6 LQFP-64 çizimindeki karşılık gelen bacağı vurgular. F401RE ve F411RE konektör atamaları Table 16'yı (s. 44–45) ve Table 29'u (s. 59), paket pin numaraları ve AF seçicileri ise kilitli STM32CubeMX pin verisini kullanır. Sayfa numaraları PDF sayfalarıdır.

## NUCLEO-G474RE · MB1367

NUCLEO-G474RE, ST **UM2505 Rev 7 (Mayıs 2026)** belgesini kullanır: Arduino konektörleri için Table 15 (s. 30–31), ST Morpho konektörleri için Table 16 (s. 32–33) ve MB1367 lehim köprüleri için Table 12 (s. 25–27). Konektör konumları ve sıraları için görsel referans Figure 18'dir (s. 30). D0/D1 ve CN10.35/37, UM2505'in varsayılanını, PC5/PC4 üzerinde USART1'i izler; PA2/PA3 üzerindeki LPUART1 ST-LINK sanal COM portuna hizmet eder. MB1136 lehim köprüsü notları bu karta uygulanmaz. Paket bacakları ve AF seçicileri `STM32_open_pin_data` commit `7d1f1514…` kaynağından gelir. UM2505, `scripts/record-st-tables.py` tarafından `sources/extracted/nucleo-g4-um2505.json` içine kaydedilir; yani CI'da tablo hücresi olarak denetlenen yedi ST belgesinden biridir.

## Kart ve paket eşlemesi

Her bağlantı, kimliği belirlenmiş bir kart şemasını veya pin şemasını MCU paketine bağlar. Arduino A000066 ATmega328P PDIP-28'i, Nano A000005 ATmega328P QFN/MLF-32'yi, Mega A000067 ATmega2560 TQFP-100'ü kullanır. Pico ve Pico W'deki GPIO ve RUN temasları RP2040 Figure 3'ü, Pico 2 ve Pico 2 W RP2350A haritasını kullanır. Blue Pill mevcut STM32F103C8T6 paket pin numaralarını kullanır. Nucleo F401RE ve F411RE modele özgü CubeMX LQFP-64 paketlerini kullanır. Tek bir paket bacağı olmayan ortak güç hatları ve topraklar kart etiketlerini korur.

## Arduino AVR kartları

- **UNO R3:** A000066 tam pin şeması (6 Ekim 2022), sayfa 1/3/4; commit'e sabitlenmiş veri sayfası Markdown'ındaki JANALOG/JDIGITAL konektör tabloları. İki ana başlık grubu 32 temas, ana MCU ICSP'si 6 temas getirir. 20 ayrı GPIO hattı vardır. JDIGITAL'deki A4/SD4 ve A5/SD5 yazım hataları, tam pin şeması ve AVR çekirdeğiyle SDA/A4 ve SCL/A5 olarak çözülür.
- **Klasik Nano:** A000005 tam pin şeması (30 Haziran 2021), sayfa 1–3. Ana başlık sırası ve ICSP yönü görsel olarak incelendi; üstten görünümde ICSP sıraları 2/4/6 ve 1/3/5'tir. 30 yan temas, 6 ICSP teması, 20 bağımsız GPIO ve 8 ADC girişi vardır. Güncel Nano veri sayfasında konektör numaralandırma hataları ve yanıltıcı A6/A7 GPIO etiketleri olduğu için fiziksel pin kaynağı olarak kullanılmaz. Resmî `eightanaloginputs` varyantı 20 girdilik dijital port haritasını `standard`'dan devralır; A6/A7 yalnızca ADC'dir ve dijital portu, pull-up'ı veya PWM'i yoktur.
- **Mega 2560 Rev3:** A000067 tam pin şeması (16 Aralık 2020), sayfa 1–4; commit'e sabitlenmiş veri sayfası Markdown'ındaki konektör tabloları. 86 dış temas ve 6 ana MCU ICSP teması 70 bağımsız GPIO sunar. USB yukarıdayken uç başlığın çift numaralı GPIO sırası USB'ye daha yakındır; güç temasları sağda, toprak temasları soldadır. Kaynakta ayrıca döndürülmüş ayrıntı `manual-observations.json` içinde kayıtlıdır. Tam pin şemasındaki tilde işaretlerine rağmen D0/D1 Arduino PWM çıkışı değildir. Çekirdek D2–D13 ve D44–D46'da 15 PWM çıkışını ve D50–D53'te SPI'ı doğrular.

Resmî `arduino/ArduinoCore-avr` revizyonu `11b9130371e8447920edb65a75706a6c951e51fc`, commit ve dosya başına hash ile kilitlidir. Üretici betik `standard` ve `mega` dosyalarından, Nano için `eightanaloginputs` geçersiz kılmasıyla, dijital port/bit dizilerini, zamanlayıcı dizilerini, analog takma adları ve SPI/Wire pin sabitlerini ayrıştırır. UART ve donanım INT adları tam pin şemasının metninden okunur ve port haritasıyla denetlenir. PWM, olası her ham zamanlayıcı çıkışını değil, Arduino'nun zamanlayıcı eşlemesini yansıtır. Uydurma mux seçicileri eklenmez. Arayüzde gösterilen GPIO sayıları benzersiz hatları sayar; fiziksel temas eşleşme sayıları tekrarları da içerir.

Yalnızca ana MCU ICSP'si ve ana sinyal/güç başlıkları gösterilir. USB soketleri, jak soketleri, USB köprüsü ICSP/JP5, test noktaları, köprüler ve çıplak işlemci paket haritaları bu kart profillerinin dışındadır. Çizimler mekanik yerleşim değil, özgün şematik çizimlerdir. Kaynaklar her pinde bağlı kalır. Ortak hat atamaları hem plan işlemi hem de JSON/paylaşım içe aktarma doğrulaması tarafından reddedilir.

`PWR`, `ANALOG`, `DIGITAL`, `L`, `R` ve `END`, Pin Atlas'ın konektör konum etiketleridir. Üretici konektör adları veya Arduino çizim pin numaraları olduklarını iddia etmezler. Plan dosyalarındaki sayısal kimlik iç temas anahtarıdır; ayrıntılar Arduino dijital numarasını ve MCU portunu ayrıca gösterir.

## Genişletilmiş Arduino referansları

- Leonardo (A000057, 25 Kasım 2025) ve Micro (A000053, 10 Kasım 2020) tam pin şemaları başlık yerleşimini, fiziksel sinyal adlarını ve donanım kesmelerini verir. Sabitlenmiş AVR çekirdeğinin `leonardo` port/bit/zamanlayıcı/kanal dizileri yeniden ayrıştırılır; `micro` bu haritayı açıkça devralır. ADC kanalları Arduino analog takma ad numaraları değildir: A0, ADC7'dir; A4, ADC1'dir; altı ek analog takma ad dijital başlık portlarını paylaşır. Leonardo'da I²C D2/D3'ü, SPI ICSP'deki D14–D16'yı kullanır. Micro ayrıca D17/SS'yi ve diğer SPI pinlerini kendine özgü 34 temaslı yan ayak izinde sunar. İkisi de D0/D1 Serial1'den bağımsız yerleşik USB kullanır.
- Nano Every (ABX00028, 15 Aralık 2021) ArduinoCore-megaavr `e8edb4ef2e8ab5c98544c3884a653f0b9c1318dc`, `nona4809/pins_arduino.h` dosyasını kullanır. Üretici betik port/bit, analog kanal ve PWM bildirimlerini okur. A6/A7, ADC4/ADC5 ve dijital yetenekli PD4/PD5'tir; A4/A5, PF2/PA2 ve PF3/PA3'e bağlıdır, bu yüzden GPIO/ADC ve TWI sürücüleri birlikte yönetilmelidir. Yalnızca 30 yan temas dahildir; alttaki SAMD11/UPDI hata ayıklama pedleri dahil değildir. Beş Arduino PWM pini klasik Nano'dan farklıdır.
- UNO R4 Minima (ABX00080, 27 Kasım 2023) ve WiFi (ABX00087, 23 Nisan 2025) ArduinoCore-renesas `424e86eff92d37f72123c2b641dd8bbf06a38b47` revizyonunu kullanır. Başlık sabitleri, `g_pin_cfg` RA4M1 port haritaları ve başlatılan altı PWM kanalı her modelin kendi dosyalarından ayrıştırılır. Fiziksel pin şeması ADC ANxxx kanallarını ve DAC'ı verir. CAN TX/RX sabitleri ayrıca okunur: Minima'da D4/D5, WiFi'da D10/D13. İkisi de UNO R3'ün NC temasının yerine BOOT koyar. 32 ana temas ve altı SPI teması dahildir; SWD, yardımcı işlemci/Qwiic, LED matrisi ve ek güç bağlantıları dahil değildir. Ana RA4M1 G/Ç'si 5 V'tur; WiFi kartının kapsam dışındaki ESP32-S3/Qwiic konektörleri 3,3 V kullanır.

UNO ve Nano gruplaması aynı sinyal adlarını veya türlerini değil, ortak konektör konum geometrisini doğrular. Referans değişikliği pin yeteneklerini, kaynak bağlantılarını, elektriksel notları ve isteğe bağlı temasları günceller. Planlar profil başına kalır; eski `arduino-uno-r3` ve `arduino-nano-classic` adresleri ve içe aktarmaları desteklenmeye devam eder.

## Espressif referans kartları

Kılavuz tabloları ve ön/pin düzeni görselleri `espressif/esp-dev-kits` commit `5c06bf1835329d6525f316475f7218aab6acfe79`'a kilitlidir. Küçük bir RST ayrıştırıcı numaralı J1/J2/J3 satırlarını doğrudan okur; girdi, elle yazılmış bir pin veri kümesi değil, özgün kılavuzların tamamıdır. Görseller sol/sağ ve konektör sırası için görsel olarak incelendi. USB alttadır ve pin 1 anten ucundadır. S3'ün yatay ön fotoğrafı bu yöne getirmek için saat yönünde döndürülür.

- ESP32-DevKitC V4: 38 temas, J2/J3. WROOM-32E ve WROVER fiziksel pinleri paylaşır; GPIO6–11 flash'a hizmet eder ve WROVER ayrıca GPIO16/17'yi iç belleğe ayırır. GPIO34/35/36/39 yalnızca giriştir ve iç pull-up/down yoktur.
- ESP32-C3-DevKitM-1: 30 temas, J1/J3, 15 GPIO, MINI-1/1U referansı. GPIO8 RGB LED ile paylaşılır; GPIO2/8/9 strapping pinleridir ve GPIO18/19 USB'yi taşır.
- ESP32-S3-DevKitC-1 v1.1: 44 temas, J1/J3, 36 GPIO. WROOM-1-N8 referansı Quad flash kullanır; N8R8 ayrıca GPIO35–37'yi Octal PSRAM'e ayırır. Diğer WROOM-2 veya bellek gerilimi varyantları için uyumluluk iddia edilmez. v1.1 RGB, GPIO38'i kullanır. S3'te GPIO46 giriş ve çıkışı destekler; S2'deki yalnızca giriş kısıtı buraya kopyalanmaz. GPIO0/3/45/46 strapping pinleridir ve GPIO19/20 USB'yi taşır.

Yerleşik ADC/DAC/dokunmatik, UART, JTAG, USB ve saat adları kılavuz hücrelerinden gelir. Her yonganın veri sayfası boot/strapping ve GPIO matrix yönlendirme kanıtını verir. Matrix seçenekleri açık yönlendirme yetenekleridir; varsayılan firmware atamaları veya uydurma sayısal AF seçicileri değildir. Yalnızca giriş olan bacaklar hiçbir zaman çıkış/PWM/I²C yolu sunmaz. Belleğe ayrılmış temaslar devre dışıdır ve plan içe aktarılırken reddedilir. Sürücü/ADC2/Wi-Fi ile kart üstü USB/LED paylaşımı koşullu kalır; plan SDK yazmaçlarını yapılandırmaz.

## ATmega paket görünümleri

ATmega328P, Arduino'nun bir `docs.arduino.cc` adresinde yansıttığı ve hash ile kilitlenen özgün Atmel 42735B tam veri sayfasını (Kasım 2016) kullanır. PDF s. 19/20'deki Table 6-1, PDIP-28, TQFP-32, QFN/MLF-28 ve QFN/MLF-32 için ayrı ayrı ayrıştırılır. Çıkarılan adlar görsel olarak kaydedilmiş Figure 5-1–5-4 ile karşılaştırılır. **PDIP PC0 pin 23'tür:** Table 6-1 yanlışlıkla 13 yazar; Figure 5-1 ve tam fiziksel sıra hatayı çözer. ADC6/ADC7 yalnızca 32 pinlik paketlerde vardır ve yalnızca analog kalır. QFN merkez pedleri çevre sayımının dışında GND'ye bağlıdır. PC6'nın GPIO olması RSTDISBL sigortasını gerektirir; PB6/PB7 saat/osilatör yapılandırmasına bağlıdır. Ham MCU işlev adları, Arduino takma adlarından bağımsız olarak veri sayfası sinyallerini korur.

ATmega2560, Microchip DS40002211A, Figure 1-1'i (PDF s. 2), 100 TQFP pininin tamamını ve 86 GPIO'yu kullanır. PDF s. 75–94'teki Port A–L alternatif işlev tabloları yeniden okunur. 64 pinlik ATmega1281/2561'e özgü PDI/PDO dipnotu uygulanır; bu işlevler PE0/PE1'e kopyalanmaz. Port E'nin `CLK0` etiketi, şekil ve bölünmüş saat açıklamasıyla `CLKO` olarak çözülür. PF4–PF7 JTAG/ADC koşulları taşır; PG3/PG4 asenkron osilatör kullanımına bağlıdır. Mega kartının D0–D69 numaraları ve CBGA top konumları ayrı numaralandırma sistemleridir ve TQFP pin numarası olarak kullanılmaz.

Uygulama DIP'i pin 1/çentik işaretiyle, TQFP'yi açıkta ped iddiası olmadan, QFN'i belgelenmiş merkez GND'siyle çizer. Yoğun TQFP100 etiketleri daha geniş aralık ve yatay kaydırma kullanır. Paket varyantlarının ayrı fiziksel ayak izleri vardır; yalnızca doğrulanmış ortak kart başlıkları gruplanır.

## Seeed Studio XIAO başlıkları

Seeed Studio XIAO düzeni, standart 14 temaslı castellated ayak izini (yedi sol, yedi sağ pin) paylaşan kompakt 14 pinlik geliştirme kartlarını gruplar.

- **Seeed Studio XIAO RP2040:** resmî Seeed Studio şeması v1.3'ten (Haziran 2022) görsel olarak okundu; bu profilin ayrıştırılmış bir fiziksel kaynağı yoktur. Sol pinler 1–7, D0–D6'ya (4 ADC kanallı RP2040 GPIO26–29, GPIO6, GPIO7, GPIO0) eşlenir. Sağ pinler 5V, GND, 3V3 ve D10–D7'ye (RP2040 GPIO3, GPIO4, GPIO2, GPIO1) eşlenir. Pin eşlemesi doğrudan RP2040 QFN-56 paket görünümüne bağlanır.
- **Seeed Studio XIAO ESP32C3:** resmî Seeed Studio şeması v1.3 (Ocak 2026) ve resmî pin şemasıyla doğrulandı. Sol pinler 1–7, D0–D6'ya (ESP32-C3 GPIO2–7 ve GPIO21) eşlenir. Sağ pinler 5V, GND, 3V3 ve D10–D7'ye (ESP32-C3 GPIO10, GPIO9, GPIO8, GPIO20) eşlenir. Strapping pinleri (GPIO2, GPIO8, GPIO9), ADC1/ADC2 uyarı notları ve GPIO matrix ile yönlendirilebilen çevre birimleri Espressif belgelerinden doğrulanır. Kartta USB-UART köprüsü yoktur: USB doğrudan yonganın yerleşik USB pinlerine (GPIO18/19) gider ve D6/D7, aynı hatta köprü olmadan UART0'dır (U0TXD/U0RXD). D9 (GPIO9) BOOT düğmesine bağlıdır. D3 (GPIO5), ESP32-C3 veri sayfasının ADC2 uyarısını taşır; ESP32-C3-DevKitM-1'in GPIO5 teması da aynı uyarıyı gösterir.
- **Seeed Studio XIAO SAMD21:** Seeed Studio şeması v1.0 (Kasım 2019) ve Microchip SAM D21/DA1 veri sayfası DS40001882L. D0–D10, ATSAMD21G18A'nın PA02, PA04, PA10, PA11, PA08, PA09, PB08, PB09, PA07, PA05 ve PA06 pinlerine eşlenir. Zamanlayıcı çıkışları veri sayfası adlarını kullanır: `TCC0/WO[n]`, `TCC1/WO[n]` ve `TC4/WO[n]`; SAMD21G'de TC0/TC1 yoktur. D4 (PA08) bir EXTINT hattı değil, yalnızca NMI sunar; D5 (PA09) ve D7 (PB09) EXTINT[9]'u paylaşır.

## Genişletilmiş Nucleo-64 referansları

Ortak Nucleo-64 kaydı yalnızca konektör konumlarını gruplar. Her model kendi paket profilini, GPIO seçicilerini, güç bağlantılarını ve kayıtlı planlarını korur. Yeni STM32 paketleri, resmî STMicroelectronics `STM32_open_pin_data` paket XML'ini ve bu paketin başvurduğu GPIO Modes XML'ini kullanır; ikisi de tam commit ve SHA-256 ile sabitlenmiştir. Ayrıştırıcı GPIO bağımlılığının dosya adını önbellek kullanılırken de denetler.

- **NUCLEO-F446RE / STM32F446RET6:** UM1724 Rev 17 Table 19 (s. 48–49) ve Table 29 (s. 59); LQFP-64, GPIO olarak kullanılabilen 50 bacak, Cortex-M4, en çok 180 MHz. Ham STM32 AF seçicileri F446 GPIO Modes kaynağından gelir.

UM1724 ham tablo hücreleri `sources/extracted/nucleo-um1724-r17.json` içinde hash ile kilitlidir. CI aynı ayrıştırıcıyı bu hücrelere uygular ve kılavuz PDF'ini açmaz. Varsayılan kip ve `scripts/record-st-tables.py` özgün PDF ile karşılaştırır.

- **NUCLEO-F303RE / STM32F303RET6:** UM1724 Rev 17 Table 14 (s. 42–43) ve Table 26 (s. 56); Cortex-M4, 72 MHz, GPIO olarak kullanılabilen 51 bacaklı LQFP-64. Table 14 D0 satırını atlar: CN9.1 ortak MB1136 konumunu kullanır ve D0 → PA3, sabitlenmiş resmî STM32duino F303RE varyantıyla doğrulanır. Ek kaynak o temasa bağlanır.

- **NUCLEO-L476RG / STM32L476RGT6:** UM1724 Rev 17 Tables 23 (s. 53–54) / 32 (s. 62); Cortex-M4, 80 MHz, LQFP-64 ve GPIO olarak kullanılabilen 51 bacak. Paket pinleri ve AF seçicileri sabitlenmiş üretici XML'inden bağımsız olarak çıkarılır.

- **NUCLEO-F072RB / STM32F072RBT6:** UM1724 Rev 17 Tables 11 (s. 38–39) / 26 (s. 56); Cortex-M0, 48 MHz, LQFP-64 ve GPIO olarak kullanılabilen 51 bacak. Paket pinleri ve AF seçicileri sabitlenmiş üretici XML'inden bağımsız olarak çıkarılır.

- **NUCLEO-L053R8 / STM32L053R8T6:** UM1724 Rev 17 Tables 17 (s. 46) / 30 (s. 60); Cortex-M0+, 32 MHz, LQFP-64 ve GPIO olarak kullanılabilen 51 bacak. Paket pinleri ve AF seçicileri sabitlenmiş üretici XML'inden bağımsız olarak çıkarılır.

- **NUCLEO-L152RE / STM32L152RET6:** UM1724 Rev 17 Tables 21 (s. 51–52) / 30 (s. 60); Cortex-M3, 32 MHz, LQFP-64 ve GPIO olarak kullanılabilen 51 bacak. Paket pinleri ve AF seçicileri sabitlenmiş üretici XML'inden bağımsız olarak çıkarılır.

- **STM32F407VGT6:** ayrı bir LQFP-100 paket görünümü, GPIO olarak kullanılabilen 82 bacak ve en çok 168 MHz Cortex-M4. Paket XML'i ST'nin ortak `STM32F417_gpio_v1_0` GPIO tablosuna başvurur; ayrıştırıcı onu bu yonga/paket XML'inde gerçekten bulunan sinyallerle sınırlar. Bu bağımsız MCU görünümüne Nucleo başlık numaralandırması atanmaz.

- **STM32F405RGT6:** ayrı bir LQFP-64 paket görünümü, GPIO olarak kullanılabilen 51 bacak ve en çok 168 MHz Cortex-M4. Paket XML'i ST'nin ortak `STM32F417_gpio_v1_0` GPIO tablosuna başvurur; ayrıştırıcı onu bu yonga/paket XML'inde gerçekten bulunan sinyallerle sınırlar. Bu bağımsız MCU görünümüne Nucleo başlık numaralandırması atanmaz.

## Nucleo-32 / MB1180

NUCLEO-F042K6, UM1956 Rev 6 Table 10'u (s. 24), Figure 3'ü (s. 12) ve Tables 7/8'i (s. 21/22) kullanır. CN3 ve CN4, 30 fiziksel konumun tamamını ve kendi baskı etiketlerini korur. STM32F042K6T6'nın 32 LQFP çevre bacağı ve GPIO olarak kullanılabilen 26 bacağı vardır. MCU alternatif işlevleri sabitlenmiş paketinden ve bildirilen GPIO Modes XML'inden gelir.

A4/A5 birincil PA5/PA6 bacaklarını tanımlar. SB18/SB16 bunları PB7/PB6'ya (D4/D5) bağlayabilir; bu durumda birincil bacaklar yüzer giriş olarak kalmalıdır ve D4/D5 bağımsız GPIO olarak kullanılamaz. Harita PA5/PA6 üzerinde uydurma I²C seçicileri eklemez. Pin notları ayrıca PA2/A7 VCP paylaşımını, D13 LED'ini, osilatör ve AREF bağlantılarını belirtir. Ham UM1956 tablo kaydı özgün PDF ile karşılaştırılır ve CI'ın bu PDF'i indirmeden yeniden üretim yapmasını sağlar.

NUCLEO-L432KC, UM1956 Rev 6 Table 16'yı (s. 30) kullanır ve doğrulanmış CN3/CN4 konumlarını F042K6 ile paylaşır. MCU'su STM32L432KCU6, UFQFPN-32, GPIO olarak kullanılabilen 26 bacak ve en çok 80 MHz Cortex-M4'tür; D7/D8, F042'nin PF0/PF1'i yerine PC14/PC15'i kullanır. Yalnızca ST XML'inde numaralanan çevre bacakları çizilir; merkez termal ped bu kaynağın numaralı kapsamının dışındadır.

## Nucleo-144 / MB1137

NUCLEO-F767ZI, UM1974 Rev 11 Table 19'u (s. 61–65), Table 21'i (s. 70/71) ve s. 15'teki mekanik çizimi kullanır. Altı başlığın tamamı ayrı ayrı temsil edilir: CN7 (20), CN8 (16), CN9 (30), CN10 (34), CN11 (70) ve CN12 (70); toplam 240 fiziksel temas. Bunlar STM32F767ZIT6'nın 144 LQFP bacağından ve 114 GPIO'sundan ayrıdır. MCU saati en çok 216 MHz'tir. İşlevler ve AF seçicileri sabitlenmiş paketin tam GPIO bağımlılığını, kart üstü çevre birimi notları ST'nin sabitlenmiş kart yapılandırmasını kullanır. Tekrarlanan güç hatları tek bir MCU bacağı anlamına gelmez.

## Nucleo-144 / MB1364 ve eski H723 planları

NUCLEO-H743ZI2, eski MB1137 NUCLEO-H743ZI'den ayrı olan MB1364 kartıdır. STM32H743ZIT6 paketi 144 LQFP bacağı, GPIO olarak kullanılabilen 114 bacak ve en çok 480 MHz kullanır. UM2407 Rev 6 Tables 18–22 (s. 40–44), s. 16'daki mekanik çizim ve ST'nin sabitlenmiş kart yapılandırması fiziksel temasları ve devre kanıtını verir. Kılavuzdaki PC2/PC3 etiketleri seçili paket XML'inde PC2_C/PC3_C olarak çözülür. SB14/SB15, PC8/PC9 Morpho bağlantılarını denetler; A4/A5 yönlendirmesi lehim köprülerine bağlıdır. PF11 analog ADC girişi Table 14/SB65 gereği çıkarılır; dijital EXTI tetikleri kullanılabilir kalır.

H723 görünümü aynı numaralı fiziksel tablolardan yeniden üretilir. Önceki 131 mantıksal kayıt altı fiziksel konektörün tamamını tanımlamıyordu. Mevcut 131 atama kimliğinin tamamı, `sources/legacy-h723-pin-ids.json` içindeki incelenmiş eşlemeyle elektriksel sinyalini ve MCU bacağını korur; ek fiziksel temaslar 132–240 kimliklerini alır. Eski varyant ayrıştırıcısı fiziksel konektör kanıtı olarak değil, yalnızca eski atama kimliğini doğrulamak için kullanılır. Gerçek konektör etiketleri UM2407'den gelir. Ortak düzen denetimleri adlandırılmış temas konumlarını karşılaştırır; bu yüzden iç atama kimlikleri farklı olsa da model değiştirmek fiziksel teması korur.

Artık kullanılamayan bir PF11 analog girişi veya tekrarlanan bir fiziksel hat içeren mevcut tarayıcı planları bir çakışma uyarısıyla görünür kalır. Yeni atamalar, JSON içe aktarmaları ve paylaşım önizlemeleri desteklenmeyen seçimleri reddeder. Yazdırma/SVG çıktısı uyarıyı korur. GPIO/ADC etiketleri ve kayıtlı pin numaraları sessizce atılmaz.

## WeAct Black Pill v3.x

F401CC referansı STM32F401CCU6'yı (UFQFPN-48, GPIO olarak kullanılabilen 36 bacak, en çok 84 MHz) kullanır. WeAct'in resmî deposu `6a7f7d434a9d6361f91590d4cdd16b4a70ce7513` commit'ine sabitlenmiştir. KiCad sembolü 44 elektriksel ped adının tamamını, eşleşen ayak izi her ped koordinatını ve USB-C yönünü verir. İki ham CAD dosyası ayrı ayrı ayrıştırılır ve 1–44 ped kimliklerinde eşleşmelidir. Arayüzdeki PAD numaraları KiCad ped kimlikleridir; kart baskısı veya MCU paket numaralandırması değildir. İki yan başlık 40 temas sunar; SWD dört temas daha ekler. Üreticinin donanım notları v3.1'in v3.0 pin tanımını değiştirmediğini belirtir; klon kartlar kapsam dışındadır.

Sabitlenmiş v3.1 şeması PA0 kullanıcı düğmesini (330 Ω), PC13 kullanıcı LED'ini, PB2/BOOT1'i, PA11/PA12 USB-C'yi, PA13/PA14 SWD'yi ve PA4/PA5/PA6/PA7 (CS/SCK/MISO/MOSI) üzerindeki isteğe bağlı SPI flash'ı koşullandırır. Paket bacak numaraları ve alternatif işlevler tam ST XML bağımlılığını kullanır; GPIO Modes tablosu çoğaltılmadan mevcut F401 kaynağıyla paylaşılır.

F411CE referansı STM32F411CEU6'yı (UFQFPN-48, GPIO olarak kullanılabilen 36 bacak, en çok 100 MHz), aynı doğrulanmış 44 temaslı WeAct düzenini ve kendi sabitlenmiş paket/GPIO seçicilerini kullanır. F401CC ve F411CE MCU paket görünümleri 8/9 numaralı bacaklarda üreticinin farklı analog besleme/referans etiketlerini korur; kart uyumluluğu bu silikon farklarını silmez.

## v0.8.0'dan sonra eklenen veya düzeltilen kartlar

- **Adafruit Feather RP2040:** Adafruit'in pin şeması PDF'inden (`adafruit/Adafruit-Feather-RP2040-PCB`, `be3f4b32…`) elle kaydedilmiş bir tablo. Sağ başlık, basıldığı gibi USB ucundan gider: VBAT, EN, VBUS, D13, D12, D11, D10, D9, D6, D5, SCL, SDA. Pin 3 ikinci 3,3 V çıkışıdır; kartta AREF pini yoktur. RP2040 işlevleri RP2040 veri sayfasından gelir.
- **PJRC Teensy 4.1:** PJRC pin kartları 11a/11b'den (Rev 4) ve Rev D şemasından elle kaydedilmiş bir tablo. PWM, ADC ve port verisi kilitli bir belge olmayan Teensy çekirdek kaynak koduyla (`pwm.c`, `analog.c`, `core_pins.h`) çapraz denetlendi. 42–47 numaralı microSD pedleri DAT1, DAT0, CLK, CMD, DAT3 ve DAT2'yi taşır; bir kart uyarısı pinlerin 5 V toleranslı olmadığını belirtir.
- **BeagleBone Black:** P8/P9, System Reference Manual 7. bölümden (Tables 87–88); sinyal adları, kipler ve toplar TI'ın AM335x veri sayfası SPRS717L'den. P9.41 `gpio0[20]`, P9.42 `gpio0[7]`'dir; her temastaki ikinci AM3358 topu (D13 ve B12) tek bir işlev listesine katılmak yerine ayrı modellenir. On üç sinyal adı SPRS717L'ye göre düzeltildi. Kart uyarıları güç sıralamasını (kart beslenmeden ve SYS_RESETn yükselmeden hiçbir G/Ç'ye gerilim uygulanmaz) ve eMMC'nin (P8.3–6, P8.20–25) ve HDMI'ın (P8.27–46) kullandığı, GPIO olarak kullanılabilen 30 teması kapsar; pin başına uyarılar ve notlar 7. ve 8. bölümlere dayanarak eMMC ve HDMI temaslarını, PWR_BUT'u ve güç hatlarını kapsar.
- **Arduino Nano 33 BLE Sense Rev2 ve Nano ESP32:** `arduino/docs-content` içindeki tam pin şemaları ve şemalar, ayrıca mbed `variant.cpp` ve `espressif/arduino-esp32` `pins_arduino.h`. Nano 33 BLE'nin VUSB teması, SJ1 lehim köprüsü kapatılana kadar bağlı değildir. Nano ESP32'de B1, GPIO0'dır (Arduino pin 15, yeşil LED); B0, B1 ve A2 (GPIO3) ESP32-S3 strapping pinleridir.
- **ESP32-C6-DevKitC-1 v1.2:** `5c06bf18…` commit'indeki `esp-dev-kits` kılavuzu ve pin düzeni görseli, ayrıca ESP32-C6 veri sayfası (v1.5'e kilitli; yukarıdaki iki doğrulama kipine bakın).
- **BBC micro:bit V2:** micro:bit geliştirici dokümantasyonunun kenar konektörü sayfasından (`dev-docs`, `469ea5f9…`) ve V2 şemasından (`17aae030…`) fiziksel sırayla 25 ön şerit. 1–21 numaralı pin kimlikleri önceki anlamlarını korur; küçük 3V ve GND şeritleri yeni 22–25 kimlikleridir. P19/P20, kart üstünde 4,7 kΩ pull-up'ları olan harici I²C veri yoludur; V2'de hareket sensörü ayrı bir iç veri yolundadır. Bir kart uyarısı güç kaynağı sayfasındaki kenar konektörü akım bütçesini verir.
- **RP2350 errata maddesi E9:** Pico 2, Pico 2 W, RP2350A ve RP2350B'nin her Bank 0 GPIO'su, RP2350 veri sayfasındaki (Ek D.5.1, s. 1359–1360) RP2350-E9 giriş kaçağı uyarısını taşır. RP2040 profilleri taşımaz.
- **Raspberry Pi 40 pinlik başlık:** kart uyarıları pinlerin 5 V toleranslı olmadığını belirtir ve pin başına 16 mA, toplamda 50 mA sınırını verir; GPIO2/GPIO3 sabit 1,8 kΩ pull-up'ları taşır. Zero W, Zero 2 W ve 3 Model B+ ayrıca BCM2835 ailesi gerilim tablosunu; Zero kartları lehimsiz başlık uyarısını; Pi 500 ise döndürülmüş arka başlık ve RP1 gerilim tablosu uyarılarını taşır.
- **Kanıt konumları:** ATmega2561 PDI/PDO referansı artık s. 84'teki Table 13-17 notunu, ESP32 s. 16 referansı ise Table 2-1 notlarını gösterir.

## Yol haritası eklemeleri için resmî kaynaklar ve doğrulama ölçütleri

Pin Atlas kataloğuna eklenecek yeni modeller için geçerli resmî birincil belgeler ve doğrulama kuralları:

### WCH RISC-V ekosistemi (CH32V003, CH32V203, CH32V307)
- **Belgeler:** `CH32V003DS0.PDF` (Veri Sayfası, WCH), `CH32V003RM.PDF` (Referans Kılavuzu, WCH), `CH32V203DS0.PDF`, `CH32V307RM.PDF` ve `open-wch/ch32v003` ile `open-wch/ch32v203` resmî şemaları.
- **Doğrulama ölçütleri:** TSSOP-20, QFN-20, SOP-16 ve SOP-8 fiziksel paket bacakları; USART1, I2C1 ve TIM1/TIM2 için AFIO remap kuralları; PD1 üzerindeki tek hatlı seri hata ayıklama (SDI) pini kimliği; 3,3 V ve 5,0 V çalışma sınırları.

### Espressif Systems yeni nesil silikonları (ESP32-S2, ESP32-H2, ESP32-P4)
- **Belgeler:** `esp32-s2_datasheet_en.pdf`, `esp32-s2_technical_reference_manual_en.pdf`, `esp32-h2_datasheet_en.pdf`, `esp32-h2_technical_reference_manual_en.pdf`, `esp32-p4_datasheet_en.pdf`, `esp32-p4_technical_reference_manual_en.pdf` ve commit'e sabitlenmiş ESP-IDF `components/soc/*/include/soc/gpio_pins.h`.
- **Doğrulama ölçütleri:** ESP32-S2 yerel USB OTG pinleri (GPIO19 D-, GPIO20 D+), strapping pinleri (GPIO0, GPIO45, GPIO46); ESP32-H2 IEEE 802.15.4 / BLE 5.3 strapping (GPIO8, GPIO9) ve yalnızca giriş pinleri; ESP32-P4 MIPI CSI/DSI diferansiyel çiftleri, Ethernet RMII arabirimi ve ADC2 çakışması olmayan 50+ GPIO matrisi.

### Nordic Semiconductor BLE portföyü (nRF52840, nRF5340)
- **Belgeler:** `nRF52840_PS_v1.7.pdf` (Ürün Spesifikasyonu), `nRF5340_PS_v1.3.pdf` ve PCA10056 (DK) ile PCA10059 (Dongle) resmî Nordic şemaları.
- **Doğrulama ölçütleri:** Standart ve Yüksek Sürüş (E0/E1, H0/H1) elektriksel sınırları, NFC anten pinlerinin (P0.09, P0.10) GPIO yapılandırması, 32,768 kHz kristal pinleri (P0.00, P0.01), USB VBUS algılaması ve nRF5340 çift çekirdekli alan pin yönlendirmesi (Ağ vs. Uygulama çekirdeği).

### STMicroelectronics modern serileri (STM32H5, STM32U5, STM32C0, STM32WL)
- **Belgeler:** `RM0481` (STM32H5x3 Referans Kılavuzu), `UM3115` (NUCLEO-H563ZI Kullanım Kılavuzu), `RM0456` (STM32U5 Referans Kılavuzu), `UM2861` (NUCLEO-U575ZI-Q), `RM0490` (STM32C0 Referans Kılavuzu), `UM2977` (NUCLEO-C031C6) ve `STMicroelectronics/STM32_open_pin_data` XML kaynakları.
- **Doğrulama ölçütleri:** Cortex-M33 TrustZone güvenli G/Ç nitelikleri, STM32U5'te LPBAM otonom çevre birimi pin ataması, 5 V toleranslı (FT) bacak sınıflandırması ve MB1404 / MB1549 Zio/Morpho konektör eşlemeleri.

### Microchip / Atmel SAMD ve modern tinyAVR (ATSAMD51, tinyAVR 1/2-Serisi)
- **Belgeler:** `SAM-D51-E54-Family-Data-Sheet-DS60001507.pdf`, `tinyAVR-1-Series-Data-Sheet-DS40002166.pdf` ve Adafruit Metro M4 ile Grand Central M4 resmî şemaları.
- **Doğrulama ölçütleri:** ATSAMD51 çift DAC çıkışı (PA02, PA05), çift ADC giriş kanalı, PMUX çevre birimi çoklama matrisi (A'dan N'ye); tinyAVR UPDI özel programlama kontağı, port çoklayıcı (PORTMUX) kayıtçıları ve Core Independent Peripheral pin yolları.

### Texas Instruments MSPM0 ailesi (MSPM0L1306, MSPM0G3507)
- **Belgeler:** `SLAU846.pdf` (MSPM0 G-Serisi Teknik Referans Kılavuzu), `SLAU847.pdf` (MSPM0 L-Serisi TRM) ve LP-MSPM0L1306 / LP-MSPM0G3507 LaunchPad Kullanım Kılavuzları.
- **Doğrulama ölçütleri:** 5 V toleranslı G/Ç bacaklarına karşılık yalnızca 3,3 V bacaklar, CAN-FD pin atamaları, donanımsal çarpıcı / matematik hızlandırıcı kanalları ve LaunchPad 20/40 pinli BoosterPack başlık hizalaması.

### Arduino Pro ve yüksek yoğunluklu kartlar (Arduino GIGA R1 WiFi)
- **Belgeler:** `Arduino-GIGA-R1-WiFi_schematics.pdf` (Resmî Arduino) ve commit'e sabitlenmiş `ArduinoCore-mbed/variants/GIGA/pins_arduino.h`.
- **Doğrulama ölçütleri:** Mega biçimli başlıklarda 76 GPIO kontağı; STM32H747XI çift çekirdekli (Cortex-M7 + Cortex-M4) sinyal yönlendirmesi; Murata 1DX Wi-Fi/BLE modül yalıtımı; USB-A host ve USB-C programlama portu hatları; tüm başlıklarda 3,3 V G/Ç gerilim sınırı.

### Raspberry Pi Compute Module 4 ve 5 (CM4 / CM5)
- **Belgeler:** [Compute Module 4 Datasheet, RP-008168-DS](https://datasheets.raspberrypi.com/cm4/cm4-datasheet.pdf) (Table 6, pin düzeni; §4 GPIO_VREF/PCIe metni) ve [Compute Module 5 Datasheet, RP-008180-DS](https://datasheets.raspberrypi.com/cm5/cm5-datasheet.pdf) (Table 5, pin düzeni; §4.3 elektriksel özellikler). GPIO alternatif işlevleri doğrulanmış Pi 4 (BCM2711) ve Pi 5 (RP1) tablolarından gelir.
- **Doğrulama ölçütleri:** Çift 100 pinli Hirose DF40 asma kat (mezzanine) konnektörleri (toplam 200 temas). Konnektör 1 (CN1, pin 1–100) Ethernet, GPIO bloğu (GPIO0–27), SD kart sinyallerini ve gücü taşır; Konnektör 2 (CN2, pin 101–200) USB, PCIe, HDMI ve kamera/ekran arayüzlerini taşır (CM4'te CSI ve DSI, CM5'te birleşik MIPI0/MIPI1). Yapılandırılabilir GPIO_VREF gerilim alanı (1,8 V veya 3,3 V).

### Raspberry Pi RM2 kablosuz modülü
- **Belgeler:** [Raspberry Pi Radio Module 2 Datasheet, RP-008943-DS-7](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf): Table 2 (her pinin işlevi), Table 1 (modülle haberleşmek için gereken ana sistem GPIO bağlantıları) ve §2.6 (elektriksel özellikler).
- **Doğrulama ölçütleri:** Table 2'deki kastelasyonlu ped numaralandırması; gSPI hatları (SCLK, DIN/MOSI, DOUT/MISO, CS) ve nIRQ; WL_REG_ON ve BT_REG_ON etkinleştirme hatları; VIN 3,0–4,8 V ve VDDIO 1,8 V / 3,3 V beslemeleri; modül GPIO0.

### Espressif ESP8266 (AI-Thinker ESP-12F ve ESP-01)
- **Belgeler:** Espressif `ESP8266EX Datasheet` (v6.9), `ESP8266 Technical Reference Manual` ve AI-Thinker `ESP-12F Module Specification`.
- **Doğrulama ölçütleri:** 16 pedli kastelasyonlu SMD ayak izi (ESP-12F) ve 2x4 başlık (ESP-01); kesinlikle 3,3 V G/Ç seviyeleri (5 V toleransı yoktur); önyükleme (strapping) pedleri (UART yükleme için GPIO0 düşük, GPIO2 yüksek, GPIO15 düşük); CH_PD/EN için zorunlu 10 kΩ pull-up; TOUT / ADC0 0–1,0 V giriş aralığı.

### Seeed Studio XIAO genişleme ailesi (XIAO nRF52840 Sense, XIAO ESP32-S3 Sense)
- **Belgeler:** Seeed Studio XIAO nRF52840 (Sense) Wiki ve Donanım Şemaları, `nRF52840_PS_v1.7.pdf`, Seeed Studio XIAO ESP32-S3 (Sense) Şemaları ve `esp32-s3_datasheet_en.pdf`.
- **Doğrulama ölçütleri:** Paylaşılan 14 pedli standart XIAO taban ayak izi (D0–D10, 3V3, GND, 5V); dâhili sensör veri yolu hatları (P0.27/P0.07 üzerinde LSM6DS3TR-C IMU, P0.16/P0.17 üzerinde MSM261D PDM mikrofon); P0.31 üzerinde batarya gerilim ölçümü; ESP32-S3 Sense üzerinde kamera/mikrofon için 24 pinlik alt FPC konnektörü ve microSD SPI veri yolu (GPIO21, 47, 48, 38, 39).
