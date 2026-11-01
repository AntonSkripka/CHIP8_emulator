# tokenize

**Summary:** Tokenize source text.

**Source:** `web/src/compiler/lexer.js` (line 6)

## Contract

- **Input:** `source`: source string to scan; `fileName`: optional filename copied into token spans.
- **Output:** Array of token objects ending with an EOF token.
- **Side effects:** Allocates a new operand array; does not alter source text.

## Implementation

Validates string input, scans comments, literals, identifiers, numbers, and operators, and appends an EOF token. The cursor tracks one-based line/column. Comments and whitespace are skipped; literals, identifiers, numbers and symbols each get a span. It appends an EOF token and throws `LANG001`/`LANG002` for malformed source or a literal above `65535`.

**Possible weak points:** A comma-only separator error returns `null`; callers turn that into an assembler error. The helper does not preserve commas as tokens.

## Terms

A **token** is a classified source unit with a value and span. **Lookahead** reads upcoming characters without moving the cursor.
