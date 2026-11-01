# analyzeStatement

**Summary:** Analyze one statement.

**Source:** `web/src/compiler/semantic.js` (line 192)

## Contract

- **Input:** `statement`: AST statement; `fn`: current function; `functions`: visible callable map; `scopes`: active lexical scopes.
- **Output:** No value; checks the statement and annotates referenced AST nodes.
- **Side effects:** Annotates bindings/types through recursive expression analysis; invalid statements throw.

## Implementation

Checks statement-specific declarations, conditions, return types, and expression-statement validity.

**Possible weak points:** Unsupported statement kinds throw `LANG009`; local allocation is limited to `127` bytes per function.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
