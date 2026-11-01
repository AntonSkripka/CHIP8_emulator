# `web/src/compiler/stdlib.js`

## Purpose

Describes the built-in `disk` module and its four VFS operations and array parameter constraints.

## Workflow

`arrayParameter` builds the common parameter descriptor. `createBuiltinModules` returns a new map containing the `disk` module and its operation IDs, result-parameter indices, types, and size constraints. `isBuiltinModule` recognizes the built-in module name used by the loader.

## Function and method pages

- [arrayParameter](./arrayParameter.md)
- [createBuiltinModules](./createBuiltinModules.md)
- [isBuiltinModule](./isBuiltinModule.md)

## Terms

- **Token:** A classified unit of source text.
- **AST:** The tree produced by parsing source code.
- **Span:** A source coordinate carried through diagnostics and code generation.
