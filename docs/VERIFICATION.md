# Pin data verification

[English](VERIFICATION.md) · [Türkçe](VERIFICATION.tr.md)

Reviewed on **4 November 2026**. The review covers eleven board, header, and chip profiles, **512 physical pin records, and 2,234 function assignments**. Shared physical pins are counted once per profile. The count excludes the app’s generic `GPIO` planning option and the unnumbered QFN center GND pads. Each placement of a signal on a different pin counts separately.

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
   CI passes `--table-snapshots` to use the recorded ST table extractions in `sources/extracted/`, avoiding ST CDN timeouts. Each extraction is hash-locked and identifies the original locked PDF hash. The same parser rebuilds the STM32 data from either input; the other fourteen sources are downloaded and checked in both modes. The default command rereads the original ST PDFs.
3. The physical pin number, name, type, alternate function, manufacturer signal, and F/ALT selector must match the published record.
4. Figure-only observations are marked separately. Reusing them during an automated run preserves the prior visual review. A changed hash requires a fresh source review.
5. [`sources/pin-verification.csv`](../sources/pin-verification.csv) lists each pin and function record. `dist/data/evidence.json` resolves reference IDs to documents, pages, and tables. `dist/data/verification.json` holds the verification totals and source summary.
6. GitHub Actions runs the same comparison against the manufacturer sources before deployment.

The app uses its own SVG schematics. Manufacturer documents are linked from the evidence records. Software and font licensing notices are maintained separately.

## Shared layout catalog

The eleven source profiles are presented as seven physical layouts: one Pico family entry, one Raspberry Pi 40-pin header entry, one NVIDIA Jetson Orin Nano J12 entry, the Blue Pill board, its STM32F103C8/CB LQFP48 processor, and the two distinct RP2350 packages. The application checks that grouped profiles agree on pin numbers, names and types before grouping them. A function-reference selector retains the verified processor-specific function tables and evidence. Grouping does not claim that RP2040, RP2350A and BCM2711 have interchangeable alternate functions. Legacy profile IDs remain valid for saved plans and shared links.

## NVIDIA Jetson Orin Nano · J12

The source is NVIDIA’s SHA-256-locked **Jetson Orin Nano Developer Kit Carrier Board Specification, SP-11324-001_v1.3 (December 2024)**. This map covers J12 on the NVIDIA P3768 carrier board, not the module’s 260-pin connector or third-party carriers.

- All 40 positions are extracted from Figure 3-1 (printed p. 21 / PDF p. 25) and independently matched to Table 3-3 (printed pp. 22–23 / PDF pp. 26–27). Supply pins and all eight grounds are checked against their table descriptions. All 28 signal pins can be configured for GPIO according to §3.3.
- Peripheral signals use the carrier/module names in those sources. GPIO09’s audio primary clock, GPIO01/GPIO11’s general-purpose clocks and GPIO07/GPIO13’s PWM entries come from the alternate-function column. GPIO12 is kept as GPIO; its SoC pad name containing PWM does not establish a supported header PWM function.
- Table 3-3 spells pins 16/18 as `SPI1_CSI1*` / `SPI1_CSI0*`. The corresponding Figure 3-1 labels are `SPI1_CS1*` / `SPI1_CS0*`, consistent with the same table rows’ SoC CS1_N/CS0_N names. The generator checks the exact discrepancies before using the figure names. The UART1_RTS* module/SoC label is retained despite its alternate-description cell saying UART #2; Linux bus and gpiochip mappings are outside this record.
- Function records describe documented capabilities, not the currently flashed pinmux or driver configuration. The PWM entries do not assert that every JetPack image enables hardware PWM on those pins. Use NVIDIA’s [Jetson-IO configuration guide](https://docs.nvidia.com/jetson/archives/r36.4.3/DeveloperGuide/HR/ConfiguringTheJetsonExpansionHeaders.html) and the appropriate pinmux for the target software release.
- Electrical notes cite Table 3-3: 3.3 V signals; direct open-drain I²C on 3/5 and 27/28, with 2.2 kΩ / 1.5 kΩ pull-ups and ±2 mA listed drive; other signal pins use TXB0108 translators with ±20 µA listed weak drive and external pulls greater than 50 kΩ. These are not Raspberry Pi GPIO electrical characteristics.
- J12 pins 27/28 are I2C0_SDA/SCL and are not given the Raspberry Pi HAT EEPROM reservation. No ADC or unverified numeric mux selectors are added.

The manufacturer PDF is cached for verification and is not distributed in the repository. The complete source set now covers 512 physical pin records and 2,234 function assignments.

## STM32F103C8/CB · LQFP48

ST **DS5319 Rev 20 (July 2025)** Table 5, PDF pp. 28–33, supplies the LQFP48 pin positions, I/O tolerance and functions. Figure 8, PDF p. 26, was inspected for the physical perimeter arrangement. The 48-pin LQFP has no exposed center pad. GPIO-capable OSC_IN/OSC_OUT remain oscillator functions after reset; PD0/PD1 require the software remap described in the datasheet footnote and RM0008 §9.3.1.

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
