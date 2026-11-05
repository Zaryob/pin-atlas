# Changelog

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
- Verify the UM1724 manual through hash-locked raw table cells in CI. Validate each new package's declared GPIO source at an immutable ST commit, including cold-download checks. Corroborate the F303RE D0 row omitted by the manual using ST's pinned board variant.
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
