# requireNumber

**Summary:** Validate numeric range.

**Source:** `web/src/assembler/asm.js` (line 48)

## Contract

- **Input:** `statement`: assembler statement with its source line, line number, and token list; `token`: raw assembler operand text to parse or validate; `min`: inclusive lower bound for the numeric operand; `max`: inclusive upper bound for the numeric operand; `description`: operand name used in a validation error
- **Output:** Validated safe integer within the inclusive `min..max` range.
- **Side effects:** Pure validation except that failure throws the statement error.

## Implementation

Parses a number and requires a safe integer inside the caller-provided inclusive range.

**Possible weak points:** The value must parse as a safe integer and lie within both inclusive bounds; the accepted textual forms are signed decimal and `0x` hexadecimal.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
