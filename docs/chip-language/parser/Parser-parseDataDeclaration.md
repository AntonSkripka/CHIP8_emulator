# Parser — parseDataDeclaration

**Summary:** Parse static data object.

**Source:** `web/src/compiler/parser.js` (line 85)

## Contract

- **Input:** `exported`: whether the preceding `pub` modifier exports this read-only data declaration.
- **Output:** DataDeclaration AST node with section, u8 type, fixed size, initializers or null, and export flag.
- **Side effects:** Advances the parser cursor while constructing AST nodes; syntax errors throw.

## Implementation

Parses data/rodata/bss u8 storage, fixed size, initializer rules, and export status into a declaration node.

**Possible weak points**: Only `u8` objects with fixed numeric sizes are parsed; BSS has no initializer, while data/rodata require byte/character initializer lists.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
