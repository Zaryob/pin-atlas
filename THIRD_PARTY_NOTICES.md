# Third-party notices

Pin Atlas is licensed under GPL-3.0-or-later (see `LICENSE`). This file lists the third-party material that is shipped with the site or stored in this repository, and the sources whose facts the pin data is derived from.

The site is built by Jekyll from `public/` into `_site/`. Paths below are repository paths; on the published site `public/assets/…` is served as `assets/…`.

## Bundled with the site

### Shared console theme

`public/assets/console/theme.css`, `theme.js`, `language.js`, `i18n.js`, `select-chevron.svg`, `site.svg`, `regular.svg` and the IBM Plex font files are shared with [Zaryob/zaryob.github.io](https://github.com/Zaryob/zaryob.github.io/tree/main/assets/console) and kept in sync with it. The theme stylesheet and scripts carry `SPDX-License-Identifier: GPL-2.0-or-later`; they are used here under GPL-3.0-or-later, which that licence permits. The shared Liquid includes `public/_includes/console-header.html` and `console-icon.html` carry the same identifier. The icons and fonts inside the theme folder keep their own licences, listed next.

### Font Awesome Free icons

- `public/assets/console/select-chevron.svg`: one Font Awesome Free 5.15.2 icon. Its embedded comment reads "Font Awesome Free 5.15.2 by @fontawesome - https://fontawesome.com", with the licence summary "Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License".
- `public/assets/console/site.svg`: a sprite of selected Font Awesome Free 5.15.2 icons, marked "CC BY 4.0".
- `public/assets/console/regular.svg`: the Font Awesome Free 5.15.2 regular icon sprite, with the same embedded notice. It is shipped, but no Pin Atlas page references it.

These SVG icons are licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) by Fonticons, Inc. (Font Awesome). The full Font Awesome Free licence summary is in `public/assets/console/ICONS-LICENSE.txt`. The embedded attribution comments are kept. These icons are not under the GPL.

### IBM Plex fonts

`public/assets/console/fonts/` contains IBM Plex Mono (Regular, Medium) and IBM Plex Sans (Regular, Italic, SemiBold, SemiBold Italic) as WOFF2 files. Copyright © 2017 IBM Corp., with Reserved Font Name "Plex". They are licensed under the SIL Open Font License 1.1, whose full text is in `public/assets/console/fonts/OFL.txt`.

### Other assets

The board drawings in `public/assets/boards/` and `public/assets/social-card.png` were made for this project. They are schematic illustrations. They do not contain manufacturer artwork, photographs, embedded images or CAD output.

The site loads the Umami analytics script from `cloud.umami.is` and the Google Analytics 4 tag from `www.googletagmanager.com` at run time. Pin Atlas does not bundle or redistribute either; Google Analytics sets cookies.

## Hardware sources

The pin data uses facts from the 169 records in [the source manifest](sources/manifest.json). The manifest retains the publisher, source URL, revision and SHA-256 hash for each input.

| Source family | Records | What is used |
| --- | ---: | --- |
| STMicroelectronics | 49 | Eight ST data sheets and manuals, STM32 open package and GPIO-mode files, and STM32duino variant files |
| Arduino | 38 | Board pinouts, schematics and data sheets, plus pin-definition and board files from the Arduino cores |
| Espressif | 14 | DevKit manuals and drawings, and ESP32/ESP8266 source data sheets |
| Espressif / Arduino | 1 | Arduino Nano ESP32 variant from `espressif/arduino-esp32` |
| Raspberry Pi Ltd | 28 | Pico, Compute Module, RP silicon, BCM peripherals, Raspberry Pi board and radio module documentation |
| WeAct Studio | 5 | Black Pill v3.x KiCad symbol, footprint, schematic and documentation |
| Micro:bit Educational Foundation | 4 | micro:bit V2 schematic and three hardware pages |
| Microchip / Atmel | 3 | ATmega and SAM D21 data sheets |
| PJRC | 3 | Teensy 4.1 pinout cards and schematic |
| Seeed Studio | 9 | XIAO schematics, core variant files and rear-view pinout |
| STM32-base community | 3 | Blue Pill board page, reference schematic and photo |
| BeagleBoard.org | 2 | BeagleBone Black System Reference Manual, chapters 7 and 8 |
| Texas Instruments | 2 | AM335x and MSPM0G350x data sheets |
| NVIDIA | 1 | Jetson Orin Nano Developer Kit carrier board specification |
| Adafruit | 3 | Feather RP2040 pinout and Feather RP2350 pinout and CAD schematic |
| NodeMCU | 1 | NodeMCU DevKit schematic |
| WEMOS | 2 | LOLIN D1 mini v4.0.0 schematic and pinout |
| Ai-Thinker | 1 | ESP32-CAM Rev 1.6 schematic archived by Seeed Studio |
| **Total** | **169** | |

### What is redistributed

- **No manufacturer document is bundled.** The PDFs, images, HTML pages and source files above are downloaded into the git-ignored `.cache/primary-sources/` folder for hash checks only. They are not part of the repository or the published site.
- **`sources/extracted/*.json` is redistributed.** These eight files hold raw table cells that `pdfplumber` extracted from eight ST documents (DS5319, RM0008, UM1724 Rev 17, UM2505 Rev 7, UM1956, UM1974, UM2407 and UM3115). Most cells are pin names and signal labels, but some hold whole sentences from ST's tables. They are copied text, not facts restated by this project. They are kept so CI can check the ST data without downloading the PDFs. Copyright in that text stays with STMicroelectronics.
- **The generated pin tables are derived facts.** `public/data/`, `public/search.json` and `sources/pin-verification.csv` record pin numbers, signal names, alternate functions and short notes taken from the sources. Each record links to its document, page and table. Pin Atlas wrote the notes and descriptions itself.
- Manufacturer and board names are used only to identify the hardware.

### Upstream licences

Licences are stated only where they could be confirmed from the upstream repository or from the locked document itself. Even where a licence was not confirmed, every fact keeps a link to its source.

- **Arduino documentation** (`arduino/docs-content` at `cb938e96b391e636011690e4db1348dc38db4deb`): `LICENSE.md` contains the full Creative Commons Attribution-ShareAlike 4.0 International text and links to CC BY-SA 4.0. Its summary sentence names "Attribution 4.0", but the link and the full text are for BY-SA. Pinout, schematic and data sheet material © Arduino, CC BY-SA 4.0.
- **Raspberry Pi documentation** (`raspberrypi/documentation` at `0fb416315f8f6c1949c0614989075d3e5805104b`): `LICENSE.md` contains the CC BY-SA 4.0 text, with the same "Attribution 4.0" summary sentence and a BY-SA link. GPIO header table © Raspberry Pi Ltd, CC BY-SA 4.0. The licences of the Raspberry Pi PDF data sheets were not confirmed.
- **BeagleBoard.org documentation**: the two locked BeagleBone Black SRM pages (chapters 7 and 8) state in their page footer "This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License". © BeagleBoard.org, CC BY-SA 4.0.
- **micro:bit V2 hardware** (`microbit-foundation/microbit-v2-hardware` at `17aae03003b4fd3686d18aca5ad175c420d29a20`): `LICENSE.md` is CC BY-SA 4.0. Schematic © Micro:bit Educational Foundation, CC BY-SA 4.0.
- **micro:bit developer documentation** (`microbit-foundation/dev-docs` at `469ea5f9faa31989fdb296e726ca24fd558931f4`): the licence was not confirmed. `LICENSE.MD` shows a CC BY-SA 4.0 badge, but the full text below the badge is CC BY-NC-SA 4.0. The pages are credited to the Micro:bit Educational Foundation, and only facts and short signal names are used.
- **Espressif DevKit guides** (`espressif/esp-dev-kits` at `5c06bf1835329d6525f316475f7218aab6acfe79`): the README says the documentation (text, diagrams and images) is CC BY-SA 4.0 and the code is Apache-2.0. `LICENSE-CC-BY-SA` and `LICENSE-APACHE` are present. Guide tables and pin-layout images © Espressif Systems, CC BY-SA 4.0. The licences of the Espressif PDF data sheets were not confirmed.
- **Adafruit Feather RP2040 PCB** (`adafruit/Adafruit-Feather-RP2040-PCB` at `be3f4b3260411d27569d3afe030247dc0e747284`): the README says "Creative Commons Attribution, Share-Alike license, check license.txt" and "Designed by Adafruit Industries". No `license.txt` and no licence version are present at that commit, so the exact licence was not confirmed. Pinout © Adafruit Industries.
- **WeAct Studio Black Pill** (`WeActStudio/WeActStudio.MiniSTM32F4x1` at `6a7f7d434a9d6361f91590d4cdd16b4a70ce7513`): the repository has no licence file at its root, and its README does not state a licence. Only pad names, pad coordinates and circuit facts are used. No WeAct file is redistributed.
- **STM32 open pin data** (`STMicroelectronics/STM32_open_pin_data` at `7d1f1514ed5583ec5007ad91236b4e1d377295b1`): BSD-3-Clause, © 2020 STMicroelectronics.
- **STM32duino variants** (`stm32duino/Arduino_Core_STM32` at `b18163265c827fc3b1f1396c4d09221b4821a405`): each file used carries an STMicroelectronics copyright and a BSD 3-Clause notice.
- **Arduino cores**: the ArduinoCore-avr and ArduinoCore-megaavr `pins_arduino.h` files carry GNU LGPL notices ("version 2.1 of the License, or (at your option) any later version"). ArduinoCore-renesas is MIT-licensed at the pinned commit, © 2022–2023 Arduino SA. No licence file was found at the root of ArduinoCore-mbed, and the pinned `variant.cpp` has no licence header. `espressif/arduino-esp32` is LGPL-2.1.
- **ST, Microchip, Texas Instruments, NVIDIA, PJRC and Seeed Studio documents, and the STM32-base pages**: copyright stays with each publisher. No licence for reuse was confirmed, and none of these documents is redistributed. The only exception is the ST table cells described above.

## Trademarks and affiliation

Pin Atlas is an independent reference. It is not affiliated with, sponsored by or endorsed by any manufacturer, foundation or community named in this repository. Arduino, Raspberry Pi, STM32 and Nucleo, ESP32, BBC micro:bit, BeagleBone, Teensy, Feather, XIAO, Jetson, WeAct and the other product and company names are trademarks or registered trademarks of their owners. They are used only to identify the hardware described.
