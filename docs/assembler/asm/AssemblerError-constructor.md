# AssemblerError — constructor

**Summary:** Set error location.

**Source:** `web/src/assembler/asm.js` (line 8)

## Contract

- **Input:** `message`: human-readable diagnostic message; `line`: one-based source line number stored on the error; `sourceLine`: original source line attached to the assembler error
- **Output:** No returned value; initializes the Error object.
- **Side effects:** Sets Error fields `name`, `line`, and `sourceLine`; no external state changes.

## Implementation

Creates a line-aware assembler exception, setting its name, source line number, and original source text.

**Possible weak points**: The constructor accepts the supplied line/source as-is; it does not validate line numbering or normalize source text.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
