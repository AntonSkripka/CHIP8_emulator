# asmToBin

**Summary:** Assemble source bytes.

**Source:** `web/src/assembler/asm.js` (line 238)

## Contract

- **Input:** `code`: assembly source string containing directives/instructions.
- **Output:** Array of segments shaped `{ start, bytes }`; each byte item has `{ val, size }`.
- **Side effects:** Builds local label, occupancy, and segment collections; input string remains unchanged.

## Implementation

Performs label/address discovery and opcode emission, then returns contiguous segments containing start addresses and encoded bytes. It first strips CR characters and semicolon comments, then assigns addresses and label values in a first pass. A second pass encodes instructions after forward labels are available, checks skip/extended-instruction adjacency and duplicate occupied bytes, and groups adjacent output into segments.

**Possible weak points:** Origins and emitted bytes must fit the 4 KiB address space; duplicate labels/addresses, malformed operands, and skip-to-extension cases abort the whole conversion.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
