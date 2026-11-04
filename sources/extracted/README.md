# Recorded ST table cells

These JSON files contain raw `pdfplumber` table cells from DS5319 PDF pages 28–33 and RM0008 PDF pages 175–181, plus the `PD01_REMAP` token needed by the parser. They record extracted facts, not generated Pin Atlas pin assignments. Page numbers are one-based. The manifest locks each JSON file's SHA-256 and each snapshot identifies the exact original PDF hash.

GitHub-hosted runners can time out downloading both official ST mirrors. CI uses these checked-in extractions with `verify-official-sources.py --table-snapshots`, then applies the same parsing and package restrictions as the original-PDF mode. It still compares all generated outputs. This verifies against recorded source cells; it does not independently fetch the ST PDFs during CI.

With the locked PDFs in `.cache/primary-sources/` and the pinned source-verification dependencies installed, compare every recorded cell against the originals:

```sh
python3 scripts/record-st-tables.py
```

After reviewing a source revision and updating its PDF hash in the manifest, refresh deliberately:

```sh
python3 scripts/record-st-tables.py --write
python3 scripts/verify-official-sources.py --write
python3 scripts/verify-official-sources.py --table-snapshots
```

Review the snapshot, manifest, and generated-data diffs together. The default `verify-official-sources.py` continues to read the original PDFs directly.
