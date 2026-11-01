# constantU8Value

**Summary:** Evaluate constant byte.

**Source:** `web/src/compiler/semantic.js` (line 446)

## Contract

- **Input:** `expression`: expression AST node being checked or compiled
- **Output:** Constant byte value when evaluable, otherwise `null`.
- **Side effects:** Evaluates by reading the expression tree; does not mutate it.

## Implementation

Returns a constant byte value when an expression is statically evaluable, or `null` otherwise.

**Possible weak points:** Only expressions recognized by its constant-folding cases yield a value; other expressions return `null` and need runtime checks.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
