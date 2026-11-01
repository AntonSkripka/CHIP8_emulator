# `web/src/compiler/errors.js`

## Purpose

Defines the location-bearing language diagnostic and a helper that builds it from a token, node, or span.

## Workflow

`LanguageError` formats a location in the message and retains structured `code`, `line`, `column`, and `span` fields; `languageError` normalizes a node or token to its span before constructing the error.

## Function and method pages

- [LanguageError — constructor](./LanguageError-constructor.md)
- [languageError](./languageError.md)

## Terms

- **Token:** A classified unit of source text.
- **AST:** The tree produced by parsing source code.
- **Span:** A source coordinate carried through diagnostics and code generation.
