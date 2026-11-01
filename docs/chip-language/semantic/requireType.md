# requireType

**Summary:** Require expected type.

**Source:** `web/src/compiler/semantic.js` (line 484)

## Contract

- **Input:** `actual`: type inferred from the expression; `expected`: required language type; `node`: call-graph node or AST node being visited; `context`: diagnostic context describing the type requirement
- **Output:** No value for matching types; mismatch throws `LANG002`.
- **Side effects:** Compares type strings; mismatch throws `LANG002`.

## Implementation

Compares actual and expected types and reports a contextual `LANG002` diagnostic on mismatch.

**Possible weak points:** Types must match exactly; there is no implicit conversion between `u8` and `bool`.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
