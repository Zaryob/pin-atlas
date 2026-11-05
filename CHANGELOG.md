# Changelog

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
