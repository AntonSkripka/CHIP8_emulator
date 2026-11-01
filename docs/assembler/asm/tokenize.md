# tokenize

**Summary:** Tokenize source text.

**Source:** `web/src/assembler/asm.js` (line 233)

## Contract

- **Input:** `source`: source string to scan; `fileName`: optional filename copied into token spans.
- **Output:** Array of operand strings, or `null` when comma separators are malformed.
- **Side effects:** Allocates a new operand array; does not alter source text.

## Implementation

Validates string input, scans comments, literals, identifiers, numbers, and operators, and appends an EOF token. The cursor tracks one-based line/column. Comments and whitespace are skipped; literals, identifiers, numbers and symbols each get a span. It appends an EOF token and throws `LANG001`/`LANG002` for malformed source or a literal above `65535`.

**Possible weak points:** A comma-only separator error returns `null`; callers turn that into an assembler error. The helper does not preserve commas as tokens.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
