# tokenize — advance

**Summary:** Advance lexer cursor.

**Source:** `web/src/compiler/lexer.js` (line 16)

## Contract

- **Input:** None; consumes the character at the lexer cursor and updates the cursor/line/column state.
- **Output:** The consumed source character; returns `undefined` only when called past end.
- **Side effects:** Advances the lexer offset and updates line/column state.

## Implementation

Consumes one source character and updates the one-based line/column cursor.

**Possible weak points:** The cursor advances by one UTF-16 code unit; line tracking treats only `
` as a line break.

## Terms

A **token** is a classified source unit with a value and span. **Lookahead** reads upcoming characters without moving the cursor.
