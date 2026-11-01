# `stack_size`

**Function essence:** Stores stack depth in a register.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_size(uint8_t reg_index)`

## Input / Output / Side-effects

- **Input:** A V-register index to receive the current byte depth.
- **Output:** Returns no value; writes depth to the selected register only when the pointer is non-null and index is below 16; otherwise it returns silently.
- **Side-effects:** Code path and state changes: Writes the current byte depth to the selected register when the pointer and index are valid.

## Detailed explanation

Writes the current byte depth to the selected register when the pointer and index are valid.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

Depth is stored in one byte; current capacity is 1024.
