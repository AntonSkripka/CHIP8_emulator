# isBuiltinModule

**Summary:** Check built-in module name.

**Source:** `web/src/compiler/stdlib.js` (line 60)

## Contract

- **Input:** `name`: identifier or symbol name looked up in the current module or scope
- **Output:** Boolean; true only when the name is `disk`.
- **Side effects:** Compares the supplied module name with `disk` and changes no state.

## Implementation

Returns whether the requested name equals the built-in module name `disk`.

**Possible weak points:** The built-in module name, operation numbers, and parameter layout are hard-coded and must stay in sync with the runtime VFS ABI.

## Terms

A **built-in module** is compiler-provided rather than loaded from a `.chip` file. A **parameter descriptor** records type, mutability, and optional array-length constraints.
