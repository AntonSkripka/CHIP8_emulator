# Parser — expectIdentifier

**Summary:** Require an identifier.

**Source:** `web/src/compiler/parser.js` (line 36)

## Contract

- **Input:** Optional `message`: diagnostic text when the current token is not an identifier.
- **Output:** Consumed identifier token; a different token kind throws `LANG001`.
- **Side effects:** Consumes an identifier on match; wrong token kind throws `LANG001` without consuming.

## Implementation

Requires an identifier token kind and consumes it, otherwise reports `LANG001`.

**Possible weak points:** The check uses token kind `identifier`, not the token spelling; a mismatch is reported without consuming the token.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
