# encodeInstruction — byte

**Summary:** Read byte operand.

**Source:** `web/src/assembler/asm.js` (line 104)

## Contract

- **Input:** `index`: zero-based operand position in the parsed argument list
- **Output:** Operand reduced to its low byte after the accepted -128..255 range check.
- **Side effects:** Validates and masks an operand; failure throws.

## Implementation

Reads the operand at `args[index]`, validates it as a safe integer from -128 through 255, and masks it to one byte.

**Possible weak points:** The helper accepts only safe integers from `-128` through `255`, then masks to one byte; fractions and larger values fail.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
