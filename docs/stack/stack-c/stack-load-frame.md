# `stack_load_frame`

**Function essence:** Loads a frame byte into V0.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_load_frame(int8_t offset)`

## Input / Output / Side-effects

- **Input:** A signed frame-relative byte offset; the loaded byte is written to V0.
- **Output:** Returns no value; copies a resolved frame byte into V0; on failure V0 is unchanged.
- **Side-effects:** Code path and state changes: Requires a connected register array, resolves the signed offset, and copies a valid byte into register zero.

## Detailed explanation

Requires a connected register array, resolves the signed offset, and copies a valid byte into register zero.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

A missing register pointer records INVALID_FRAME.
