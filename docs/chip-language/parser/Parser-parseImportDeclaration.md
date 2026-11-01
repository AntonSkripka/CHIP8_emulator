# Parser — parseImportDeclaration

**Summary:** Parse import declaration.

**Source:** `web/src/compiler/parser.js` (line 67)

## Contract

- **Input:** None; reads and consumes an `import` declaration from the parser's current token position.
- **Output:** Array of import records `{ moduleName, name, span }`; `name` is null for whole-module imports.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Parses comma-separated module or module.member entries terminated by a semicolon.

**Possible weak points:** Imports support module names and optional `module.name` selections separated by commas; aliases and relative paths are not parsed.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
