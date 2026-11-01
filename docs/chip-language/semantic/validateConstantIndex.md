# validateConstantIndex

**Summary:** Check static array index.

**Source:** `web/src/compiler/semantic.js` (line 403)

## Contract

- **Input:** `index`: zero-based operand position in the parsed argument list; `target`: array binding whose bounds or address are used by the generated check
- **Output:** No value for a valid/static-unprovable index; an out-of-range constant throws `LANG002`.
- **Side effects:** Reads the constant expression/target size; throws `LANG002` only for a known out-of-range constant.

## Implementation

Rejects a compile-time-known index outside the declared static object size.

**Possible weak points:** Only constant numeric/character indexes can be rejected at compile time; dynamic indexes are checked in generated code.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
