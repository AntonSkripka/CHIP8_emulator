# Parser — consume

**Summary:** Consume current token.

**Source:** `web/src/compiler/parser.js` (line 27)

## Contract

- **Input:** None; returns and consumes the token at the current parser position.
- **Output:** Current token, then advances the cursor by one.
- **Side effects:** Increments `position` and returns the token that was at the old position.

## Implementation

Returns the current token and advances the cursor by one.

**Possible weak points:** It increments `position` without checking bounds; callers rely on valid lookahead and an EOF sentinel.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
