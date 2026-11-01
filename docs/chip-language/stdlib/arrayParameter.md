# arrayParameter

**Summary:** Describe array parameter.

**Source:** `web/src/compiler/stdlib.js` (line 1)

## Contract

- **Input:** `name`: identifier or symbol name looked up in the current module or scope; `minLength`: minimum array length stored on the parameter descriptor
- **Output:** Parameter descriptor object with u8 array type, mutability, and optional length bounds.
- **Side effects:** Returns a new array-parameter descriptor without changing shared state.

## Implementation

Creates a u8 array-parameter descriptor with mutability and optional minimum/maximum length.

**Possible weak points**: Length bounds are metadata only; omitted `minLength`/`maxLength` remain undefined and are not inferred here.

## Terms

A **built-in module** is compiler-provided rather than loaded from a `.chip` file. A **parameter descriptor** records type, mutability, and optional array-length constraints.
