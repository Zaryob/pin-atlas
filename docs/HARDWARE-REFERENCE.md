# Hardware research and technical reference

Reviewed: 2026-11-14. All 89 profiles are covered individually. 54 have a qualified historical date; exact first production/sale dates remain unverified for 35. An MCU datasheet’s initial publication is not presented as a board’s production year.

Generated from `sources/hardware-details.json` by `npm run build:data`. Each fact and note carries source links. Live manufacturer pages may change; the locked versions and SHA-256 values for pin evidence remain in `sources/manifest.json`. The technical review does not change the previous pin-verification date.

Flash, fixed boot ROM, EEPROM, SRAM and PSRAM are kept separate. Memory capacities are physical totals; usable application space may be smaller. Connection tables below each Pin Atlas workspace list all sourced alternatives, without asserting that they are default routes or simultaneously usable.

## Corrected existing statements

- Pi 4: “BCM numbering” in the clock field → 1.8 GHz (original boards 1.5 GHz); processor core clarified as Cortex-A72.
- Pi 5: the same incorrect clock text → 2.4 GHz; Cortex-A76 processor distinguished from the RP1 I/O controller.
- Both corrections were applied to the pin-source extractor and generated profiles. Pin identities and saved plans were preserved.

## Individual model records

### Raspberry Pi Pico 2 W

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=pico-family&profile=pico2w) · [Pin reference](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008305-DS-1-pico-2-w-pinout.pdf) · [Datasheet](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf)

- **Initial sale / release:** 2024-11-25. [pico2w launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-2-w-on-sale-now/)
- **Processor:** 2 × Arm Cortex-M33 / 2 × Hazard3 RISC-V. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Clock / maximum:** 150 MHz. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **RAM:** 520 KB SRAM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Program Flash / storage:** 4 MB on-board QSPI Flash. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico 2 W Datasheet](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf)
- **Fixed ROM:** 32 KB boot ROM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Power / logic:** USB: 5 V; VSYS: 1.8–5.5 V. GPIO logic: 3.3 V; 5.5 V input tolerance only under datasheet conditions.. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico 2 W Datasheet](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf)

Two cores run concurrently; all four cores cannot run together. 12 PIO state machines. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

Board exposes 26 GPIOs and 3 external ADC inputs. GP29 is used for on-board measurements. [Raspberry Pi Pico 2 W Datasheet](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf)

CYW43439: 2.4 GHz Wi-Fi and Bluetooth 5.2. Wireless silicon does not increase MCU RAM. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html)

### Raspberry Pi 4 Model B

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-4) · [Pin reference](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf) · [Datasheet](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008248-DS-1-bcm2711-peripherals.pdf)

- **Initial sale / release:** 2019-06-24. [Raspberry Pi 4 launch](https://www.raspberrypi.com/news/raspberry-pi-4-on-sale-now-from-35/)
- **Processor:** 4 × Arm Cortex-A72 (64-bit). [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **Clock / maximum:** 1.8 GHz; original boards 1.5 GHz. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **RAM:** 1 / 2 / 3 / 4 / 8 GB LPDDR4; model dependent. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **Program Flash / storage:** microSD / USB storage; SPI EEPROM bootloader. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **Power / logic:** 5 V / 3 A USB-C. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)

40-pin header uses 3.3 V GPIO. Physical pin numbers differ from BCM GPIO numbers. Pins 27/28 are the HAT ID EEPROM bus. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

Circuit / board documents: [Raspberry Pi 4 Model B Reduced Schematics](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf)

### Raspberry Pi 5

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-5) · [Pin reference](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf) · [Datasheet](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf)

- **Initial sale / release:** 2023-09-28. [Introducing Raspberry Pi 5](https://www.raspberrypi.com/news/introducing-raspberry-pi-5/)
- **Processor:** 4 × Arm Cortex-A76 (64-bit); RP1 I/O. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Clock / maximum:** 2.4 GHz. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **RAM:** 1 / 2 / 4 / 8 / 16 GB LPDDR4X; model dependent. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Program Flash / storage:** microSD / USB / PCIe storage; SPI EEPROM bootloader. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Power / logic:** 5 V / 5 A USB-C. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)

40-pin header uses 3.3 V GPIO. Physical pin numbers differ from BCM GPIO numbers. Pins 27/28 are the HAT ID EEPROM bus. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

Circuit / board documents: [Raspberry Pi 4 Model B Reduced Schematics](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf)

### Raspberry Pi Pico

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=pico-family&profile=pico) · [Pin reference](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf#page=5) · [Datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)

- **Initial sale / release:** 2021-01-21. [pico launch announcement](https://www.raspberrypi.com/news/raspberry-pi-silicon-pico-now-on-sale/)
- **Processor:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Clock / maximum:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash / storage:** 2 MB on-board QSPI Flash. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico Datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)
- **Fixed ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Power / logic:** USB: 5 V; VSYS: 1.8–5.5 V. GPIO logic: 3.3 V.. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico Datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)

8 PIO state machines; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

Board exposes 26 GPIOs and 3 external ADC inputs. GP29 is used for on-board measurements. [Raspberry Pi Pico Datasheet](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf)

### Raspberry Pi Pico W

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=pico-family&profile=picow) · [Pin reference](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf#page=5) · [Datasheet](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf)

- **Initial sale / release:** 2022-06-30. [picow launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-w-your-6-iot-platform/)
- **Processor:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Clock / maximum:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash / storage:** 2 MB on-board QSPI Flash. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico W Datasheet](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf)
- **Fixed ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Power / logic:** USB: 5 V; VSYS: 1.8–5.5 V. GPIO logic: 3.3 V.. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico W Datasheet](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf)

8 PIO state machines; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

Board exposes 26 GPIOs and 3 external ADC inputs. GP29 is used for on-board measurements. [Raspberry Pi Pico W Datasheet](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf)

CYW43439: 2.4 GHz Wi-Fi and Bluetooth 5.2. Wireless silicon does not increase MCU RAM. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html)

### Raspberry Pi Pico 2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=pico-family&profile=pico2) · [Pin reference](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf#page=5) · [Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf)

- **Initial sale / release:** 2024-08-08. [pico2 launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-2-our-new-5-microcontroller-board-on-sale-now/)
- **Processor:** 2 × Arm Cortex-M33 / 2 × Hazard3 RISC-V. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Clock / maximum:** 150 MHz. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **RAM:** 520 KB SRAM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Program Flash / storage:** 4 MB on-board QSPI Flash. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf)
- **Fixed ROM:** 32 KB boot ROM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Power / logic:** USB: 5 V; VSYS: 1.8–5.5 V. GPIO logic: 3.3 V; 5.5 V input tolerance only under datasheet conditions.. [Pico series specifications](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html), [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf)

Two cores run concurrently; all four cores cannot run together. 12 PIO state machines. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

Board exposes 26 GPIOs and 3 external ADC inputs. GP29 is used for on-board measurements. [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf)

### Raspberry Pi · 40-pin GPIO

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-40) · [Pin reference](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc) · [Datasheet](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

- **First production / release:** Unverified. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **Processor:** Common header; no single processor model. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **Clock / maximum:** Depends on selected board. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **RAM:** Depends on selected board. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **Program Flash / storage:** Depends on selected board. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)
- **Power / logic:** 5 V and 3.3 V power pins; GPIO: 3.3 V. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

This profile covers common physical pins only. Open the Pi 3 Model B+, Pi 4, Pi 5, Zero W, Zero 2 W or Pi 500 profile for alternate functions. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

### NVIDIA Jetson Orin Nano

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=jetson-orin-nano&profile=jetson-orin-nano) · [Pin reference](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf#page=25) · [Datasheet](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf)

- **First production / release:** Unverified. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html), [Jetson Orin Nano Developer Kit Carrier Board Specification](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf)
- **Processor:** 6 × Arm Cortex-A78AE. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html)
- **Clock / maximum:** 1.5 GHz; 1.7 GHz with Super mode. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html)
- **RAM:** 8 GB LPDDR5. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html)
- **Program Flash / storage:** microSD / NVMe; developer module has no eMMC. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html)
- **Power / logic:** Power through DC jack; USB-C is for data. J12 GPIO: 3.3 V.. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Orin Nano Developer Kit hardware layout](https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/hardware_layout.html), [Jetson Orin Nano Developer Kit Carrier Board Specification](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

This is the P3768 carrier header. RAM and clock depend on the fitted module/JetPack power mode; Linux bus numbers need not match carrier signal names. [Jetson Orin Nano Super specifications](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/), [Jetson Orin Nano Developer Kit Carrier Board Specification](https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf)

### STM32 Blue Pill

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=blue-pill&profile=blue-pill) · [Pin reference](https://stm32-base.org/boards/STM32F103C8T6-Blue-Pill.html) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **First production / release:** Unverified. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Processor:** Arm Cortex-M3. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Clock / maximum:** 72 MHz. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **RAM:** 20 KB. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Program Flash / storage:** 64 KB Flash. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf), [Blue Pill reference schematic (community mirror)](https://stm32-base.org/assets/pdf/boards/original-schematic-STM32F103C8T6-Blue_Pill.pdf)
- **MCU datasheet initial publication:** 2007-06-01. [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

Guaranteed C8 Flash is 64 KB; do not assume 128 KB. Blue Pill manufacturer and first production year are unverified. Clones may differ in USB resistor, regulator and MCU. [STM32F103x8 / STM32F103xB datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

Circuit / board documents: [Blue Pill reference schematic (community mirror)](https://stm32-base.org/assets/pdf/boards/original-schematic-STM32F103C8T6-Blue_Pill.pdf)

### STM32F103C8T6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f103c8t6&profile=stm32f103c8t6) · [Pin reference](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf#page=26) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **Documented by:** 2007-06-01. [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Processor:** Arm Cortex-M3. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Clock / maximum:** 72 MHz. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **RAM:** 20 KB. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Program Flash / storage:** 64 KB Flash. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F103C8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103c8.html), [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)
- **MCU datasheet initial publication:** 2007-06-01. [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F103C8 datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

### STM32F103RBT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f103rbt6&profile=stm32f103rbt6) · [Pin reference](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf#page=25) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **Documented by:** 2007-06-01. [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Processor:** Arm Cortex-M3. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Clock / maximum:** 72 MHz. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **RAM:** 20 KB. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Program Flash / storage:** 128 KB Flash. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **MCU datasheet initial publication:** 2007-06-01. [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)

### STM32F103VBT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f103vbt6&profile=stm32f103vbt6) · [Pin reference](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf#page=24) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **Documented by:** 2007-06-01. [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **Processor:** Arm Cortex-M3. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **Clock / maximum:** 72 MHz. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **RAM:** 20 KB. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **Program Flash / storage:** 128 KB Flash. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F103VB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103vb.html), [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)
- **MCU datasheet initial publication:** 2007-06-01. [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F103VB datasheet](https://www.st.com/resource/en/datasheet/stm32f103vb.pdf)

### NUCLEO-F103RB

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f103rb) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=40) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f103c8.pdf)

- **First production / release:** Unverified. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Processor:** Arm Cortex-M3. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Clock / maximum:** 72 MHz. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **RAM:** 20 KB. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Program Flash / storage:** 128 KB Flash. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F103RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f103rb.html), [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2007-06-01. [F103RB datasheet](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### NUCLEO-F401RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f401re) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=44) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

- **First production / release:** Unverified. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Processor:** Arm Cortex-M4F. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Clock / maximum:** 84 MHz. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **RAM:** 96 KB. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Program Flash / storage:** 512 KB Flash. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2014-01-16. [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### NUCLEO-F411RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f411re) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=44) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

- **First production / release:** Unverified. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Processor:** Arm Cortex-M4F. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Clock / maximum:** 100 MHz. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **RAM:** 128 KB. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Program Flash / storage:** 512 KB Flash. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2014-06-19. [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### NUCLEO-G474RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-g474re) · [Pin reference](https://www.st.com/resource/en/user_manual/um2505-stm32g4-nucleo64-boards-stmicroelectronics.pdf#page=30) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

- **First production / release:** Unverified. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Processor:** Arm Cortex-M4F. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Clock / maximum:** 170 MHz. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **RAM:** 128 KB (96 KB SRAM + 32 KB CCM). [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Program Flash / storage:** 512 KB Flash. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf), [STM32G4 Nucleo-64 boards (MB1367) user manual](https://www.st.com/resource/en/user_manual/um2505-stm32g4-nucleo64-boards-stmicroelectronics.pdf)
- **MCU datasheet initial publication:** 2019-05-15. [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32G4 Nucleo-64 boards (MB1367) user manual](https://www.st.com/resource/en/user_manual/um2505-stm32g4-nucleo64-boards-stmicroelectronics.pdf)

Circuit / board documents: [STM32G4 Nucleo-64 boards (MB1367) user manual](https://www.st.com/resource/en/user_manual/um2505-stm32g4-nucleo64-boards-stmicroelectronics.pdf)

### NUCLEO-H723ZG

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-144&profile=nucleo-h723zg) · [Pin reference](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

- **First production / release:** Unverified. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Processor:** Arm Cortex-M7 (DP-FPU). [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Clock / maximum:** 550 MHz. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **RAM:** 564 KB (TCM + SRAM + 4 KB backup). [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Program Flash / storage:** 1024 KB Flash. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf), [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)
- **MCU datasheet initial publication:** 2020-07-10. [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)

Circuit / board documents: [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)

### Arduino UNO R3

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-uno&profile=arduino-uno-r3) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/uno/boards/uno-rev3/downloads/A000066-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf)

- **First production / release:** Unverified. [uno-rev3 hardware manual](https://docs.arduino.cc/hardware/uno-rev3/), [A000066 circuit schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)
- **Processor:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Clock / maximum:** 16 MHz. [uno-rev3 hardware manual](https://docs.arduino.cc/hardware/uno-rev3/), [A000066 circuit schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash / storage:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / persistent data:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Power / logic:** USB: 5 V; header GPIO: 5 V. See the board manual for VIN limits.. [uno-rev3 hardware manual](https://docs.arduino.cc/hardware/uno-rev3/), [A000066 circuit schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

20 MHz requires 4.5–5.5 V; use the datasheet speed grade at lower voltages. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

Flash capacity is the total; the bootloader occupies part of it. USB serial and the header UART are separate interfaces. [uno-rev3 hardware manual](https://docs.arduino.cc/hardware/uno-rev3/)

Circuit / board documents: [Arduino UNO Rev3 through-hole schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)

### Arduino Nano (classic)

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-nano&profile=arduino-nano-classic) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano/downloads/A000005-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano/downloads/A000005-full-pinout.pdf)

- **First production / release:** Unverified. [nano hardware manual](https://docs.arduino.cc/hardware/nano/), [A000005 circuit schematic](https://docs.arduino.cc/resources/schematics/A000005-schematics.pdf)
- **Processor:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Clock / maximum:** 16 MHz. [nano hardware manual](https://docs.arduino.cc/hardware/nano/), [A000005 circuit schematic](https://docs.arduino.cc/resources/schematics/A000005-schematics.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash / storage:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / persistent data:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Power / logic:** USB: 5 V; header GPIO: 5 V. See the board manual for VIN limits.. [nano hardware manual](https://docs.arduino.cc/hardware/nano/), [A000005 circuit schematic](https://docs.arduino.cc/resources/schematics/A000005-schematics.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

20 MHz requires 4.5–5.5 V; use the datasheet speed grade at lower voltages. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

Flash capacity is the total; the bootloader occupies part of it. USB serial and the header UART are separate interfaces. [nano hardware manual](https://docs.arduino.cc/hardware/nano/)

A6/A7 are analog inputs only. Nano family launched in 2008 with ATmega168; this profile is the ATmega328P version. [Original Nano announcement](https://blog.arduino.cc/2008/05/15/arduino-nano-all-in-one-design-for-breadboard-use/)

Circuit / board documents: [Arduino Nano V3.3 schematic](https://docs.arduino.cc/resources/schematics/A000005-schematics.pdf)

### Arduino Mega 2560 Rev3

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-mega-2560&profile=arduino-mega-2560) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/mega/boards/mega-2560/downloads/A000067-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/A000067-datasheet.pdf)

- **Documented by:** 2010. [New Uno and Mega 2560 support](https://blog.arduino.cc/2010/09/27/arduino-0020-released-for-windows-and-mac-supports-uno-and-mega-2560/)
- **Processor:** 8-bit AVR. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Clock / maximum:** 16 MHz. [mega-2560 hardware manual](https://docs.arduino.cc/hardware/mega-2560/), [A000067 circuit schematic](https://docs.arduino.cc/resources/schematics/A000067-schematics.pdf)
- **RAM:** 8 KB SRAM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Program Flash / storage:** 256 KB Flash. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **EEPROM / persistent data:** 4 KB EEPROM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Power / logic:** USB: 5 V; header GPIO: 5 V. See the board manual for VIN limits.. [mega-2560 hardware manual](https://docs.arduino.cc/hardware/mega-2560/), [A000067 circuit schematic](https://docs.arduino.cc/resources/schematics/A000067-schematics.pdf)

Flash capacity is the total; the bootloader occupies part of it. USB serial and the header UART are separate interfaces. [mega-2560 hardware manual](https://docs.arduino.cc/hardware/mega-2560/)

4 hardware UARTs; I²C on D20/SDA and D21/SCL. SPI: D50/MISO, D51/MOSI, D52/SCK, D53/SS and duplicated ICSP nets. [mega-2560 hardware manual](https://docs.arduino.cc/hardware/mega-2560/)

Circuit / board documents: [Arduino Mega 2560 Rev3 schematic](https://docs.arduino.cc/resources/schematics/A000067-schematics.pdf)

### Arduino Leonardo

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-uno&profile=arduino-leonardo) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/hero/boards/leonardo/downloads/A000057-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/hero/boards/leonardo/downloads/A000057-full-pinout.pdf)

- **Documented by:** 2012. [arduino-leonardo announcement](https://blog.arduino.cc/2012/05/22/arduino-1-0-1-release/)
- **Processor:** 8-bit AVR. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Clock / maximum:** 16 MHz. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/), [A000057 circuit schematic](https://docs.arduino.cc/resources/schematics/A000057-schematics.pdf)
- **RAM:** 2.5 KB SRAM. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Program Flash / storage:** 32 KB Flash. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **EEPROM / persistent data:** 1 KB EEPROM. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Power / logic:** USB: 5 V; header GPIO: 5 V. See the board manual for VIN limits.. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/), [A000057 circuit schematic](https://docs.arduino.cc/resources/schematics/A000057-schematics.pdf)

Flash capacity is the total; the bootloader occupies part of it. USB serial and the header UART are separate interfaces. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)

I²C: D2/D3; SPI: ICSP header. Do not use the UNO D11–D13 SPI mapping. USB is native to ATmega32U4. [Arduino leonardo full pinout](https://docs.arduino.cc/resources/pinouts/A000057-full-pinout.pdf)

### Arduino Micro

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-micro&profile=arduino-micro) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/hero/boards/micro/downloads/A000053-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/hero/boards/micro/downloads/A000053-full-pinout.pdf)

- **Initial sale / release:** 2012-11-08. [arduino-micro announcement](https://blog.arduino.cc/2012/11/08/new-arduino-micro-available/)
- **Processor:** 8-bit AVR. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Clock / maximum:** 16 MHz. [micro hardware manual](https://docs.arduino.cc/hardware/micro/), [A000053 circuit schematic](https://docs.arduino.cc/resources/schematics/A000053-schematics.pdf)
- **RAM:** 2.5 KB SRAM. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Program Flash / storage:** 32 KB Flash. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **EEPROM / persistent data:** 1 KB EEPROM. [leonardo hardware manual](https://docs.arduino.cc/hardware/leonardo/)
- **Power / logic:** USB: 5 V; header GPIO: 5 V. See the board manual for VIN limits.. [micro hardware manual](https://docs.arduino.cc/hardware/micro/), [A000053 circuit schematic](https://docs.arduino.cc/resources/schematics/A000053-schematics.pdf)

Flash capacity is the total; the bootloader occupies part of it. USB serial and the header UART are separate interfaces. [micro hardware manual](https://docs.arduino.cc/hardware/micro/)

ATmega32U4 provides native USB. SPI is on ICSP contacts; I²C uses D2/SDA and D3/SCL. [micro hardware manual](https://docs.arduino.cc/hardware/micro/)

### Arduino Nano Every

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-nano&profile=arduino-nano-every) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-every/downloads/ABX00028-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/ABX00028-datasheet.pdf)

- **Announcement:** 2019-05-17. [arduino-nano-every announcement](https://blog.arduino.cc/2019/05/17/whats-new-at-maker-faire-bay-area-2019/)
- **Processor:** 8-bit AVR. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)
- **Clock / maximum:** 20 MHz. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/), [ABX00028 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00028-schematics.pdf)
- **RAM:** 6 KB SRAM. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)
- **Program Flash / storage:** 48 KB Flash. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)
- **EEPROM / persistent data:** 256 B EEPROM. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)
- **Power / logic:** USB: 5 V; header GPIO: 5 V. See the board manual for VIN limits.. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/), [ABX00028 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00028-schematics.pdf)

ATmega4809: 48 KB Flash, 6 KB SRAM and 256 B EEPROM. USB bridge is SAMD11; it does not use the Nano Classic AVR register map. [nano-every hardware manual](https://docs.arduino.cc/hardware/nano-every/)

### Arduino Nano 33 BLE Sense Rev2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-nano&profile=arduino-nano-33-ble-sense-rev2) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-33-ble-sense-rev2/downloads/ABX00069-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-33-ble-sense-rev2/downloads/ABX00069-full-pinout.pdf)

- **First production / release:** Unverified. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/), [ABX00069 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00069-schematics.pdf)
- **Processor:** Arm Cortex-M4F. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **Clock / maximum:** 64 MHz. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/), [ABX00069 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00069-schematics.pdf)
- **RAM:** 256 KB SRAM. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **Program Flash / storage:** 1 MB Flash. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **Power / logic:** USB: 5 V; header GPIO: 3.3 V. See the board manual for VIN limits.. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/), [ABX00069 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00069-schematics.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

NINA-B306/nRF52840: BLE, native USB and sensors. Rev2 IMU: BMI270 + BMM150; temperature/humidity: HS3003. GPIO is not 5 V tolerant. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)

### Arduino UNO R4 Minima

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-uno&profile=arduino-uno-r4-minima) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/uno/boards/uno-r4-minima/downloads/ABX00080-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/ABX00080-datasheet.pdf)

- **Initial sale / release:** 2023-06-26. [UNO R4 available](https://blog.arduino.cc/2023/06/26/uno-r4-the-new-dimension-of-making/)
- **Processor:** Arm Cortex-M4F. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Clock / maximum:** 48 MHz. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/), [ABX00080 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00080-schematics.pdf)
- **RAM:** 32 KB SRAM. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Program Flash / storage:** 256 KB Flash. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **EEPROM / persistent data:** 8 KB data Flash (EEPROM emulation). [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Power / logic:** USB: 5 V; header GPIO: 5 V. See the board manual for VIN limits.. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/), [ABX00080 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00080-schematics.pdf)

RA4M1: 12-bit DAC, RTC and CAN controller. A CAN physical bus connection requires an external transceiver. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)

### Arduino UNO R4 WiFi

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-uno&profile=arduino-uno-r4-wifi) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/uno/boards/uno-r4-wifi/downloads/ABX00087-full-pinout.pdf) · [Datasheet](https://docs.arduino.cc/resources/datasheets/ABX00087-datasheet.pdf)

- **Initial sale / release:** 2023-06-26. [UNO R4 available](https://blog.arduino.cc/2023/06/26/uno-r4-the-new-dimension-of-making/)
- **Processor:** Arm Cortex-M4F. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Clock / maximum:** 48 MHz. [uno-r4-wifi hardware manual](https://docs.arduino.cc/hardware/uno-r4-wifi/), [ABX00087 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00087-schematics.pdf)
- **RAM:** 32 KB SRAM. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Program Flash / storage:** 256 KB Flash. [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **EEPROM / persistent data:** 8 KB data Flash (EEPROM emulation). [uno-r4-minima hardware manual](https://docs.arduino.cc/hardware/uno-r4-minima/)
- **Power / logic:** USB: 5 V; header GPIO: 5 V. See the board manual for VIN limits.. [uno-r4-wifi hardware manual](https://docs.arduino.cc/hardware/uno-r4-wifi/), [ABX00087 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00087-schematics.pdf)

RA4M1 is the application MCU; ESP32-S3 provides Wi-Fi/BLE and the USB serial bridge. Do not sum the two MCUs’ RAM and Flash. [uno-r4-wifi hardware manual](https://docs.arduino.cc/hardware/uno-r4-wifi/)

### Arduino Nano ESP32

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=arduino-nano&profile=arduino-nano-esp32) · [Pin reference](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-esp32/downloads/ABX00083-full-pinout.pdf) · [Datasheet](https://github.com/arduino/docs-content/blob/cb938e96b391e636011690e4db1348dc38db4deb/content/hardware/nano/boards/nano-esp32/downloads/ABX00083-schematics.pdf)

- **Announcement:** 2023-07-17. [arduino-nano-esp32 announcement](https://blog.arduino.cc/2023/07/17/introducing-the-nano-esp32-thats-iot/)
- **Processor:** 2 × Xtensa LX7. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Clock / maximum:** 240 MHz. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/), [ABX00083 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)
- **RAM:** 512 KB SRAM + 16 KB RTC SRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Program Flash / storage:** 16 MB QSPI Flash. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/), [ABX00083 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)
- **Fixed ROM:** 384 KB ROM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **External PSRAM:** 8 MB PSRAM. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/), [ABX00083 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)
- **Power / logic:** USB: 5 V; header GPIO: 3.3 V. See the board manual for VIN limits.. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/), [ABX00083 circuit schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)

u-blox NORA-W106 / ESP32-S3. Arduino D labels differ from ESP32 GPIO numbers; match Tools > Pin Numbering to your code. [nano-esp32 hardware manual](https://docs.arduino.cc/hardware/nano-esp32/)

Circuit / board documents: [Arduino Nano ESP32 schematic](https://docs.arduino.cc/resources/schematics/ABX00083-schematics.pdf)

### ESP32-DevKitC V4

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-devkitc-v4&profile=esp32-devkitc-v4) · [Pin reference](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)

- **First production / release:** Unverified. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)
- **Processor:** 2 × Xtensa LX6. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Clock / maximum:** 240 MHz. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **RAM:** 520 KB SRAM + 16 KB RTC SRAM. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Program Flash / storage:** WROOM-32E: 4 / 8 / 16 MB; depends on order code. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html), [ESP32-WROOM-32E / 32UE module datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)
- **Fixed ROM:** 448 KB ROM. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **External PSRAM:** No fitted PSRAM in this profile. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html), [ESP32-WROOM-32E / 32UE module datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)
- **Power / logic:** Use USB / 5V / 3V3 power options according to the guide. GPIO: 3.3 V.. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html), [ESP32-WROOM-32E / 32UE module datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

GPIO matrix rows describe routing capability, not firmware defaults. Maintain correct strapping levels during reset. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)

Circuit / board documents: [ESP32-DevKitC V4 schematic](https://dl.espressif.com/dl/schematics/esp32_devkitc_v4_sch.pdf)

### ESP32-DevKitC V4 · WROVER

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-devkitc-v4&profile=esp32-devkitc-v4-wrover) · [Pin reference](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)

- **First production / release:** Unverified. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)
- **Processor:** 2 × Xtensa LX6. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Clock / maximum:** 240 MHz. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **RAM:** 520 KB SRAM + 16 KB RTC SRAM. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **Program Flash / storage:** Depends on WROVER variant; check module code. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)
- **Fixed ROM:** 448 KB ROM. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- **External PSRAM:** Depends on WROVER module; B/E variants have 8 MB. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)
- **Power / logic:** Use USB / 5V / 3V3 power options according to the guide. GPIO: 3.3 V.. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

GPIO matrix rows describe routing capability, not firmware defaults. Maintain correct strapping levels during reset. [ESP32 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [esp32-devkitc official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html)

Circuit / board documents: [ESP32-DevKitC V4 schematic](https://dl.espressif.com/dl/schematics/esp32_devkitc_v4_sch.pdf)

### ESP32-C3-DevKitM-1

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-c3-devkitm-1&profile=esp32-c3-devkitm-1) · [Pin reference](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)

- **First production / release:** Unverified. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)
- **Processor:** 1 × 32-bit RISC-V. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Clock / maximum:** 160 MHz. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **RAM:** 400 KB SRAM (16 KB cache included) + 8 KB RTC SRAM. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Program Flash / storage:** 4 MB Flash. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)
- **Fixed ROM:** 384 KB ROM. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **External PSRAM:** No fitted PSRAM in this profile. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)
- **Power / logic:** Use USB / 5V / 3V3 power options according to the guide. GPIO: 3.3 V.. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

GPIO matrix rows describe routing capability, not firmware defaults. Maintain correct strapping levels during reset. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), [esp32-c3-devkitm-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html)

Circuit / board documents: [ESP32-C3-DevKitM-1 schematic](https://dl.espressif.com/dl/schematics/SCH_ESP32-C3-DEVKITM-1_V1_20200915A.pdf)

### ESP32-S3-DevKitC-1 v1.1

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-s3-devkitc-1&profile=esp32-s3-devkitc-1) · [Pin reference](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)

- **First production / release:** Unverified. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Processor:** 2 × Xtensa LX7. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Clock / maximum:** 240 MHz. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **RAM:** 512 KB SRAM + 16 KB RTC SRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Program Flash / storage:** 8 MB Flash. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Fixed ROM:** 384 KB ROM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **External PSRAM:** No fitted PSRAM in this profile. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Power / logic:** Use USB / 5V / 3V3 power options according to the guide. GPIO: 3.3 V.. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

GPIO matrix rows describe routing capability, not firmware defaults. Maintain correct strapping levels during reset. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

v1.1 RGB LED: GPIO38; initial revision uses GPIO48. On N8R8, GPIO35/36/37 are reserved for Octal PSRAM. [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

Circuit / board documents: [ESP32-S3-DevKitC-1 v1.1 schematic](https://dl.espressif.com/dl/schematics/SCH_ESP32-S3-DevKitC-1_V1.1_20221130.pdf)

### ESP32-S3-DevKitC-1 v1.1 · Octal memory

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-s3-devkitc-1&profile=esp32-s3-devkitc-1-octal) · [Pin reference](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)

- **First production / release:** Unverified. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Processor:** 2 × Xtensa LX7. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Clock / maximum:** 240 MHz. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **RAM:** 512 KB SRAM + 16 KB RTC SRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Program Flash / storage:** 8 MB Flash. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Fixed ROM:** 384 KB ROM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **External PSRAM:** 8 MB Octal PSRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)
- **Power / logic:** Use USB / 5V / 3V3 power options according to the guide. GPIO: 3.3 V.. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

GPIO matrix rows describe routing capability, not firmware defaults. Maintain correct strapping levels during reset. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

v1.1 RGB LED: GPIO38; initial revision uses GPIO48. On N8R8, GPIO35/36/37 are reserved for Octal PSRAM. [esp32-s3-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html)

Circuit / board documents: [ESP32-S3-DevKitC-1 v1.1 schematic](https://dl.espressif.com/dl/schematics/SCH_ESP32-S3-DevKitC-1_V1.1_20221130.pdf)

### ESP32-C6-DevKitC-1 v1.2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=esp32-c6-devkitc-1&profile=esp32-c6-devkitc-1) · [Pin reference](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)

- **First production / release:** Unverified. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)
- **Processor:** 1 × HP RISC-V + LP RISC-V. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)
- **Clock / maximum:** 160 MHz HP / 20 MHz LP. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)
- **RAM:** 512 KB HP SRAM + 16 KB LP SRAM. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)
- **Program Flash / storage:** 8 MB Flash. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)
- **Fixed ROM:** 320 KB ROM. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)
- **External PSRAM:** No fitted PSRAM in this profile. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)
- **Power / logic:** Use USB / 5V / 3V3 power options according to the guide. GPIO: 3.3 V.. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

GPIO matrix rows describe routing capability, not firmware defaults. Maintain correct strapping levels during reset. [ESP32C6 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), [esp32-c6-devkitc-1 official user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html)

Circuit / board documents: [ESP32-C6-DevKitC-1 v1.2 schematic](https://dl.espressif.com/dl/schematics/esp32-c6-devkitc-1-schematics_v1.2.pdf)

### NodeMCU v2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nodemcu-v2&profile=nodemcu-v2) · [Pin reference](https://github.com/nodemcu/nodemcu-devkit-v1.0/blob/7cb0a330a25fad85e701c768ef46064c17d54446/NODEMCU_DEVKIT_V1.0.PDF) · [Datasheet](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf)

- **Initial sale / release:** 2015-01-29. [NodeMCU DevKit release history](https://github.com/nodemcu/nodemcu-devkit-v1.0/releases)
- **Processor:** 1 × Tensilica L106 32-bit. [ESP8266EX Datasheet](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf)
- **Clock / maximum:** 80 MHz (160 MHz max). [ESP8266EX Datasheet](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf)
- **RAM:** 80 KB user data SRAM + 32 KB instruction RAM + 32 KB instruction cache. [ESP8266EX Datasheet](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf)
- **Program Flash / storage:** 4 MB Flash. [NodeMCU DEVKIT v1.0 specifications](https://github.com/nodemcu/nodemcu-devkit-v1.0), [NodeMCU DEVKIT v1.0 Schematic](https://raw.githubusercontent.com/nodemcu/nodemcu-devkit-v1.0/master/NODEMCU_DEVKIT_V1.0.PDF), [ESP8266EX Datasheet](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf)
- **Power / logic:** Micro-USB: 5 V; VIN: 4.5–9 V; GPIO: 3.3 V. A 5 V power pin does not imply 5 V GPIO tolerance.. [NodeMCU DEVKIT v1.0 specifications](https://github.com/nodemcu/nodemcu-devkit-v1.0), [NodeMCU DEVKIT v1.0 Schematic](https://raw.githubusercontent.com/nodemcu/nodemcu-devkit-v1.0/master/NODEMCU_DEVKIT_V1.0.PDF), [ESP8266EX Datasheet](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf)

Houses an ESP-12E/F module with 4 MB internal SPI Flash. SDIO pins (GPIO6–GPIO11) connect directly to this flash and are reserved. Analog pin A0 includes an onboard 220 kΩ / 100 kΩ divider for a 0–3.3 V range. [NodeMCU DEVKIT v1.0 specifications](https://github.com/nodemcu/nodemcu-devkit-v1.0), [NodeMCU DEVKIT v1.0 Schematic](https://raw.githubusercontent.com/nodemcu/nodemcu-devkit-v1.0/master/NODEMCU_DEVKIT_V1.0.PDF)

Circuit / board documents: [NodeMCU DEVKIT v1.0 Schematic](https://raw.githubusercontent.com/nodemcu/nodemcu-devkit-v1.0/master/NODEMCU_DEVKIT_V1.0.PDF)

### Raspberry Pi RM2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-rm2&profile=raspberry-pi-rm2) · [Pin reference](https://www.raspberrypi.com/documentation/microcontrollers/radio-modules.html) · [Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)

- **Initial sale / release:** 2024-11-20. [Raspberry Pi Radio Module 2 Product Documentation](https://www.raspberrypi.com/documentation/microcontrollers/radio-modules.html)
- **Processor:** Embedded Arm Cortex-M3 (WLAN/BT subsystem). [Raspberry Pi Radio Module 2 Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)
- **Clock / maximum:** 37.4 MHz reference. [Raspberry Pi Radio Module 2 Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)
- **RAM:** Internal WLAN/BT RAM & ROM. [Raspberry Pi Radio Module 2 Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)
- **Program Flash / storage:** Firmware loaded via gSPI (Pico SDK). [Raspberry Pi Radio Module 2 Product Documentation](https://www.raspberrypi.com/documentation/microcontrollers/radio-modules.html), [Raspberry Pi Radio Module 2 Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)
- **Power / logic:** VIN: 3.0 to 4.8 V (nominal 3.3 V); VDDIO: 1.8 V +/-5% or 3.3 V +/-5%. Match VDDIO logic levels to the host microcontroller.. [Raspberry Pi Radio Module 2 Product Documentation](https://www.raspberrypi.com/documentation/microcontrollers/radio-modules.html), [Raspberry Pi Radio Module 2 Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)

Infineon CYW43439 single-band (2.4 GHz) Wi-Fi 4 (802.11n) and Bluetooth 5.2 radio combo chip. Features a gSPI interface and 3 host-controlled GPIO expanders. [Raspberry Pi Radio Module 2 Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)

21 castellated SMT edge pads, shared 2.4 GHz onboard PCB antenna, low pin-count gSPI bus, and 3 GPIO expander pins. [Raspberry Pi Radio Module 2 Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)

Circuit / board documents: [Raspberry Pi Radio Module 2 Datasheet](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf)

### Raspberry Pi Compute Module 4

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=compute-module&profile=raspberry-pi-cm4) · [Pin reference](https://www.raspberrypi.com/documentation/computers/compute-module.html) · [Datasheet](https://datasheets.raspberrypi.com/cm4/cm4-datasheet.pdf)

- **Initial sale / release:** 2020-10-19. [Raspberry Pi Compute Module 4 Product Documentation](https://www.raspberrypi.com/documentation/computers/compute-module.html)
- **Processor:** 4 × Arm Cortex-A72 (64-bit). [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **Clock / maximum:** 1.8 GHz; original boards 1.5 GHz. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **RAM:** 1 / 2 / 3 / 4 / 8 GB LPDDR4; model dependent. [Raspberry Pi 4 product brief](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008344-DS-7-raspberry-pi-4-product-brief.pdf)
- **Program Flash / storage:** Optional eMMC (8/16/32 GB) or Lite (external SD). [Raspberry Pi Compute Module 4 Product Documentation](https://www.raspberrypi.com/documentation/computers/compute-module.html), [Raspberry Pi Compute Module 4 Datasheet](https://datasheets.raspberrypi.com/cm4/cm4-datasheet.pdf)
- **Power / logic:** 5 V main power input (4.75-5.25 V). Select 3.3 V or 1.8 V I/O via GPIO_VREF.. [Raspberry Pi Compute Module 4 Product Documentation](https://www.raspberrypi.com/documentation/computers/compute-module.html), [Raspberry Pi Compute Module 4 Datasheet](https://datasheets.raspberrypi.com/cm4/cm4-datasheet.pdf)

Provides 200 contacts across dual 100-pin Hirose DF40 mezzanine connectors. Includes PCIe Gen 2 x1, Gigabit Ethernet PHY, dual HDMI 2.0, and 28 GPIOs. [Raspberry Pi Compute Module 4 Datasheet](https://datasheets.raspberrypi.com/cm4/cm4-datasheet.pdf)

Circuit / board documents: [Raspberry Pi Compute Module 4 Datasheet](https://datasheets.raspberrypi.com/cm4/cm4-datasheet.pdf)

### Raspberry Pi Compute Module 5

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=compute-module&profile=raspberry-pi-cm5) · [Pin reference](https://www.raspberrypi.com/documentation/computers/compute-module.html) · [Datasheet](https://datasheets.raspberrypi.com/cm5/cm5-datasheet.pdf)

- **Initial sale / release:** 2024-11-26. [Raspberry Pi Compute Module 5 Product Documentation](https://www.raspberrypi.com/documentation/computers/compute-module.html)
- **Processor:** 4 × Arm Cortex-A76 (64-bit); RP1 I/O. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Clock / maximum:** 2.4 GHz. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **RAM:** 1 / 2 / 4 / 8 / 16 GB LPDDR4X; model dependent. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Program Flash / storage:** Optional eMMC (16/32/64 GB) or Lite (external SD). [Raspberry Pi Compute Module 5 Product Documentation](https://www.raspberrypi.com/documentation/computers/compute-module.html), [Raspberry Pi Compute Module 5 Datasheet](https://datasheets.raspberrypi.com/cm5/cm5-datasheet.pdf)
- **Power / logic:** 5 V main power input (4.75-5.25 V). Select 3.3 V or 1.8 V I/O via GPIO_VREF.. [Raspberry Pi Compute Module 5 Product Documentation](https://www.raspberrypi.com/documentation/computers/compute-module.html), [Raspberry Pi Compute Module 5 Datasheet](https://datasheets.raspberrypi.com/cm5/cm5-datasheet.pdf)

Features BCM2712 SoC and RP1 I/O controller with PCIe Gen 2/3 x1, 2× USB 3.0, dual 4Kp60 HDMI, fan tacho/PWM, and RTC battery support. [Raspberry Pi Compute Module 5 Datasheet](https://datasheets.raspberrypi.com/cm5/cm5-datasheet.pdf)

Circuit / board documents: [Raspberry Pi Compute Module 5 Datasheet](https://datasheets.raspberrypi.com/cm5/cm5-datasheet.pdf)

### Raspberry Pi Zero W

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-zero-w) · [Pin reference](https://pip-assets.raspberrypi.com/categories/592-raspberry-pi-zero-w/documents/RP-008368-DS-1-raspberry-pi-zero-w-reduced-schematics.pdf) · [Datasheet](https://pip-assets.raspberrypi.com/categories/579-raspberry-pi-zero/documents/RP-008249-DS-1-bcm2835-peripherals.pdf)

- **Initial sale / release:** 2017-02-28. [Raspberry Pi Zero W joins the family](https://www.raspberrypi.com/news/raspberry-pi-zero-w-joins-family/)
- **Processor:** 1 × ARM1176JZF-S (32-bit). [Raspberry Pi processors documentation · BCM2835](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2835.adoc), [Raspberry Pi Zero models documentation · introduction and model list](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/zero/zero-intro.adoc)
- **Clock / maximum:** 1 GHz. [Raspberry Pi processors documentation · BCM2835](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2835.adoc), [Raspberry Pi Zero models documentation · introduction and model list](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/zero/zero-intro.adoc)
- **RAM:** 512 MB (Zero W). [Raspberry Pi processors documentation · BCM2835](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2835.adoc), [Raspberry Pi Zero models documentation · introduction and model list](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/zero/zero-intro.adoc)
- **Program Flash / storage:** microSD card slot. [Raspberry Pi processors documentation · BCM2835](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2835.adoc), [Raspberry Pi Zero models documentation · introduction and model list](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/zero/zero-intro.adoc)
- **Power / logic:** Power input through one of the two micro USB ports. [Raspberry Pi Zero models documentation · introduction and model list](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/zero/zero-intro.adoc)

40-pin header uses 3.3 V GPIO. Physical pin numbers differ from BCM GPIO numbers. Pins 27/28 are the HAT ID EEPROM bus. The header footprint ships unpopulated (fitted on the WH model). [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc), [Raspberry Pi Zero models documentation · introduction and model list](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/zero/zero-intro.adoc), [Raspberry Pi Zero W Reduced Schematics](https://pip-assets.raspberrypi.com/categories/592-raspberry-pi-zero-w/documents/RP-008368-DS-1-raspberry-pi-zero-w-reduced-schematics.pdf)

Circuit / board documents: [Raspberry Pi Zero W Reduced Schematics](https://pip-assets.raspberrypi.com/categories/592-raspberry-pi-zero-w/documents/RP-008368-DS-1-raspberry-pi-zero-w-reduced-schematics.pdf), [BCM2835 ARM Peripherals](https://pip-assets.raspberrypi.com/categories/579-raspberry-pi-zero/documents/RP-008249-DS-1-bcm2835-peripherals.pdf)

### Raspberry Pi Zero 2 W

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-zero-2-w) · [Pin reference](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008360-DS-1-raspberry-pi-zero-2-w-reduced-schematics.pdf) · [Datasheet](https://pip-assets.raspberrypi.com/categories/579-raspberry-pi-zero/documents/RP-008249-DS-1-bcm2835-peripherals.pdf)

- **Initial sale / release:** 2021-10-28. [New product: Raspberry Pi Zero 2 W on sale now](https://www.raspberrypi.com/news/new-raspberry-pi-zero-2-w-2/)
- **Processor:** 4 × Arm Cortex-A53 (64-bit). [Raspberry Pi processors documentation · RP3A0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/rp3a0.adoc), [Raspberry Pi Zero 2 W Product Brief](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf)
- **Clock / maximum:** 1 GHz. [Raspberry Pi processors documentation · RP3A0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/rp3a0.adoc), [Raspberry Pi Zero 2 W Product Brief](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf)
- **RAM:** 512 MB LPDDR2 (in package). [Raspberry Pi processors documentation · RP3A0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/rp3a0.adoc), [Raspberry Pi Zero 2 W Product Brief](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf)
- **Program Flash / storage:** microSD card slot. [Raspberry Pi processors documentation · RP3A0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/rp3a0.adoc), [Raspberry Pi Zero 2 W Product Brief](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf)
- **Power / logic:** 5 V DC 2.5 A via micro USB. [Raspberry Pi Zero 2 W Product Brief](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf)

40-pin header uses 3.3 V GPIO. Physical pin numbers differ from BCM GPIO numbers. Pins 27/28 are the HAT ID EEPROM bus. The header footprint ships unpopulated (fitted on the “with headers” model). [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc), [Raspberry Pi Zero 2 W Product Brief](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf), [Raspberry Pi Zero 2 W Reduced Schematics](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008360-DS-1-raspberry-pi-zero-2-w-reduced-schematics.pdf)

Circuit / board documents: [Raspberry Pi Zero 2 W Reduced Schematics](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008360-DS-1-raspberry-pi-zero-2-w-reduced-schematics.pdf), [Raspberry Pi Zero 2 W Product Brief](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf), [BCM2835 ARM Peripherals](https://pip-assets.raspberrypi.com/categories/579-raspberry-pi-zero/documents/RP-008249-DS-1-bcm2835-peripherals.pdf)

### Raspberry Pi 3 Model B+

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-3b-plus) · [Pin reference](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008339-DS-1-raspberry-pi-3-b-plus-reduced-schematics.pdf) · [Datasheet](https://pip-assets.raspberrypi.com/categories/579-raspberry-pi-zero/documents/RP-008249-DS-1-bcm2835-peripherals.pdf)

- **Initial sale / release:** 2018-03-14. [Raspberry Pi 3 Model B+ on sale now at $35](https://www.raspberrypi.com/news/raspberry-pi-3-model-bplus-sale-now-35/)
- **Processor:** 4 × Arm Cortex-A53 (64-bit). [Raspberry Pi processors documentation · BCM2837B0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2837b0.adoc), [Raspberry Pi 3 Model B+ Product Brief](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008338-DS-2-raspberry-pi-3-b-plus-product-brief.pdf)
- **Clock / maximum:** 1.4 GHz. [Raspberry Pi processors documentation · BCM2837B0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2837b0.adoc), [Raspberry Pi 3 Model B+ Product Brief](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008338-DS-2-raspberry-pi-3-b-plus-product-brief.pdf)
- **RAM:** 1 GB (3 Model B+). [Raspberry Pi processors documentation · BCM2837B0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2837b0.adoc), [Raspberry Pi 3 Model B+ Product Brief](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008338-DS-2-raspberry-pi-3-b-plus-product-brief.pdf)
- **Program Flash / storage:** microSD card slot. [Raspberry Pi processors documentation · BCM2837B0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2837b0.adoc), [Raspberry Pi 3 Model B+ Product Brief](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008338-DS-2-raspberry-pi-3-b-plus-product-brief.pdf)
- **Power / logic:** 5 V / 2.5 A via micro USB; 5 V DC via GPIO header; PoE with PoE HAT. [Raspberry Pi 3 Model B+ Product Brief](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008338-DS-2-raspberry-pi-3-b-plus-product-brief.pdf)

40-pin header uses 3.3 V GPIO. Physical pin numbers differ from BCM GPIO numbers. Pins 27/28 are the HAT ID EEPROM bus. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc)

Circuit / board documents: [Raspberry Pi 3 Model B+ Reduced Schematics](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008339-DS-1-raspberry-pi-3-b-plus-reduced-schematics.pdf), [Raspberry Pi 3 Model B+ Product Brief](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008338-DS-2-raspberry-pi-3-b-plus-product-brief.pdf), [BCM2835 ARM Peripherals](https://pip-assets.raspberrypi.com/categories/579-raspberry-pi-zero/documents/RP-008249-DS-1-bcm2835-peripherals.pdf)

### Raspberry Pi 500

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=raspberry-pi-40&profile=raspberry-pi-500) · [Pin reference](https://pip-assets.raspberrypi.com/categories/1115-raspberry-pi-500/documents/RP-008349-DS-4-raspberry-pi-500-product-brief.pdf) · [Datasheet](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf)

- **Initial sale / release:** 2024-12-09. [Raspberry Pi 500 and Raspberry Pi Monitor on sale now](https://www.raspberrypi.com/news/raspberry-pi-500-and-raspberry-pi-monitor-on-sale-now/)
- **Processor:** 4 × Arm Cortex-A76 (64-bit); RP1 I/O. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **Clock / maximum:** 2.4 GHz. [Raspberry Pi 5 specifications](https://www.raspberrypi.com/products/raspberry-pi-5/)
- **RAM:** 8 GB LPDDR4X-4267. [Raspberry Pi 500 Product Brief](https://pip-assets.raspberrypi.com/categories/1115-raspberry-pi-500/documents/RP-008349-DS-4-raspberry-pi-500-product-brief.pdf), [Raspberry Pi keyboard computers documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/keyboard-computers/intro.adoc)
- **Program Flash / storage:** microSD card slot. [Raspberry Pi 500 Product Brief](https://pip-assets.raspberrypi.com/categories/1115-raspberry-pi-500/documents/RP-008349-DS-4-raspberry-pi-500-product-brief.pdf), [Raspberry Pi keyboard computers documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/keyboard-computers/intro.adoc)
- **Power / logic:** 5 V / 5 A (25 W) via USB-C with a 600 mA peripheral limit. [Raspberry Pi 500 Product Brief](https://pip-assets.raspberrypi.com/categories/1115-raspberry-pi-500/documents/RP-008349-DS-4-raspberry-pi-500-product-brief.pdf), [Raspberry Pi keyboard computers documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/keyboard-computers/intro.adoc)

40-pin header uses 3.3 V GPIO. Physical pin numbers differ from BCM GPIO numbers. Pins 27/28 are the HAT ID EEPROM bus. The header is on the rear of the keyboard and rotated 180° compared with a standard board. [Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc), [Raspberry Pi keyboard computers documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/keyboard-computers/intro.adoc)

Circuit / board documents: [Raspberry Pi 500 Product Brief](https://pip-assets.raspberrypi.com/categories/1115-raspberry-pi-500/documents/RP-008349-DS-4-raspberry-pi-500-product-brief.pdf), [Raspberry Pi RP1 Peripherals](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf)

### ATmega328P · PDIP-28

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega328p-pdip28&profile=atmega328p-pdip28) · [Pin reference](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf#page=14) · [Datasheet](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

- **First production / release:** Unverified. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Processor:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Clock / maximum:** 20 MHz. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash / storage:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / persistent data:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Power / logic:** Connect VCC, AVCC and every GND pin; oscillator/fuse and RESET conditions are independent of Arduino boards.. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

20 MHz requires 4.5–5.5 V; use the datasheet speed grade at lower voltages. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

### ATmega328P · TQFP-32

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega328p-tqfp32&profile=atmega328p-tqfp32) · [Pin reference](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf#page=16) · [Datasheet](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

- **First production / release:** Unverified. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Processor:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Clock / maximum:** 20 MHz. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash / storage:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / persistent data:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Power / logic:** Connect VCC, AVCC and every GND pin; oscillator/fuse and RESET conditions are independent of Arduino boards.. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

20 MHz requires 4.5–5.5 V; use the datasheet speed grade at lower voltages. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

### ATmega328P · QFN/MLF-32

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega328p-qfn32&profile=atmega328p-qfn32) · [Pin reference](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf#page=17) · [Datasheet](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

- **First production / release:** Unverified. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Processor:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Clock / maximum:** 20 MHz. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash / storage:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / persistent data:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Power / logic:** Connect VCC, AVCC and every GND pin; oscillator/fuse and RESET conditions are independent of Arduino boards.. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

20 MHz requires 4.5–5.5 V; use the datasheet speed grade at lower voltages. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

### ATmega328P · QFN/MLF-28

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega328p-qfn28&profile=atmega328p-qfn28) · [Pin reference](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf#page=15) · [Datasheet](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

- **First production / release:** Unverified. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Processor:** 8-bit AVR. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Clock / maximum:** 20 MHz. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **RAM:** 2 KB SRAM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Program Flash / storage:** 32 KB Flash. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **EEPROM / persistent data:** 1 KB EEPROM. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)
- **Power / logic:** Connect VCC, AVCC and every GND pin; oscillator/fuse and RESET conditions are independent of Arduino boards.. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

20 MHz requires 4.5–5.5 V; use the datasheet speed grade at lower voltages. [Atmel ATmega328/P complete datasheet (Arduino mirror)](https://docs.arduino.cc/resources/datasheets/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf)

### ATmega2560 · TQFP-100

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega2560-tqfp100&profile=atmega2560-tqfp100) · [Pin reference](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf#page=2) · [Datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)

- **First production / release:** Unverified. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Processor:** 8-bit AVR. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Clock / maximum:** 16 MHz. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **RAM:** 8 KB SRAM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Program Flash / storage:** 256 KB Flash. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **EEPROM / persistent data:** 4 KB EEPROM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Power / logic:** Connect VCC, AVCC and every GND pin; oscillator/fuse and RESET conditions are independent of Arduino boards.. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

### ATmega2561 · TQFP-64

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=atmega2561-tqfp64&profile=atmega2561-tqfp64) · [Pin reference](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf#page=4) · [Datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)

- **First production / release:** Unverified. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Processor:** 8-bit AVR. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Clock / maximum:** 16 MHz. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **RAM:** 8 KB SRAM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Program Flash / storage:** 256 KB Flash. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **EEPROM / persistent data:** 4 KB EEPROM. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)
- **Power / logic:** Connect VCC, AVCC and every GND pin; oscillator/fuse and RESET conditions are independent of Arduino boards.. [ATmega640/1280/1281/2560/2561 complete datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/ATmega640-1280-1281-2560-2561-Datasheet-DS40002211A.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

### Seeed Studio XIAO RP2040

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=seeed-xiao&profile=xiao-rp2040) · [Pin reference](https://wiki.seeedstudio.com/XIAO-RP2040/) · [Datasheet](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/Seeed-Studio-XIAO-RP2040-v1.3.pdf)

- **Initial sale / release:** 2021. [XIAO RP2040 launch history](https://www.seeedstudio.com/blog/2021/07/29/new-product-post-xiao-rp2040/)
- **Processor:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Clock / maximum:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash / storage:** 2 MB QSPI Flash. [XIAO RP2040 specifications](https://wiki.seeedstudio.com/XIAO-RP2040/), [Seeed Studio XIAO RP2040 Schematic](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/Seeed-Studio-XIAO-RP2040-v1.3.pdf)
- **Fixed ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Power / logic:** USB-C: 5 V; GPIO: 3.3 V. A 5 V power pin does not imply 5 V GPIO tolerance.. [XIAO RP2040 specifications](https://wiki.seeedstudio.com/XIAO-RP2040/), [Seeed Studio XIAO RP2040 Schematic](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/Seeed-Studio-XIAO-RP2040-v1.3.pdf)

8 PIO state machines; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

Standard 14-contact XIAO: 11 GPIO + 3 power/ground contacts. Do not apply Plus-variant extra pins to this map. [XIAO RP2040 specifications](https://wiki.seeedstudio.com/XIAO-RP2040/)

Circuit / board documents: [Seeed Studio XIAO RP2040 Schematic](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/Seeed-Studio-XIAO-RP2040-v1.3.pdf)

### Seeed Studio XIAO ESP32C3

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=seeed-xiao&profile=xiao-esp32c3) · [Pin reference](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/) · [Datasheet](https://files.seeedstudio.com/wiki/XIAO_WiFi/Resources/XIAO_ESP32C3_v1.3_SCH_260116.pdf)

- **Initial sale / release:** 2022-07-07. [XIAO ESP32C3 launch](https://www.seeedstudio.com/blog/2022/07/11/voice-needed-do-you-know-xiao-esp32c3-can-can/)
- **Processor:** 1 × 32-bit RISC-V. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Clock / maximum:** 160 MHz. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **RAM:** 400 KB SRAM (16 KB cache included) + 8 KB RTC SRAM. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Program Flash / storage:** 4 MB Flash. [XIAO ESP32C3 specifications](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/), [Seeed Studio XIAO ESP32C3 Schematic](https://files.seeedstudio.com/wiki/XIAO_WiFi/Resources/XIAO_ESP32C3_v1.3_SCH_260116.pdf)
- **Fixed ROM:** 384 KB ROM. [ESP32C3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)
- **Power / logic:** USB-C: 5 V; GPIO: 3.3 V. A 5 V power pin does not imply 5 V GPIO tolerance.. [XIAO ESP32C3 specifications](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/), [Seeed Studio XIAO ESP32C3 Schematic](https://files.seeedstudio.com/wiki/XIAO_WiFi/Resources/XIAO_ESP32C3_v1.3_SCH_260116.pdf)

Standard 14-contact XIAO: 11 GPIO + 3 power/ground contacts. Do not apply Plus-variant extra pins to this map. [XIAO ESP32C3 specifications](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/)

Circuit / board documents: [Seeed Studio XIAO ESP32C3 Schematic](https://files.seeedstudio.com/wiki/XIAO_WiFi/Resources/XIAO_ESP32C3_v1.3_SCH_260116.pdf)

### Seeed Studio XIAO SAMD21

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=seeed-xiao&profile=xiao-samd21) · [Pin reference](https://wiki.seeedstudio.com/Seeeduino-XIAO/) · [Datasheet](https://files.seeedstudio.com/wiki/Seeeduino-XIAO/res/Seeeduino-XIAO-v1.0-SCH-191112.pdf)

- **Documented by:** 2020. [Seeeduino XIAO manufacturer project roundup](https://www.seeedstudio.com/blog/2020/05/08/seeeduino-xiao-community-projects-collection-whats-your-next-project-idea-made-by-seeeeduino-xiao/)
- **Processor:** Arm Cortex-M0+. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/)
- **Clock / maximum:** 48 MHz. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/)
- **RAM:** 32 KB SRAM. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/)
- **Program Flash / storage:** 256 KB internal Flash. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/), [Seeed Studio XIAO SAMD21 Schematic](https://files.seeedstudio.com/wiki/Seeeduino-XIAO/res/Seeeduino-XIAO-v1.0-SCH-191112.pdf)
- **Power / logic:** USB-C: 5 V; GPIO: 3.3 V. A 5 V power pin does not imply 5 V GPIO tolerance.. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/), [Seeed Studio XIAO SAMD21 Schematic](https://files.seeedstudio.com/wiki/Seeeduino-XIAO/res/Seeeduino-XIAO-v1.0-SCH-191112.pdf)

Standard 14-contact XIAO: 11 GPIO + 3 power/ground contacts. Do not apply Plus-variant extra pins to this map. [XIAO SAMD21 specifications](https://wiki.seeedstudio.com/Seeeduino-XIAO/)

Circuit / board documents: [Seeed Studio XIAO SAMD21 Schematic](https://files.seeedstudio.com/wiki/Seeeduino-XIAO/res/Seeeduino-XIAO-v1.0-SCH-191112.pdf)

### Seeed Studio XIAO nRF52840

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=seeed-xiao&profile=xiao-nrf52840) · [Pin reference](https://wiki.seeedstudio.com/XIAO_BLE/) · [Datasheet](https://files.seeedstudio.com/wiki/XIAO-BLE/Seeed-Studio-XIAO-nRF52840-Sense-v1.1.pdf)

- **Initial sale / release:** 2021-12-07. [Seeed Studio XIAO nRF52840 launch](https://www.seeedstudio.com/blog/2021/12/07/seeed-xiao-ble-nrf52840-sense/)
- **Processor:** Arm Cortex-M4F. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **Clock / maximum:** 64 MHz. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **RAM:** 256 KB SRAM. [nano-33-ble-sense-rev2 hardware manual](https://docs.arduino.cc/hardware/nano-33-ble-sense-rev2/)
- **Program Flash / storage:** 1 MB internal Flash + 2 MB QSPI Flash. [XIAO nRF52840 specifications](https://wiki.seeedstudio.com/XIAO_BLE/), [Seeed Studio XIAO nRF52840 Sense Schematic](https://files.seeedstudio.com/wiki/XIAO-BLE/Seeed-Studio-XIAO-nRF52840-Sense-v1.1.pdf)
- **Power / logic:** USB-C: 5 V; GPIO: 3.3 V. A 5 V power pin does not imply 5 V GPIO tolerance.. [XIAO nRF52840 specifications](https://wiki.seeedstudio.com/XIAO_BLE/), [Seeed Studio XIAO nRF52840 Sense Schematic](https://files.seeedstudio.com/wiki/XIAO-BLE/Seeed-Studio-XIAO-nRF52840-Sense-v1.1.pdf)

Standard 14-contact XIAO: 11 GPIO + 3 power/ground contacts. nRF52840 BLE and internal antenna. The Sense variant adds an onboard LSM6DS3TR-C 6-axis IMU and PDM microphone. [XIAO nRF52840 specifications](https://wiki.seeedstudio.com/XIAO_BLE/)

Circuit / board documents: [Seeed Studio XIAO nRF52840 Sense Schematic](https://files.seeedstudio.com/wiki/XIAO-BLE/Seeed-Studio-XIAO-nRF52840-Sense-v1.1.pdf)

### Seeed Studio XIAO ESP32S3

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=seeed-xiao&profile=xiao-esp32s3) · [Pin reference](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/) · [Datasheet](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/new-res/202003751_XIAO%20ESP32S3_v1.4_SCH_260226.pdf.pdf)

- **Initial sale / release:** 2023-03-27. [Seeed Studio XIAO ESP32S3 launch](https://www.seeedstudio.com/blog/2023/03/27/seeed-studio-xiao-esp32s3-sense/)
- **Processor:** 2 × Xtensa LX7. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Clock / maximum:** 240 MHz. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **RAM:** 512 KB SRAM + 16 KB RTC SRAM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **Program Flash / storage:** 8 MB Flash. [XIAO ESP32S3 specifications](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/), [Seeed Studio XIAO ESP32S3 Schematic](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/new-res/202003751_XIAO%20ESP32S3_v1.4_SCH_260226.pdf.pdf)
- **Fixed ROM:** 384 KB ROM. [ESP32S3 series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **External PSRAM:** 8 MB PSRAM (Octal). [XIAO ESP32S3 specifications](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/), [Seeed Studio XIAO ESP32S3 Schematic](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/new-res/202003751_XIAO%20ESP32S3_v1.4_SCH_260226.pdf.pdf)
- **Power / logic:** USB-C: 5 V; GPIO: 3.3 V. A 5 V power pin does not imply 5 V GPIO tolerance.. [XIAO ESP32S3 specifications](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/), [Seeed Studio XIAO ESP32S3 Schematic](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/new-res/202003751_XIAO%20ESP32S3_v1.4_SCH_260226.pdf.pdf)

Standard 14-contact XIAO: 11 GPIO + 3 power/ground contacts. Houses ESP32-S3R8 with 8 MB Flash and 8 MB Octal PSRAM. The Sense add-on board provides an OV2640 camera, digital microphone, and microSD card slot. [XIAO ESP32S3 specifications](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/)

Circuit / board documents: [Seeed Studio XIAO ESP32S3 Schematic](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/new-res/202003751_XIAO%20ESP32S3_v1.4_SCH_260226.pdf.pdf)

### BBC micro:bit V2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=microbit-v2&profile=microbit-v2) · [Pin reference](https://tech.microbit.org/hardware/edgeconnector/) · [Datasheet](https://tech.microbit.org/hardware/schematic/)

- **Announcement:** 2020-10-13. [New BBC micro:bit announced](https://microbit.org/news/2020-10-13/meet-the-new-bbc-microbit/)
- **Processor:** Arm Cortex-M4F. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)
- **Clock / maximum:** 64 MHz. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)
- **RAM:** 128 KB SRAM. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)
- **Program Flash / storage:** 512 KB Flash. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)
- **Power / logic:** USB: 5 V or battery connector; edge-connector logic approximately 3 V.. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/), [BBC micro:bit V2 Schematic](https://tech.microbit.org/hardware/schematic/)

LED matrix, buttons and touch functions share some GPIOs. Distinguish nRF52833 application MCU from the USB interface processor. [micro:bit v2.0 hardware](https://tech.microbit.org/hardware/2-0-revision/)

Circuit / board documents: [BBC micro:bit V2 Schematic](https://tech.microbit.org/hardware/schematic/)

### Adafruit Feather RP2040

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=adafruit-feather-rp2040&profile=adafruit-feather-rp2040) · [Pin reference](https://github.com/adafruit/Adafruit-Feather-RP2040-PCB/blob/be3f4b3260411d27569d3afe030247dc0e747284/Adafruit%20Feather%20RP2040%20pinout.pdf) · [Datasheet](https://learn.adafruit.com/adafruit-feather-rp2040-pico/downloads)

- **Documented by:** 2021-03-05. [Feather RP2040 overview](https://learn.adafruit.com/adafruit-feather-rp2040-pico/overview)
- **Processor:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Clock / maximum:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash / storage:** 8 MB SPI Flash. [Feather RP2040 overview](https://learn.adafruit.com/adafruit-feather-rp2040-pico/overview)
- **Fixed ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Power / logic:** USB: 5 V / single-cell LiPo; GPIO: 3.3 V. On-board LiPo charging: 200 mA.. [Feather RP2040 overview](https://learn.adafruit.com/adafruit-feather-rp2040-pico/overview)

8 PIO state machines; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

STEMMA QT uses the board I²C bus. 133 MHz is the chip limit; the product guide also lists approximately 125 MHz operation. [Feather RP2040 overview](https://learn.adafruit.com/adafruit-feather-rp2040-pico/overview)

### Teensy 4.1

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=teensy-41&profile=teensy-41) · [Pin reference](https://www.pjrc.com/teensy/card11a_rev4_web.pdf) · [Datasheet](https://www.pjrc.com/teensy/card11b_rev4_web.pdf)

- **Initial sale / release:** 2020. [Teensy 4.1 released](https://www.pjrc.com/teensy-4-1-released/)
- **Processor:** Arm Cortex-M7 (DP-FPU). [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html)
- **Clock / maximum:** 600 MHz. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html)
- **RAM:** 1024 KB RAM. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html)
- **Program Flash / storage:** 8 MB on-board Flash; 7936 KB program space. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html), [Teensy 4.1 Schematic](https://www.pjrc.com/teensy/schematic41.png)
- **EEPROM / persistent data:** 4 KB emulated EEPROM. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html), [Teensy 4.1 Schematic](https://www.pjrc.com/teensy/schematic41.png)
- **Power / logic:** USB / VIN: 5 V; GPIO: 3.3 V, not 5 V tolerant.. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html), [Teensy 4.1 Schematic](https://www.pjrc.com/teensy/schematic41.png)

Top 256 KB of Flash is reserved for EEPROM emulation and restore code. Extra RAM/Flash footprints may be empty. [Teensy 4.1 specifications](https://www.pjrc.com/store/teensy41.html)

Circuit / board documents: [Teensy 4.1 Schematic](https://www.pjrc.com/teensy/schematic41.png)

### BeagleBone Black

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=beaglebone-black&profile=beaglebone-black) · [Pin reference](https://docs.beagleboard.org/boards/beaglebone/black/ch07.html) · [Datasheet](https://docs.beagleboard.org/boards/beaglebone/black/ch07.html)

- **Documented by:** 2013. [BeagleBone Black document and board history](https://docs.beagleboard.org/boards/beaglebone/black/ch02.html)
- **Processor:** Arm Cortex-A8 + 2 × PRU. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html)
- **Clock / maximum:** 1 GHz. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html)
- **RAM:** 512 MB DDR3L. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html)
- **Program Flash / storage:** Rev C: 4 GB eMMC; older revisions 2 GB; microSD. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html)
- **Power / logic:** 5 V DC / USB; digital GPIO: 3.3 V; analog inputs maximum 1.8 V.. [BeagleBone Black specifications](https://docs.beagleboard.org/boards/beaglebone/black/ch05.html), [BeagleBone Black System Reference Manual · Chapter 7 Expansion Headers P8/P9](https://docs.beagleboard.org/boards/beaglebone/black/ch07.html)

P8/P9 pins may be shared with HDMI and eMMC. Device Tree/pinmux configuration is required. Do not apply 3.3 V to analog inputs. [BeagleBone Black System Reference Manual · Chapter 7 Expansion Headers P8/P9](https://docs.beagleboard.org/boards/beaglebone/black/ch07.html)

### RP2350A

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=rp2350a&profile=rp2350a) · [Pin reference](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=16) · [Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

- **Silicon introduction:** 2024-08-08. [pico2 launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-2-our-new-5-microcontroller-board-on-sale-now/)
- **Processor:** 2 × Arm Cortex-M33 / 2 × Hazard3 RISC-V. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Clock / maximum:** 150 MHz. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **RAM:** 520 KB SRAM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Program Flash / storage:** No internal Flash; external QSPI Flash required.. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Fixed ROM:** 32 KB boot ROM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Power / logic:** Connect every supply, ground and exposed pad per datasheet; no board regulator is included.. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

Two cores run concurrently; all four cores cannot run together. 12 PIO state machines. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

### RP2350B

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=rp2350b&profile=rp2350b) · [Pin reference](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=17) · [Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

- **Silicon introduction:** 2024-08-08. [pico2 launch announcement](https://www.raspberrypi.com/news/raspberry-pi-pico-2-our-new-5-microcontroller-board-on-sale-now/)
- **Processor:** 2 × Arm Cortex-M33 / 2 × Hazard3 RISC-V. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Clock / maximum:** 150 MHz. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **RAM:** 520 KB SRAM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Program Flash / storage:** No internal Flash; external QSPI Flash required.. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Fixed ROM:** 32 KB boot ROM. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)
- **Power / logic:** Connect every supply, ground and exposed pad per datasheet; no board regulator is included.. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

Two cores run concurrently; all four cores cannot run together. 12 PIO state machines. [RP2350 Datasheet](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf)

### STM32F401RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f401ret6&profile=stm32f401ret6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F401R(D-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

- **Documented by:** 2014-01-16. [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Processor:** Arm Cortex-M4F. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Clock / maximum:** 84 MHz. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **RAM:** 96 KB. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Program Flash / storage:** 512 KB Flash. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F401RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401re.html), [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)
- **MCU datasheet initial publication:** 2014-01-16. [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F401RE datasheet](https://www.st.com/resource/en/datasheet/stm32f401re.pdf)

### STM32F411RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f411ret6&profile=stm32f411ret6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F411R(C-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

- **Documented by:** 2014-06-19. [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Processor:** Arm Cortex-M4F. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Clock / maximum:** 100 MHz. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **RAM:** 128 KB. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Program Flash / storage:** 512 KB Flash. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F411RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411re.html), [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)
- **MCU datasheet initial publication:** 2014-06-19. [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F411RE datasheet](https://www.st.com/resource/en/datasheet/stm32f411re.pdf)

### STM32G474RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32g474ret6&profile=stm32g474ret6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32G474R(B-C-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

- **Documented by:** 2019-05-15. [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Processor:** Arm Cortex-M4F. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Clock / maximum:** 170 MHz. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **RAM:** 128 KB (96 KB SRAM + 32 KB CCM). [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Program Flash / storage:** 512 KB Flash. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [G474RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32g474re.html), [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)
- **MCU datasheet initial publication:** 2019-05-15. [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [G474RE datasheet](https://www.st.com/resource/en/datasheet/stm32g474re.pdf)

### STM32H723ZGT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32h723zgt6&profile=stm32h723zgt6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32H723ZGTx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

- **Documented by:** 2020-07-10. [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Processor:** Arm Cortex-M7 (DP-FPU). [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Clock / maximum:** 550 MHz. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **RAM:** 564 KB (TCM + SRAM + 4 KB backup). [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Program Flash / storage:** 1024 KB Flash. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [H723ZG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h723zg.html), [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)
- **MCU datasheet initial publication:** 2020-07-10. [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [H723ZG datasheet](https://www.st.com/resource/en/datasheet/stm32h723zg.pdf)

### RP2040

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=rp2040&profile=rp2040) · [Pin reference](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf#page=12) · [Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

- **Silicon introduction:** 2021-01-21. [pico launch announcement](https://www.raspberrypi.com/news/raspberry-pi-silicon-pico-now-on-sale/)
- **Processor:** 2 × Arm Cortex-M0+. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Clock / maximum:** 133 MHz. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **RAM:** 264 KB SRAM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Program Flash / storage:** No internal Flash; external QSPI Flash required.. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Fixed ROM:** 16 KB boot ROM. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- **Power / logic:** Connect every supply, ground and exposed pad per datasheet; no board regulator is included.. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

8 PIO state machines; 2 UART, 2 SPI, 2 I²C; USB 1.1. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)

### NUCLEO-F446RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f446re) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=48) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

- **First production / release:** Unverified. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Processor:** Arm Cortex-M4F. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Clock / maximum:** 180 MHz. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **RAM:** 128 KB SRAM + 4 KB backup. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Program Flash / storage:** 512 KB Flash. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2015-02-17. [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32F446RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f446ret6&profile=stm32f446ret6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F446R(C-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

- **Documented by:** 2015-02-17. [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Processor:** Arm Cortex-M4F. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Clock / maximum:** 180 MHz. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **RAM:** 128 KB SRAM + 4 KB backup. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Program Flash / storage:** 512 KB Flash. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F446RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html), [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
- **MCU datasheet initial publication:** 2015-02-17. [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F446RE datasheet](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)

### NUCLEO-F303RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f303re) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=42) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

- **First production / release:** Unverified. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Processor:** Arm Cortex-M4F. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Clock / maximum:** 72 MHz. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **RAM:** 80 KB (64 KB SRAM + 16 KB CCM). [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Program Flash / storage:** 512 KB Flash. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2015-01-20. [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32F303RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f303ret6&profile=stm32f303ret6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F303R(D-E)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

- **Documented by:** 2015-01-20. [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Processor:** Arm Cortex-M4F. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Clock / maximum:** 72 MHz. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **RAM:** 80 KB (64 KB SRAM + 16 KB CCM). [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Program Flash / storage:** 512 KB Flash. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F303RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f303re.html), [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)
- **MCU datasheet initial publication:** 2015-01-20. [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F303RE datasheet](https://www.st.com/resource/en/datasheet/stm32f303re.pdf)

### NUCLEO-L476RG

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-l476rg) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=53) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

- **First production / release:** Unverified. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Processor:** Arm Cortex-M4F. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Clock / maximum:** 80 MHz. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **RAM:** 128 KB SRAM. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Program Flash / storage:** 1024 KB Flash. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2015-05-29. [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32L476RGT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32l476rgt6&profile=stm32l476rgt6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32L476R(C-E-G)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

- **Documented by:** 2015-05-29. [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Processor:** Arm Cortex-M4F. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Clock / maximum:** 80 MHz. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **RAM:** 128 KB SRAM. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Program Flash / storage:** 1024 KB Flash. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [L476RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l476rg.html), [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)
- **MCU datasheet initial publication:** 2015-05-29. [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [L476RG datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf)

### NUCLEO-F072RB

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-f072rb) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=38) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

- **First production / release:** Unverified. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Processor:** Arm Cortex-M0. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Clock / maximum:** 48 MHz. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **RAM:** 16 KB SRAM. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Program Flash / storage:** 128 KB Flash. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2014-01-13. [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32F072RBT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f072rbt6&profile=stm32f072rbt6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F072R(8-B)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

- **Documented by:** 2014-01-13. [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Processor:** Arm Cortex-M0. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Clock / maximum:** 48 MHz. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **RAM:** 16 KB SRAM. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Program Flash / storage:** 128 KB Flash. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F072RB specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f072rb.html), [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)
- **MCU datasheet initial publication:** 2014-01-13. [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F072RB datasheet](https://www.st.com/resource/en/datasheet/stm32f072rb.pdf)

### NUCLEO-L053R8

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-l053r8) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=46) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

- **First production / release:** Unverified. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Processor:** Arm Cortex-M0+. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Clock / maximum:** 32 MHz. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **RAM:** 8 KB SRAM. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Program Flash / storage:** 64 KB Flash. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **EEPROM / persistent data:** 2 KB data EEPROM. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2014-02-07. [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32L053R8T6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32l053r8t6&profile=stm32l053r8t6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32L053R(6-8)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

- **Documented by:** 2014-02-07. [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Processor:** Arm Cortex-M0+. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Clock / maximum:** 32 MHz. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **RAM:** 8 KB SRAM. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Program Flash / storage:** 64 KB Flash. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **EEPROM / persistent data:** 2 KB data EEPROM. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [L053R8 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l053r8.html), [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)
- **MCU datasheet initial publication:** 2014-02-07. [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [L053R8 datasheet](https://www.st.com/resource/en/datasheet/stm32l053r8.pdf)

### NUCLEO-L152RE

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-64&profile=nucleo-l152re) · [Pin reference](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf#page=51) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

- **First production / release:** Unverified. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Processor:** Arm Cortex-M3. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Clock / maximum:** 32 MHz. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **RAM:** 80 KB SRAM. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Program Flash / storage:** 512 KB Flash. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **EEPROM / persistent data:** 16 KB data EEPROM. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf), [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)
- **MCU datasheet initial publication:** 2013-10-31. [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

Circuit / board documents: [STM32 Nucleo-64 boards (MB1136) user manual](https://evo.net.ua/content/files/dm00105823-stm32-nucleo-64-boards-mb1136-stmicroelectronics-5104243.pdf)

### STM32L152RET6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32l152ret6&profile=stm32l152ret6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32L152RETx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

- **Documented by:** 2013-10-31. [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Processor:** Arm Cortex-M3. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Clock / maximum:** 32 MHz. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **RAM:** 80 KB SRAM. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Program Flash / storage:** 512 KB Flash. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **EEPROM / persistent data:** 16 KB data EEPROM. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [L152RE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l152re.html), [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)
- **MCU datasheet initial publication:** 2013-10-31. [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [L152RE datasheet](https://www.st.com/resource/en/datasheet/stm32l152re.pdf)

### STM32F407VGT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f407vgt6&profile=stm32f407vgt6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F407V(E-G)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)

- **Documented by:** 2011-09-15. [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **Processor:** Arm Cortex-M4F. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **Clock / maximum:** 168 MHz. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **RAM:** 192 KB (128 KB SRAM + 64 KB CCM) + 4 KB backup. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **Program Flash / storage:** 1024 KB Flash. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F407VG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html), [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)
- **MCU datasheet initial publication:** 2011-09-15. [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F407VG datasheet](https://www.st.com/resource/en/datasheet/stm32f407vg.pdf)

### STM32F405RGT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f405rgt6&profile=stm32f405rgt6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F405RGTx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)

- **Documented by:** 2011-09-15. [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **Processor:** Arm Cortex-M4F. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **Clock / maximum:** 168 MHz. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **RAM:** 192 KB (128 KB SRAM + 64 KB CCM) + 4 KB backup. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **Program Flash / storage:** 1024 KB Flash. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F405RG specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f405rg.html), [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)
- **MCU datasheet initial publication:** 2011-09-15. [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F405RG datasheet](https://www.st.com/resource/en/datasheet/stm32f405rg.pdf)

### NUCLEO-F042K6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-32&profile=nucleo-f042k6) · [Pin reference](https://www.st.com/resource/en/user_manual/dm00231744.pdf#page=24) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

- **First production / release:** Unverified. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Processor:** Arm Cortex-M0. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Clock / maximum:** 48 MHz. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **RAM:** 6 KB SRAM. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Program Flash / storage:** 32 KB Flash. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf), [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)
- **MCU datasheet initial publication:** 2014-02-25. [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)

Circuit / board documents: [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)

### STM32F042K6T6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f042k6t6&profile=stm32f042k6t6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F042K(4-6)Tx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

- **Documented by:** 2014-02-25. [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Processor:** Arm Cortex-M0. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Clock / maximum:** 48 MHz. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **RAM:** 6 KB SRAM. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Program Flash / storage:** 32 KB Flash. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F042K6 specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f042k6.html), [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)
- **MCU datasheet initial publication:** 2014-02-25. [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F042K6 datasheet](https://www.st.com/resource/en/datasheet/stm32f042k6.pdf)

### NUCLEO-L432KC

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-32&profile=nucleo-l432kc) · [Pin reference](https://www.st.com/resource/en/user_manual/dm00231744.pdf#page=30) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

- **First production / release:** Unverified. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Processor:** Arm Cortex-M4F. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Clock / maximum:** 80 MHz. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **RAM:** 64 KB SRAM. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Program Flash / storage:** 256 KB Flash. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf), [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)
- **MCU datasheet initial publication:** 2016-02-08. [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)

Circuit / board documents: [STM32 Nucleo-32 boards MB1180 · UM1956 Rev 6](https://www.st.com/resource/en/user_manual/dm00231744.pdf)

### STM32L432KCU6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32l432kcu6&profile=stm32l432kcu6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32L432K(B-C)Ux.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

- **Documented by:** 2016-02-08. [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Processor:** Arm Cortex-M4F. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Clock / maximum:** 80 MHz. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **RAM:** 64 KB SRAM. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Program Flash / storage:** 256 KB Flash. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [L432KC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32l432kc.html), [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)
- **MCU datasheet initial publication:** 2016-02-08. [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [L432KC datasheet](https://www.st.com/resource/en/datasheet/stm32l432kc.pdf)

### NUCLEO-F767ZI

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-144&profile=nucleo-f767zi) · [Pin reference](https://www.st.com/resource/en/user_manual/dm00244518-stm32-nucleo144-boards-stmicroelectronics.pdf) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

- **First production / release:** Unverified. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Processor:** Arm Cortex-M7 (DP-FPU). [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Clock / maximum:** 216 MHz. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **RAM:** 512 KB SRAM + 16 KB ITCM + 4 KB backup. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Program Flash / storage:** 2048 KB Flash. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf), [STM32 Nucleo-144 · UM1974 Rev 11](https://www.st.com/resource/en/user_manual/dm00244518-stm32-nucleo144-boards-stmicroelectronics.pdf)
- **MCU datasheet initial publication:** 2016-03-21. [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-144 · UM1974 Rev 11](https://www.st.com/resource/en/user_manual/dm00244518-stm32-nucleo144-boards-stmicroelectronics.pdf)

Circuit / board documents: [STM32 Nucleo-144 · UM1974 Rev 11](https://www.st.com/resource/en/user_manual/dm00244518-stm32-nucleo144-boards-stmicroelectronics.pdf)

### STM32F767ZIT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f767zit6&profile=stm32f767zit6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F767ZITx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

- **Documented by:** 2016-03-21. [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Processor:** Arm Cortex-M7 (DP-FPU). [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Clock / maximum:** 216 MHz. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **RAM:** 512 KB SRAM + 16 KB ITCM + 4 KB backup. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Program Flash / storage:** 2048 KB Flash. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F767ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f767zi.html), [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)
- **MCU datasheet initial publication:** 2016-03-21. [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F767ZI datasheet](https://www.st.com/resource/en/datasheet/stm32f767zi.pdf)

### NUCLEO-H743ZI2

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=nucleo-144&profile=nucleo-h743zi2) · [Pin reference](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

- **First production / release:** Unverified. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Processor:** Arm Cortex-M7 (DP-FPU). [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Clock / maximum:** 480 MHz. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **RAM:** 1056 KB (192 KB TCM + 864 KB SRAM) + 4 KB backup. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Program Flash / storage:** 2048 KB Flash. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf), [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)
- **MCU datasheet initial publication:** 2017-06-22. [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

On-board ST-LINK provides programming/debugging. Arduino headers, Morpho contacts and MCU pads use separate numbering; solder bridges may affect access to the same net. [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)

Circuit / board documents: [STM32 Nucleo-144 · UM2407 Rev 6](https://www.st.com/resource/en/user_manual/um2407-stm32h7-nucleo144-board-stmicroelectronics.pdf)

### STM32H743ZIT6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32h743zit6&profile=stm32h743zit6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32H743ZITx.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

- **Documented by:** 2017-06-22. [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Processor:** Arm Cortex-M7 (DP-FPU). [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Clock / maximum:** 480 MHz. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **RAM:** 1056 KB (192 KB TCM + 864 KB SRAM) + 4 KB backup. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Program Flash / storage:** 2048 KB Flash. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [H743ZI specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32h743zi.html), [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)
- **MCU datasheet initial publication:** 2017-06-22. [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [H743ZI datasheet](https://www.st.com/resource/en/datasheet/stm32h743zi.pdf)

### WeAct Black Pill F401CC v3.x

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=black-pill&profile=weact-blackpill-f401cc) · [Pin reference](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/README.md) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

- **First production / release:** Unverified. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Processor:** Arm Cortex-M4F. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Clock / maximum:** 84 MHz. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **RAM:** 64 KB SRAM. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Program Flash / storage:** 256 KB Flash. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf), [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf)
- **MCU datasheet initial publication:** 2013-07-23. [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

v3.x board has a PC13 LED and PA0 button. Optional SPI Flash is separate from internal program Flash and is not fitted on every board. [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf), [WeAct MiniF4x1 hardware release notes](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/README.md)

Circuit / board documents: [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf)

### STM32F401CCU6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f401ccu6&profile=stm32f401ccu6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F401C(B-C)Ux.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

- **Documented by:** 2013-07-23. [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Processor:** Arm Cortex-M4F. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Clock / maximum:** 84 MHz. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **RAM:** 64 KB SRAM. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Program Flash / storage:** 256 KB Flash. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F401CC specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html), [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)
- **MCU datasheet initial publication:** 2013-07-23. [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F401CC datasheet](https://www.st.com/resource/en/datasheet/stm32f401cc.pdf)

### WeAct Black Pill F411CE v3.x

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=black-pill&profile=weact-blackpill-f411ce) · [Pin reference](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/README.md) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

- **First production / release:** Unverified. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Processor:** Arm Cortex-M4F. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Clock / maximum:** 100 MHz. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **RAM:** 128 KB SRAM. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Program Flash / storage:** 512 KB Flash. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Power / logic:** Board GPIO: 3.3 V. Select USB / external power using the jumper and bridge conditions in the board manual.. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf), [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf)
- **MCU datasheet initial publication:** 2014-06-19. [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

First production or sale date for this exact model/revision was not established in the reviewed primary documents. A document revision date is not a production year.

v3.x board has a PC13 LED and PA0 button. Optional SPI Flash is separate from internal program Flash and is not fitted on every board. [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf), [WeAct MiniF4x1 hardware release notes](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/README.md)

Circuit / board documents: [WeAct MiniF4x1Cx v3.1 schematic](https://github.com/WeActStudio/WeActStudio.MiniSTM32F4x1/blob/6a7f7d434a9d6361f91590d4cdd16b4a70ce7513/Hardware/MiniF4x1Cx_V31%20SchDoc.pdf)

### STM32F411CEU6

[Pin Atlas](https://zaryob.github.io/pin-atlas/#board=stm32f411ceu6&profile=stm32f411ceu6) · [Pin reference](https://github.com/STMicroelectronics/STM32_open_pin_data/blob/7d1f1514ed5583ec5007ad91236b4e1d377295b1/mcu/STM32F411C(C-E)Ux.xml) · [Datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

- **Documented by:** 2014-06-19. [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Processor:** Arm Cortex-M4F. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Clock / maximum:** 100 MHz. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **RAM:** 128 KB SRAM. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Program Flash / storage:** 512 KB Flash. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **Power / logic:** Supply range and 5 V tolerance depend on pin type; check VDD, VDDA, VCAP and VBAT conditions in the datasheet.. [F411CE specifications](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html), [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)
- **MCU datasheet initial publication:** 2014-06-19. [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

Clock is the MCU maximum. Configure PLL, supply and Flash wait states accordingly. RAM banks do not have identical DMA accessibility. [F411CE datasheet](https://www.st.com/resource/en/datasheet/stm32f411ce.pdf)

