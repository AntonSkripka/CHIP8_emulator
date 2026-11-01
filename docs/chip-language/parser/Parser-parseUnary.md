# Parser — parseUnary

**Summary:** Parse unary expression.

**Source:** `web/src/compiler/parser.js` (line 281)

## Contract

- **Input:** None; reads the current token and parses a prefix operator or delegates to primary-expression parsing.
- **Output:** UnaryExpression node for `!`/`-`, or the result of `parsePrimary()`.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Builds recursive unary `!` and `-` nodes before delegating to primary expressions.

**Possible weak points:** Only prefix `!` and `-` are recognized; unary plus and other prefix operators are not part of this grammar.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
