# Pin Atlas

Contributing a profile? Follow the [board and MCU verification workflow](docs/ADDING-BOARDS.md).

[English](README.md) · [Türkçe](README.tr.md)

[Live site](https://zaryob.github.io/pin-atlas/?lang=en) · [Verification record](docs/VERIFICATION.md) · [Pin-by-pin comparison](sources/pin-verification.csv)

An English-first pin guide with Turkish localization built from manufacturer documentation and identified board references. View physical pin positions, alternate functions, and wiring plans in one workspace. The interface, schematic drawings, and application code were made for this project. The console theme is shared with my personal site.

## Pin layouts

The catalog lists each documented hardware model separately under **Development boards**, **MCU packages**, or **Common headers**, then groups models by platform/manufacturer. Type and platform filters combine with model, processor, series, and package searches. Shared geometry is reused internally; selecting NUCLEO-L432KC, for example, opens that model and its own functions rather than a generic Nucleo-32 entry. Compatibility-only aliases lead to a labeled reference, not a newly claimed MCU function map.

The underlying pin layouts include:

- **Raspberry Pi Pico family:** Pico, Pico W, Pico 2, and Pico 2 W share one 40-pin layout with 26 exposed GPIOs. Select the RP2040 function reference for Pico / Pico W, or RP2350A for Pico 2 / Pico 2 W inside that layout.
- **Raspberry Pi 40-pin GPIO:** B+, A+, Pi 2/3/4/5, Zero models, and 400/500 share one header entry. Choose common GPIO/power/ground connections, the verified BCM2711 alternate functions for Pi 4, or the verified RP1 alternate functions for Pi 5 in the same view. This excludes older 26-pin boards and Compute Modules; some Zero headers are unpopulated and keyboard models have a rotated header.
- **NVIDIA Jetson Orin Nano:** the NVIDIA P3768 developer-kit carrier’s 40-pin J12 header, with SPI, I²C, UART, I²S, PWM and clock capabilities from the carrier specification. This is a separate pin map from Raspberry Pi; header signal names and pinmux requirements differ.
- **STM32 Blue Pill:** the STM32-base community reference with two 20-pin side headers and four SWD connections. H1/H2/SWD positions are distinct from MCU package pins; the diagram includes the MCU pin mapping and shared LED, crystal, USB and debug connections. Check clone wiring and chip markings.
- **STM32F103 packages:** separate LQFP-48 (STM32F103C8T6 / STM32F103CBT6 with 37 GPIOs), LQFP-64 (STM32F103RBT6 / STM32F103R8T6 with 51 GPIOs), and LQFP-100 (STM32F103VBT6 / STM32F103V8T6 with 80 GPIOs) views with raw MCU functions and full AFIO remap conditions from RM0008.
- **STM32 Nucleo-32 family:** F042K6 and L432KC share 30 MB1180 CN3/CN4 contacts, with separate LQFP-32 / UFQFPN-32 MCU references and I²C, VCP and oscillator bridge notes.
- **STM32 Nucleo-64 family:** compatible MB1136 and MB1367 references share one 108-contact Arduino/ST Morpho entry. Select the exact model to retain its MCU functions, package links and solder-bridge notes.
- **STM32 Nucleo-144 family:** F767ZI, H743ZI2 and H723ZG share 240 verified physical ST Zio/Morpho positions across CN7–CN12. Model references retain their own MCU, power nets and circuit restrictions; the corrected H723 mapping preserves existing assignment IDs.
- **WeAct Black Pill v3.x:** F401CC and F411CE share one 44-contact entry, including four SWD contacts. Electrical names and positions are parsed from the manufacturer's pinned KiCad symbol and footprint; package references, USB, boot, key, LED and optional-flash notes remain explicit.
- **Additional Nucleo models:** F446RE, F303RE, L476RG, F072RB, L053R8 and L152RE, each linked to its exact STM32 package. Their pin maps use the locked UM1724 manual tables and pinned manufacturer XML; CI verifies the recorded tables without downloading the manual PDF.
- **STM32 package views:** STM32F446RET6, F303RET6, L476RGT6, F072RBT6, L053R8T6 and L152RET6 (LQFP-64), plus standalone STM32F405RGT6 (LQFP-64) and STM32F407VGT6 (LQFP-100). Package pad numbers and GPIO alternate-function selectors come from ST's pinned XML sources.
- **Additional STM32 packages:** F042K6T6 (LQFP-32), L432KCU6 (UFQFPN-32), F767ZIT6 / H743ZIT6 (LQFP-144), and F401CCU6 / F411CEU6 (UFQFPN-48), linked to their exact board references. UFQFPN drawings cover the perimeter pads numbered by the source XML.
- **Arduino UNO-format headers:** UNO R3, Leonardo, UNO R4 Minima and UNO R4 WiFi share 32 main-header positions in one entry. Choose the MCU reference for the correct I²C, SPI, ADC, PWM, DAC and CAN signals. Each reference includes its six-contact main-MCU SPI/ICSP connector; BOOT replaces NC on R4.
- **Arduino Nano headers:** classic Nano and Nano Every share 30 side contacts in one entry. Classic Nano adds six ICSP contacts and has analog-only A6/A7; Every has digital-capable A6/A7, different PWM support and no ICSP in this map.
- **Arduino Mega 2560 Rev3:** 92 header contacts including the end header and main MCU ICSP, 70 independent GPIOs, 16 analog inputs and 15 PWM outputs. SPI uses D50–D53.
- **Arduino Micro:** its distinct 34-contact side footprint plus six ICSP contacts. The ATmega32U4 exposes 24 independent GPIOs; SPI and 12 ADC channels follow its own core mapping.
- **Seeed Studio XIAO headers:** 14-contact compact XIAO footprint shared by Seeed Studio XIAO RP2040 (with RP2040 QFN package pin linking) and Seeed Studio XIAO ESP32C3 (RISC-V Wi-Fi/BLE), showing how D0–D10 map to different GPIOs and peripherals across processors.
- **BBC micro:bit V2:** 21-contact edge connector layout featuring 5 large crocodile/banana rings (0, 1, 2, 3V, GND) and 16 expansion edge contacts (P3–P16, P19, P20). Details nRF52833 GPIOs, touch sensing, analog inputs, and shared circuit notes for the 5×5 LED matrix columns, A/B push buttons, and I²C pull-ups, with dedicated connector zoom for RING vs EDGE.
- **ESP32-DevKitC V4:** one 38-contact entry with WROOM-32E and WROVER memory references. Flash and module-specific PSRAM pins are excluded from plans; GPIO34/35/36/39 are input-only.
- **ESP32-C3-DevKitM-1:** the official MINI-1/1U 30-contact footprint with 15 exposed GPIOs, including USB and RGB LED sharing.
- **ESP32-S3-DevKitC-1 v1.1:** one 44-contact entry with WROOM-1-N8 and N8R8 references. Octal PSRAM reserves GPIO35–37; the v1.1 RGB LED uses GPIO38. Other board revisions and module memory voltages need separate verification.
- **ATmega328P packages:** separate PDIP-28, TQFP-32, QFN/MLF-28 and QFN/MLF-32 views. Package pins and raw MCU functions are independent of Arduino numbering. Reset/clock fuses qualify the 23 GPIO-capable pins; ADC6/ADC7 exist only on 32-pin packages.
- **ATmega2560 and ATmega2561 packages:** separate TQFP-100 (ATmega2560 / ATmega1280 with 86 GPIOs) and TQFP-64 (ATmega2561 / ATmega1281 with 54 GPIOs) views with raw MCU functions; Mega board headers differ from package numbering.
- **RP2350A:** QFN-60, 30 Bank 0 GPIOs.
- **RP2350B:** QFN-80, 48 Bank 0 GPIOs.

The Pico drawing represents the common header and does not claim identical wireless, LED or internal board wiring. Processor references change alternate functions, not physical pin positions. Plans are saved per reference; old model links, exported JSON files, and saved plans remain supported. If multiple old model plans exist for the same processor, they remain individually available in Compatible boards without being merged.

Boards with a verified MCU package link support selecting a contact or package pin from either drawing. The package view also opens matching board contacts. Board drawings with multiple connectors can zoom to an individual header.

The [verification summary](public/data/verification.json) lists the dataset totals and source profiles. The central GND pad on RP2040 and RP2350 packages sits outside the perimeter pin count. The schematic drawings show pin positions and are not mechanical CAD layouts.

## Usage

**Board configuration** declares source-backed solder bridges, debug wiring, clocks and fitted components for supported STM32 references. Nucleo-32 SB16/SB18 change A5/A4 MCU routes and functions, reserve D5/D4 when coupled, and require the original analog pads to remain floating inputs. MB1364 Nucleo-144 A4/A5 presets, SB14/SB15 contacts, ST-LINK VCP and WeAct optional flash have their own constraints. Unspecified settings reserve affected contacts conservatively. Apply a configuration to update the map, connection choices and conflict checks; existing assignments remain visible even when they conflict. These declarations do not change the physical board or firmware.

**Suggest compatible pins** accepts total SPI, I²C and UART connections (for example, one SPI and two UARTs). Existing functions and labels are locked; complete connections count toward the requested totals. Compare up to three alternatives with bus instances, physical contacts, selectors, circuit notes and sources before adding one to the plan. SPI can require a verified hardware CS/NSS route, or leave device chip select for manual assignment. The search respects configured wiring, shared MCU pads, reserved memory and AFIO conditions. It runs in a cancellable worker and reports a reached search limit separately from an impossible request. It does not infer undocumented bus instances or electrical timing compatibility.

**Add a peripheral** in the wiring plan selects verified SPI, I²C or UART/USART signal roles from one peripheral instance. It preserves existing assignments and shows the selected pins' circuit notes and sources. Duplicate routes and incompatible STM32 AFIO remap settings are rejected; conflicting legacy browser entries remain visible with a warning.

**Print / Save PDF** creates a source-backed wiring table through the browser's print dialog. **Download SVG** includes the full top-view pin map, selected functions, labels, applied board configuration and source locators; colors and artwork are embedded for offline use.

The home page loads a roughly 56 KB catalog summary. Pin maps and their evidence load on demand with content-addressed profile files, cached navigation and a persistent retry that retains the selected model and saved plans.

Select pins, filter interfaces, search, switch to a table, mirror or rotate the diagram by 180°, add custom labels, and save a wiring plan per board. Start with an unfiltered map. Pin details prioritize matching or common functions; expand **More functions** for the rest. References are expandable, and the wiring plan has its own tab. On smaller screens, pin selection opens a detail sheet with a persistent save action. Import and export plans as JSON or share them with a link. Filters match any selected interface. The map displays the first two matching functions, and the table displays all matches.

Each pin detail links to the manufacturer document, PDF page, and table or figure supporting the physical connection and alternate functions. `F0` through `F11` are RP2350 function selectors. RP2040 uses F1–F9. Jetson names follow carrier signals, not Linux bus numbers; no F/ALT selectors are assigned to Jetson functions. `ALT0` through `ALT5` are BCM2711 selectors. ADC records describe analog inputs. The app’s `GPIO` option is a general input/output planning label and carries no manufacturer selector number.

Jetson peripheral use requires a suitable pinmux / Jetson-IO configuration and software support; saving a plan does not configure the device. NVIDIA documents 3.3 V signal levels, open-drain I²C and weak TXB0108-buffered outputs. Check the per-pin electrical notes before connecting hardware.

STM32F1 functions list the actual AFIO remap fields and allowed values from RM0008 rather than inventing AF0–AF15 selectors. Remapping applies to whole peripherals; configure all selected signals consistently and release JTAG pins when needed. The plan does not validate every joint register or board-circuit constraint.

Arduino maps use official full pinouts, connector tables and a pinned Arduino AVR core revision. They cover the listed AVR and Renesas boards; each MCU reference keeps its own capabilities and optional connector scope. Board-header contacts are distinct from Arduino digital pin numbers and MCU ports. Repeated GPIO contacts show their shared net; the plan and JSON importer reject using the same GPIO twice. USB-bridge programming headers and an exhaustive bare-MCU alternate-function map are outside this scope.

ESP GPIO matrix options describe configurable peripheral routes, not default firmware pin assignments. The selected reference retains strapping, input-only, USB/LED and flash/PSRAM restrictions. Input-only pads never offer output/PWM routes; reserved memory contacts cannot enter plans. Espressif board orientation places USB at the bottom.

**Compatible boards** opens a numbered model index with processor/reference details, the active reference and saved-plan indicators. Select a model directly; longer lists can be searched. Physical-only compatibility links open the common pinout rather than another board’s alternate-function map.

Home and library searches use the same model catalog and filters. Each model card opens its own processor reference within the shared physical layout, and the workspace heading retains the exact model name. Nucleo-32/64/144 are series labels. MCU packages remain individually selectable, and the common Raspberry Pi header is explicitly physical-only. Featured names, GPIO counts and I/O voltages come from the verified profiles. If the library cannot load, use **Try again**; saved browser plans are retained.

The site uses Umami for usage analytics. Wiring plans are stored locally in the browser.

The browser stores configured plans atomically under `pin-atlas:plans:v2`, including their hardware settings. Legacy `pin-atlas:plans:v1` entries remain as a backup; profiles without configuration retain the v1 format. JSON/share v2 includes hardware settings; v1 imports use the current settings and undergo the same strict validation. Share links carry the saved plan in the URL fragment. Links and JSON imports open a preview. Saving replaces an existing plan only after you choose to replace it. Pi 4 physical pins 27 and 28 are reserved for the HAT EEPROM and excluded from regular wiring plans. Check electrical compatibility and firmware configuration against the manufacturer documentation.

## Run locally

Use Node.js with npm, Python 3, and Ruby 3.3 or newer with Bundler. Install the Jekyll dependencies before starting the local server.

```sh
git clone https://github.com/Zaryob/pin-atlas.git
cd pin-atlas
python3 scripts/jekyll.py install
npm run dev
```

Open `http://127.0.0.1:4173`. Run `npm run build` to generate `_site/` from `public/` and check the built asset paths. The repository checks require the Python packages in `requirements-source-verification.txt` (including the profile schema validator); install them in your Python environment before `npm run check`.

For browser regression checks, install the test dependencies and Chromium, then build the GitHub Pages project-path preview:

```sh
npm ci
npx playwright install chromium
npm run build:ui
npm run test:ui
```

The browser suite checks desktop and mobile dark views, model-specific search, connector zoom, keyboard navigation, loading recovery, and saved/imported/shared plans. CI runs it before deployment and checks the final compiled asset paths. Test reports and traces stay outside the published site.

Fonts are bundled locally. English is the default language. The theme and EN/TR language preferences are shared with `zaryob.github.io`. Use `?lang=en` or `?lang=tr` to open the interface in a specific language. Switching languages preserves the current board, filters, and wiring plan.

## Recheck against manufacturer documentation

```sh
python3 -m pip install -r requirements-source-verification.txt
python3 scripts/verify-official-sources.py
```

The script reads the [source manifest](sources/manifest.json), which includes manufacturer documents and source files as well as the identified Blue Pill community references. It downloads missing files to `.cache/primary-sources/`, checks the locked SHA-256 hashes, rereads the PDF and source tables, and compares the extracted data with the checked-in files. The check fails on a changed hash or pin record.

GitHub Actions uses `python3 scripts/verify-official-sources.py --table-snapshots` because ST's CDN can time out on hosted runners. This mode uses the raw ST table cells recorded in `sources/extracted/`. The manifest locks both the snapshots and the original PDFs. The script still checks the remaining sources and compares every generated pin and function. The default command above checks the original ST PDFs directly.

Pin labels that appear only in drawings are checked against the visual observations recorded in `sources/manual-observations.json`. That record also explains the IOVDD discrepancy in RP2350 Release 8. See the full method in the [verification record](docs/VERIFICATION.md).

To regenerate the dataset after reviewing the sources, run:

```sh
python3 scripts/verify-official-sources.py --write
npm run build:data
npm run check
```

`--write` regenerates `boards.json`, `evidence.json`, and `verification.json` in `public/data/` and the pin-by-pin CSV in `sources/`. When changing a document revision, review the manufacturer document and update its hash and any affected visual observations.

`npm run build:data` generates the small runtime catalog and profile/evidence bundles after validating full shared geometry. `npm run check` verifies that these files match the source dataset. The separate [weekly source audit](.github/workflows/source-audit.yml) cold-downloads recorded URLs and checks their hashes, keeping external CDN availability out of the deployment path.

## Add a board

Follow [Adding a verified board or MCU](docs/ADDING-BOARDS.md). Profiles must satisfy the common JSON schema, board/package net contracts and source locks. Add the manufacturer, exact model/revision, physical connections, functions and source locations together; update the generator, runtime bundles and regression checks alongside the dataset.

Diagram renderers are `pico`, `header`, `dip`, `qfn`, `lqfp`, and `custom`. The quad renderer uses the verified `packageName` for TQFP/LQFP and expands dense 100-pin packages to keep their labels separated. A `custom` board can use a local SVG and `pins[].position` coordinates. SVG paths resolve from the app base, including deployments under `/pin-atlas/`. The coordinates mark the connection center, `side` sets the label direction, and `angle` controls optional rotation.

## GitHub Pages

Pushes to `main` trigger source verification and repository checks. After they pass, GitHub Actions builds the site with Jekyll and deploys `_site/` to GitHub Pages. See the [Pages workflow](.github/workflows/pages.yml).

## License

The application is licensed under GPL-3.0-or-later. Notices for the shared theme and IBM Plex Mono are in `THIRD_PARTY_NOTICES.md`. Hardware verification sources are documented separately in `sources/manifest.json` and `docs/VERIFICATION.md`.
