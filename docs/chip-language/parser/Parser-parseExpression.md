# Parser — parseExpression

**Summary:** Parse an expression.

**Source:** `web/src/compiler/parser.js` (line 260)

## Contract

- **Input:** `minimumPrecedence`: minimum operator precedence accepted in this recursive parse
- **Output:** Expression AST node with operator precedence and associativity represented by its tree shape.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Uses precedence climbing to build assignment and binary-expression trees; assignment parses right-associatively. Precedence climbing recurses with `precedence + 1` for left-associative operators and the same precedence for right-associative `=`. The operator token span is attached to each constructed node.

**Possible weak points**: Supported operators and precedence are fixed by `BINARY_PRECEDENCE`; unsupported operators are left for a later parse error.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
