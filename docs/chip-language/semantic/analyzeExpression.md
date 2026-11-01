# analyzeExpression

**Summary:** Analyze typed expression.

**Source:** `web/src/compiler/semantic.js` (line 248)

## Contract

- **Input:** `expression`: AST expression; `fn`: current function metadata; `functions`: visible function map; `scopes`: active lexical scopes.
- **Output:** Expression type string (`u8`, `bool`, or a function return type); annotates expression/bindings or throws.
- **Side effects:** Adds type and binding/function metadata to expression nodes; invalid expressions throw.

## Implementation

Assigns types and bindings while checking literals, names, arrays, calls, assignments, unary and binary operands. The switch annotates each expression with `type` and, where needed, `binding` or `function`. It resolves array names in scopes/data symbols, checks array mutability and constant indexes, verifies call arity/types, and pushes validated call nodes to `fn.callSites`.

**Possible weak points**: Values are limited to `u8`/`bool`; arrays are references only as parameters, static-data reads require indexing, and each expression kind has explicit type rules.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
