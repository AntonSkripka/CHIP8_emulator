# makeSpan

**Summary:** Capture source location.

**Source:** `web/src/compiler/lexer.js` (line 159)

## Contract

- **Input:** `line`: one-based source line number stored on the error; `column`: one-based source column number; `fileName`: optional filename copied into token source spans
- **Output:** Location object `{ line, column }`, optionally including `fileName`.
- **Side effects:** Creates and returns a coordinate object; it does not mutate the source or lexer state.

## Implementation

Creates a line/column object and includes `fileName` only when supplied.

**Possible weak points:** The filename is included only when truthy; line and column are copied as supplied and are not range-checked.

## Terms

A **token** is a classified source unit with a value and span. **Lookahead** reads upcoming characters without moving the cursor.
