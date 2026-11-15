# Donanım araştırması ve teknik referans

İnceleme: 2026-11-14. 79 profil ayrı ayrı kapsanır. 44 profil için nitelendirilmiş tarih bilgisi vardır; 35 profilin kesin ilk üretim/satış tarihi doğrulanmamıştır. MCU veri sayfasının ilk yayını, kartın üretim yılı olarak sunulmaz.

Bu dosya `sources/hardware-details.json` kayıtlarından `npm run build:data` ile üretilir. Her özellik ve notun kaynak bağlantısı yanındadır. Canlı üretici sayfalarının içeriği değişebilir; pin kanıtlarının kilitli sürüm ve SHA-256 bilgileri ayrı `sources/manifest.json` kaydında korunur. Yeni teknik bilgi incelemesi, önceki pin doğrulama tarihini değiştirmez.

Flash, sabit boot ROM, EEPROM, SRAM ve PSRAM ayrı tutulur. Bellek kapasiteleri toplam fiziksel kapasitedir; kullanılabilir uygulama alanı daha küçük olabilir. Bağlantı tabloları Pin Atlas sayfasının altında kaynaklı tüm alternatifleri listeler; aynı anda kullanılabilecek varsayılan bağlantılar oldukları iddia edilmez.

## Düzeltilen mevcut ifadeler

- Pi 4: saat alanındaki “BCM numaralandırma” → 1.8 GHz (ilk kartlarda 1.5 GHz); işlemci çekirdeği Cortex-A72 olarak açıklandı.
- Pi 5: aynı hatalı saat ifadesi → 2.4 GHz; Cortex-A76 işlemcisi ve RP1 I/O denetleyicisi ayrıldı.
- Her iki düzeltme kaynak pin çıkarıcısında ve üretilen profillerde birlikte uygulandı. Pin kimlikleri ve kayıtlı planlar korundu.

## Model kayıtları

### Raspberry Pi Pico 2 W

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=pico-family&profile=pico2w) · [Pin referansı](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008305-DS-1-pico-2-w-pinout.pdf) · [Datasheet](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf)

- **İlk satış / çıkış:** 2024-11-25. [pico2w launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-2-w-on-sale-now/)
- **İşlemci:** 2 × Arm Cortex-M33 / 2 × Hazard3 RISC-V. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Saat hızı / üst sınır:** 150 MHz. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **RAM:** 520 KB SRAM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Program Flash’ı / depolama:** 4 MB kart üstü QSPI Flash. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico 2 W Datasheet](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf)
- **Sabit ROM:** 32 KB boot ROM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Besleme / mantık:** USB: 5 V; VSYS: 1.8–5.5 V. GPIO mantığı: 3.3 V; 5.5 V giriş toleransı yalnızca veri sayfasındaki koşullarda.. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico 2 W Datasheet](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf)

İki çekirdek aynı anda çalışır; dört çekirdeğin tamamı birlikte kullanılamaz. 12 PIO durum makinesi. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

Kartta 26 GPIO ve 3 harici ADC girişi vardır. GP29 kart içi ölçümlerde kullanılır. [Raspberry Pi Pico 2 W Datasheet](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf)

CYW43439: 2.4 GHz Wi-Fi ve Bluetooth 5.2. Kablosuz yonga MCU RAM kapasitesini artırmaz. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html)

### Raspberry Pi 4 Model B

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-4) · [Pin referansı](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf) · [Datasheet](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008248-DS-1-bcm2711-peripherals.pdf)

- **İlk satış / çıkış:** 2019-06-24. [Raspberry Pi 4 launch](https://www.raspberrypi.com/news/raspberry-pi-4-on-sale-now-from-35/)
- **İşlemci:** 4 × Arm Cortex-A72 (64-bit). [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **Saat hızı / üst sınır:** 1.8 GHz; ilk sürümlerde 1.5 GHz. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **RAM:** 1 / 2 / 3 / 4 / 8 GB LPDDR4; modele bağlı. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **Program Flash’ı / depolama:** microSD / USB depolama; SPI EEPROM önyükleyici. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **Besleme / mantık:** 5 V / 3 A USB-C. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)

40 pin başlıkta 3.3 V GPIO kullanılır. Fiziksel pin numarası BCM GPIO numarasından farklıdır. 27/28 HAT kimlik EEPROM hattıdır. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

Devre / kart belgeleri: [Raspberry Pi 4 Model B Reduced Schematics](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf)

### Raspberry Pi 5

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-5) · [Pin referansı](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf) · [Datasheet](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf)

- **İlk satış / çıkış:** 2023-09-28. [Introducing Raspberry Pi 5](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/)
- **İşlemci:** 4 × Arm Cortex-A76 (64-bit); RP1 I/O. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Saat hızı / üst sınır:** 2.4 GHz. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **RAM:** 1 / 2 / 4 / 8 / 16 GB LPDDR4X; modele bağlı. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Program Flash’ı / depolama:** microSD / USB / PCIe depolama; SPI EEPROM önyükleyici. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Besleme / mantık:** 5 V / 5 A USB-C. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)

40 pin başlıkta 3.3 V GPIO kullanılır. Fiziksel pin numarası BCM GPIO numarasından farklıdır. 27/28 HAT kimlik EEPROM hattıdır. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

Devre / kart belgeleri: [Raspberry Pi 4 Model B Reduced Schematics](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf)

### Raspberry Pi Pico

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=pico-family&profile=pico) · [Pin referansı](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf#page=5) · [Datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)

- **İlk satış / çıkış:** 2021-01-21. [pico launch announcement](https://www.raspberrypi.com/news/raspberry-pi-silicon-pico-now-on-sale/)
- **İşlemci:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Saat hızı / üst sınır:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash’ı / depolama:** 2 MB kart üstü QSPI Flash. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico Datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)
- **Sabit ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Besleme / mantık:** USB: 5 V; VSYS: 1.8–5.5 V. GPIO mantığı: 3.3 V.. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico Datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)

8 PIO durum makinesi; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

Kartta 26 GPIO ve 3 harici ADC girişi vardır. GP29 kart içi ölçümlerde kullanılır. [Raspberry Pi Pico Datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)

### Raspberry Pi Pico W

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=pico-family&profile=picow) · [Pin referansı](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf#page=5) · [Datasheet](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf)

- **İlk satış / çıkış:** 2022-06-30. [picow launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-w-your-6-iot-platform/)
- **İşlemci:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Saat hızı / üst sınır:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash’ı / depolama:** 2 MB kart üstü QSPI Flash. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico W Datasheet](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf)
- **Sabit ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Besleme / mantık:** USB: 5 V; VSYS: 1.8–5.5 V. GPIO mantığı: 3.3 V.. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico W Datasheet](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf)

8 PIO durum makinesi; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

Kartta 26 GPIO ve 3 harici ADC girişi vardır. GP29 kart içi ölçümlerde kullanılır. [Raspberry Pi Pico W Datasheet](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf)

CYW43439: 2.4 GHz Wi-Fi ve Bluetooth 5.2. Kablosuz yonga MCU RAM kapasitesini artırmaz. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html)

### Raspberry Pi Pico 2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=pico-family&profile=pico2) · [Pin referansı](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf#page=5) · [Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf)

- **İlk satış / çıkış:** 2024-08-08. [pico2 launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-2-our-new-5-microcontroller-board-on-sale-now/)
- **İşlemci:** 2 × Arm Cortex-M33 / 2 × Hazard3 RISC-V. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Saat hızı / üst sınır:** 150 MHz. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **RAM:** 520 KB SRAM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Program Flash’ı / depolama:** 4 MB kart üstü QSPI Flash. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf)
- **Sabit ROM:** 32 KB boot ROM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Besleme / mantık:** USB: 5 V; VSYS: 1.8–5.5 V. GPIO mantığı: 3.3 V; 5.5 V giriş toleransı yalnızca veri sayfasındaki koşullarda.. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf)

İki çekirdek aynı anda çalışır; dört çekirdeğin tamamı birlikte kullanılamaz. 12 PIO durum makinesi. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

Kartta 26 GPIO ve 3 harici ADC girişi vardır. GP29 kart içi ölçümlerde kullanılır. [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf)

### Raspberry Pi · 40-pin GPIO

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-40) · [Pin referansı](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc) · [Datasheet](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

- **İlk üretim / çıkış:** Doğrulanamadı. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **İşlemci:** Ortak başlık; tek bir işlemci modeli yok. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **Saat hızı / üst sınır:** Seçilen karta bağlı. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **RAM:** Seçilen karta bağlı. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **Program Flash’ı / depolama:** Seçilen karta bağlı. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **Besleme / mantık:** 5 V ve 3.3 V güç pinleri; GPIO: 3.3 V. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Bu profil yalnızca ortak fiziksel pinleri kapsar. Alternatif işlevler için Pi 4 veya Pi 5 profilini açın. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

### NVIDIA Jetson Orin Nano

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=jetson-orin-nano&profile=jetson-orin-nano) · [Pin referansı](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf#page=25) · [Datasheet](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html), [Jetson Orin Nano Developer Kit Carrier Board Specification](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf)
- **İşlemci:** 6 × Arm Cortex-A78AE. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html)
- **Saat hızı / üst sınır:** 1.5 GHz; Super modu ile 1.7 GHz. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html)
- **RAM:** 8 GB LPDDR5. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html)
- **Program Flash’ı / depolama:** microSD / NVMe; geliştirme modülünde eMMC yok. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html)
- **Besleme / mantık:** DC jak ile besleme; USB-C veri içindir. J12 GPIO: 3.3 V.. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html), [Jetson Orin Nano Developer Kit Carrier Board Specification](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

P3768 taşıyıcı kart başlığıdır. RAM ve saat takılı modüle/JetPack güç moduna bağlıdır; Linux veri yolu numarası taşıyıcı sinyal adıyla aynı olmak zorunda değildir. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Jetson Orin Nano Developer Kit Carrier Board Specification](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf)

### STM32 Blue Pill

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=blue-pill&profile=blue-pill) · [Pin referansı](https://stm32-base.org/boards/STM32F103C8T6-Blue-Pill.html) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **İşlemci:** Arm Cortex-M3. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Saat hızı / üst sınır:** 72 MHz. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **RAM:** 20 KB. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Program Flash’ı / depolama:** 64 KB Flash. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf), [Blue Pill reference schematic (community mirror)](https://stm32-base.org/assets/pdf/boards/original-schematic-STM32F103C8T6-Blue_Pill.pdf)
- **MCU veri sayfasının ilk yayını:** 2007-06-01. [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

C8 için garantili Flash 64 KB’dir; 128 KB varsaymayın. Blue Pill üreticisi ve ilk üretim yılı doğrulanamıyor. Klonların USB direnci, regülatörü ve MCU’su değişebilir. [STM32F103x8 / STM32F103xB datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

Devre / kart belgeleri: [Blue Pill reference schematic (community mirror)](https://stm32-base.org/assets/pdf/boards/original-schematic-STM32F103C8T6-Blue_Pill.pdf)

### STM32F103C8T6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f103c8t6&profile=stm32f103c8t6) · [Pin referansı](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf#page=26) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **Belgelenmiş olduğu tarih:** 2007-06-01. [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **İşlemci:** Arm Cortex-M3. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Saat hızı / üst sınır:** 72 MHz. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **RAM:** 20 KB. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Program Flash’ı / depolama:** 64 KB Flash. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **MCU veri sayfasının ilk yayını:** 2007-06-01. [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

### STM32F103RBT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f103rbt6&profile=stm32f103rbt6) · [Pin referansı](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf#page=25) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **Belgelenmiş olduğu tarih:** 2007-06-01. [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **İşlemci:** Arm Cortex-M3. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Saat hızı / üst sınır:** 72 MHz. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **RAM:** 20 KB. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Program Flash’ı / depolama:** 128 KB Flash. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **MCU veri sayfasının ilk yayını:** 2007-06-01. [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)

### STM32F103VBT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f103vbt6&profile=stm32f103vbt6) · [Pin referansı](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf#page=24) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **Belgelenmiş olduğu tarih:** 2007-06-01. [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **İşlemci:** Arm Cortex-M3. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **Saat hızı / üst sınır:** 72 MHz. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **RAM:** 20 KB. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **Program Flash’ı / depolama:** 128 KB Flash. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **MCU veri sayfasının ilk yayını:** 2007-06-01. [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)

### NUCLEO-F103RB

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f103rb) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=40) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **İşlemci:** Arm Cortex-M3. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Saat hızı / üst sınır:** 72 MHz. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **RAM:** 20 KB. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Program Flash’ı / depolama:** 128 KB Flash. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2007-06-01. [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### NUCLEO-F401RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f401re) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=44) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **İşlemci:** Arm Cortex-M4F. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Saat hızı / üst sınır:** 84 MHz. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **RAM:** 96 KB. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-01-16. [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### NUCLEO-F411RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f411re) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=44) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **İşlemci:** Arm Cortex-M4F. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Saat hızı / üst sınır:** 100 MHz. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **RAM:** 128 KB. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-06-19. [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### NUCLEO-G474RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-g474re) · [Pin referansı](https://www.st.com/resource/en/user_manual/um2505-stm32g4-nucleo64-boards-stmicroelectronics.pdf#page=30) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **İşlemci:** Arm Cortex-M4F. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Saat hızı / üst sınır:** 170 MHz. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **RAM:** 128 KB (96 KB SRAM + 32 KB CCM). [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf), [STM32G4 Nucleo-64 boards (MB1367) user manual](https://www.st.com/resource/en/user_manual/um2505-stm32g4-nucleo64-boards-stmicroelectronics.pdf)
- **MCU veri sayfasının ilk yayını:** 2019-05-15. [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32G4 Nucleo-64 boards (MB1367) user manual](https://www.st.com/resource/en/user_manual/um2505-stm32g4-nucleo64-boards-stmicroelectronics.pdf)

Devre / kart belgeleri: [STM32G4 Nucleo-64 boards (MB1367) user manual](https://www.st.com/resource/en/user_manual/um2505-stm32g4-nucleo64-boards-stmicroelectronics.pdf)

### NUCLEO-H723ZG

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-144&profile=nucleo-h723zg) · [Pin referansı](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **İşlemci:** Arm Cortex-M7 (DP-FPU). [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Saat hızı / üst sınır:** 550 MHz. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **RAM:** 564 KB (TCM + SRAM + 4 KB backup). [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Program Flash’ı / depolama:** 1024 KB Flash. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf), [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)
- **MCU veri sayfasının ilk yayını:** 2020-07-10. [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)

Devre / kart belgeleri: [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)

### Arduino UNO R3

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-uno&profile=arduino-uno-r3) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/uno/boards/uno-rev3/downloads/A000066-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [uno-rev3 hardware manual](https://docs.arduino.cc/hardware/uno-rev3/), [A000066 circuit schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)
- **İşlemci:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Saat hızı / üst sınır:** 16 MHz. [uno-rev3 hardware manual](https://docs.arduino.cc/hardware/uno-rev3/), [A000066 circuit schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash’ı / depolama:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / kalıcı veri:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 5 V. VIN sınırı için kart kılavuzuna bakın.. [uno-rev3 hardware manual](https://docs.arduino.cc/hardware/uno-rev3/), [A000066 circuit schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

20 MHz için 4.5–5.5 V gerekir; daha düşük beslemede veri sayfasındaki hız sınırlamasını kullanın. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

Flash kapasitesi toplamdır; önyükleyici bir bölümünü kullanır. USB seri arabirimi ile başlıktaki UART aynı bağlantı değildir. [uno-rev3 hardware manual](https://docs.arduino.cc/hardware/uno-rev3/)

Devre / kart belgeleri: [Arduino UNO Rev3 through-hole schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)

### Arduino Nano (classic)

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-nano&profile=arduino-nano-classic) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano/downloads/A000005-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano/downloads/A000005-full-pinout.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [nano hardware manual](https://docs.arduino.cc/hardware/nano/), [A000005 circuit schematic](https://docs.arduino.cc/resources/schematics/A000005-schematics.pdf)
- **İşlemci:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Saat hızı / üst sınır:** 16 MHz. [nano hardware manual](https://docs.arduino.cc/hardware/nano/), [A000005 circuit schematic](https://docs.arduino.cc/resources/schematics/A000005-schematics.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash’ı / depolama:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / kalıcı veri:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 5 V. VIN sınırı için kart kılavuzuna bakın.. [nano hardware manual](https://docs.arduino.cc/hardware/nano/), [A000005 circuit schematic](https://docs.arduino.cc/resources/schematics/A000005-schematics.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

20 MHz için 4.5–5.5 V gerekir; daha düşük beslemede veri sayfasındaki hız sınırlamasını kullanın. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

Flash kapasitesi toplamdır; önyükleyici bir bölümünü kullanır. USB seri arabirimi ile başlıktaki UART aynı bağlantı değildir. [nano hardware manual](https://docs.arduino.cc/hardware/nano/)

A6/A7 yalnızca analog girişlerdir. Nano ailesi 2008’de ATmega168 ile tanıtıldı; bu profil ATmega328P sürümüdür. [Original Nano announcement](https://blog.arduino.cc/2008/05/15/arduino-nano-all-in-one-design-for-breadboard-use/)

Devre / kart belgeleri: [Arduino Nano V3.3 schematic](https://docs.arduino.cc/resources/schematics/A000005-schematics.pdf)

### Arduino Mega 2560 Rev3

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-mega-2560&profile=arduino-mega-2560) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/mega/boards/mega-2560/downloads/A000067-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/A000067-datasheet.pdf)

- **Belgelenmiş olduğu tarih:** 2010. [New Uno and Mega 2560 support](https://blog.arduino.cc/2010/09/27/arduino-0020-released-for-windows-and-mac-supports-uno-and-mega-2560/)
- **İşlemci:** 8-bit AVR. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Saat hızı / üst sınır:** 16 MHz. [mega-2560 hardware manual](https://docs.arduino.cc/hardware/mega-2560/), [A000067 circuit schematic](https://docs.arduino.cc/resources/schematics/A000067-schematics.pdf)
- **RAM:** 8 KB SRAM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Program Flash’ı / depolama:** 256 KB Flash. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **EEPROM / kalıcı veri:** 4 KB EEPROM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 5 V. VIN sınırı için kart kılavuzuna bakın.. [mega-2560 hardware manual](https://docs.arduino.cc/hardware/mega-2560/), [A000067 circuit schematic](https://docs.arduino.cc/resources/schematics/A000067-schematics.pdf)

Flash kapasitesi toplamdır; önyükleyici bir bölümünü kullanır. USB seri arabirimi ile başlıktaki UART aynı bağlantı değildir. [mega-2560 hardware manual](https://docs.arduino.cc/hardware/mega-2560/)

4 donanım UART; I²C D20/SDA ve D21/SCL. SPI: D50/MISO, D51/MOSI, D52/SCK, D53/SS ve tekrarlanan ICSP ağları. [mega-2560 hardware manual](https://docs.arduino.cc/hardware/mega-2560/)

Devre / kart belgeleri: [Arduino Mega 2560 Rev3 schematic](https://docs.arduino.cc/resources/schematics/A000067-schematics.pdf)

### Arduino Leonardo

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-uno&profile=arduino-leonardo) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/hero/boards/leonardo/downloads/A000057-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/hero/boards/leonardo/downloads/A000057-full-pinout.pdf)

- **Belgelenmiş olduğu tarih:** 2012. [arduino-leonardo announcement](https://blog.arduino.cc/2012/05/22/arduino-1-0-1-release/)
- **İşlemci:** 8-bit AVR. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Saat hızı / üst sınır:** 16 MHz. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/), [A000057 circuit schematic](https://docs.arduino.cc/resources/schematics/A000057-schematics.pdf)
- **RAM:** 2.5 KB SRAM. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Program Flash’ı / depolama:** 32 KB Flash. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **EEPROM / kalıcı veri:** 1 KB EEPROM. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 5 V. VIN sınırı için kart kılavuzuna bakın.. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/), [A000057 circuit schematic](https://docs.arduino.cc/resources/schematics/A000057-schematics.pdf)

Flash kapasitesi toplamdır; önyükleyici bir bölümünü kullanır. USB seri arabirimi ile başlıktaki UART aynı bağlantı değildir. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)

I²C: D2/D3; SPI: ICSP başlığı. UNO’nun D11–D13 SPI eşlemesini kullanmayın. USB ATmega32U4 içindedir. [Arduino leonardo full pinout](https://docs.arduino.cc/resources/pinouts/A000057-full-pinout.pdf)

### Arduino Micro

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-micro&profile=arduino-micro) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/hero/boards/micro/downloads/A000053-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/hero/boards/micro/downloads/A000053-full-pinout.pdf)

- **İlk satış / çıkış:** 2012-11-08. [arduino-micro announcement](https://blog.arduino.cc/2012/11/08/new-arduino-micro-available/)
- **İşlemci:** 8-bit AVR. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Saat hızı / üst sınır:** 16 MHz. [micro hardware manual](https://docs.arduino.cc/hardware/micro/), [A000053 circuit schematic](https://docs.arduino.cc/resources/schematics/A000053-schematics.pdf)
- **RAM:** 2.5 KB SRAM. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Program Flash’ı / depolama:** 32 KB Flash. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **EEPROM / kalıcı veri:** 1 KB EEPROM. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 5 V. VIN sınırı için kart kılavuzuna bakın.. [micro hardware manual](https://docs.arduino.cc/hardware/micro/), [A000053 circuit schematic](https://docs.arduino.cc/resources/schematics/A000053-schematics.pdf)

Flash kapasitesi toplamdır; önyükleyici bir bölümünü kullanır. USB seri arabirimi ile başlıktaki UART aynı bağlantı değildir. [micro hardware manual](https://docs.arduino.cc/hardware/micro/)

ATmega32U4 yerel USB desteği sunar. SPI, ICSP temaslarında; I²C, D2/SDA ve D3/SCL üzerindedir. [micro hardware manual](https://docs.arduino.cc/hardware/micro/)

### Arduino Nano Every

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-nano&profile=arduino-nano-every) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-every/downloads/ABX00028-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/ABX00028-datasheet.pdf)

- **Duyuru:** 2019-05-17. [arduino-nano-every announcement](https://blog.arduino.cc/2019/05/17/whats-new-at-maker-faire-bay-area-2019/)
- **İşlemci:** 8-bit AVR. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)
- **Saat hızı / üst sınır:** 20 MHz. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/), [ABX00028 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00028-schematics.pdf)
- **RAM:** 6 KB SRAM. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)
- **Program Flash’ı / depolama:** 48 KB Flash. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)
- **EEPROM / kalıcı veri:** 256 B EEPROM. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 5 V. VIN sınırı için kart kılavuzuna bakın.. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/), [ABX00028 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00028-schematics.pdf)

ATmega4809: 48 KB Flash, 6 KB SRAM ve 256 B EEPROM. USB köprüsü SAMD11’dir; Nano Classic ile aynı AVR yazmaç haritasını kullanmaz. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)

### Arduino Nano 33 BLE Sense Rev2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-nano&profile=arduino-nano-33-ble-sense-rev2) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-33-ble-sense-rev2/downloads/ABX00069-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-33-ble-sense-rev2/downloads/ABX00069-full-pinout.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/), [ABX00069 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00069-schematics.pdf)
- **İşlemci:** Arm Cortex-M4F. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **Saat hızı / üst sınır:** 64 MHz. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/), [ABX00069 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00069-schematics.pdf)
- **RAM:** 256 KB SRAM. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **Program Flash’ı / depolama:** 1 MB Flash. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 3.3 V. VIN sınırı için kart kılavuzuna bakın.. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/), [ABX00069 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00069-schematics.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

NINA-B306/nRF52840: BLE, yerel USB ve sensörler. Rev2 IMU: BMI270 + BMM150; sıcaklık/nem: HS3003. GPIO 5 V toleranslı değildir. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)

### Arduino UNO R4 Minima

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-uno&profile=arduino-uno-r4-minima) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/uno/boards/uno-r4-minima/downloads/ABX00080-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/ABX00080-datasheet.pdf)

- **İlk satış / çıkış:** 2023-06-26. [UNO R4 available](https://blog.arduino.cc/2023/06/26/uno-r4-the-new-dimension-of-making/)
- **İşlemci:** Arm Cortex-M4F. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Saat hızı / üst sınır:** 48 MHz. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/), [ABX00080 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00080-schematics.pdf)
- **RAM:** 32 KB SRAM. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Program Flash’ı / depolama:** 256 KB Flash. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **EEPROM / kalıcı veri:** 8 KB data Flash (EEPROM emulation). [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 5 V. VIN sınırı için kart kılavuzuna bakın.. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/), [ABX00080 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00080-schematics.pdf)

RA4M1: 12 bit DAC, RTC ve CAN denetleyicisi. CAN fiziksel hat bağlantısı için harici alıcı-verici gerekir. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)

### Arduino UNO R4 WiFi

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-uno&profile=arduino-uno-r4-wifi) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/uno/boards/uno-r4-wifi/downloads/ABX00087-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/ABX00087-datasheet.pdf)

- **İlk satış / çıkış:** 2023-06-26. [UNO R4 available](https://blog.arduino.cc/2023/06/26/uno-r4-the-new-dimension-of-making/)
- **İşlemci:** Arm Cortex-M4F. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Saat hızı / üst sınır:** 48 MHz. [uno-r4-wifi hardware manual](https://docs.arduino.cc/hardware/uno-r4-wifi/), [ABX00087 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00087-schematics.pdf)
- **RAM:** 32 KB SRAM. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Program Flash’ı / depolama:** 256 KB Flash. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **EEPROM / kalıcı veri:** 8 KB data Flash (EEPROM emulation). [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 5 V. VIN sınırı için kart kılavuzuna bakın.. [uno-r4-wifi hardware manual](https://docs.arduino.cc/hardware/uno-r4-wifi/), [ABX00087 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00087-schematics.pdf)

RA4M1 ana uygulama MCU’sudur; ESP32-S3 Wi-Fi/BLE ve USB seri köprüsünü sağlar. İki MCU’nun RAM ve Flash kapasitelerini toplamayın. [uno-r4-wifi hardware manual](https://docs.arduino.cc/hardware/uno-r4-wifi/)

### Arduino Nano ESP32

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-nano&profile=arduino-nano-esp32) · [Pin referansı](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-esp32/downloads/ABX00083-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-esp32/downloads/ABX00083-schematics.pdf)

- **Duyuru:** 2023-07-17. [arduino-nano-esp32 announcement](https://blog.arduino.cc/2023/07/17/introducing-the-nano-esp32-thats-iot/)
- **İşlemci:** 2 × Xtensa LX7. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Saat hızı / üst sınır:** 240 MHz. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/), [ABX00083 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)
- **RAM:** 512 KB SRAM + 16 KB RTC SRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Program Flash’ı / depolama:** 16 MB QSPI Flash. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/), [ABX00083 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)
- **Sabit ROM:** 384 KB ROM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Harici PSRAM:** 8 MB PSRAM. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/), [ABX00083 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)
- **Besleme / mantık:** USB: 5 V; başlık GPIO: 3.3 V. VIN sınırı için kart kılavuzuna bakın.. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/), [ABX00083 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)

u-blox NORA-W106 / ESP32-S3. Arduino D numarası ve ESP32 GPIO numarası farklıdır; Tools > Pin Numbering seçimini eşleştirin. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/)

Devre / kart belgeleri: [Arduino Nano ESP32 schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)

### ESP32-DevKitC V4

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-devkitc-v4&profile=esp32-devkitc-v4) · [Pin referansı](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)
- **İşlemci:** 2 × Xtensa LX6. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Saat hızı / üst sınır:** 240 MHz. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **RAM:** 520 KB SRAM + 16 KB RTC SRAM. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Program Flash’ı / depolama:** WROOM-32E: 4 / 8 / 16 MB; sipariş koduna bağlı. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html), [ESP32-WROOM-32E / 32UE module datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)
- **Sabit ROM:** 448 KB ROM. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Harici PSRAM:** Bu profilde takılı PSRAM yok. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html), [ESP32-WROOM-32E / 32UE module datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)
- **Besleme / mantık:** USB / 5V / 3V3 güç seçeneklerini kılavuzdaki kurallara göre kullanın. GPIO: 3.3 V.. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html), [ESP32-WROOM-32E / 32UE module datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

GPIO matrix satırları yönlendirme yeteneğini gösterir; varsayılan yazılım pinleri değildir. Strapping pinlerini reset sırasında uygun seviyede tutun. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)

Devre / kart belgeleri: [ESP32-DevKitC V4 schematic](https://dl.espressif.com/dl/schematics/esp32_devkitc_v4_sch.pdf)

### ESP32-DevKitC V4 · WROVER

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-devkitc-v4&profile=esp32-devkitc-v4-wrover) · [Pin referansı](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)
- **İşlemci:** 2 × Xtensa LX6. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Saat hızı / üst sınır:** 240 MHz. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **RAM:** 520 KB SRAM + 16 KB RTC SRAM. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Program Flash’ı / depolama:** WROVER varyantına bağlı; modül kodunu kontrol edin. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)
- **Sabit ROM:** 448 KB ROM. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Harici PSRAM:** WROVER modülüne bağlı; B/E sürümlerinde 8 MB. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)
- **Besleme / mantık:** USB / 5V / 3V3 güç seçeneklerini kılavuzdaki kurallara göre kullanın. GPIO: 3.3 V.. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

GPIO matrix satırları yönlendirme yeteneğini gösterir; varsayılan yazılım pinleri değildir. Strapping pinlerini reset sırasında uygun seviyede tutun. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)

Devre / kart belgeleri: [ESP32-DevKitC V4 schematic](https://dl.espressif.com/dl/schematics/esp32_devkitc_v4_sch.pdf)

### ESP32-C3-DevKitM-1

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-c3-devkitm-1&profile=esp32-c3-devkitm-1) · [Pin referansı](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)
- **İşlemci:** 1 × 32-bit RISC-V. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Saat hızı / üst sınır:** 160 MHz. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **RAM:** 400 KB SRAM (16 KB cache included) + 8 KB RTC SRAM. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Program Flash’ı / depolama:** 4 MB Flash. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)
- **Sabit ROM:** 384 KB ROM. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Harici PSRAM:** Bu profilde takılı PSRAM yok. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)
- **Besleme / mantık:** USB / 5V / 3V3 güç seçeneklerini kılavuzdaki kurallara göre kullanın. GPIO: 3.3 V.. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

GPIO matrix satırları yönlendirme yeteneğini gösterir; varsayılan yazılım pinleri değildir. Strapping pinlerini reset sırasında uygun seviyede tutun. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)

Devre / kart belgeleri: [ESP32-C3-DevKitM-1 schematic](https://dl.espressif.com/dl/schematics/SCH_ESP32-C3-DEVKITM-1_V1_20200915A.pdf)

### ESP32-S3-DevKitC-1 v1.1

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-s3-devkitc-1&profile=esp32-s3-devkitc-1) · [Pin referansı](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **İşlemci:** 2 × Xtensa LX7. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Saat hızı / üst sınır:** 240 MHz. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **RAM:** 512 KB SRAM + 16 KB RTC SRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Program Flash’ı / depolama:** 8 MB Flash. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Sabit ROM:** 384 KB ROM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Harici PSRAM:** Bu profilde takılı PSRAM yok. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Besleme / mantık:** USB / 5V / 3V3 güç seçeneklerini kılavuzdaki kurallara göre kullanın. GPIO: 3.3 V.. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

GPIO matrix satırları yönlendirme yeteneğini gösterir; varsayılan yazılım pinleri değildir. Strapping pinlerini reset sırasında uygun seviyede tutun. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

v1.1 RGB LED: GPIO38; ilk sürümde GPIO48. N8R8 sürümünde GPIO35/36/37 Octal PSRAM için ayrılmıştır. [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

Devre / kart belgeleri: [ESP32-S3-DevKitC-1 v1.1 schematic](https://dl.espressif.com/dl/schematics/SCH_ESP32-S3-DevKitC-1_V1.1_20221130.pdf)

### ESP32-S3-DevKitC-1 v1.1 · Octal memory

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-s3-devkitc-1&profile=esp32-s3-devkitc-1-octal) · [Pin referansı](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **İşlemci:** 2 × Xtensa LX7. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Saat hızı / üst sınır:** 240 MHz. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **RAM:** 512 KB SRAM + 16 KB RTC SRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Program Flash’ı / depolama:** 8 MB Flash. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Sabit ROM:** 384 KB ROM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Harici PSRAM:** 8 MB Octal PSRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Besleme / mantık:** USB / 5V / 3V3 güç seçeneklerini kılavuzdaki kurallara göre kullanın. GPIO: 3.3 V.. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

GPIO matrix satırları yönlendirme yeteneğini gösterir; varsayılan yazılım pinleri değildir. Strapping pinlerini reset sırasında uygun seviyede tutun. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

v1.1 RGB LED: GPIO38; ilk sürümde GPIO48. N8R8 sürümünde GPIO35/36/37 Octal PSRAM için ayrılmıştır. [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

Devre / kart belgeleri: [ESP32-S3-DevKitC-1 v1.1 schematic](https://dl.espressif.com/dl/schematics/SCH_ESP32-S3-DevKitC-1_V1.1_20221130.pdf)

### ESP32-C6-DevKitC-1 v1.2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-c6-devkitc-1&profile=esp32-c6-devkitc-1) · [Pin referansı](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)
- **İşlemci:** 1 × HP RISC-V + LP RISC-V. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)
- **Saat hızı / üst sınır:** 160 MHz HP / 20 MHz LP. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)
- **RAM:** 512 KB HP SRAM + 16 KB LP SRAM. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)
- **Program Flash’ı / depolama:** 8 MB Flash. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)
- **Sabit ROM:** 320 KB ROM. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)
- **Harici PSRAM:** Bu profilde takılı PSRAM yok. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)
- **Besleme / mantık:** USB / 5V / 3V3 güç seçeneklerini kılavuzdaki kurallara göre kullanın. GPIO: 3.3 V.. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

GPIO matrix satırları yönlendirme yeteneğini gösterir; varsayılan yazılım pinleri değildir. Strapping pinlerini reset sırasında uygun seviyede tutun. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)

Devre / kart belgeleri: [ESP32-C6-DevKitC-1 v1.2 schematic](https://dl.espressif.com/dl/schematics/esp32-c6-devkitc-1-schematics_v1.2.pdf)

### ATmega328P · PDIP-28

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega328p-pdip28&profile=atmega328p-pdip28) · [Pin referansı](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf#page=14) · [Datasheet](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **İşlemci:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Saat hızı / üst sınır:** 20 MHz. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash’ı / depolama:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / kalıcı veri:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Besleme / mantık:** VCC, AVCC ve tüm GND pinlerini bağlayın; osilatör/fuse ve RESET koşulları Arduino kartından bağımsızdır.. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

20 MHz için 4.5–5.5 V gerekir; daha düşük beslemede veri sayfasındaki hız sınırlamasını kullanın. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

### ATmega328P · TQFP-32

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega328p-tqfp32&profile=atmega328p-tqfp32) · [Pin referansı](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf#page=16) · [Datasheet](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **İşlemci:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Saat hızı / üst sınır:** 20 MHz. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash’ı / depolama:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / kalıcı veri:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Besleme / mantık:** VCC, AVCC ve tüm GND pinlerini bağlayın; osilatör/fuse ve RESET koşulları Arduino kartından bağımsızdır.. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

20 MHz için 4.5–5.5 V gerekir; daha düşük beslemede veri sayfasındaki hız sınırlamasını kullanın. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

### ATmega328P · QFN/MLF-32

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega328p-qfn32&profile=atmega328p-qfn32) · [Pin referansı](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf#page=17) · [Datasheet](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **İşlemci:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Saat hızı / üst sınır:** 20 MHz. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash’ı / depolama:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / kalıcı veri:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Besleme / mantık:** VCC, AVCC ve tüm GND pinlerini bağlayın; osilatör/fuse ve RESET koşulları Arduino kartından bağımsızdır.. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

20 MHz için 4.5–5.5 V gerekir; daha düşük beslemede veri sayfasındaki hız sınırlamasını kullanın. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

### ATmega328P · QFN/MLF-28

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega328p-qfn28&profile=atmega328p-qfn28) · [Pin referansı](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf#page=15) · [Datasheet](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **İşlemci:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Saat hızı / üst sınır:** 20 MHz. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash’ı / depolama:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / kalıcı veri:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Besleme / mantık:** VCC, AVCC ve tüm GND pinlerini bağlayın; osilatör/fuse ve RESET koşulları Arduino kartından bağımsızdır.. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

20 MHz için 4.5–5.5 V gerekir; daha düşük beslemede veri sayfasındaki hız sınırlamasını kullanın. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

### ATmega2560 · TQFP-100

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega2560-tqfp100&profile=atmega2560-tqfp100) · [Pin referansı](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf#page=2) · [Datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **İşlemci:** 8-bit AVR. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Saat hızı / üst sınır:** 16 MHz. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **RAM:** 8 KB SRAM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Program Flash’ı / depolama:** 256 KB Flash. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **EEPROM / kalıcı veri:** 4 KB EEPROM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Besleme / mantık:** VCC, AVCC ve tüm GND pinlerini bağlayın; osilatör/fuse ve RESET koşulları Arduino kartından bağımsızdır.. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

### ATmega2561 · TQFP-64

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega2561-tqfp64&profile=atmega2561-tqfp64) · [Pin referansı](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf#page=4) · [Datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **İşlemci:** 8-bit AVR. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Saat hızı / üst sınır:** 16 MHz. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **RAM:** 8 KB SRAM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Program Flash’ı / depolama:** 256 KB Flash. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **EEPROM / kalıcı veri:** 4 KB EEPROM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Besleme / mantık:** VCC, AVCC ve tüm GND pinlerini bağlayın; osilatör/fuse ve RESET koşulları Arduino kartından bağımsızdır.. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

### Seeed Studio XIAO RP2040

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=seeed-xiao&profile=xiao-rp2040) · [Pin referansı](https://wiki.seeedstudio.com/XIAO-RP2040/) · [Datasheet](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/Seeed-Studio-XIAO-RP2040-v1.3.pdf)

- **İlk satış / çıkış:** 2021. [XIAO RP2040 launch history](https://www.seeedstudio.com/blog/2021/07/29/new-product-post-xiao-rp2040/)
- **İşlemci:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Saat hızı / üst sınır:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash’ı / depolama:** 2 MB QSPI Flash. [XIAO RP2040 specifications](https://wiki.seeedstudio.com/XIAO-RP2040/), [Seeed Studio XIAO RP2040 Schematic](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/Seeed-Studio-XIAO-RP2040-v1.3.pdf)
- **Sabit ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Besleme / mantık:** USB-C: 5 V; GPIO: 3.3 V. 5 V güç pini GPIO toleransı anlamına gelmez.. [XIAO RP2040 specifications](https://wiki.seeedstudio.com/XIAO-RP2040/), [Seeed Studio XIAO RP2040 Schematic](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/Seeed-Studio-XIAO-RP2040-v1.3.pdf)

8 PIO durum makinesi; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

Standart 14 temaslı XIAO sürümü: 11 GPIO + 3 güç/toprak teması. Plus sürümlerinin ek pinlerini bu haritaya uygulamayın. [XIAO RP2040 specifications](https://wiki.seeedstudio.com/XIAO-RP2040/)

Devre / kart belgeleri: [Seeed Studio XIAO RP2040 Schematic](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/Seeed-Studio-XIAO-RP2040-v1.3.pdf)

### Seeed Studio XIAO ESP32C3

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=seeed-xiao&profile=xiao-esp32c3) · [Pin referansı](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/) · [Datasheet](https://files.seeedstudio.com/wiki/XIAO_WiFi/Resources/XIAO_ESP32C3_v1.3_SCH_260116.pdf)

- **İlk satış / çıkış:** 2022-07-07. [XIAO ESP32C3 launch](https://www.seeedstudio.com/blog/2022/07/11/voice-needed-do-you-know-xiao-esp32c3-can-can/)
- **İşlemci:** 1 × 32-bit RISC-V. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Saat hızı / üst sınır:** 160 MHz. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **RAM:** 400 KB SRAM (16 KB cache included) + 8 KB RTC SRAM. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Program Flash’ı / depolama:** 4 MB Flash. [XIAO ESP32C3 specifications](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/), [Seeed Studio XIAO ESP32C3 Schematic](https://files.seeedstudio.com/wiki/XIAO_WiFi/Resources/XIAO_ESP32C3_v1.3_SCH_260116.pdf)
- **Sabit ROM:** 384 KB ROM. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Besleme / mantık:** USB-C: 5 V; GPIO: 3.3 V. 5 V güç pini GPIO toleransı anlamına gelmez.. [XIAO ESP32C3 specifications](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/), [Seeed Studio XIAO ESP32C3 Schematic](https://files.seeedstudio.com/wiki/XIAO_WiFi/Resources/XIAO_ESP32C3_v1.3_SCH_260116.pdf)

Standart 14 temaslı XIAO sürümü: 11 GPIO + 3 güç/toprak teması. Plus sürümlerinin ek pinlerini bu haritaya uygulamayın. [XIAO ESP32C3 specifications](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/)

Devre / kart belgeleri: [Seeed Studio XIAO ESP32C3 Schematic](https://files.seeedstudio.com/wiki/XIAO_WiFi/Resources/XIAO_ESP32C3_v1.3_SCH_260116.pdf)

### Seeed Studio XIAO SAMD21

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=seeed-xiao&profile=xiao-samd21) · [Pin referansı](https://wiki.seeedstudio.com/Seeeduino-XIAO/) · [Datasheet](https://files.seeedstudio.com/wiki/Seeeduino-XIAO/res/Seeeduino-XIAO-v1.0-SCH-191112.pdf)

- **Belgelenmiş olduğu tarih:** 2020. [Seeeduino XIAO manufacturer project roundup](https://www.seeedstudio.com/blog/2020/05/08/seeeduino-xiao-community-projects-collection-whats-your-next-project-idea-made-by-seeeeduino-xiao/)
- **İşlemci:** Arm Cortex-M0+. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/)
- **Saat hızı / üst sınır:** 48 MHz. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/)
- **RAM:** 32 KB SRAM. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/)
- **Program Flash’ı / depolama:** 256 KB internal Flash. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/), [Seeed Studio XIAO SAMD21 Schematic](https://files.seeedstudio.com/wiki/Seeeduino-XIAO/res/Seeeduino-XIAO-v1.0-SCH-191112.pdf)
- **Besleme / mantık:** USB-C: 5 V; GPIO: 3.3 V. 5 V güç pini GPIO toleransı anlamına gelmez.. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/), [Seeed Studio XIAO SAMD21 Schematic](https://files.seeedstudio.com/wiki/Seeeduino-XIAO/res/Seeeduino-XIAO-v1.0-SCH-191112.pdf)

Standart 14 temaslı XIAO sürümü: 11 GPIO + 3 güç/toprak teması. Plus sürümlerinin ek pinlerini bu haritaya uygulamayın. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/)

Devre / kart belgeleri: [Seeed Studio XIAO SAMD21 Schematic](https://files.seeedstudio.com/wiki/Seeeduino-XIAO/res/Seeeduino-XIAO-v1.0-SCH-191112.pdf)

### BBC micro:bit V2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=microbit-v2&profile=microbit-v2) · [Pin referansı](https://tech.microbit.org/hardware/edgeconnector/) · [Datasheet](https://tech.microbit.org/hardware/schematic/)

- **Duyuru:** 2020-10-13. [New BBC micro:bit announced](https://microbit.org/news/2020-10-13/meet-the-new-bbc-microbit/)
- **İşlemci:** Arm Cortex-M4F. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)
- **Saat hızı / üst sınır:** 64 MHz. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)
- **RAM:** 128 KB SRAM. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)
- **Program Flash’ı / depolama:** 512 KB Flash. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)
- **Besleme / mantık:** USB: 5 V veya pil bağlantısı; kenar konektörü mantığı yaklaşık 3 V.. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/), [BBC micro:bit V2 Schematic](https://tech.microbit.org/hardware/schematic/)

LED matrisi, düğmeler ve dokunma işlevleri bazı GPIO’ları paylaşır. nRF52833 uygulama MCU’su ile USB arayüz işlemcisini ayırın. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)

Devre / kart belgeleri: [BBC micro:bit V2 Schematic](https://tech.microbit.org/hardware/schematic/)

### Adafruit Feather RP2040

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=adafruit-feather-rp2040&profile=adafruit-feather-rp2040) · [Pin referansı](https://github.com/adafruit/Adafruit-Feather-RP2040-PCB/blob/be3f4b3260411d27569d3afe030247dc0e747284/Adafruit%20Feather%20RP2040%20pinout.pdf) · [Datasheet](https://learn.adafruit.com/adafruit-feather-rp2040-pico/downloads)

- **Belgelenmiş olduğu tarih:** 2021-03-05. [Feather RP2040 overview](https://learn.adafruit.com/adafruit-feather-rp2040-pico/overview)
- **İşlemci:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Saat hızı / üst sınır:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash’ı / depolama:** 8 MB SPI Flash. [Feather RP2040 overview](https://learn.adafruit.com/adafruit-feather-rp2040-pico/overview)
- **Sabit ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Besleme / mantık:** USB: 5 V / tek hücreli LiPo; GPIO: 3.3 V. Kart üstü LiPo şarjı: 200 mA.. [Feather RP2040 overview](https://learn.adafruit.com/adafruit-feather-rp2040-pico/overview)

8 PIO durum makinesi; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

STEMMA QT, kartın I²C hattını kullanır. 133 MHz yonganın sınırıdır; ürün rehberi yaklaşık 125 MHz çalışma değerini de belirtir. [Feather RP2040 overview](https://learn.adafruit.com/adafruit-feather-rp2040-pico/overview)

### Teensy 4.1

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=teensy-41&profile=teensy-41) · [Pin referansı](https://www.pjrc.com/teensy/card11a_rev4_web.pdf) · [Datasheet](https://www.pjrc.com/teensy/card11b_rev4_web.pdf)

- **İlk satış / çıkış:** 2020. [Teensy 4.1 released](https://www.pjrc.com/teensy-4-1-released/)
- **İşlemci:** Arm Cortex-M7 (DP-FPU). [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html)
- **Saat hızı / üst sınır:** 600 MHz. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html)
- **RAM:** 1024 KB RAM. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html)
- **Program Flash’ı / depolama:** 8 MB kart üstü Flash; 7936 KB program alanı. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html), [Teensy 4.1 Schematic](https://www.pjrc.com/teensy/schematic41.png)
- **EEPROM / kalıcı veri:** 4 KB emüle EEPROM. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html), [Teensy 4.1 Schematic](https://www.pjrc.com/teensy/schematic41.png)
- **Besleme / mantık:** USB / VIN: 5 V; GPIO: 3.3 V, 5 V toleranslı değil.. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html), [Teensy 4.1 Schematic](https://www.pjrc.com/teensy/schematic41.png)

Flash’ın üst 256 KB’ı EEPROM emülasyonu ve kurtarma programına ayrılmıştır. Ek RAM/Flash lehim yerleri boş olabilir. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html)

Devre / kart belgeleri: [Teensy 4.1 Schematic](https://www.pjrc.com/teensy/schematic41.png)

### BeagleBone Black

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=beaglebone-black&profile=beaglebone-black) · [Pin referansı](https://docs.beagleboard.org/boards/beaglebone/black/ch07.html) · [Datasheet](https://docs.beagleboard.org/boards/beaglebone/black/ch07.html)

- **Belgelenmiş olduğu tarih:** 2013. [BeagleBone Black document and board history](https://docs.beagleboard.org/boards/beaglebone/black/ch02.html)
- **İşlemci:** Arm Cortex-A8 + 2 × PRU. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html)
- **Saat hızı / üst sınır:** 1 GHz. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html)
- **RAM:** 512 MB DDR3L. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html)
- **Program Flash’ı / depolama:** Rev C: 4 GB eMMC; eski sürümlerde 2 GB; microSD. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html)
- **Besleme / mantık:** 5 V DC / USB; dijital GPIO: 3.3 V; analog girişler en fazla 1.8 V.. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html), [BeagleBone Black System Reference Manual · Chapter 7 Expansion Headers P8/P9](https://docs.beagleboard.org/boards/beaglebone/black/ch07.html)

P8/P9 pinleri HDMI ve eMMC ile paylaşılabilir. Device Tree/pinmux ayarları gerekir. Analog pinlere 3.3 V uygulamayın. [BeagleBone Black System Reference Manual · Chapter 7 Expansion Headers P8/P9](https://docs.beagleboard.org/boards/beaglebone/black/ch07.html)

### RP2350A

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=rp2350a&profile=rp2350a) · [Pin referansı](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=16) · [Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

- **Yonga tanıtımı:** 2024-08-08. [pico2 launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-2-our-new-5-microcontroller-board-on-sale-now/)
- **İşlemci:** 2 × Arm Cortex-M33 / 2 × Hazard3 RISC-V. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Saat hızı / üst sınır:** 150 MHz. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **RAM:** 520 KB SRAM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Program Flash’ı / depolama:** Dahili Flash yok; harici QSPI Flash gerekir.. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Sabit ROM:** 32 KB boot ROM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Besleme / mantık:** Tüm besleme, toprak ve açık pad bağlantıları veri sayfasına göre bağlanmalıdır; kart regülatörü yoktur.. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

İki çekirdek aynı anda çalışır; dört çekirdeğin tamamı birlikte kullanılamaz. 12 PIO durum makinesi. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

### RP2350B

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=rp2350b&profile=rp2350b) · [Pin referansı](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=17) · [Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

- **Yonga tanıtımı:** 2024-08-08. [pico2 launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-2-our-new-5-microcontroller-board-on-sale-now/)
- **İşlemci:** 2 × Arm Cortex-M33 / 2 × Hazard3 RISC-V. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Saat hızı / üst sınır:** 150 MHz. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **RAM:** 520 KB SRAM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Program Flash’ı / depolama:** Dahili Flash yok; harici QSPI Flash gerekir.. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Sabit ROM:** 32 KB boot ROM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Besleme / mantık:** Tüm besleme, toprak ve açık pad bağlantıları veri sayfasına göre bağlanmalıdır; kart regülatörü yoktur.. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

İki çekirdek aynı anda çalışır; dört çekirdeğin tamamı birlikte kullanılamaz. 12 PIO durum makinesi. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

### STM32F401RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f401ret6&profile=stm32f401ret6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F401R(D-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

- **Belgelenmiş olduğu tarih:** 2014-01-16. [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **İşlemci:** Arm Cortex-M4F. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Saat hızı / üst sınır:** 84 MHz. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **RAM:** 96 KB. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-01-16. [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

### STM32F411RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f411ret6&profile=stm32f411ret6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F411R(C-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

- **Belgelenmiş olduğu tarih:** 2014-06-19. [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **İşlemci:** Arm Cortex-M4F. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Saat hızı / üst sınır:** 100 MHz. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **RAM:** 128 KB. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-06-19. [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

### STM32G474RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32g474ret6&profile=stm32g474ret6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32G474R(B-C-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

- **Belgelenmiş olduğu tarih:** 2019-05-15. [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **İşlemci:** Arm Cortex-M4F. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Saat hızı / üst sınır:** 170 MHz. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **RAM:** 128 KB (96 KB SRAM + 32 KB CCM). [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **MCU veri sayfasının ilk yayını:** 2019-05-15. [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

### STM32H723ZGT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32h723zgt6&profile=stm32h723zgt6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32H723ZGTx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

- **Belgelenmiş olduğu tarih:** 2020-07-10. [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **İşlemci:** Arm Cortex-M7 (DP-FPU). [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Saat hızı / üst sınır:** 550 MHz. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **RAM:** 564 KB (TCM + SRAM + 4 KB backup). [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Program Flash’ı / depolama:** 1024 KB Flash. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **MCU veri sayfasının ilk yayını:** 2020-07-10. [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

### RP2040

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=rp2040&profile=rp2040) · [Pin referansı](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf#page=12) · [Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

- **Yonga tanıtımı:** 2021-01-21. [pico launch announcement](https://www.raspberrypi.com/news/raspberry-pi-silicon-pico-now-on-sale/)
- **İşlemci:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Saat hızı / üst sınır:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash’ı / depolama:** Dahili Flash yok; harici QSPI Flash gerekir.. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Sabit ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Besleme / mantık:** Tüm besleme, toprak ve açık pad bağlantıları veri sayfasına göre bağlanmalıdır; kart regülatörü yoktur.. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

8 PIO durum makinesi; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

### NUCLEO-F446RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f446re) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=48) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **İşlemci:** Arm Cortex-M4F. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Saat hızı / üst sınır:** 180 MHz. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **RAM:** 128 KB SRAM + 4 KB backup. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2015-02-17. [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32F446RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f446ret6&profile=stm32f446ret6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F446R(C-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

- **Belgelenmiş olduğu tarih:** 2015-02-17. [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **İşlemci:** Arm Cortex-M4F. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Saat hızı / üst sınır:** 180 MHz. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **RAM:** 128 KB SRAM + 4 KB backup. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **MCU veri sayfasının ilk yayını:** 2015-02-17. [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

### NUCLEO-F303RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f303re) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=42) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **İşlemci:** Arm Cortex-M4F. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Saat hızı / üst sınır:** 72 MHz. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **RAM:** 80 KB (64 KB SRAM + 16 KB CCM). [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2015-01-20. [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32F303RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f303ret6&profile=stm32f303ret6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F303R(D-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

- **Belgelenmiş olduğu tarih:** 2015-01-20. [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **İşlemci:** Arm Cortex-M4F. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Saat hızı / üst sınır:** 72 MHz. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **RAM:** 80 KB (64 KB SRAM + 16 KB CCM). [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **MCU veri sayfasının ilk yayını:** 2015-01-20. [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

### NUCLEO-L476RG

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-l476rg) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=53) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **İşlemci:** Arm Cortex-M4F. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Saat hızı / üst sınır:** 80 MHz. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **RAM:** 128 KB SRAM. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Program Flash’ı / depolama:** 1024 KB Flash. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2015-05-29. [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32L476RGT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32l476rgt6&profile=stm32l476rgt6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32L476R(C-E-G)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

- **Belgelenmiş olduğu tarih:** 2015-05-29. [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **İşlemci:** Arm Cortex-M4F. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Saat hızı / üst sınır:** 80 MHz. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **RAM:** 128 KB SRAM. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Program Flash’ı / depolama:** 1024 KB Flash. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **MCU veri sayfasının ilk yayını:** 2015-05-29. [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

### NUCLEO-F072RB

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f072rb) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=38) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **İşlemci:** Arm Cortex-M0. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Saat hızı / üst sınır:** 48 MHz. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **RAM:** 16 KB SRAM. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Program Flash’ı / depolama:** 128 KB Flash. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-01-13. [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32F072RBT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f072rbt6&profile=stm32f072rbt6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F072R(8-B)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

- **Belgelenmiş olduğu tarih:** 2014-01-13. [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **İşlemci:** Arm Cortex-M0. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Saat hızı / üst sınır:** 48 MHz. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **RAM:** 16 KB SRAM. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Program Flash’ı / depolama:** 128 KB Flash. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-01-13. [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

### NUCLEO-L053R8

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-l053r8) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=46) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **İşlemci:** Arm Cortex-M0+. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Saat hızı / üst sınır:** 32 MHz. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **RAM:** 8 KB SRAM. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Program Flash’ı / depolama:** 64 KB Flash. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **EEPROM / kalıcı veri:** 2 KB data EEPROM. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-02-07. [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32L053R8T6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32l053r8t6&profile=stm32l053r8t6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32L053R(6-8)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

- **Belgelenmiş olduğu tarih:** 2014-02-07. [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **İşlemci:** Arm Cortex-M0+. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Saat hızı / üst sınır:** 32 MHz. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **RAM:** 8 KB SRAM. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Program Flash’ı / depolama:** 64 KB Flash. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **EEPROM / kalıcı veri:** 2 KB data EEPROM. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-02-07. [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

### NUCLEO-L152RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-l152re) · [Pin referansı](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=51) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **İşlemci:** Arm Cortex-M3. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Saat hızı / üst sınır:** 32 MHz. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **RAM:** 80 KB SRAM. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **EEPROM / kalıcı veri:** 16 KB data EEPROM. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU veri sayfasının ilk yayını:** 2013-10-31. [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Devre / kart belgeleri: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32L152RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32l152ret6&profile=stm32l152ret6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32L152RETx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

- **Belgelenmiş olduğu tarih:** 2013-10-31. [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **İşlemci:** Arm Cortex-M3. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Saat hızı / üst sınır:** 32 MHz. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **RAM:** 80 KB SRAM. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **EEPROM / kalıcı veri:** 16 KB data EEPROM. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **MCU veri sayfasının ilk yayını:** 2013-10-31. [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

### STM32F407VGT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f407vgt6&profile=stm32f407vgt6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F407V(E-G)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)

- **Belgelenmiş olduğu tarih:** 2011-09-15. [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **İşlemci:** Arm Cortex-M4F. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **Saat hızı / üst sınır:** 168 MHz. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **RAM:** 192 KB (128 KB SRAM + 64 KB CCM) + 4 KB backup. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **Program Flash’ı / depolama:** 1024 KB Flash. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **MCU veri sayfasının ilk yayını:** 2011-09-15. [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)

### STM32F405RGT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f405rgt6&profile=stm32f405rgt6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F405RGTx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)

- **Belgelenmiş olduğu tarih:** 2011-09-15. [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **İşlemci:** Arm Cortex-M4F. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **Saat hızı / üst sınır:** 168 MHz. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **RAM:** 192 KB (128 KB SRAM + 64 KB CCM) + 4 KB backup. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **Program Flash’ı / depolama:** 1024 KB Flash. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **MCU veri sayfasının ilk yayını:** 2011-09-15. [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)

### NUCLEO-F042K6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-32&profile=nucleo-f042k6) · [Pin referansı](https://www.st.com/resource/en/user_manual/dm00231744.pdf#page=24) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **İşlemci:** Arm Cortex-M0. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Saat hızı / üst sınır:** 48 MHz. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **RAM:** 6 KB SRAM. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Program Flash’ı / depolama:** 32 KB Flash. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf), [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-02-25. [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)

Devre / kart belgeleri: [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)

### STM32F042K6T6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f042k6t6&profile=stm32f042k6t6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F042K(4-6)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

- **Belgelenmiş olduğu tarih:** 2014-02-25. [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **İşlemci:** Arm Cortex-M0. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Saat hızı / üst sınır:** 48 MHz. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **RAM:** 6 KB SRAM. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Program Flash’ı / depolama:** 32 KB Flash. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-02-25. [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

### NUCLEO-L432KC

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-32&profile=nucleo-l432kc) · [Pin referansı](https://www.st.com/resource/en/user_manual/dm00231744.pdf#page=30) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **İşlemci:** Arm Cortex-M4F. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Saat hızı / üst sınır:** 80 MHz. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **RAM:** 64 KB SRAM. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Program Flash’ı / depolama:** 256 KB Flash. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf), [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)
- **MCU veri sayfasının ilk yayını:** 2016-02-08. [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)

Devre / kart belgeleri: [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)

### STM32L432KCU6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32l432kcu6&profile=stm32l432kcu6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32L432K(B-C)Ux.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

- **Belgelenmiş olduğu tarih:** 2016-02-08. [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **İşlemci:** Arm Cortex-M4F. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Saat hızı / üst sınır:** 80 MHz. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **RAM:** 64 KB SRAM. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Program Flash’ı / depolama:** 256 KB Flash. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **MCU veri sayfasının ilk yayını:** 2016-02-08. [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

### NUCLEO-F767ZI

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-144&profile=nucleo-f767zi) · [Pin referansı](https://www.st.com/resource/en/user_manual/dm00244518-stm32-nucleo144-boards-stmicroelectronics.pdf) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **İşlemci:** Arm Cortex-M7 (DP-FPU). [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Saat hızı / üst sınır:** 216 MHz. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **RAM:** 512 KB SRAM + 16 KB ITCM + 4 KB backup. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Program Flash’ı / depolama:** 2048 KB Flash. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf), [STM32 Nucleo-144 · UM1974 Rev 11](https://www.st.com/resource/en/user_manual/dm00244518-stm32-nucleo144-boards-stmicroelectronics.pdf)
- **MCU veri sayfasının ilk yayını:** 2016-03-21. [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-144 · UM1974 Rev 11](https://www.st.com/resource/en/user_manual/dm00244518-stm32-nucleo144-boards-stmicroelectronics.pdf)

Devre / kart belgeleri: [STM32 Nucleo-144 · UM1974 Rev 11](https://www.st.com/resource/en/user_manual/dm00244518-stm32-nucleo144-boards-stmicroelectronics.pdf)

### STM32F767ZIT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f767zit6&profile=stm32f767zit6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F767ZITx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

- **Belgelenmiş olduğu tarih:** 2016-03-21. [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **İşlemci:** Arm Cortex-M7 (DP-FPU). [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Saat hızı / üst sınır:** 216 MHz. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **RAM:** 512 KB SRAM + 16 KB ITCM + 4 KB backup. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Program Flash’ı / depolama:** 2048 KB Flash. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **MCU veri sayfasının ilk yayını:** 2016-03-21. [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

### NUCLEO-H743ZI2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-144&profile=nucleo-h743zi2) · [Pin referansı](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **İşlemci:** Arm Cortex-M7 (DP-FPU). [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Saat hızı / üst sınır:** 480 MHz. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **RAM:** 1056 KB (192 KB TCM + 864 KB SRAM) + 4 KB backup. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Program Flash’ı / depolama:** 2048 KB Flash. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf), [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)
- **MCU veri sayfasının ilk yayını:** 2017-06-22. [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

Kartta ST-LINK programlayıcı/hata ayıklayıcı bulunur. Arduino başlığı, Morpho ve MCU pad numaraları ayrı numaralandırmalardır; lehim köprüleri aynı ağın erişimini etkileyebilir. [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)

Devre / kart belgeleri: [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)

### STM32H743ZIT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32h743zit6&profile=stm32h743zit6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32H743ZITx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

- **Belgelenmiş olduğu tarih:** 2017-06-22. [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **İşlemci:** Arm Cortex-M7 (DP-FPU). [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Saat hızı / üst sınır:** 480 MHz. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **RAM:** 1056 KB (192 KB TCM + 864 KB SRAM) + 4 KB backup. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Program Flash’ı / depolama:** 2048 KB Flash. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **MCU veri sayfasının ilk yayını:** 2017-06-22. [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

### WeAct Black Pill F401CC v3.x

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=black-pill&profile=weact-blackpill-f401cc) · [Pin referansı](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/README.md) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **İşlemci:** Arm Cortex-M4F. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Saat hızı / üst sınır:** 84 MHz. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **RAM:** 64 KB SRAM. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Program Flash’ı / depolama:** 256 KB Flash. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf), [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf)
- **MCU veri sayfasının ilk yayını:** 2013-07-23. [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

v3.x kartın PC13 LED’i ve PA0 düğmesi vardır. İsteğe bağlı SPI Flash, MCU içi program Flash’ından ayrıdır ve her kartta takılı değildir. [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf), [WeAct MiniF4x1 hardware release notes](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/README.md)

Devre / kart belgeleri: [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf)

### STM32F401CCU6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f401ccu6&profile=stm32f401ccu6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F401C(B-C)Ux.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

- **Belgelenmiş olduğu tarih:** 2013-07-23. [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **İşlemci:** Arm Cortex-M4F. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Saat hızı / üst sınır:** 84 MHz. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **RAM:** 64 KB SRAM. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Program Flash’ı / depolama:** 256 KB Flash. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **MCU veri sayfasının ilk yayını:** 2013-07-23. [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

### WeAct Black Pill F411CE v3.x

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=black-pill&profile=weact-blackpill-f411ce) · [Pin referansı](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/README.md) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

- **İlk üretim / çıkış:** Doğrulanamadı. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **İşlemci:** Arm Cortex-M4F. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Saat hızı / üst sınır:** 100 MHz. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **RAM:** 128 KB SRAM. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Besleme / mantık:** Kart GPIO: 3.3 V. USB / harici güç seçimini kartın kullanıcı kılavuzundaki jumper ve köprü koşullarına göre yapın.. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf), [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-06-19. [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

Bu kesin model/revizyon için ilk üretim veya satış tarihi incelenen birincil belgelerde doğrulanamadı. Belge revizyon tarihi üretim yılı değildir.

v3.x kartın PC13 LED’i ve PA0 düğmesi vardır. İsteğe bağlı SPI Flash, MCU içi program Flash’ından ayrıdır ve her kartta takılı değildir. [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf), [WeAct MiniF4x1 hardware release notes](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/README.md)

Devre / kart belgeleri: [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf)

### STM32F411CEU6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f411ceu6&profile=stm32f411ceu6) · [Pin referansı](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F411C(C-E)Ux.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

- **Belgelenmiş olduğu tarih:** 2014-06-19. [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **İşlemci:** Arm Cortex-M4F. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Saat hızı / üst sınır:** 100 MHz. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **RAM:** 128 KB SRAM. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Program Flash’ı / depolama:** 512 KB Flash. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Besleme / mantık:** Besleme aralığı ve 5 V toleransı pin türüne göre değişir; VDD, VDDA, VCAP ve VBAT koşullarını veri sayfasından kontrol edin.. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **MCU veri sayfasının ilk yayını:** 2014-06-19. [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

Belirtilen saat, MCU üst sınırıdır. PLL, besleme ve Flash bekleme çevrimleri uygun yapılandırılmalıdır. RAM bankalarının DMA erişimi aynı değildir. [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

