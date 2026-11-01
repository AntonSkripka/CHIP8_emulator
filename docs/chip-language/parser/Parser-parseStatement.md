# Parser — parseStatement

**Summary:** Parse one statement.

**Source:** `web/src/compiler/parser.js` (line 205)

## Contract

- **Input:** None; dispatches on the parser's current token to parse one statement.
- **Output:** One AST statement node selected from the supported statement forms.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Selects block, variable declaration, if/else, while, return, empty, or expression statement from the current token.

**Possible weak points:** Only blocks, `u8`/`bool` declarations, `if`, `while`, `return`, empty statements, and expression statements are recognized.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
