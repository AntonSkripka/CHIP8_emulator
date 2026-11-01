# Parser — at

**Summary:** Compare current token.

**Source:** `web/src/compiler/parser.js` (line 23)

## Contract

- **Input:** `value`: spelling to compare with the current token value.
- **Output:** Boolean indicating whether the current token value equals the requested value.
- **Side effects:** Reads the current token without moving `position`.

## Implementation

Checks whether the current token value equals the requested spelling.

**Possible weak points:** It compares only `current().value`; a missing current token causes a property-access error, so the token stream must end with EOF.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
