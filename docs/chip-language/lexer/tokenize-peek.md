# tokenize — peek

**Summary:** Peek at source text.

**Source:** `web/src/compiler/lexer.js` (line 27)

## Contract

- **Input:** `distance`: character lookahead distance from the lexer cursor
- **Output:** Character at the requested lookahead distance, or empty string at end of source.
- **Side effects:** Reads the source at an offset without advancing.

## Implementation

Reads a character at the current offset plus a distance without advancing; end-of-source is an empty string.

**Possible weak points:** Lookahead returns an empty string beyond the source end and does not move the cursor.

## Terms

A **token** is a classified source unit with a value and span. **Lookahead** reads upcoming characters without moving the cursor.
