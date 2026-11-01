# Parser — parseBlock

**Summary:** Parse statement block.

**Source:** `web/src/compiler/parser.js` (line 195)

## Contract

- **Input:** None; parses a braced block beginning at the parser's current token.
- **Output:** Block AST node containing the parsed statements.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Reads statements between braces and returns a Block node; missing closing braces produce a parser error.

**Possible weak points:** The method reads until `}` or EOF and then requires `}`; an unterminated block is a syntax error with no recovery.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
