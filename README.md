# Pin Atlas

[English](README.md) · [Türkçe](README.tr.md)

[Live site](https://zaryob.github.io/pin-atlas/?lang=en) · [Verification record](docs/VERIFICATION.md) · [Pin-by-pin comparison](sources/pin-verification.csv)

An English-first pin guide with Turkish localization built from manufacturer documentation and identified board references. View physical pin positions, alternate functions, and wiring plans in one workspace. The interface, schematic drawings, and application code were made for this project. The console theme is shared with my personal site.

## Pin layouts

The library lists each physical layout once and names its compatible boards:

- **Raspberry Pi Pico family:** Pico, Pico W, Pico 2, and Pico 2 W share one 40-pin layout with 26 exposed GPIOs. Select the RP2040 function reference for Pico / Pico W, or RP2350A for Pico 2 / Pico 2 W inside that layout.
- **Raspberry Pi 40-pin GPIO:** B+, A+, Pi 2/3/4/5, Zero models, and 400/500 share one header entry. Choose common GPIO/power/ground connections or the verified BCM2711 alternate functions for Pi 4 in the same view. This excludes older 26-pin boards and Compute Modules; some Zero headers are unpopulated and keyboard models have a rotated header.
- **NVIDIA Jetson Orin Nano:** the NVIDIA P3768 developer-kit carrier’s 40-pin J12 header, with SPI, I²C, UART, I²S, PWM and clock capabilities from the carrier specification. This is a separate pin map from Raspberry Pi; header signal names and pinmux requirements differ.
- **STM32 Blue Pill:** the STM32-base community reference with two 20-pin side headers and four SWD connections. H1/H2/SWD positions are distinct from MCU package pins; the diagram includes the MCU pin mapping and shared LED, crystal, USB and debug connections. Check clone wiring and chip markings.
- **STM32F103C8T6:** the 48-pin LQFP processor, with 37 GPIO-capable pins (including PD0/PD1 after releasing HSE). The STM32F103CBT6 uses the same package pinout.
- **Arduino UNO-format headers:** UNO R3, Leonardo, UNO R4 Minima and UNO R4 WiFi share 32 main-header positions in one entry. Choose the MCU reference for the correct I²C, SPI, ADC, PWM, DAC and CAN signals. Each reference includes its six-contact main-MCU SPI/ICSP connector; BOOT replaces NC on R4.
- **Arduino Nano headers:** classic Nano and Nano Every share 30 side contacts in one entry. Classic Nano adds six ICSP contacts and has analog-only A6/A7; Every has digital-capable A6/A7, different PWM support and no ICSP in this map.
- **Arduino Mega 2560 Rev3:** 92 header contacts including the end header and main MCU ICSP, 70 independent GPIOs, 16 analog inputs and 15 PWM outputs. SPI uses D50–D53.
- **Arduino Micro:** its distinct 34-contact side footprint plus six ICSP contacts. The ATmega32U4 exposes 24 independent GPIOs; SPI and 12 ADC channels follow its own core mapping.
- **ESP32-DevKitC V4:** one 38-contact entry with WROOM-32E and WROVER memory references. Flash and module-specific PSRAM pins are excluded from plans; GPIO34/35/36/39 are input-only.
- **ESP32-C3-DevKitM-1:** the official MINI-1/1U 30-contact footprint with 15 exposed GPIOs, including USB and RGB LED sharing.
- **ESP32-S3-DevKitC-1 v1.1:** one 44-contact entry with WROOM-1-N8 and N8R8 references. Octal PSRAM reserves GPIO35–37; the v1.1 RGB LED uses GPIO38. Other board revisions and module memory voltages need separate verification.
- **ATmega328P packages:** separate PDIP-28, TQFP-32, QFN/MLF-28 and QFN/MLF-32 views. Package pins and raw MCU functions are independent of Arduino numbering. Reset/clock fuses qualify the 23 GPIO-capable pins; ADC6/ADC7 exist only on 32-pin packages.
- **ATmega2560 package:** TQFP-100 with all 100 package pins, 86 GPIOs and raw MCU functions, including signals absent from Mega board headers.
- **RP2350A:** QFN-60, 30 Bank 0 GPIOs.
- **RP2350B:** QFN-80, 48 Bank 0 GPIOs.

The Pico drawing represents the common header and does not claim identical wireless, LED or internal board wiring. Processor references change alternate functions, not physical pin positions. Plans are saved per reference; old model links, exported JSON files, and saved plans remain supported. If multiple old model plans exist for the same processor, they remain available in the function-reference selector without being merged.

The dataset contains 1,276 physical pin records across twenty-nine source profiles backing nineteen library layouts and 4,431 pin/function assignments. The central GND pad on each RP2350 package sits outside the perimeter pin count. The schematic drawings show pin positions and are not mechanical CAD layouts.

## Usage

Select pins, filter interfaces, search, switch to a table, mirror or rotate the diagram by 180°, add custom labels, and save a wiring plan per board. Start with an unfiltered map. Pin details prioritize matching or common functions; expand **More functions** for the rest. References are expandable, and the wiring plan has its own tab. On smaller screens, pin selection opens a detail sheet with a persistent save action. Import and export plans as JSON or share them with a link. Filters match any selected interface. The map displays the first two matching functions, and the table displays all matches.

Each pin detail links to the manufacturer document, PDF page, and table or figure supporting the physical connection and alternate functions. `F0` through `F11` are RP2350 function selectors. RP2040 uses F1–F9. Jetson names follow carrier signals, not Linux bus numbers; no F/ALT selectors are assigned to Jetson functions. `ALT0` through `ALT5` are BCM2711 selectors. ADC records describe analog inputs. The app’s `GPIO` option is a general input/output planning label and carries no manufacturer selector number.

Jetson peripheral use requires a suitable pinmux / Jetson-IO configuration and software support; saving a plan does not configure the device. NVIDIA documents 3.3 V signal levels, open-drain I²C and weak TXB0108-buffered outputs. Check the per-pin electrical notes before connecting hardware.

STM32F1 functions list the actual AFIO remap fields and allowed values from RM0008 rather than inventing AF0–AF15 selectors. Remapping applies to whole peripherals; configure all selected signals consistently and release JTAG pins when needed. The plan does not validate every joint register or board-circuit constraint.

Arduino maps use official full pinouts, connector tables and a pinned Arduino AVR core revision. They cover the listed AVR and Renesas boards; each MCU reference keeps its own capabilities and optional connector scope. Board-header contacts are distinct from Arduino digital pin numbers and MCU ports. Repeated GPIO contacts show their shared net; the plan and JSON importer reject using the same GPIO twice. USB-bridge programming headers and an exhaustive bare-MCU alternate-function map are outside this scope.

ESP GPIO matrix options describe configurable peripheral routes, not default firmware pin assignments. The selected reference retains strapping, input-only, USB/LED and flash/PSRAM restrictions. Input-only pads never offer output/PWM routes; reserved memory contacts cannot enter plans. Espressif board orientation places USB at the bottom.

The browser stores plans under `pin-atlas:plans:v1`. Share links carry the saved plan in the URL fragment. Opening one updates the local plan for that board. Pi 4 physical pins 27 and 28 are reserved for the HAT EEPROM and excluded from regular wiring plans. Check electrical compatibility and firmware configuration against the manufacturer documentation.

## Run locally

```sh
git clone https://github.com/Zaryob/pin-atlas.git
cd pin-atlas
npm run dev
# http://127.0.0.1:4173
npm run check
```

The app runs directly from the static files in `dist/`. Fonts are bundled locally. English is the default language. The theme and EN/TR language preferences are shared with `zaryob.github.io`. Use `?lang=en` or `?lang=tr` to open the interface in a specific language. Switching languages preserves the current board, filters, and wiring plan.

## Recheck against manufacturer documentation

```sh
python3 -m pip install -r requirements-source-verification.txt
python3 scripts/verify-official-sources.py
```

The script downloads fifty hash-locked sources: forty-seven manufacturer documents or source files and three explicitly identified community Blue Pill references. It checks their SHA-256 hashes, rereads the PDF and source tables, and compares the extracted data with the published files. The downloads stay under `.cache/primary-sources/`. The check fails on a changed hash or pin record.

GitHub Actions uses `python3 scripts/verify-official-sources.py --table-snapshots` because ST's CDN can time out on hosted runners. This mode uses the raw ST table cells recorded in `sources/extracted/`; both the snapshots and their original PDF hashes are locked in the manifest. It still regenerates and compares every pin and function, and downloads the other forty-eight sources. The default command above checks the original ST PDFs directly.

Pin labels that appear only in drawings are checked against the visual observations recorded in `sources/manual-observations.json`. That record also explains the IOVDD discrepancy in RP2350 Release 8. See the full method in the [verification record](docs/VERIFICATION.md).

To regenerate the dataset after reviewing the sources, run:

```sh
python3 scripts/verify-official-sources.py --write
npm run check
```

`--write` regenerates `dist/data/boards.json`, `evidence.json`, `verification.json`, and the pin-by-pin CSV. When changing a document revision, review the manufacturer document and update its hash and any affected visual observations.

## Add a board

Blue Pill, the listed Arduino/Espressif references and AVR/STM32 packages are supported. Additional boards and packages need their own source records. Add the manufacturer, model, revision, physical connections, alternate functions, and official source locations together. Update the generator and source records alongside the dataset so the change passes verification.

Diagram renderers are `pico`, `header`, `dip`, `qfn`, `lqfp`, and `custom`. The quad renderer uses the verified `packageName` for TQFP/LQFP and expands dense 100-pin packages to keep their labels separated. A `custom` board can use a local SVG and `pins[].position` coordinates. SVG paths resolve from the app base, including deployments under `/pin-atlas/`. The coordinates mark the connection center, `side` sets the label direction, and `angle` controls optional rotation.

## GitHub Pages

Pushes to `main` trigger manufacturer source verification and static file checks. GitHub Actions deploys `dist/` to GitHub Pages after the checks pass. The workflow is in `.github/workflows/pages.yml`.

## License

The application is licensed under GPL-3.0-or-later. Notices for the shared theme and IBM Plex Mono are in `THIRD_PARTY_NOTICES.md`. Hardware verification sources are documented separately in `sources/manifest.json` and `docs/VERIFICATION.md`.
