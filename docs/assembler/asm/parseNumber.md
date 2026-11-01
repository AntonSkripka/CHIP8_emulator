# parseNumber

**Summary:** Parse a number.

**Source:** `web/src/assembler/asm.js` (line 20)

## Contract

- **Input:** `token`: raw assembler operand text to parse or validate
- **Output:** An integer for decimal/hex syntax, or `NaN` for unrecognized text.
- **Side effects:** Pure conversion; no state is changed.

## Implementation

Accepts signed decimal or hexadecimal text and returns its integer value; unmatched forms produce `NaN`.

**Possible weak points**: Recognizes only signed decimal integers and signed `0x` hexadecimal integers; it does not enforce opcode-specific ranges or safe-integer limits.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
