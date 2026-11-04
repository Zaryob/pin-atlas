# Pin data verification

[Türkçe](VERIFICATION.md) · [English](VERIFICATION.en.md)

Reviewed on **3 November 2026**. The review covers four boards and chips, **220 physical pins, and 1,310 function assignments**. The count excludes the app’s generic `GPIO` planning option and the unnumbered QFN center GND pads. Each placement of a signal on a different pin counts separately.

## Sources by pin map

### Raspberry Pi Pico 2 W

- Physical pins 1–40 were visually checked against the single-page [manufacturer pin diagram](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008305-DS-1-pico-2-w-pinout.pdf#page=1). With USB at the top, the left edge runs from 1 to 20 and the right edge from 40 to 21.
- VBUS, VSYS, 3V3_EN, 3V3, ADC_VREF, AGND, and RUN were also checked against the text in the [Pico 2 W Datasheet, §2.1, printed pages 7–8, PDF pages 8–9](https://pip-assets.raspberrypi.com/categories/1088-raspberry-pi-pico-2-w/documents/RP-008304-DS-3-pico-2-w-datasheet.pdf#page=8).
- The digital alternate functions on exposed GPIOs come from the [RP2350 Datasheet, §1.2.3, Table 3, PDF pages 18–20](https://pip-assets.raspberrypi.com/categories/1214-rp2350/documents/RP-008373-DS-3-rp2350-datasheet.pdf#page=18). GPIO23, GPIO24, GPIO25, and GPIO29 are internal wireless connections and sit outside the 40-pin header.
- ADC0, ADC1, and ADC2 map to GP26, GP27, and GP28 in the pin diagram and datasheet Figure 2. HSTX uses the signal name `HSTX` and selector F0 from Table 3.

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
3. The physical pin number, name, type, alternate function, manufacturer signal, and F/ALT selector must match the published record.
4. Figure-only observations are marked separately. Reusing them during an automated run preserves the prior visual review. A changed hash requires a fresh source review.
5. [`sources/pin-verification.csv`](../sources/pin-verification.csv) lists each pin and function record. `dist/data/evidence.json` resolves reference IDs to documents, pages, and tables. `dist/data/verification.json` holds the verification totals and source summary.
6. GitHub Actions runs the same comparison against the manufacturer sources before deployment.

The app uses its own SVG schematics. Manufacturer documents are linked from the evidence records. Software and font licensing notices are maintained separately.
