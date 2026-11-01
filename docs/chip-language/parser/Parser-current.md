# Parser — current

**Summary:** Read current token.

**Source:** `web/src/compiler/parser.js` (line 19)

## Contract

- **Input:** None; reads `tokens[position]` from the parser instance.
- **Output:** Token object at the current cursor position.
- **Side effects:** Reads the current token without moving `position`.

## Implementation

Returns the token at the current cursor position.

**Possible weak points:** It directly indexes `tokens[position]`; exhausting a stream without EOF returns `undefined`.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
