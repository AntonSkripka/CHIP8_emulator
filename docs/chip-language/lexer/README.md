# `web/src/compiler/lexer.js`

## Purpose

Scans source characters into tokens with source locations, recognizing comments, literals, identifiers, numbers, and symbols.

## Workflow

`tokenize` advances through the source while tracking one-based line and column. It skips whitespace and both comment forms, then recognizes byte character literals and escapes, identifiers, decimal/hex integers, paired operators, and single-character punctuation. Invalid characters, malformed literals, unterminated block comments, and out-of-range integers raise location-aware language errors. The local `advance`, `peek`, and `makeSpan` helpers centralize cursor and span handling.

## Function and method pages

- [makeSpan](./makeSpan.md)
- [tokenize](./tokenize.md)
- [tokenize — advance](./tokenize-advance.md)
- [tokenize — peek](./tokenize-peek.md)

## Terms

- **Token:** A classified unit of source text.
- **AST:** The tree produced by parsing source code.
- **Span:** A source coordinate carried through diagnostics and code generation.
