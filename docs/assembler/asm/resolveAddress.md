# resolveAddress

**Summary:** Resolve label or address.

**Source:** `web/src/assembler/asm.js` (line 56)

## Contract

- **Input:** `statement`: assembler statement with its source line, line number, and token list; `token`: raw assembler operand text to parse or validate; `labels`: map from normalized label names to resolved addresses
- **Output:** Resolved integer address from 0 through `0xFFF`; unknown/out-of-range values throw.
- **Side effects:** Reads the label map; failure throws without changing it.

## Implementation

Resolves a case-insensitive label first, then a numeric address, and restricts it to the 4 KiB memory range.

**Possible weak points:** Label lookup uppercases the operand, while numeric parsing accepts only signed decimal or `0x` hexadecimal text; valid addresses are `0..4095`.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
