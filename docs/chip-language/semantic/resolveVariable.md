# resolveVariable

**Summary:** Find variable binding.

**Source:** `web/src/compiler/semantic.js` (line 476)

## Contract

- **Input:** `scopes`: ordered stack of lexical-scope maps, from outermost to innermost; `name`: identifier or symbol name looked up in the current module or scope
- **Output:** Nearest matching binding in the scope stack, or `undefined`.
- **Side effects:** Reads scopes from innermost to outermost; no binding is changed.

## Implementation

Searches lexical scopes from innermost to outermost and returns the first matching binding.

**Possible weak points:** Scopes are searched from innermost to outermost; a matching name in a nearer scope hides outer declarations.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
