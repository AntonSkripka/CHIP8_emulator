# parseRegister

**Summary:** Decode register name.

**Source:** `web/src/assembler/asm.js` (line 31)

## Contract

- **Input:** `token`: raw assembler operand text to parse or validate
- **Output:** A number from 0 to 15 for `V0`–`VF`, otherwise `null`.
- **Side effects:** Pure conversion; no state is changed.

## Implementation

Matches only `V0` through `VF` and returns the hexadecimal register index, or `null`.

**Possible weak points:** The regular expression is case-sensitive and accepts only `V0` through `VF`; lowercase register spellings return `null`.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
