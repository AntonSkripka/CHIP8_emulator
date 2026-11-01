# analyzeArrayArgument

**Summary:** Check array argument.

**Source:** `web/src/compiler/semantic.js` (line 412)

## Contract

- **Input:** `argument`: call argument AST node and its corresponding parameter descriptor; `parameter`: built-in parameter descriptor with array and length constraints; `fn`: current function record, including parameters, return type, and local metadata; `scopes`: ordered stack of lexical-scope maps, from outermost to innermost
- **Output:** No value; records `arrayBinding` on a valid argument, otherwise throws a semantic error.
- **Side effects:** Sets `argument.arrayBinding` for a valid static/parameter array argument.

## Implementation

Checks that an argument denotes an array accepted by the parameter and records its array binding.

**Possible weak points:** The argument must resolve to an array parameter or static array; scalar bindings and unresolved names are rejected.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
