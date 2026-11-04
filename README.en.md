# Pin Atlas

[Türkçe](README.md) · [English](README.en.md)

[Live site](https://zaryob.github.io/pin-atlas/?lang=en) · [Verification record](docs/VERIFICATION.en.md) · [Pin-by-pin comparison](sources/pin-verification.csv)

A Turkish and English pin guide built from manufacturer documentation. View physical pin positions, alternate functions, and wiring plans in one workspace. The interface, schematic drawings, and application code were made for this project. The console theme is shared with my personal site.

## Boards

- Raspberry Pi Pico 2 W has 40 physical pins and 26 GPIOs.
- Raspberry Pi 4 Model B has 40 physical pins on J8, with 26 general-purpose GPIOs and two lines reserved for the HAT identification EEPROM. The alternate functions are specific to the BCM2711.
- RP2350A has a QFN-60 package and 30 Bank 0 GPIOs.
- RP2350B has a QFN-80 package and 48 Bank 0 GPIOs.

The dataset contains 220 physical pins and 1,310 pin/function assignments. The central GND pad on each RP2350 package sits outside the perimeter pin count. The schematic drawings show pin positions and are not mechanical CAD layouts.

## Usage

Select pins, filter interfaces, search, switch to a table, mirror or rotate the diagram by 180°, add custom labels, and save a wiring plan per board. Import and export plans as JSON or share them with a link. Filters match any selected interface. The map displays the first two matching functions, and the table displays all matches.

Each pin detail links to the manufacturer document, PDF page, and table or figure supporting the physical connection and alternate functions. `F0` through `F11` are RP2350 function selectors. `ALT0` through `ALT5` are BCM2711 selectors. ADC records describe analog inputs. The app’s `GPIO` option is a general input/output planning label and carries no manufacturer selector number.

The browser stores plans under `pin-atlas:plans:v1`. Share links carry the saved plan in the URL fragment. Opening one updates the local plan for that board. Pi 4 physical pins 27 and 28 are reserved for the HAT EEPROM and excluded from regular wiring plans. Check electrical compatibility and firmware configuration against the manufacturer documentation.

## Run locally

```sh
git clone https://github.com/Zaryob/pin-atlas.git
cd pin-atlas
npm run dev
# http://127.0.0.1:4173
npm run check
```

The app runs directly from the static files in `dist/`. Fonts are bundled locally. The theme and TR/EN language preferences are shared with `zaryob.github.io`. Use `?lang=en` or `?lang=tr` to open the interface in a specific language. Switching languages preserves the current board, filters, and wiring plan.

## Recheck against manufacturer documentation

```sh
python3 -m pip install -r requirements-source-verification.txt
python3 scripts/verify-official-sources.py
```

The script downloads six pinned manufacturer sources, checks their SHA-256 hashes, rereads the PDF and source tables, and compares the extracted data with the published files. The downloads stay under `.cache/primary-sources/`. The check fails on a changed hash or pin record.

Pin labels that appear only in drawings are checked against the visual observations recorded in `sources/manual-observations.json`. That record also explains the IOVDD discrepancy in RP2350 Release 8. See the full method in the [verification record](docs/VERIFICATION.en.md).

To regenerate the dataset after reviewing the sources, run:

```sh
python3 scripts/verify-official-sources.py --write
npm run check
```

`--write` regenerates `dist/data/boards.json`, `evidence.json`, `verification.json`, and the pin-by-pin CSV. When changing a document revision, review the manufacturer document and update its hash and any affected visual observations.

## Add a board

STM32 boards are planned for a future release. Add the manufacturer, model, revision, physical connections, alternate functions, and official source locations together. Update the generator and source records alongside the dataset so the change passes verification.

Diagram renderers are `pico`, `header`, `qfn`, and `custom`. A `custom` board can use a local SVG and `pins[].position` coordinates. SVG paths resolve from the app base, including deployments under `/pin-atlas/`. The coordinates mark the connection center, `side` sets the label direction, and `angle` controls optional rotation.

## GitHub Pages

Pushes to `main` trigger manufacturer source verification and static file checks. GitHub Actions deploys `dist/` to GitHub Pages after the checks pass. The workflow is in `.github/workflows/pages.yml`.

## License

The application is licensed under GPL-3.0-or-later. Notices for the shared theme and IBM Plex Mono are in `THIRD_PARTY_NOTICES.md`. Hardware verification sources are documented separately in `sources/manifest.json` and `docs/VERIFICATION.en.md`.
