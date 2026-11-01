# Parser — parseProgram

**Summary:** Parse top-level declarations.

**Source:** `web/src/compiler/parser.js` (line 42)

## Contract

- **Input:** None; consumes top-level declarations from the current token position through EOF.
- **Output:** Program AST node with imports, functions, and data declarations.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Reads imports, data declarations, public declarations, and functions until EOF, returning a Program node.

**Possible weak points:** Top-level parsing accepts imports, data sections, and functions; `pub` is limited to functions and `rodata` declarations.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
