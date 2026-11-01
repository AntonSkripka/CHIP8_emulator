# createBuiltinModules

**Summary:** Create built-in modules.

**Source:** `web/src/compiler/stdlib.js` (line 12)

## Contract

- **Input:** None; creates a fresh built-in module map.
- **Output:** New Map containing the `disk` module and its built-in function descriptors.
- **Side effects:** Creates a fresh map containing the built-in `disk` functions and descriptors.

## Implementation

Builds the `disk` built-in module map containing `file_size`, `read_file`, `write_file`, and `delete_file`.

**Possible weak points**: The built-in table is hard-coded to module `disk` and its four operations; changes must match compiler lowering and runtime ABI.

## Terms

A **built-in module** is compiler-provided rather than loaded from a `.chip` file. A **parameter descriptor** records type, mutability, and optional array-length constraints.
