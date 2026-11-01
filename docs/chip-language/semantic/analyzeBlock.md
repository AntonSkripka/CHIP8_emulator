# analyzeBlock

**Summary:** Analyze lexical block.

**Source:** `web/src/compiler/semantic.js` (line 184)

## Contract

- **Input:** `block`: block AST node whose statements are analyzed or emitted; `fn`: current function record, including parameters, return type, and local metadata; `functions`: function AST records considered by the analysis; `scopes`: ordered stack of lexical-scope maps, from outermost to innermost; `reuseScope`: flag indicating whether the block uses its caller's current scope
- **Output:** No value; checks and annotates statements in the block.
- **Side effects:** Pushes/pops lexical scope unless `reuseScope` is true; annotates declarations and bindings.

## Implementation

Creates or reuses a lexical scope, analyzes statements in order, and removes block-local bindings on exit.

**Possible weak points:** Scopes are pushed and popped only when `reuseScope` is false; callers must preserve the matching scope-stack discipline.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
