# encodeInstruction — pair

**Summary:** Pack register operands.

**Source:** `web/src/assembler/asm.js` (line 105)

## Contract

- **Input:** `opcode`: base opcode bits to combine with register fields; `x`: destination register index to place in the x field; `y`: source register index to place in the y field
- **Output:** Packed 16-bit opcode with the supplied/default x and y register fields.
- **Side effects:** Reads registers through `reg` and returns a packed value; no persistent state changes.

## Implementation

Combines the provided `opcode` with the validated register indexes `x` and `y`, shifting them into the CHIP-8 x/y bit fields.

**Possible weak points:** The closure places `x` and `y` into fixed bit fields; callers must provide valid register operands before using it.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
