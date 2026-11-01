# encodeInstruction — reg

**Summary:** Read register operand.

**Source:** `web/src/assembler/asm.js` (line 103)

## Contract

- **Input:** `index`: zero-based operand position in the parsed argument list
- **Output:** Register index from 0 to 15 or an assembler error.
- **Side effects:** Validates the selected operand; failure throws.

## Implementation

Reads `args[index]` and parses it as an uppercase `V0`–`VF` register, returning the hexadecimal register index.

**Possible weak points:** The selected operand must match uppercase `V0`–`VF`; a missing operand or other register form fails through `requireRegister`.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
