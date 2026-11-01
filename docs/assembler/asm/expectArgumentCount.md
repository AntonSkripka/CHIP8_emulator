# expectArgumentCount

**Summary:** Check operand count.

**Source:** `web/src/assembler/asm.js` (line 36)

## Contract

- **Input:** `statement`: assembler statement with its source line, line number, and token list; `args`: operand strings following the instruction mnemonic; `expected`: required operand count or expected type, according to the helper
- **Output:** No value when counts match; otherwise throws `AssemblerError`.
- **Side effects:** Reads operands; mismatch throws with statement context.

## Implementation

Compares actual and required operand counts and reports a line-specific error on mismatch.

**Possible weak points:** The count is exact; it does not support optional operands or variadic forms, and mismatch immediately throws using statement context.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
