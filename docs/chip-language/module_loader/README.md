# `web/src/compiler/module_loader.js`

## Purpose

Parses the root unit, resolves and decodes imported modules, detects cycles, and combines declarations.

## Workflow

The loader creates the root parse unit, merges repeated import declarations, skips loading built-ins, and resolves other imports through the provided callback as `<module>.chip`. It validates the virtual-disk filename byte limit, rejects cycles and missing resolvers/sources, decodes UTF-8 bytes strictly, and gathers functions and data declarations with module-qualified symbol names.

## Function and method pages

- [createUnit](./createUnit.md)
- [decodeModuleSource](./decodeModuleSource.md)
- [loadImports](./loadImports.md)
- [parseProgramWithModules](./parseProgramWithModules.md)

## Terms

- **Token:** A classified unit of source text.
- **AST:** The tree produced by parsing source code.
- **Span:** A source coordinate carried through diagnostics and code generation.
