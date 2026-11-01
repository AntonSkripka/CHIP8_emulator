# Parser — expect

**Summary:** Require a token value.

**Source:** `web/src/compiler/parser.js` (line 31)

## Contract

- **Input:** `value`: required spelling; optional `message`: diagnostic text used if it does not match.
- **Output:** Consumed token with the requested value; mismatch throws `LANG001`.
- **Side effects:** Consumes on match; a mismatch throws `LANG001` without consuming.

## Implementation

Requires a specific token value, otherwise raises `LANG001` at the current token.

**Possible weak points:** A mismatch throws `LANG001` before consuming the current token; parsing stops at the first syntax error.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
