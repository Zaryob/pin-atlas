# Pin data verification

[English](VERIFICATION.md) · [Türkçe](VERIFICATION.tr.md)

Catalog snapshot from the generated data: **99 board, header, and chip profiles, 6,546 physical pin records, and 30,045 function assignments**, taken from **169 hash-locked source records** in [`sources/manifest.json`](../sources/manifest.json). The catalog-wide `verifiedOn` date stays **5 November 2026** on purpose: on 14–15 November 2026 only the profiles changed on those days were checked again, not the whole catalog. Profiles whose pin data or board cautions were corrected after that date, and profiles added later, carry their own date from `verifiedOnByProfile` in the manifest: the day of their last data change (14, 15, 16 or 19 November 2026). Add or update an entry there whenever a profile is verified or corrected. Totals are recorded in [`public/data/verification.json`](../public/data/verification.json); these counts do not certify that every pin was independently reviewed. Shared physical pins are counted once per profile. The count excludes the app’s generic `GPIO` planning option and unnumbered QFN center GND pads. Each placement of a signal on a different pin counts separately.

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

The common profile uses only the physical pin table in the pinned Raspberry Pi GPIO documentation. That document explicitly describes the standard layout for B+ and later and all Zero models, and the rotated orientation on keyboard computers. Some Zero headers are unpopulated. The profile excludes older 26-pin boards and Compute Modules. It deliberately carries no alternate function records or board schematic evidence: choose the Pi 3 Model B+, Pi 4, Pi 5, Zero W, Zero 2 W or Pi 500 profile for those functions. HAT EEPROM pins 27/28 remain reserved.

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

### Raspberry Pi Zero W, Zero 2 W and 3 Model B+ / J8

- The 40 physical pins use the same GPIO documentation table as the common header. On each board, the 28 GPIO net labels (including ID_SD/ID_SC) were matched to J8 contacts by coordinates in that board's own reduced schematic: [Zero W, RP-008368-DS-1](https://pip-assets.raspberrypi.com/categories/592-raspberry-pi-zero-w/documents/RP-008368-DS-1-raspberry-pi-zero-w-reduced-schematics.pdf#page=1), [Zero 2 W, RP-008360-DS-1](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008360-DS-1-raspberry-pi-zero-2-w-reduced-schematics.pdf#page=1) and [3 Model B+, RP-008339-DS-1](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008339-DS-1-raspberry-pi-3-b-plus-reduced-schematics.pdf#page=1). Power and ground were checked visually. On both Zero schematics J8 is marked DNF (not fitted).
- Alternate functions come from GPIO0–27, ALT0–ALT5, in [BCM2835 ARM Peripherals, §6.2, PDF page 102](https://pip-assets.raspberrypi.com/categories/579-raspberry-pi-zero/documents/RP-008249-DS-1-bcm2835-peripherals.pdf#page=102); blank and `<reserved>` cells are skipped (83 assignments per board). The [GPIO documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/raspberry-pi/gpio-on-raspberry-pi.adoc) names this table for earlier families and Zero models.
- Zero W uses BCM2835 ([processor documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2835.adoc), which also warns that the peripheral document contains known errors). For 3 Model B+ (BCM2837B0) and Zero 2 W (RP3A0 with a BCM2710A1 die) the same table is used because Raspberry Pi's processor documentation states that BCM2710A1 is the BCM2837 die, that BCM2837B0 shares the BCM2837 architecture, and that BCM2837 and BCM2836 are BCM2835 with different Arm cores ([rp3a0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/rp3a0.adoc), [bcm2837b0](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2837b0.adoc), [bcm2837](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2837.adoc), [bcm2836](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/processors/bcm2836.adoc)). The functions carry a separate evidence record that states this reliance.
- BCM2711-only selectors are not copied: these boards have no UART2–5, SPI3–6, I2C3–6 or ALT2 DPI entries (the BCM2835 table prints ALT2 as reserved for GPIO0–27). PWM keeps the BCM2835 names `PWM0`/`PWM1`, and ALT5 on GPIO14/15 is the mini UART (`TXD1`/`RXD1`).
- Cautions: the unpopulated Zero header ([Zero models documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/zero/zero-intro.adoc), [Zero 2 W product brief](https://pip-assets.raspberrypi.com/categories/584-raspberry-pi-zero-2-w/documents/RP-008359-DS-1-raspberry-pi-zero-2-w-product-brief.pdf#page=2) and the DNF marking); the BCM2835/BCM2836/BCM2837/RP3A0 voltage table in the GPIO documentation (V_IL ≤ 0.9 V, V_IH ≥ 1.6 V, 8 mA default / 16 mA maximum drive, 50–65 kΩ pulls); and 5 V DC input via the GPIO header on 3 Model B+ ([product brief, Specification](https://pip-assets.raspberrypi.com/categories/532-raspberry-pi-3-model-b/documents/RP-008338-DS-2-raspberry-pi-3-b-plus-product-brief.pdf#page=3)).

### Raspberry Pi 500 / rear 40-pin header

- The [keyboard computers documentation](https://github.com/raspberrypi/documentation/blob/0fb416315f8f6c1949c0614989075d3e5805104b/documentation/asciidoc/computers/keyboard-computers/intro.adoc) lists a horizontal 40-pin GPIO header and BCM2712 with the RP1 I/O controller; the [Pi 500 product brief, RP-008349-DS-4](https://pip-assets.raspberrypi.com/categories/1115-raspberry-pi-500/documents/RP-008349-DS-4-raspberry-pi-500-product-brief.pdf#page=2) states that Pi 500 has the same processor and RP1 I/O controller as Pi 5. The profile therefore reuses the Pi 5 RP1 functions (RP1 Peripherals, Table 4) on the standard 40-pin numbering.
- No Pi 500 schematic is published, so there is no net-label cross-check. The GPIO documentation states that the keyboard-computer header is on the rear and rotated 180° with pins 1 and 40 labelled; the profile records that as a caution and does not draw a rear-panel view. The RP1 voltage table, which names Pi 500, is attached as a caution.

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

1. The [source manifest](../sources/manifest.json) records each source revision, document URL or commit, and SHA-256 hash. It includes the three identified Blue Pill community references.
2. `scripts/verify-official-sources.py` downloads and checks those sources, rebuilds every profile and compares the result with the checked-in data. Where a generator parses a document, it rereads the PDF tables or commit-pinned manufacturer Markdown connector tables and normalizes whitespace where cells wrap across lines.
3. The physical pin number, name, type, alternate function, manufacturer signal, and F/ALT selector must match the published record.
4. Figure-only observations are marked separately. Reusing them during an automated run preserves the prior visual review; it is not a new review. A changed hash requires a fresh source review.
5. [`sources/pin-verification.csv`](../sources/pin-verification.csv) lists each pin and function record. [`public/data/evidence.json`](../public/data/evidence.json) resolves reference IDs to documents, pages, and tables. [`public/data/verification.json`](../public/data/verification.json) holds the verification totals and source summary.
6. GitHub Actions runs the comparison before deployment in the table-snapshot mode described next.

### The two verification modes

- **`--table-snapshots` (what CI runs).** No ST PDF is opened. The eight ST documents are checked only as the recorded table cells in `sources/extracted/*.json`. The manifest locks the hash of each snapshot file, and each snapshot records the hash of the PDF it came from, but this mode does not compare the snapshot with that PDF. All other sources are still downloaded or read from the cache and checked by hash, and every generated pin and function is compared.
- **Default mode (no flag).** The original PDFs are reread, including the eight ST PDFs. `python3 scripts/record-st-tables.py` separately checks that every snapshot still matches its PDF. This mode works locally again: on 14 November 2026 all eight ST PDFs downloaded from their recorded URLs and matched their locked hashes, because the downloader now sends the request `www.st.com` accepts (HTTP/2, compressed, with a Safari-style user agent, falling back to HTTP/1.1). Whether hosted CI runners can reach `www.st.com` this way has not been tested.
- **Mirrors.** Only DS5319 and RM0008 list the `www.st.com.cn` mirror in the manifest, ahead of `www.st.com`. All other ST documents, including UM1724 and UM2505, are downloaded only from `www.st.com`. Both URLs of a document must produce the same locked SHA-256.
- **Sources the live URL no longer serves.** The ESP32-C3 data sheet is locked at v2.4 while its URL now serves v2.5, and the ESP32-C6 data sheet is locked at v1.5 while its URL serves v1.6. A cold download of either file therefore fails with a hash mismatch until the new revision is reviewed. The weekly cold-download audit shows such a mismatch; the lock is never updated automatically.

### What a hash lock proves

A SHA-256 lock proves that the cited document is the one that was reviewed and that it has not changed. It does not prove that a hand-recorded table matches that document. In [`public/data/verification.json`](../public/data/verification.json), `physicalSourceMethods` shows how each profile's physical pins were obtained:

- **Parsed from the document:** PDF tables, manufacturer XML, KiCad files, Markdown/RST tables or source code read from the locked copy. This covers most STM32, Raspberry Pi, Espressif, Arduino core, Jetson, BeagleBone Black and micro:bit data.
- **Hand-recorded tables:** the Adafruit Feather RP2040 and Teensy 4.1 generators contain tables typed in from the cited pinout and do not open the locked document. Teensy PWM, ADC and port data were cross-checked against the Teensy core source.
- **Visual readings.** Some contact positions and labels were transcribed from a drawing or photo. Earlier observations are in `sources/manual-observations.json`. The recently added profiles record these readings alongside their source extractors. In [the generated verification report](../public/data/verification.json), 64 of 99 profiles list visual evidence, and 608 of 6,546 pin records (9.3%) cite only visual evidence for their physical contacts.

### Sourced warnings

Pins can carry `warnings` (extra warning keys) and `noteEvidence` (the reference IDs behind each note or warning); boards can carry `cautions`, each with its own evidence. `scripts/warning_sources.py` attaches them and asserts every number quoted in a warning against the locked document. `scripts/validate-data.py` checks that every warning and caution names an existing reference and that every referenced translation key exists in both English and Turkish. The interface shows the source link next to each warning.

### Pinned URLs

GitHub sources are pinned to full commits, including the NUCLEO-G474RE package and GPIO-mode XML (`STM32_open_pin_data` `7d1f1514…`), the Feather RP2040 pinout (`be3f4b32…`), the micro:bit V2 schematic (`17aae030…`) and the 15 Arduino PDFs and 5 Markdown data sheets from `arduino/docs-content` (`cb938e96…`). Of the Arduino-published sources, only the ATmega328P data sheet still comes from a `docs.arduino.cc` URL, which can be replaced in place; its hash lock detects such a change. Manufacturer PDFs on `st.com`, `espressif.com`, `raspberrypi.com` and similar sites are not commit-pinned; their hash locks detect a change.

The app uses its own SVG schematics. Manufacturer documents are linked from the evidence records and are not bundled. The one exception is `sources/extracted/*.json`: these files redistribute raw table cells extracted from eight ST documents, including some full sentences from ST's tables (see [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)). Software and font licensing notices are maintained separately.

## Shared layout catalog

The catalog groups source profiles by physical layout. UNO-format boards share 32 main-header positions, Nano references share 30 side positions, and the two Espressif module pairs retain one entry each. Optional connectors and electrical/MCU capabilities belong to the selected reference. Grouping checks connector labels and positions while allowing documented BOOT/NC and analog-only/GPIO differences. Older Pico/Pi groups retain their stricter number/name/type comparison. Legacy model IDs, saved plans and shared links still resolve to the original reference.

## NVIDIA Jetson Orin Nano · J12

The source is NVIDIA’s SHA-256-locked **Jetson Orin Nano Developer Kit Carrier Board Specification, SP-11324-001_v1.3 (December 2024)**. This map covers J12 on the NVIDIA P3768 carrier board, not the module’s 260-pin connector or third-party carriers.

- All 40 positions are extracted from Figure 3-1 (printed p. 21 / PDF p. 25) and independently matched to Table 3-3 (printed pp. 22–23 / PDF pp. 26–27). Supply pins and all eight grounds are checked against their table descriptions. All 28 signal pins can be configured for GPIO according to §3.3.
- Peripheral signals use the carrier/module names in those sources. GPIO09’s audio primary clock, GPIO01/GPIO11’s general-purpose clocks and GPIO07/GPIO13’s PWM entries come from the alternate-function column. GPIO12 is kept as GPIO; its SoC pad name containing PWM does not establish a supported header PWM function.
- Table 3-3 spells pins 16/18 as `SPI1_CSI1*` / `SPI1_CSI0*`. The corresponding Figure 3-1 labels are `SPI1_CS1*` / `SPI1_CS0*`, consistent with the same table rows’ SoC CS1_N/CS0_N names. The generator checks the exact discrepancies before using the figure names. The UART1_RTS* module/SoC label is retained despite its alternate-description cell saying UART #2; Linux bus and gpiochip mappings are outside this record.
- Function records describe documented capabilities, not the currently flashed pinmux or driver configuration. The PWM entries do not assert that every JetPack image enables hardware PWM on those pins. Use NVIDIA’s [Jetson-IO configuration guide](https://docs.nvidia.com/jetson/archives/r36.4.3/DeveloperGuide/HR/ConfiguringTheJetsonExpansionHeaders.html) and the appropriate pinmux for the target software release.
- Electrical notes cite Table 3-3: 3.3 V signals; direct open-drain I²C on 3/5 and 27/28, with 2.2 kΩ / 1.5 kΩ pull-ups and ±2 mA listed drive; other signal pins use TXB0108 translators with ±20 µA listed weak drive and external pulls greater than 50 kΩ. These are not Raspberry Pi GPIO electrical characteristics.
- J12 pins 27/28 are I2C0_SDA/SCL and are not given the Raspberry Pi HAT EEPROM reservation. No ADC or unverified numeric mux selectors are added.

The manufacturer PDF is cached for verification and is not distributed in the repository.

## STM32F103 packages · LQFP48, LQFP64, LQFP100

ST **DS5319 Rev 20 (July 2025)** Table 5, PDF pp. 28–33, supplies the LQFP48, LQFP64, and LQFP100 pin positions, I/O tolerance and functions. Figures 6–8, PDF pp. 24–26, were inspected for the physical perimeter arrangements. These LQFP packages have no exposed center pad. LQFP48 and LQFP64 use `PD01_REMAP` to expose PD0 and PD1 on OSC_IN and OSC_OUT, as described in Table 5 footnote 7 and RM0008. LQFP100 has dedicated oscillator pins at 12 and 13, with PD0 and PD1 at 81 and 82.

**RM0008 Rev 21**, §9.3, Tables 34, 43–46 and 52–56, supplies CAN, timer, USART, I²C1 and SPI1 remap conditions. The extractor expands merged cells and matches each remap destination to a pin in the selected package. For example, Table 46 maps TIM1 to PE7–PE15 with `TIM1_REMAP=11` on LQFP100. Tables 36–37 cover JTAG/SWD mapping. Function records carry the AFIO field, allowed values and a configuration reference. Each remap value applies to the peripheral as a whole.

FT status and PC13–PC15 restrictions use the Table 5 footnotes: the backup-domain pins have 3 mA / 2 MHz / 30 pF limits and must not be used as current sources. FT is a conditional digital-mode property, not permission to apply 5 V to analog inputs or to every pin.

## Blue Pill · community board reference

Blue Pill has no single authoritative manufacturer. Its connector positions use the **STM32-base community board page**, the mirrored 2016 reference schematic and an inspected top-view photo. All three artifacts are hash-locked and explicitly marked as community sources; STM32-base is not affiliated with ST. MCU functions and chip pin identities come separately from ST documents.

- The board exposes 44 connections: H1 (20), H2 (20) and SWD (4); 34 are GPIO-capable. Internal storage IDs 1–44 are displayed as H1.n/H2.n/SWD.n, never as invented package pin numbers. Each signal links to its actual MCU package pin.
- With USB at the top, H2 is on the left and H1 on the right, both running from connector position 20 at the USB end to position 1 at the SWD end. The four bottom SWD pins read GND, PA14, PA13, 3V3 from left to right. This orientation was reviewed against the locked reference photograph.
- H1/H2 correspond to schematic P3/P4; SWD corresponds to P2. The schematic labels the reset-button/MCU net RESET but the header net NRST. The connector page and R silkscreen support the reset connection; this discrepancy is documented rather than treating the schematic as an independently consistent netlist.
- PB2/BOOT1 is on a boot jumper, and PD0/PD1 attach to the 8 MHz crystal; they are absent from the side-header export. PC13 drives an active-low LED; PC14/PC15 share the LSE crystal; PA11/PA12 share USB; PA13/PA14 appear on SWD.
- The community reference warns that USB VBUS and the 5 V rail are not isolated, so simultaneous USB and external 5 V power is not supported by this map. Clone regulators, USB pull-ups, MCUs and wiring can differ and require board inspection. The map makes no compatibility claim for GD32/CS32 clones.

The DS5319 and RM0008 downloads try the official `www.st.com.cn` mirror first and fall back to `www.st.com`; both URLs must match the same locked SHA-256 values. Transfer retries are bounded; no source-hash or pin-data check is skipped when a CDN is unavailable.

## NUCLEO-F103RB / F401RE / F411RE · MB1136

The connector map uses the hash-locked ST **UM1724 Rev 17 (September 2025)**, downloaded from its official `www.st.com` URL. (Until November 2026 the lock was Rev 14, downloaded from a third-party mirror.) NUCLEO-F103RB uses Table 12 (p. 40) and Table 27 (pp. 56–57). MCU pin numbers and functions come from the STM32F103RB LQFP64 profile. The map shows the analog A4/A5 routing and labels the alternate I²C route and configurable clock, serial and LED connections using Table 10 (pp. 27–28). The board drawing follows the connector positions and row numbering in Figure 13 (p. 31) for F103RB and Figures 17/18 (p. 33) for F401RE/F411RE. Selecting a contact on NUCLEO-F103RB highlights the corresponding pad in the separate STM32F103RBT6 LQFP-64 drawing. F401RE and F411RE connector assignments use Table 16 (pp. 44–45) and Table 29 (p. 59), with package pin numbers and AF selectors from the locked STM32CubeMX pin data. Page numbers are PDF pages.

## NUCLEO-G474RE · MB1367

NUCLEO-G474RE uses ST **UM2505 Rev 7 (May 2026)**: Table 15 (pp. 30–31) for the Arduino connectors, Table 16 (pp. 32–33) for the ST Morpho connectors, and Table 12 (pp. 25–27) for the MB1367 solder bridges. Figure 18 (p. 30) is the visual reference for connector positions and rows. D0/D1 and CN10.35/37 follow the UM2505 default, USART1 on PC5/PC4; LPUART1 on PA2/PA3 serves the ST-LINK virtual COM port. The MB1136 solder-bridge notes do not apply to this board. Package pads and AF selectors come from `STM32_open_pin_data` at commit `7d1f1514…`. UM2505 is recorded in `sources/extracted/nucleo-g4-um2505.json` by `scripts/record-st-tables.py`, so it is one of the eight ST documents checked as table cells in CI.

## Board-to-package mapping

Each link joins an identified board schematic or pinout to its MCU package. Arduino A000066 uses ATmega328P PDIP-28, Nano A000005 uses ATmega328P QFN/MLF-32, and Mega A000067 uses ATmega2560 TQFP-100. GPIO and RUN contacts on Pico and Pico W use RP2040 Figure 3, while Pico 2 and Pico 2 W use the RP2350A map. Blue Pill uses its existing STM32F103C8T6 package pin numbers. Nucleo F401RE and F411RE use their model-specific CubeMX LQFP-64 packages. Shared power rails and grounds without a unique package pad keep their board labels.

## Arduino AVR boards

- **UNO R3:** A000066 full pinout (6 October 2022), pages 1/3/4; the JANALOG/JDIGITAL connector tables in the commit-pinned datasheet Markdown. The two main header groups contribute 32 contacts; main-MCU ICSP contributes 6. There are 20 distinct GPIO nets. JDIGITAL's A4/SD4 and A5/SD5 typos resolve to SDA/A4 and SCL/A5 using the full pinout and AVR core.
- **Classic Nano:** A000005 full pinout (30 June 2021), pages 1–3. Main-header order and ICSP orientation were visually reviewed; the top-view ICSP rows are 2/4/6 and 1/3/5. There are 30 side contacts, 6 ICSP contacts, 20 independent GPIOs and 8 ADC inputs. The current Nano datasheet has connector numbering errors and misleading A6/A7 GPIO labels, so it is not used as the physical pin source. The official `eightanaloginputs` variant inherits a 20-entry digital port map from `standard`; A6/A7 are ADC-only and have no digital port, pull-up or PWM.
- **Mega 2560 Rev3:** A000067 full pinout (16 December 2020), pages 1–4; the connector tables in the commit-pinned datasheet Markdown. Its 86 outer contacts and 6 main-MCU ICSP contacts expose 70 independent GPIOs. With USB at top, the end header's even-GPIO row is nearer USB; its power contacts are at the right and ground contacts at the left. The separately rotated source detail is recorded in `manual-observations.json`. D0/D1 are not Arduino PWM outputs despite the tilde marks in the full pinout. The core confirms 15 PWM outputs on D2–D13 and D44–D46, and SPI on D50–D53.

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

ATmega328P uses the original Atmel 42735B complete datasheet (November 2016), mirrored by Arduino at a `docs.arduino.cc` URL and locked by hash. Tables 6-1 on PDF pages 19/20 are parsed separately for PDIP-28, TQFP-32, QFN/MLF-28 and QFN/MLF-32. The extracted names are compared with visually recorded Figures 5-1 through 5-4. **PDIP PC0 is pin 23:** Table 6-1 incorrectly prints 13; Figure 5-1 and the full physical sequence resolve the error. ADC6/ADC7 exist only in 32-pin packages and remain analog-only. QFN center pads connect to GND outside the perimeter count. PC6 GPIO requires the RSTDISBL fuse; PB6/PB7 depend on clock/oscillator configuration. The raw MCU function names retain their datasheet signals, independent of Arduino aliases.

ATmega2560 uses Microchip DS40002211A, Figure 1-1 (PDF page 2), all 100 TQFP pins and 86 GPIOs. Port A–L alternate-function tables on PDF pages 75–94 are reread. The 64-pin ATmega1281/2561 PDI/PDO footnote is applied, so those functions are not copied onto PE0/PE1. Port E's `CLK0` label is resolved to `CLKO` using the figure and divided-clock description. PF4–PF7 carry JTAG/ADC qualifications; PG3/PG4 depend on asynchronous oscillator use. Mega board D0–D69 and CBGA ball positions are separate numbering systems and are not used as TQFP pin numbers.

The application renders DIP with a pin-1/notch marker, TQFP without an exposed-pad claim, and QFN with its documented center GND. Dense TQFP100 labels use wider spacing and horizontal scrolling. Package variants have distinct physical footprints; only verified common board headers are grouped.

## Seeed Studio XIAO headers

The Seeed Studio XIAO layout groups compact 14-pin development boards sharing the standard 14-contact castellated footprint (seven left pins, seven right pins).

- **Seeed Studio XIAO RP2040:** Read visually from the official Seeed Studio schematic v1.3 (June 2022); this profile has no parsed physical source. Left pins 1–7 map to D0–D6 (RP2040 GPIO26–29 with 4 ADC channels, GPIO6, GPIO7, GPIO0). Right pins map to 5V, GND, 3V3, and D10–D7 (RP2040 GPIO3, GPIO4, GPIO2, GPIO1). Pin mapping bridges directly to the RP2040 QFN-56 package view.
- **Seeed Studio XIAO ESP32C3:** Verified against official Seeed Studio schematic v1.3 (January 2026) and official pinout sheet. Left pins 1–7 map to D0–D6 (ESP32-C3 GPIO2–7 and GPIO21). Right pins map to 5V, GND, 3V3, and D10–D7 (ESP32-C3 GPIO10, GPIO9, GPIO8, GPIO20). Strapping pins (GPIO2, GPIO8, GPIO9), ADC1/ADC2 caution notes, and GPIO matrix routable peripherals are verified from Espressif documentation. The board has no USB-UART bridge: USB goes directly to the chip's native USB pins (GPIO18/19), and D6/D7 are UART0 (U0TXD/U0RXD) without a bridge on the same line. D9 (GPIO9) is wired to the BOOT button. D3 (GPIO5) carries the ESP32-C3 data sheet's ADC2 caveat, which the ESP32-C3-DevKitM-1 GPIO5 contact also shows.
- **Seeed Studio XIAO SAMD21:** Seeed Studio schematic v1.0 (November 2019) with Microchip SAM D21/DA1 data sheet DS40001882L. D0–D10 map to ATSAMD21G18A PA02, PA04, PA10, PA11, PA08, PA09, PB08, PB09, PA07, PA05 and PA06. Timer outputs use the data sheet names `TCC0/WO[n]`, `TCC1/WO[n]` and `TC4/WO[n]`; the SAMD21G has no TC0/TC1. D4 (PA08) offers NMI only, not an EXTINT line, and D5 (PA09) and D7 (PB09) share EXTINT[9].

## Extended Nucleo-64 references

The shared Nucleo-64 catalog groups connector positions only. Each model retains its own package profile, GPIO selectors, power connections and saved plans. New STM32 packages use the official STMicroelectronics `STM32_open_pin_data` package XML and the GPIO Modes XML referenced by that package, both pinned to a full commit and SHA-256. The parser checks the GPIO dependency filename even when cached.

- **NUCLEO-F446RE / STM32F446RET6:** UM1724 Rev 17 Table 19 (pp. 48–49) and Table 29 (p. 59); LQFP-64, 50 GPIO-capable pads, Cortex-M4, up to 180 MHz. Raw STM32 AF selectors come from the F446 GPIO Modes source.

UM1724 raw table cells are hash-locked in `sources/extracted/nucleo-um1724-r17.json`. CI applies the same parser to those cells and does not open the manual PDF. The default mode and `scripts/record-st-tables.py` compare against the original PDF.

- **NUCLEO-F303RE / STM32F303RET6:** UM1724 Rev 17 Table 14 (pp. 42–43) and Table 26 (p. 56); Cortex-M4, 72 MHz, LQFP-64 with 51 GPIO-capable pads. Table 14 omits the D0 row: CN9.1 uses the common MB1136 position, and D0 → PA3 is corroborated by the pinned official STM32duino F303RE variant. The supplementary source is attached to that contact.

- **NUCLEO-L476RG / STM32L476RGT6:** UM1724 Rev 17 Tables 23 (pp. 53–54) / 32 (p. 62); Cortex-M4, 80 MHz, LQFP-64 and 51 GPIO-capable pads. Package pins and AF selectors are independently extracted from the pinned manufacturer XML.

- **NUCLEO-F072RB / STM32F072RBT6:** UM1724 Rev 17 Tables 11 (pp. 38–39) / 26 (p. 56); Cortex-M0, 48 MHz, LQFP-64 and 51 GPIO-capable pads. Package pins and AF selectors are independently extracted from the pinned manufacturer XML.

- **NUCLEO-L053R8 / STM32L053R8T6:** UM1724 Rev 17 Tables 17 (p. 46) / 30 (p. 60); Cortex-M0+, 32 MHz, LQFP-64 and 51 GPIO-capable pads. Package pins and AF selectors are independently extracted from the pinned manufacturer XML.

- **NUCLEO-L152RE / STM32L152RET6:** UM1724 Rev 17 Tables 21 (pp. 51–52) / 30 (p. 60); Cortex-M3, 32 MHz, LQFP-64 and 51 GPIO-capable pads. Package pins and AF selectors are independently extracted from the pinned manufacturer XML.

- **STM32F407VGT6:** a separate LQFP-100 package view, 82 GPIO-capable pads and Cortex-M4 up to 168 MHz. The package XML references ST's shared `STM32F417_gpio_v1_0` GPIO table; the parser limits it to signals actually present in this chip/package XML. No Nucleo header numbering is assigned to this standalone MCU view.

- **STM32F405RGT6:** a separate LQFP-64 package view, 51 GPIO-capable pads and Cortex-M4 up to 168 MHz. The package XML references ST's shared `STM32F417_gpio_v1_0` GPIO table; the parser limits it to signals actually present in this chip/package XML. No Nucleo header numbering is assigned to this standalone MCU view.

## Nucleo-32 / MB1180

NUCLEO-F042K6 uses UM1956 Rev 6 Table 10 (page 24), Figure 3 (page 12), and Tables 7/8 (pages 21/22). CN3 and CN4 retain all 30 physical positions and their own printed labels. STM32F042K6T6 has 32 LQFP perimeter pads and 26 GPIO-capable pads. MCU alternate functions come from its pinned package and declared GPIO Modes XML.

A4/A5 describe their primary PA5/PA6 pads. SB18/SB16 can link them to PB7/PB6 (D4/D5); the primary pads must then remain floating inputs and D4/D5 are unavailable as independent GPIOs. The map does not invent I²C selectors on PA5/PA6. Pin notes also identify PA2/A7 VCP sharing, the D13 LED, oscillator and AREF connections. The raw UM1956 table snapshot is checked against the original PDF and lets CI regenerate without downloading that PDF.

NUCLEO-L432KC uses UM1956 Rev 6 Table 16 (page 30) and shares the verified CN3/CN4 positions with F042K6. Its MCU is STM32L432KCU6, UFQFPN-32, 26 GPIO-capable pads, Cortex-M4 at up to 80 MHz; D7/D8 use PC14/PC15 rather than F042's PF0/PF1. Only perimeter pads enumerated in ST's XML are rendered; the center thermal pad is outside that source's numbered scope.

## Nucleo-144 / MB1137

NUCLEO-F767ZI uses UM1974 Rev 11 Table 19 (pages 61–65), Table 21 (pages 70/71) and the mechanical drawing on page 15. All six headers are represented independently: CN7 (20), CN8 (16), CN9 (30), CN10 (34), CN11 (70) and CN12 (70), totaling 240 physical contacts. These are separate from STM32F767ZIT6's 144 LQFP pads and 114 GPIOs. The MCU clock is up to 216 MHz. Functions and AF selectors use the pinned package's exact GPIO dependency; onboard peripheral notes use ST's pinned board configuration. Repeated power rails do not imply a unique MCU pad.

## Nucleo-144 / MB1364 and legacy H723 plans

NUCLEO-H743ZI2 is the MB1364 board, distinct from the older MB1137 NUCLEO-H743ZI. Its STM32H743ZIT6 package uses 144 LQFP pads, 114 GPIO-capable pads and up to 480 MHz. UM2407 Rev 6 Tables 18–22 (pages 40–44), the mechanical drawing on page 16, and ST's pinned board configuration provide the physical contacts and circuit evidence. The manual's PC2/PC3 labels resolve to PC2_C/PC3_C in the selected package XML. SB14/SB15 control the PC8/PC9 Morpho connections; A4/A5 routing depends on solder bridges. PF11 analog ADC input is excluded per Table 14/SB65, while digital EXTI triggers remain available.

The H723 view is rebuilt from the same numbered physical tables. Its former 131 logical records did not describe all six physical connectors. All 131 existing assignment IDs keep their electrical signal and MCU pad, using the reviewed mapping in `sources/legacy-h723-pin-ids.json`; additional physical contacts get IDs 132–240. The old variant parser is used only to verify legacy assignment identity, not as physical connector evidence. Actual connector labels come from UM2407. Shared layout checks compare named contact positions, so switching models retains the physical contact even when internal assignment IDs differ.

Existing browser plans containing a now-unavailable PF11 analog input or repeated physical net remain visible with a conflict warning. New assignments, JSON imports and share previews reject unsupported choices. Printed/SVG output retains the warning. GPIO/ADC labels and saved pin numbers are not silently discarded.

## WeAct Black Pill v3.x

The F401CC reference uses STM32F401CCU6 (UFQFPN-48, 36 GPIO-capable pads, up to 84 MHz). WeAct's official repository is pinned to commit `6a7f7d434a9d6361f91590d4cdd16b4a70ce7513`. Its KiCad symbol supplies all 44 electrical pad names; the matching footprint supplies every pad coordinate and USB-C orientation. Both raw CAD files are parsed independently and must agree on pad IDs 1–44. PAD numbers in the UI are KiCad pad IDs, not silkscreen connector or MCU package numbering. The two side headers expose 40 contacts; SWD adds four more. The manufacturer's hardware notes state that v3.1 keeps the v3.0 pin definition unchanged; clone boards are not covered.

The pinned v3.1 schematic qualifies PA0's user key (330 Ω), PC13's user LED, PB2/BOOT1, PA11/PA12 USB-C, PA13/PA14 SWD, and optional SPI flash on PA4/PA5/PA6/PA7 (CS/SCK/MISO/MOSI). Package pad numbers and alternate functions use the exact ST XML dependency; the GPIO Modes table is shared with the existing F401 source rather than duplicated.

The F411CE reference uses STM32F411CEU6 (UFQFPN-48, 36 GPIO-capable pads, up to 100 MHz), the same verified 44-contact WeAct layout, and its own pinned package/GPIO selectors. The F401CC and F411CE MCU package views retain the manufacturer's distinct analog supply/reference labels at pads 8/9; board compatibility does not erase those silicon differences.

## Boards added or corrected after v0.8.0

- **Adafruit Feather RP2040:** a hand-recorded table from Adafruit's pinout PDF (`adafruit/Adafruit-Feather-RP2040-PCB` at `be3f4b32…`). The right header runs from the USB end as printed: VBAT, EN, VBUS, D13, D12, D11, D10, D9, D6, D5, SCL, SDA. Pin 3 is the second 3.3 V output; the board has no AREF pin. RP2040 functions come from the RP2040 data sheet.
- **PJRC Teensy 4.1:** a hand-recorded table from PJRC pinout cards 11a/11b (Rev 4) and the Rev D schematic. PWM, ADC and port data were cross-checked against the Teensy core source (`pwm.c`, `analog.c`, `core_pins.h`), which is not a locked document. The microSD pads 42–47 carry DAT1, DAT0, CLK, CMD, DAT3 and DAT2, and a board caution states that the pins are not 5 V tolerant.
- **BeagleBone Black:** P8/P9 from the System Reference Manual chapter 7 (Tables 87–88); signal names, modes and balls from TI's AM335x data sheet SPRS717L. P9.41 is `gpio0[20]` and P9.42 is `gpio0[7]`; the second AM3358 ball on each contact (D13 and B12) is modelled separately rather than merged into one function list. Thirteen signal names were corrected against SPRS717L. Board cautions cover power sequencing (no voltage on any I/O before the board is powered and SYS_RESETn is high) and the 30 GPIO-capable contacts used by eMMC (P8.3–6, P8.20–25) and HDMI (P8.27–46); per-pin warnings and notes cover the eMMC and HDMI contacts, PWR_BUT and the power rails, citing chapters 7 and 8.
- **Arduino Nano 33 BLE Sense Rev2 and Nano ESP32:** full pinouts and schematics from `arduino/docs-content`, with the mbed `variant.cpp` and `espressif/arduino-esp32` `pins_arduino.h`. The Nano 33 BLE VUSB contact is unconnected until solder jumper SJ1 is closed. On the Nano ESP32, B1 is GPIO0 (Arduino pin 15, green LED), and B0, B1 and A2 (GPIO3) are ESP32-S3 strapping pins.
- **ESP32-C6-DevKitC-1 v1.2:** the `esp-dev-kits` guide and pin-layout image at `5c06bf18…`, with the ESP32-C6 data sheet (locked at v1.5; see the two verification modes above).
- **BBC micro:bit V2:** the 25 front strips in physical order, from the micro:bit developer documentation edge-connector page (`dev-docs` at `469ea5f9…`) and the V2 schematic (`17aae030…`). Pin IDs 1–21 keep their earlier meaning; the small 3V and GND strips are new IDs 22–25. P19/P20 are the external I²C bus with on-board 4.7 kΩ pull-ups; on V2 the motion sensor is on a separate internal bus. A board caution gives the edge-connector current budget from the power-supply page.
- **RP2350 erratum E9:** every Bank 0 GPIO of Pico 2, Pico 2 W, RP2350A and RP2350B carries the RP2350-E9 input-leakage warning from the RP2350 data sheet (Appendix D.5.1, pp. 1359–1360). RP2040 profiles do not.
- **Raspberry Pi 40-pin header:** board cautions state that the pins are not 5 V tolerant and give 16 mA per pin and 50 mA in total; GPIO2/GPIO3 carry the fixed 1.8 kΩ pull-ups. Zero W, Zero 2 W and 3 Model B+ add the BCM2835-family voltage table; the Zero boards add the unpopulated-header caution; Pi 500 adds the rotated rear-header and RP1 voltage-table cautions.
- **Evidence locators:** the ATmega2561 PDI/PDO reference now points to the Table 13-17 note on p. 84, and the ESP32 p. 16 reference to the Table 2-1 notes.

## Primary sources and verification standards for roadmap additions

The following official primary documents and verification rules govern additions to the Pin Atlas catalog:

### WCH RISC-V ecosystem (CH32V003, CH32V203, CH32V307)
- **Documents:** `CH32V003DS0.PDF` (Datasheet, WCH), `CH32V003RM.PDF` (Reference Manual, WCH), `CH32V203DS0.PDF`, `CH32V307RM.PDF`, and the official schematics in `open-wch/ch32v003` and `open-wch/ch32v203`.
- **Verification criteria:** Physical package pins across TSSOP-20, QFN-20, SOP-16 and SOP-8; AFIO remapping rules for USART1, I2C1 and TIM1/TIM2 channels; single-wire serial debug interface (SDI) pin identity on PD1; operating voltage bounds (3.3 V and 5.0 V modes).

### Espressif Systems next-generation silicon (ESP32-S2, ESP32-H2, ESP32-P4)
- **Documents:** `esp32-s2_datasheet_en.pdf`, `esp32-s2_technical_reference_manual_en.pdf`, `esp32-h2_datasheet_en.pdf`, `esp32-h2_technical_reference_manual_en.pdf`, `esp32-p4_datasheet_en.pdf`, `esp32-p4_technical_reference_manual_en.pdf`, and ESP-IDF commit-pinned `components/soc/*/include/soc/gpio_pins.h`.
- **Verification criteria:** ESP32-S2 native USB OTG pins (GPIO19 D-, GPIO20 D+), strapping pins (GPIO0, GPIO45, GPIO46); ESP32-H2 IEEE 802.15.4 / BLE 5.3 strapping (GPIO8, GPIO9) and input-only pads; ESP32-P4 MIPI CSI/DSI differential pin pairs, Ethernet RMII interface, and 50+ GPIO pad matrix without analog ADC2 conflict.

### Nordic Semiconductor BLE portfolio (nRF52840, nRF5340)
- **Documents:** `nRF52840_PS_v1.7.pdf` (Product Specification), `nRF5340_PS_v1.3.pdf`, and Nordic Semiconductor official schematics for PCA10056 (DK) and PCA10059 (Dongle).
- **Verification criteria:** Standard vs. High Drive (E0/E1, H0/H1) electrical ratings, NFC antenna pins (P0.09, P0.10) configuration, 32.768 kHz crystal pins (P0.00, P0.01), USB VBUS detection, and nRF5340 dual-core domain pin routing (Network vs. Application core).

### STMicroelectronics modern families (STM32H5, STM32U5, STM32C0, STM32WL)
- **Documents:** `RM0481` (STM32H5x3 Reference Manual), `UM3115` (NUCLEO-H563ZI User Manual), `RM0456` (STM32U5 Reference Manual), `UM2861` (NUCLEO-U575ZI-Q), `RM0490` (STM32C0 Reference Manual), `UM2977` (NUCLEO-C031C6), and `STMicroelectronics/STM32_open_pin_data` XML sources.
- **Verification criteria:** TrustZone secure I/O attributes for Cortex-M33, LPBAM autonomous peripheral pin allocation on STM32U5, 5 V tolerant (FT) pad classification, and Zio/Morpho connector mappings across MB1404 / MB1549 carrier layouts.

### Microchip / Atmel SAMD and modern tinyAVR (ATSAMD51, tinyAVR 1/2-Series)
- **Documents:** `SAM-D51-E54-Family-Data-Sheet-DS60001507.pdf`, `tinyAVR-1-Series-Data-Sheet-DS40002166.pdf`, and official board schematics for Adafruit Metro M4 and Grand Central M4.
- **Verification criteria:** ATSAMD51 dual DAC outputs (PA02, PA05), dual ADC input channels, PMUX peripheral multiplexing matrix (A through N); tinyAVR UPDI dedicated programming contact, port multiplexer (PORTMUX) registers, and Core Independent Peripheral pin routes.

### Texas Instruments MSPM0 family (MSPM0L1306, MSPM0G3507)
- **Documents:** `SLAU846.pdf` (MSPM0 G-Series Technical Reference Manual), `SLAU847.pdf` (MSPM0 L-Series TRM), and LP-MSPM0L1306 / LP-MSPM0G3507 LaunchPad User Guides.
- **Verification criteria:** 5 V tolerant I/O pads versus 3.3 V only pads, CAN-FD pin allocations, hardware multiplier / math accelerator dedicated channels, and LaunchPad 20-pin / 40-pin BoosterPack header standard alignment.

### Arduino Pro and high-density boards (Arduino GIGA R1 WiFi)
- **Documents:** `Arduino-GIGA-R1-WiFi_schematics.pdf` (Arduino official), and commit-pinned `ArduinoCore-mbed/variants/GIGA/pins_arduino.h`.
- **Verification criteria:** 76 GPIO contacts on Mega-format headers; STM32H747XI dual-core (Cortex-M7 + Cortex-M4) signal routing; Murata 1DX Wi-Fi/BLE module isolation; USB-A host and USB-C programming port nets; 3.3 V I/O voltage boundary across all header pins.

### Raspberry Pi Compute Module 4 and 5 (CM4 / CM5)
- **Documents:** [Compute Module 4 Datasheet, RP-008168-DS](https://datasheets.raspberrypi.com/cm4/cm4-datasheet.pdf) (Table 6, pinout; §4 GPIO_VREF/PCIe text) and [Compute Module 5 Datasheet, RP-008180-DS](https://datasheets.raspberrypi.com/cm5/cm5-datasheet.pdf) (Table 5, pinout; §4.3 electrical specifications). GPIO alternate functions reuse the verified Pi 4 (BCM2711) and Pi 5 (RP1) tables.
- **Verification criteria:** Dual 100-pin Hirose DF40 mezzanine connectors (200 contacts total). Connector 1 (CN1, pins 1–100) carries Ethernet, the GPIO bank (GPIO0–27), SD-card signals and power; Connector 2 (CN2, pins 101–200) carries USB, PCIe, HDMI and the camera/display interfaces (CSI and DSI on CM4, combined MIPI0/MIPI1 on CM5). Configurable GPIO_VREF voltage domain (1.8 V versus 3.3 V).

### Raspberry Pi RM2 wireless module
- **Documents:** [Raspberry Pi Radio Module 2 Datasheet, RP-008943-DS-7](https://datasheets.raspberrypi.com/rm2/rm2-datasheet.pdf): Table 2 (function of each pin), Table 1 (host GPIO connections needed to communicate with the module) and §2.6 (electrical specifications).
- **Verification criteria:** Castellated pad numbering from Table 2; gSPI lines (SCLK, DIN/MOSI, DOUT/MISO, CS) and nIRQ; WL_REG_ON and BT_REG_ON enables; VIN 3.0–4.8 V and VDDIO 1.8 V / 3.3 V supplies; module GPIO0.

### Espressif ESP8266 (AI-Thinker ESP-12F and ESP-01)
- **Documents:** Espressif `ESP8266EX Datasheet` (v6.9), `ESP8266 Technical Reference Manual`, and AI-Thinker `ESP-12F Module Specification`.
- **Verification criteria:** 16-pad castellated SMD footprint (ESP-12F) and 2x4 header (ESP-01); strictly 3.3 V I/O levels (no 5 V tolerance); bootstrapping pads (GPIO0 low for UART download, GPIO2 high, GPIO15 low); CH_PD/EN mandatory 10 kΩ pull-up; TOUT / ADC0 0–1.0 V input range versus board-level voltage dividers.

### Seeed Studio XIAO expansion family (XIAO nRF52840 Sense, XIAO ESP32-S3 Sense)
- **Documents:** Seeed Studio XIAO nRF52840 (Sense) Wiki & Hardware Schematics, `nRF52840_PS_v1.7.pdf`, Seeed Studio XIAO ESP32-S3 (Sense) Schematics, and `esp32-s3_datasheet_en.pdf`.
- **Verification criteria:** Shared 14-pad XIAO base footprint (D0–D10, 3V3, GND, 5V); internal sensor bus routing (LSM6DS3TR-C IMU on P0.27/P0.07, MSM261D PDM microphone on P0.16/P0.17); battery voltage sensing on P0.31; on the ESP32-S3 Sense, the 24-pin bottom FPC connector for camera/microphone and the microSD SPI bus (GPIO21, 47, 48, 38, 39).

## Profiles added on 19 November 2026

UM3115 Rev 3 pp. 27 and 33–36 document the MB1404 connector contacts and A4/A5 setting. STM32H563ZIT6 package pads and alternate-function selectors come from the matching ST XML files. The Nano R4 pinout and Arduino core are pinned separately. XIAO RP2350 electrical mappings follow the Seeed schematic and RP2350 datasheet. The rear drawing identifies pad positions. Feather connector nets are parsed from Eagle. For MSPM0G3507SPT, the extractor reads the LQFP-48 column and PINCM.PF values from SLASEX6C Table 6-2.
