# CodeEmitter — resolveLayout

**Summary:** Assign addresses and ranges.

**Source:** `web/src/compiler/compiler.js` (line 141)

## Contract

- **Input:** None; lays out the emitter instance's records from the fixed CHIP-8 base address.
- **Output:** Layout object with symbol addresses, source-map ranges, BSS start, and section ranges.
- **Side effects:** Writes calculated `address` values onto data/BSS records and builds local Maps/ranges; overflow throws `LANG010`.

## Implementation

Walks records in order to assign addresses, symbols, section ranges, BSS boundaries, and source-map entries, enforcing memory limits. Labels bind to the current address without consuming bytes. Instructions use 2 bytes, known extended mnemonics 4 bytes, address-byte records 2 bytes, initialized data its value count, and BSS its reserved size. It also closes section ranges and emits source-map records for spans.

**Possible weak points**: Base instructions are counted as 2 bytes and known extensions as 4; a mnemonic omitted from the extension-size set would produce an incorrect layout.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
