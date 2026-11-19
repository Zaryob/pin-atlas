# Changelog

## [0.9.0] - 2026-11-20

### Added
- **RISC-V Microcontrollers and Evaluation Boards:**
  - Added WCH CH32V003F4P6 bare chip package (`ch32v003f4p6-tssop20`) with 20 pins, 18 GPIOs, and complete alternate function mappings for QingKe 32-bit RISC-V2A @ 48 MHz.
  - Added WCH CH32V003-EVT evaluation board profile (`ch32v003-evt`) with custom vector artwork, P1/P2 headers, and MCU package linking.
  - Added Espressif ESP32-C6 bare silicon QFN-32 package profile (`esp32-c6-qfn32`) from Table 2-2 of the official datasheet, linking both `esp32-c6-devkitc-1` and `xiao-esp32c6` to the QFN-32 package with bidirectional `mcuPin` navigation.
- **Nordic Semiconductor:**
  - Added Nordic nRF52840 DK (`nrf52840-dk`, PCA10056) development kit profile with 32 shield-compatible contacts across P3, P4, P5, and P6 headers, customized SVG board artwork, and hardware specifications.
- **Catalog & Platform Expansion:**
  - Introduced `WCH` and `Nordic Semiconductor` catalog platforms (`wch` and `nordic` families) with complete bilingual Turkish and English localization.
  - Added test coverage in UI and contract test suites verifying exact MCU package links and header navigation.

## Unreleased

### Committed since v0.8.0

- Catalog every documented hardware model as its own card, simplify workspace controls, and use the same pin selection and detail presentation for boards and MCU packages.
- Add a site search index (`search.json`), URL search with result highlighting, and a sitemap. Add social preview metadata and catalog-wide descriptions. Sync the shared console theme and language state, preserving the query across language redirects and the search content language.
- Add a CAN peripheral solver that pairs TX/RX of one documented CAN or FDCAN instance, electrical tolerance badges and strapping-pin alerts. Add Arduino Nano ESP32 and Seeed Studio XIAO SAMD21 profiles.
- Improve pin planning: resolve occupied GPIO aliases to the saved contact, compare changed routes and separate hardware constraints from general guidance. Export JSON in plan format version 3 with readable physical contacts, the dataset revision and source hashes; older files remain importable.
- Validate RP2040/RP2350 PWM assignments that share a slice channel and require explicit `sharedPWM` consent for fan-out.
- Correct RP2350 input limits, RP1 SPI roles and STM32 ADC groups. Keep catalog controls and suggestion text readable at larger text sizes.
- Pin the Arduino Markdown data sheets to an `arduino/docs-content` commit. Document dated catalog totals and reproducible source inputs.
- Correct Adafruit Feather RP2040 (right header ordered from the USB end, VBAT … SDA; pin 3 is the second 3.3 V output, not AREF), Teensy 4.1 (functions from PJRC cards 11a/11b and the core source, SD pad order, pads 44/45 as GPIO) and NUCLEO-G474RE (D0/D1 and CN10.35/37 on USART1 PC5/PC4, MB1367 solder-bridge notes).

### Not yet committed

- **Search engines and links.** Generate a crawlable pinout page per profile in English (`/boards/<profile-id>/`) and Turkish (`/tr/boards/<profile-id>/`), an index grouped by platform, and a sitemap that lists them, all from the generated profile data (`scripts/static-pages.mjs`, run by `npm run build:data` and verified by `npm run check`). The suite search index now links to `#board=<layout-id>&profile=<profile-id>` with no query; it used to name the renderer type as the board and repeat the board name as a pin filter, which opened the wrong board with no matching pins. A known profile id now decides the target on its own, older search links still open their board, and a link that names an unknown board or profile shows a notice instead of silently opening the default board. The home title says “pinout”.
- **Sources and provenance.** Lock UM1724 Rev 17 from its official `www.st.com` URL instead of Rev 14 from a third-party mirror, and UM2505 Rev 7 instead of Rev 2; `scripts/record-st-tables.py` now also records UM2505, so it checks all seven ST table snapshots against their PDFs. Send the HTTP/2 request that `www.st.com` accepts, so the default verification downloads all seven ST PDFs again. Pin mutable URLs to commits: G474 package and GPIO-mode XML (`STM32_open_pin_data` `7d1f1514…`), the Feather RP2040 pinout (`be3f4b32…`), the micro:bit V2 schematic (`17aae030…`) and 15 Arduino PDFs from `arduino/docs-content` (`cb938e96…`); only the ATmega328P data sheet remains on `docs.arduino.cc`.
- **Sourced warnings.** Add pin `warnings` and `noteEvidence` and board `cautions`. `scripts/warning_sources.py` attaches them and asserts every quoted number against the locked document; `scripts/validate-data.py` checks that each warning has a source and each translation key exists in both languages. Warnings show their source link in the interface.
- **BeagleBone Black.** P9.41/P9.42 nets are `gpio0[20]`/`gpio0[7]`; the second balls D13/B12 are modelled separately. Correct 13 signal names against TI SPRS717L. Add eMMC, HDMI, PWR_BUT, power-rail and power-sequencing warnings.
- **Arduino.** Nano ESP32 B1 is Arduino pin 15, and A2/GPIO3 is a strapping pin. Nano Every shows the 16 MHz clock the Arduino core builds for, not 20 MHz. Nano 33 BLE Sense Rev2 VUSB needs solder jumper SJ1. UNO R4 IOREF note added.
- **RP2350.** Add the erratum E9 input-leakage note to every Bank 0 GPIO on Pico 2, Pico 2 W, RP2350A and RP2350B.
- **Seeed Studio XIAO.** Remove the incorrect USB-UART bridge note from XIAO ESP32C3, mark the BOOT button on D9 and add the ESP32-C3 ADC2 caveat (also on ESP32-C3-DevKitM-1). Use data sheet timer names on XIAO SAMD21 (TCC0/TCC1/TC4), mark PA08 as NMI-only and note that D5/D7 share EXTINT[9].
- **BBC micro:bit V2.** Show the 25 front strips in physical order; pin IDs 1–21 are unchanged and the new strips are 22–25. Correct the I²C note (on V2 the motion sensor is on a separate internal bus) and add an edge-connector current-budget caution.
- **Raspberry Pi and Teensy.** Raspberry Pi header cautions: not 5 V tolerant, 16 mA per pin and 50 mA in total, fixed 1.8 kΩ pull-ups on GPIO2/3. Teensy 4.1 voltage caution and SD pad notes.
- **Evidence locators.** ATmega2561 PDI points to the Table 13-17 note on p. 84; the ESP32 p. 16 reference is the Table 2-1 notes.
- **Localization and search.** Replace raw Turkish notes in the Pico 2 W and Raspberry Pi data with translated keys. Write `search.json` entries in their declared language. Fix model search in the Turkish locale (dotted/dotless i). Add the missing shared-header translations. The Turkish badge now says source-verified. Add a trademark note to the footer.
- **Hardware reference.** Add `sources/hardware-details.json` and the generated `docs/HARDWARE-REFERENCE.md` / `docs/HARDWARE-REFERENCE.tr.md`.
- **Totals.** 79 profiles, 5,226 physical pin records, 24,290 function assignments and 128 locked sources. The data's `verifiedOn` stays 2026-11-05; only the changed profiles were re-checked on 2026-11-14/15.
- **Documentation.** Rewrite `THIRD_PARTY_NOTICES.md`; bring the READMEs and verification records up to date in both languages, including the two verification modes and the redistributed ST table cells.

### Compatibility

- Saved plans that used the old XIAO SAMD21 function names (`TC0_WO0` …, "GPIO interrupt") or the second-ball functions on BeagleBone Black P9.41/P9.42 no longer match the current function names.
- Feather RP2040 pins 17–28 were reordered in the earlier Feather correction; plans saved before it refer to different physical contacts.

## v0.8.0 — 2026-11-05

- Add source-backed STM32 board configuration for solder bridges, debug wiring, clocks and fitted components. Apply Nucleo-32 SB16/SB18 MCU rerouting, VCP/LED bridges, MB1364 A4/A5 and Morpho contacts, and WeAct optional-flash constraints to maps and plan validation. Unspecified wiring reserves affected contacts.
- Preserve existing assignments with visible configuration conflicts. Store configured pins and hardware settings atomically in v2 records; keep v1 backups and support configuration-aware JSON/share previews, cancellation and concurrent-change checks. Include applied settings and evidence in print/SVG output.
- Suggest up to three compatible SPI, I²C and UART pin sets while locking existing functions and labels. Reuse partial/complete connections, distinguish hardware bus instances and enforce shared-pad, memory and AFIO constraints. Support verified hardware chip select, source/circuit comparisons and explicit application.
- Run bounded search in a cancellable worker. Discard stale suggestions when requirements, settings or plans change; report exhausted search separately from unsatisfiable requests. Retain in-memory planning when browser storage is full.
- Retain the 55,815-byte startup catalog, all 77 profiles and existing physical layouts, English-first localization and Umami. Verify 63 unit cases and 60 desktop/mobile browser cases, including configured-plan migration, previews and worker-generated alternatives.

## v0.7.0 — 2026-11-05

- Add guided SPI, I²C and UART/USART connections with verified pin choices, source links, circuit notes and protection for existing assignments.
- Standardize profile schemas and board/package net contracts, move STM32 additions into a declarative registry, and add an independent weekly cold-source download audit. Correct Feather RP2040 MCU-pad links caught by the new contracts.
- Reject duplicate USART/LPUART routes and incompatible STM32 AFIO remap settings across manual assignments, imports and share previews. Preserve conflicting legacy browser plans with visible warnings.
- Load a 55,815-byte catalog first and fetch content-addressed profile/evidence bundles on demand. Preserve exact model links, saved plans and retry behavior, including cancelled navigation.
- Export full top-view SVG maps with embedded artwork, readable colors, labels and numbered sources. Add printable wiring tables with browser Save PDF and retain legacy conflict warnings in output.
- Add NUCLEO-F042K6, NUCLEO-L432KC, NUCLEO-F767ZI, NUCLEO-H743ZI2 and WeAct Black Pill F401CC/F411CE with their exact MCU packages. Group verified Nucleo-32, Nucleo-144 and Black Pill physical footprints.
- Rebuild H723's physical contacts from UM2407 while preserving all 131 old electrical assignment IDs. Expose all 240 real Nucleo-144 contacts; retain model-specific solder-bridge, SDMMC and analog-input restrictions.
- Publish 77 source profiles across 51 physical layouts: 5,178 pins, 24,181 function assignments and 117 locked source documents. Regression coverage includes 53 unit tests and 50 desktop/mobile browser cases.

## v0.6.0 — 2026-11-05

- Add NUCLEO-F446RE, NUCLEO-F303RE, NUCLEO-L476RG, NUCLEO-F072RB, NUCLEO-L053R8 and NUCLEO-L152RE with their exact STM32 package views and GPIO alternate-function selectors.
- Add standalone STM32F407VGT6 LQFP-100 and STM32F405RGT6 LQFP-64 package views.
- Group compatible Nucleo-64 boards into one 108-contact catalog entry while preserving model-specific functions, power nets, package links, old URLs and saved plans.
- Verify the UM1724 manual through hash-locked raw table cells in CI. Validate each new package's declared GPIO source at an immutable ST commit, including cold-download checks. (Correction: the NUCLEO-G474RE XML stayed on the `master` branch and the UM1724 download came from a third-party mirror until the Unreleased work above.) Corroborate the F303RE D0 row omitted by the manual using ST's pinned board variant.
- Publish 65 source profiles across 43 physical layouts: 3,993 pins, 17,194 function assignments and 97 locked source documents.
- Extend regression coverage to 37 unit tests and 18 desktop/mobile browser tests, including exact Nucleo references, board/package navigation and standalone STM32 search.

## v0.5.0 — 2026-11-05

- Show catalog results immediately below active searches and retain exact model references across the home page and library.
- Display the selected board and MCU together, with compatible models above the pin map.
- Use board-specific Nucleo connector groups and keep map and table scopes consistent.
- Preserve keyboard focus, add arrow-key pin navigation, and improve narrow mobile navigation.
- Show persistent library loading errors with a safe retry that retains browser plans and deep links.
- Derive featured model names, GPIO counts and I/O voltages from verified profiles. Retain Umami and describe its use accurately.
- Gate deployment on source verification, 28 unit tests, 14 desktop/mobile browser tests, and compiled asset checks.
