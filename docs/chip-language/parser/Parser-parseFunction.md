# Parser — parseFunction

**Summary:** Parse function declaration.

**Source:** `web/src/compiler/parser.js` (line 144)

## Contract

- **Input:** `exported`: whether the preceding top-level `pub` modifier exports this function.
- **Output:** Function AST node containing name, return type, parameters, body, and export flag.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Parses function visibility, optional u8 return type, scalar/array parameters, and a block body.

**Possible weak points**: Parameters are only scalar `u8` or `u8[]`; `mut` is permitted only on array parameters, and the body must be a block.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
