# Wiring plan files

Downloaded JSON files use format version 3. Each `pins` row records the physical
contact (`physical`), signal name, numbered MCU pad when available (`mcuPin`),
function, AF selector when available (`selector`), project label and source IDs.
Contacts are sorted in physical-label order so changes are readable in Git.

`hardware` records the applied board settings. Routes and MCU identities describe
those settings, including any switched solder-bridge routes.

`provenance.profile` identifies the profile and verification date. Its `file` is
the runtime bundle path; `revision` is the first 16 hexadecimal characters of
that bundle's SHA-256 digest, as used by the runtime catalog. The bundle includes
the board definition and its evidence. `provenance.documents` records document
revisions, URLs and full SHA-256 hashes. `provenance.references` maps source IDs
to document locations. These identify the source data, not electrical approval
of the connected circuit.

Imports resolve physical contacts against the current profile and applied
hardware settings, then verify signal names, MCU pad numbers, AF selectors and
the existing plan rules. Changed or duplicate contacts are rejected. A different
profile bundle revision is flagged in the preview, even when all pin identities
still match. Source information from an imported file never replaces the
application's current evidence or bypasses validation.

Version 1 and version 2 files remain importable. Browser storage and compact
share links continue using those formats: numeric pin IDs with function/label
entries, plus hardware settings in version 2. Exporting does not rewrite existing
browser records. Version 3 downloads preserve pin assignments, labels and board
settings when imported, and do not require the original internal numeric IDs.
