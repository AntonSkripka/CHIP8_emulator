# alwaysReturns

**Summary:** Check return coverage.

**Source:** `web/src/compiler/semantic.js` (line 490)

## Contract

- **Input:** `statement`: statement AST node being analyzed or emitted
- **Output:** Boolean indicating whether every path through the supported statement shape returns.
- **Side effects:** Inspects statement structure without modifying nodes.

## Implementation

Determines whether a return statement is guaranteed by a return node, a returning block, or an if with both returning arms.

**Possible weak points**: Recognizes direct returns, returning blocks, and `if` with both branches returning; it does not prove that loops terminate.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
