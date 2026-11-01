# Parser — parsePrimary

**Summary:** Parse primary expression.

**Source:** `web/src/compiler/parser.js` (line 294)

## Contract

- **Input:** None; parses the primary expression starting at the parser's current token.
- **Output:** Literal, identifier, call, array-index, or grouped expression AST node.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Builds literal, identifier, qualified call, array-index, or parenthesized-expression nodes.

**Possible weak points**: Qualified names allow one module/member dot; array indexing and calls are recognized only directly after an identifier.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
