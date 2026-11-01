# rejectRecursion

**Summary:** Detect recursive calls.

**Source:** `web/src/compiler/semantic.js` (line 503)

## Contract

- **Input:** `functions`: function AST records considered by the analysis; `callGraph`: map from function symbols to their call-site lists
- **Output:** No value for an acyclic call graph; a cycle throws `LANG009`.
- **Side effects:** Reads the call graph and throws on a cycle; it does not rewrite it.

## Implementation

Depth-first walks the call graph with active/done sets and reports a cycle as `LANG009`. A depth-first traversal uses `active` to detect a back edge and `done` to avoid revisiting completed functions. The detected cycle is reported at a call-site span.

**Possible weak points**: Any direct or indirect call cycle is rejected; there is no recursion-depth limit or runtime recursion support.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
