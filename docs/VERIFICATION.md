# Pin data verification

[English](VERIFICATION.md) · [Türkçe](VERIFICATION.tr.md)

Reviewed on **4 November 2026**. The review covers thirty-three board, header, and chip profiles, **1,544 physical pin records, and 5,005 function assignments**. Shared physical pins are counted once per profile. The count excludes the app’s generic `GPIO` planning option and the unnumbered QFN center GND pads. Each placement of a signal on a different pin counts separately.

## Sources by pin map

### Raspberry Pi Pico 2 W

- Physical pins 1–40 were visually checked against the single-page [manufacturer pin diagram](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008305-DS-1-pico-2-w-pinout.pdf#page=1). With USB at the top, the left edge runs from 1 to 20 and the right edge from 40 to 21.
- VBUS, VSYS, 3V3_EN, 3V3, ADC_VREF, AGND, and RUN were also checked against the text in the [Pico 2 W Datasheet, §2.1, printed pages 7–8, PDF pages 8–9](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf#page=8).
- The digital alternate functions on exposed GPIOs come from the [RP2350 Datasheet, §1.2.3, Table 3, PDF pages 18–20](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=18). GPIO23, GPIO24, GPIO25, and GPIO29 are internal wireless connections and sit outside the 40-pin header.
- ADC0, ADC1, and ADC2 map to GP26, GP27, and GP28 in the pin diagram and datasheet Figure 2. HSTX uses the signal name `HSTX` and selector F0 from Table 3.

### Pico, Pico W, and Pico 2

- The 40 physical labels and ADC0/1/2 mappings were independently reviewed in Figure 2, PDF page 5 of each model’s datasheet: [Pico](https://datasheets.raspberrypi.com/pico/pico-datasheet.pdf#page=5), [Pico W](https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf#page=5), and [Pico 2](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf#page=5). Each observation is recorded separately in `sources/manual-observations.json`.
- Special supply, analogue and RUN connections are also checked against the text in §2.1 of each datasheet.
- Pico and Pico W digital functions are extracted from [RP2040 Datasheet §1.4.3, Table 2, PDF pages 13–14](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf#page=13). Selectors F1–F9 are preserved; RP2350-only HSTX, PIO2 and QMI are absent.
- Pico 2 uses the RP2350A function table already used for Pico 2 W. The board metadata and drawing distinguish RP2040 / RP2350A and wired / wireless models.
- Debug pads and internal GPIOs are outside the 40-pin header scope. These profiles do not imply that internal LED, wireless or voltage-sensing wiring is identical.

### Common Raspberry Pi 40-pin header

The common profile uses only the physical pin table in the pinned Raspberry Pi GPIO documentation. That document explicitly describes the standard layout for B+ and later and all Zero models, and the rotated orientation on keyboard computers. Some Zero headers are unpopulated. The profile excludes older 26-pin boards and Compute Modules. It deliberately carries no BCM2711 alternate function records or Pi 4 schematic evidence: choose the Pi 4 profile for those functions. HAT EEPROM pins 27/28 remain reserved.

### Raspberry Pi 4 Model B / J8

- All 40 physical pins come from the “Pin names, types, and typical functions” table in the [pinned Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc).
- Each GPIO net label was matched to its pin row by coordinates in the [Pi 4 Model B Reduced Schematics, Rev 4, J8](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008345-DS-1-raspberry-pi-4-reduced-schematics.pdf#page=1). The power and ground connections were checked visually on the schematic.
- The alternate function data comes from GPIO0–27, ALT0–ALT5, in [BCM2711 ARM Peripherals, §5.3, Table 94, PDF pages 78–79](https://pip-assets.raspberrypi.com/categories/545-raspberry-pi-4-model-b/documents/RP-008248-DS-1-bcm2711-peripherals.pdf#page=78). The extraction skips blank and `<reserved>` cells.
- The app expands `GPx` to `GPIOx`. Display names such as `I2C1 SDA` for `SDA1` or `UART0 TX` for `TXD0` retain the original manufacturer signal in `functions[].signal`. `PWM0_0` and `PWM0_1` retain their source names.
- Physical pins 27 and 28 carry GPIO0 and GPIO1, also called ID_SD and ID_SC. They are reserved for the HAT identification EEPROM. This pin map describes the BCM2711 alternate functions on the Pi 4.

### Raspberry Pi 5 / J8

- All 40 physical pins share the standard physical pin layout from the [pinned Raspberry Pi GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc).
- Alternate functions come from GPIO0–27, ALT0–ALT8 (a0–a8), in [Raspberry Pi RP1 Peripherals, §3.1.1, Table 4, PDF pages 16–17](https://datasheets.raspberrypi.com/rp1/rp1-peripherals.pdf#page=16).
- Physical pins 27 and 28 carry GPIO0 and GPIO1, reserved for the HAT identification EEPROM.
- RP1 alternate functions provide UART, SPI, I2C, I2S, PWM, PIO, DPI, SDIO, and PCM audio options distinct from BCM2711.

### RP2350A / QFN-60

- GPIO, QSPI, oscillator, debug, USB, and power pins use the [RP2350 Datasheet, §14.8.2.2, Tables 1674–1679, PDF pages 1333–1336](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=1333).
- The physical arrangement and IOVDD pads were checked against [§1.2.1.1, Figure 2, PDF page 16](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=16). The center GND pad sits outside the 60-pin count.
- Bank 0 uses Table 3 on PDF pages 18–20. Bank 1 USB and QSPI functions use [Table 5, PDF page 21](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=21).
- Table 1674 identifies GPIO26 through GPIO29 as ADC0 through ADC3 for this package.

### RP2350B / QFN-80

- The pin list uses the QFN-80 column of the RP2350 datasheet. The placement was checked against [§1.2.1.2, Figure 3, PDF page 17](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=17).
- Table 1674 gives the physical positions of GPIO0–47, and Table 5 gives Bank 1 USB and QSPI functions. On this package, ADC0–ADC7 map to GPIO40–GPIO47.

## IOVDD discrepancy in the manufacturer document

In RP2350 Release 8, Table 1679 lists `11,20,30,38,45,54` as the QFN-60 IOVDD pads. The same table also assigns pin 54 to QSPI_IOVDD. Figures 2 and 152 both show pin 1 as IOVDD and pin 54 as QSPI_IOVDD. [RP2350 Datasheet, Figure 2](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=16)

The verified QFN-60 IOVDD list uses **1,11,20,30,38,45** from the two figures. The QFN-80 IOVDD list was visually checked against Figure 3. The evidence and reasoning are recorded in `sources/manual-observations.json`.

## Reproduce the verification

1. `sources/manifest.json` records each source revision, document URL or commit, and SHA-256 hash.
2. `scripts/verify-official-sources.py` downloads and checks those sources, then rereads the PDF tables. It normalizes whitespace where cells wrap across lines.
   CI passes `--table-snapshots` to use the recorded ST table extractions in `sources/extracted/`, avoiding ST CDN timeouts. Each extraction is hash-locked and identifies the original locked PDF hash. The same parser rebuilds the STM32 data from either input; the other forty-eight sources are downloaded and checked in both modes. The default command rereads the original ST PDFs.
3. The physical pin number, name, type, alternate function, manufacturer signal, and F/ALT selector must match the published record.
4. Figure-only observations are marked separately. Reusing them during an automated run preserves the prior visual review. A changed hash requires a fresh source review.
5. [`sources/pin-verification.csv`](../sources/pin-verification.csv) lists each pin and function record. `dist/data/evidence.json` resolves reference IDs to documents, pages, and tables. `dist/data/verification.json` holds the verification totals and source summary.
6. GitHub Actions runs the same comparison against the manufacturer sources before deployment.

The app uses its own SVG schematics. Manufacturer documents are linked from the evidence records. Software and font licensing notices are maintained separately.

## Shared layout catalog

The twenty-nine source profiles are presented as nineteen physical layouts. UNO-format boards share 32 main-header positions, Nano references share 30 side positions, and the two Espressif module pairs retain one entry each. Optional connectors and electrical/MCU capabilities belong to the selected reference. Geometry grouping verifies connector labels and positions; it deliberately permits documented BOOT/NC and analog-only/GPIO differences. Older Pico/Pi groups retain their stricter number/name/type comparison. Legacy model IDs, saved plans and shared links still resolve to the original reference.

## NVIDIA Jetson Orin Nano · J12

The source is NVIDIA’s SHA-256-locked **Jetson Orin Nano Developer Kit Carrier Board Specification, SP-11324-001_v1.3 (December 2024)**. This map covers J12 on the NVIDIA P3768 carrier board, not the module’s 260-pin connector or third-party carriers.

- All 40 positions are extracted from Figure 3-1 (printed p. 21 / PDF p. 25) and independently matched to Table 3-3 (printed pp. 22–23 / PDF pp. 26–27). Supply pins and all eight grounds are checked against their table descriptions. All 28 signal pins can be configured for GPIO according to §3.3.
- Peripheral signals use the carrier/module names in those sources. GPIO09’s audio primary clock, GPIO01/GPIO11’s general-purpose clocks and GPIO07/GPIO13’s PWM entries come from the alternate-function column. GPIO12 is kept as GPIO; its SoC pad name containing PWM does not establish a supported header PWM function.
- Table 3-3 spells pins 16/18 as `SPI1_CSI1*` / `SPI1_CSI0*`. The corresponding Figure 3-1 labels are `SPI1_CS1*` / `SPI1_CS0*`, consistent with the same table rows’ SoC CS1_N/CS0_N names. The generator checks the exact discrepancies before using the figure names. The UART1_RTS* module/SoC label is retained despite its alternate-description cell saying UART #2; Linux bus and gpiochip mappings are outside this record.
- Function records describe documented capabilities, not the currently flashed pinmux or driver configuration. The PWM entries do not assert that every JetPack image enables hardware PWM on those pins. Use NVIDIA’s [Jetson-IO configuration guide](https://docs.nvidia.com/jetson/archives/r36.4.3/DeveloperGuide/HR/ConfiguringTheJetsonExpansionHeaders.html) and the appropriate pinmux for the target software release.
- Electrical notes cite Table 3-3: 3.3 V signals; direct open-drain I²C on 3/5 and 27/28, with 2.2 kΩ / 1.5 kΩ pull-ups and ±2 mA listed drive; other signal pins use TXB0108 translators with ±20 µA listed weak drive and external pulls greater than 50 kΩ. These are not Raspberry Pi GPIO electrical characteristics.
- J12 pins 27/28 are I2C0_SDA/SCL and are not given the Raspberry Pi HAT EEPROM reservation. No ADC or unverified numeric mux selectors are added.

The manufacturer PDF is cached for verification and is not distributed in the repository. The complete source set now covers 1,504 physical pin records and 4,769 function assignments.

## STM32F103 packages · LQFP48, LQFP64, LQFP100

ST **DS5319 Rev 20 (July 2025)** Table 5, PDF pp. 28–33, supplies the LQFP48, LQFP64, and LQFP100 pin positions, I/O tolerance and functions. Figures 6–8, PDF pp. 24–26, were inspected for the physical perimeter arrangements. These LQFP packages have no exposed center pad. GPIO-capable OSC_IN/OSC_OUT remain oscillator functions after reset; PD0/PD1 require the software remap described in the datasheet footnote and RM0008 §9.3.1.

**RM0008 Rev 21**, §9.3, Tables 34, 43–46 and 52–56, supplies actual CAN, timer, USART, I²C1 and SPI1 remap conditions. Merged table cells are expanded before assigning allowed values. Package restrictions exclude unavailable full-remap destinations; no larger-package ports or higher-density-only peripherals are injected. JTAG/SWD mapping is supported by Tables 36–37. The F1 architecture has no AF0–AF15 pin selector model; function records carry AFIO field/value conditions and a separate configuration reference. These are capabilities, not a claim that every combination of selected functions is simultaneously usable.

FT status and PC13–PC15 restrictions use the Table 5 footnotes: the backup-domain pins have 3 mA / 2 MHz / 30 pF limits and must not be used as current sources. FT is a conditional digital-mode property, not permission to apply 5 V to analog inputs or to every pin.

## Blue Pill · community board reference

Blue Pill has no single authoritative manufacturer. Its connector positions use the **STM32-base community board page**, the mirrored 2016 reference schematic and an inspected top-view photo. All three artifacts are hash-locked and explicitly marked as community sources; STM32-base is not affiliated with ST. MCU functions and chip pin identities come separately from ST documents.

- The board exposes 44 connections: H1 (20), H2 (20) and SWD (4); 34 are GPIO-capable. Internal storage IDs 1–44 are displayed as H1.n/H2.n/SWD.n, never as invented package pin numbers. Each signal links to its actual MCU package pin.
- With USB at the top, H2 is on the left and H1 on the right, both running from connector position 20 at the USB end to position 1 at the SWD end. The four bottom SWD pins read GND, PA14, PA13, 3V3 from left to right. This orientation was reviewed against the locked reference photograph.
- H1/H2 correspond to schematic P3/P4; SWD corresponds to P2. The schematic labels the reset-button/MCU net RESET but the header net NRST. The connector page and R silkscreen support the reset connection; this discrepancy is documented rather than treating the schematic as an independently consistent netlist.
- PB2/BOOT1 is on a boot jumper, and PD0/PD1 attach to the 8 MHz crystal; they are absent from the side-header export. PC13 drives an active-low LED; PC14/PC15 share the LSE crystal; PA11/PA12 share USB; PA13/PA14 appear on SWD.
- The community reference warns that USB VBUS and the 5 V rail are not isolated, so simultaneous USB and external 5 V power is not supported by this map. Clone regulators, USB pull-ups, MCUs and wiring can differ and require board inspection. The map makes no compatibility claim for GD32/CS32 clones.

The complete locked source set contains 16 documents: 13 manufacturer documents and 3 community Blue Pill references.

ST source downloads prefer the official `www.st.com.cn` mirror and fall back to `www.st.com`. Both downloads were checked byte-for-byte against the same locked SHA-256 values. Transfer retries are bounded; no source-hash or pin-data check is skipped when a CDN is unavailable.

## Arduino AVR boards

- **UNO R3:** A000066 full pinout (6 October 2022), pages 1/3/4; the board datasheet connector tables on page 10. The two main header groups contribute 32 contacts; main-MCU ICSP contributes 6. There are 20 distinct GPIO nets. JDIGITAL's A4/SD4 and A5/SD5 typos resolve to SDA/A4 and SCL/A5 using the full pinout and AVR core.
- **Classic Nano:** A000005 full pinout (30 June 2021), pages 1–3. Main-header order and ICSP orientation were visually reviewed; the top-view ICSP rows are 2/4/6 and 1/3/5. There are 30 side contacts, 6 ICSP contacts, 20 independent GPIOs and 8 ADC inputs. The current Nano datasheet has connector numbering errors and misleading A6/A7 GPIO labels, so it is not used as the physical pin source. The official `eightanaloginputs` variant inherits a 20-entry digital port map from `standard`; A6/A7 are ADC-only and have no digital port, pull-up or PWM.
- **Mega 2560 Rev3:** A000067 full pinout (16 December 2020), pages 1–4; datasheet connector tables on pages 10/11/12/13. Its 86 outer contacts and 6 main-MCU ICSP contacts expose 70 independent GPIOs. With USB at top, the end header's even-GPIO row is nearer USB; its power contacts are at the right and ground contacts at the left. The separately rotated source detail is recorded in `manual-observations.json`. D0/D1 are not Arduino PWM outputs despite the tilde marks in the full pinout. The core confirms 15 PWM outputs on D2–D13 and D44–D46, and SPI on D50–D53.

The official `arduino/ArduinoCore-avr` revision `11b9130371e8447920edb65a75706a6c951e51fc` is locked by commit and per-file hash. The generator parses digital port/bit arrays, timer arrays, analog aliases and SPI/Wire pin constants from `standard` and `mega`, with Nano's `eightanaloginputs` override. UART and hardware INT names are read from the full pinout text and checked against the port map. PWM reflects Arduino's timer mapping, not every possible raw timer output. No invented mux selectors are added. GPIO counts shown in the interface count unique nets; physical-contact match counts still include duplicates.

Only main-MCU ICSP and the main signal/power headers are shown. USB sockets, barrel sockets, USB-bridge ICSP/JP5, test points, jumpers, and bare-processor package maps are outside these board profiles. The drawings are original schematic illustrations, not mechanical layouts. Sources remain linked at each pin. Shared-net assignments are rejected by both the plan action and JSON/share import validation.

`PWR`, `ANALOG`, `DIGITAL`, `L`, `R`, and `END` are Pin Atlas connector-position labels. They do not claim to be manufacturer connector designators or Arduino sketch pin numbers. The numeric ID used in plan files is an internal contact key; details show the Arduino digital number and MCU port separately.

## Expanded Arduino references

- Leonardo (A000057, 25 November 2025) and Micro (A000053, 10 November 2020) full pinouts supply header placement, physical signal names and hardware interrupts. The pinned AVR core `leonardo` port/bit/timer/channel arrays are parsed again; `micro` explicitly inherits that map. Their ADC channels are not Arduino analog alias numbers: A0 is ADC7, A4 is ADC1, and the six extra analog aliases share digital-header ports. Leonardo's I²C uses D2/D3, and SPI uses its ICSP D14–D16. Micro additionally exposes D17/SS and the other SPI pins on its distinct 34-contact side footprint. Both use native USB independently of D0/D1 Serial1.
- Nano Every (ABX00028, 15 December 2021) uses ArduinoCore-megaavr `e8edb4ef2e8ab5c98544c3884a653f0b9c1318dc`, `nona4809/pins_arduino.h`. The generator reads its port/bit, analog channel and PWM declarations. A6/A7 are PD4/PD5 with ADC4/ADC5 and digital capability; A4/A5 connect PF2/PA2 and PF3/PA3, so GPIO/ADC and TWI drivers must be coordinated. Only the 30 side contacts are included; underside SAMD11/UPDI debug pads are excluded. Its five Arduino PWM pins differ from classic Nano.
- UNO R4 Minima (ABX00080, 27 November 2023) and WiFi (ABX00087, 23 April 2025) use ArduinoCore-renesas `424e86eff92d37f72123c2b641dd8bbf06a38b47`. Header constants, `g_pin_cfg` RA4M1 port maps and the six initialized PWM channels are parsed from each model's own files. The physical pinout supplies the ADC ANxxx channels and DAC. CAN TX/RX constants are read independently: Minima D4/D5, WiFi D10/D13. Both replace the UNO R3 NC contact with BOOT. Their 32 main contacts and six SPI contacts are included; SWD, coprocessor/Qwiic, LED-matrix and extra power connections are excluded. Main RA4M1 I/O is 5 V; the WiFi board's excluded ESP32-S3/Qwiic connectors use 3.3 V.

UNO and Nano grouping validates the common connector-position geometry, not identical signal names or types. Reference changes update pin capabilities, source links, electrical notes and optional contacts. Plans remain per profile; legacy `arduino-uno-r3` and `arduino-nano-classic` URLs/imports remain supported.

## Espressif reference boards

The guide tables and front/pin-layout images are locked to `espressif/esp-dev-kits` commit `5c06bf1835329d6525f316475f7218aab6acfe79`. A small RST parser reads numbered J1/J2/J3 rows directly; the complete original guides remain the inputs, rather than a handwritten generated pin dataset. Images were visually inspected for left/right and connector order. USB is at the bottom and pin 1 at the antenna end. S3's horizontal front photo is rotated clockwise to that orientation.

- ESP32-DevKitC V4: 38 contacts, J2/J3. WROOM-32E and WROVER share physical pins; GPIO6–11 serve flash and WROVER additionally reserves GPIO16/17 for internal memory. GPIO34/35/36/39 are input-only without internal pull-up/down.
- ESP32-C3-DevKitM-1: 30 contacts, J1/J3, 15 GPIOs, MINI-1/1U reference. GPIO8 shares the RGB LED; GPIO2/8/9 are strapping pins and GPIO18/19 carry USB.
- ESP32-S3-DevKitC-1 v1.1: 44 contacts, J1/J3, 36 GPIOs. The WROOM-1-N8 reference uses Quad flash; N8R8 additionally reserves GPIO35–37 for Octal PSRAM. Other WROOM-2 or memory-voltage variants are not claimed compatible. v1.1 RGB uses GPIO38. GPIO46 supports input and output on S3; the input-only restriction from S2 is not copied here. GPIO0/3/45/46 are strapping pins and GPIO19/20 carry USB.

Native ADC/DAC/touch, UART, JTAG, USB and clock names come from the guide cells. Each chip's datasheet provides boot/strapping and GPIO-matrix routing evidence. Matrix choices are explicit routing capabilities, not default firmware assignments or invented numeric AF selectors. Input-only pads never offer output/PWM/I²C routes. Memory-reserved contacts are disabled and rejected on plan import. Driver/ADC2/Wi-Fi and onboard USB/LED sharing remain qualified; the plan does not configure SDK registers.

## ATmega package views

ATmega328P uses the original Atmel 42735B complete datasheet (November 2016), mirrored by Arduino. Tables 6-1 on PDF pages 19/20 are parsed separately for PDIP-28, TQFP-32, QFN/MLF-28 and QFN/MLF-32. The extracted names are compared with visually recorded Figures 5-1 through 5-4. **PDIP PC0 is pin 23:** Table 6-1 incorrectly prints 13; Figure 5-1 and the full physical sequence resolve the error. ADC6/ADC7 exist only in 32-pin packages and remain analog-only. QFN center pads connect to GND outside the perimeter count. PC6 GPIO requires the RSTDISBL fuse; PB6/PB7 depend on clock/oscillator configuration. The raw MCU function names retain their datasheet signals, independent of Arduino aliases.

ATmega2560 uses Microchip DS40002211A, Figure 1-1 (PDF page 2), all 100 TQFP pins and 86 GPIOs. Port A–L alternate-function tables on PDF pages 75–94 are reread. The 64-pin ATmega1281/2561 PDI/PDO footnote is applied, so those functions are not copied onto PE0/PE1. Port E's `CLK0` label is resolved to `CLKO` using the figure and divided-clock description. PF4–PF7 carry JTAG/ADC qualifications; PG3/PG4 depend on asynchronous oscillator use. Mega board D0–D69 and CBGA ball positions are separate numbering systems and are not used as TQFP pin numbers.

The application renders DIP with a pin-1/notch marker, TQFP without an exposed-pad claim, and QFN with its documented center GND. Dense TQFP100 labels use wider spacing and horizontal scrolling. Package variants have distinct physical footprints; only verified common board headers are grouped.
