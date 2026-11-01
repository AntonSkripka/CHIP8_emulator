# encodeExtendedInstruction

**Summary:** Encode extended instruction.

**Source:** `web/src/assembler/asm.js` (line 64)

## Contract

- **Input:** `statement`: assembler statement with its source line, line number, and token list
- **Output:** Two 16-bit words: fixed `0x5001` prefix and the encoded sub-operation word.
- **Side effects:** No shared state is changed; it reads operands and returns the encoded/converted value, or throws an assembler error.

## Implementation

Selects the `chip8-dev` sub-operation and packs its checked immediate or signed frame offset into the two-word extension encoding.

**Possible weak points**: All extended encodings are fixed at two words; unknown extension mnemonics have no default branch result and are rejected by surrounding dispatch.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
