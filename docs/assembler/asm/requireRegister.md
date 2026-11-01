# requireRegister

**Summary:** Validate register operand.

**Source:** `web/src/assembler/asm.js` (line 42)

## Contract

- **Input:** `statement`: assembler statement with its source line, line number, and token list; `token`: raw assembler operand text to parse or validate
- **Output:** Register index from 0 to 15; invalid spelling throws `AssemblerError`.
- **Side effects:** Pure validation except that failure throws the statement error.

## Implementation

Uses `parseRegister` and rejects a missing or invalid register with the accepted range in the message.

**Possible weak points:** Only uppercase `V0`–`VF` is accepted; special registers such as `I`, `DT`, and `ST` are not valid here.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
