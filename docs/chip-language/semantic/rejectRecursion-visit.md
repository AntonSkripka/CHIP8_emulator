# rejectRecursion — visit

**Summary:** Visit call-graph node.

**Source:** `web/src/compiler/semantic.js` (line 507)

## Contract

- **Input:** `name`: identifier or symbol name looked up in the current module or scope
- **Output:** No value; completes a DFS visit or throws `LANG009` when it reaches an active node.
- **Side effects:** Updates traversal-local active/done sets; throws when a cycle is reached.

## Implementation

Marks a function as active during depth-first traversal, follows its call sites, throws `LANG009` when it encounters an active function, then moves completed nodes into the visited set.

**Possible weak points:** The DFS treats a node already in the active set as a cycle; it assumes every traversed call target has a graph entry.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
