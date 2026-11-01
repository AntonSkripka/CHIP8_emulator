# encodeExtendedInstruction — immediate

**Summary:** Check immediate value.

**Source:** `web/src/assembler/asm.js` (line 67)

## Contract

- **Input:** `min`: inclusive lower bound for the numeric operand; `max`: inclusive upper bound for the numeric operand; `description`: operand name used in a validation error
- **Output:** Validated integer operand for the selected extension.
- **Side effects:** Reads and validates the first immediate operand; failure throws.

## Implementation

Parses the first extended-instruction operand with the requested inclusive bounds and attaches the supplied description to any validation error.

**Possible weak points:** The accepted range depends on the extension: frame offsets use `-128..127`, while adjustment, trap, and system-call values use `0..255`.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
