# fail

**Summary:** Raise assembler error.

**Source:** `web/src/assembler/asm.js` (line 16)

## Contract

- **Input:** `statement`: assembler statement with its source line, line number, and token list; `message`: human-readable diagnostic message
- **Output:** Does not return; throws an `AssemblerError` carrying this statement’s line and source.
- **Side effects:** Throws immediately; does not mutate labels or source.

## Implementation

Converts an assembler statement and message into `AssemblerError`; control does not return.

**Possible weak points:** The statement must carry `line` and original `source`; the function always throws and does not provide a recovery path.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
