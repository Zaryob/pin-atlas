# Third-party notices

## Zaryob console theme

`dist/assets/console/theme.css`, `select-chevron.svg` and the adapted `theme.js` come from [Zaryob/zaryob.github.io](https://github.com/Zaryob/zaryob.github.io/tree/main/assets/console). The original files carry `SPDX-License-Identifier: GPL-2.0-or-later`; the application is distributed under GPL-3.0-or-later. Original notices are retained. The adapted JavaScript keeps only the shared color theme preference and omits the blog's search, translation and navigation features.

## IBM Plex Mono

IBM Plex Mono Regular and Medium are bundled locally under the SIL Open Font License 1.1. The copyright notice and license are in `dist/assets/console/fonts/OFL.txt`.

## Arduino reference sources

Arduino full-pinout PDFs for UNO R3 (A000066), classic Nano (A000005), and Mega 2560 Rev3 (A000067) credit Arduino and carry Creative Commons Attribution-ShareAlike 4.0 notices. Their URLs, revisions and hashes are recorded in `sources/manifest.json`. The official ArduinoCore-avr pin-definition files carry LGPL-2.1-or-later notices. These originals are downloaded to the ignored verification cache. Pin Atlas extracts mapping facts and provides source links; the board illustrations in this repository are original schematic drawings.

## Additional manufacturer references

The source manifest also records official Arduino Leonardo/Micro, Nano Every and UNO R4 pinouts; ArduinoCore-renesas and ArduinoCore-megaavr mapping files; Espressif user-guide source tables and front/pin-layout images; and original Microchip/Atmel datasheets. Original license and copyright notices remain with those documents and repositories. These inputs are cached privately for hash verification. The shipped board/package illustrations are original schematic drawings; extracted pin facts retain links to their source revision and location.
