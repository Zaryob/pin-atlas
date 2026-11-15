# Recorded ST table cells

These seven JSON files contain raw `pdfplumber` table cells from seven ST documents. `scripts/record-st-tables.py` records these PDF pages (one-based):

| File | Document | PDF pages |
| --- | --- | --- |
| `stm32f103.json` | DS5319 Rev 20 | 28–33 |
| `stm32-rm0008.json` | RM0008 Rev 21 | 175–181 |
| `nucleo-um1724-r17.json` | UM1724 Rev 17 | 27, 28, 31, 33, 38–63 |
| `nucleo-g4-um2505.json` | UM2505 Rev 7 | 30–33 |
| `nucleo-um1956-r6.json` | UM1956 Rev 6 | 12, 13, 21, 22, 24, 30–32 |
| `nucleo-um1974-r11.json` | UM1974 Rev 11 | 14, 15, 31–35, 37, 61–65, 70, 71 |
| `nucleo-um2407-r6.json` | UM2407 Rev 6 | 15, 16, 31–34, 38–44 |

They also record the `PD01_REMAP` token needed by the parser. They hold extracted source text, not generated Pin Atlas pin assignments. The manifest locks each JSON file's SHA-256, and each snapshot records the SHA-256 of the original PDF it was extracted from.

**These files redistribute ST text.** They are raw table cells copied from the ST documents, mostly pin and signal names but including some full sentences from ST's tables. Copyright in that text stays with STMicroelectronics; see [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md).

CI runs `verify-official-sources.py --table-snapshots`. In that mode no ST PDF is opened: the ST data is rebuilt from these cells with the same parsing and package restrictions as the original-PDF mode, and all generated outputs are still compared. The mode checks each snapshot's own hash, but does not compare a snapshot with its PDF.

With the locked PDFs in `.cache/primary-sources/` and the pinned source-verification dependencies installed, compare all seven recorded snapshots against their original PDFs:

```sh
python3 scripts/record-st-tables.py
```

After reviewing a source revision and updating its PDF hash in the manifest, refresh deliberately:

```sh
python3 scripts/record-st-tables.py --write
python3 scripts/verify-official-sources.py --write
python3 scripts/verify-official-sources.py --table-snapshots
```

Review the snapshot, manifest, and generated-data diffs together. The default `verify-official-sources.py` (without `--table-snapshots`) reads the original PDFs directly.
