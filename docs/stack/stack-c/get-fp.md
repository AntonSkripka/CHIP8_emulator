# `get_fp`

**Function essence:** Returns the current frame pointer.

Signature: `EMSCRIPTEN_KEEPALIVE int get_fp(void)`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the current internal frame-pointer index.
- **Side-effects:** Code path and state changes: Returns the private frame pointer.

## Detailed explanation

Returns the private frame pointer.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

Zero indicates no active frame in the initialized state.
