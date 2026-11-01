# `get_stack_value`

**Function essence:** Reads a stack slot by index.

Signature: `EMSCRIPTEN_KEEPALIVE uint8_t get_stack_value(int index)`

## Input / Output / Side-effects

- **Input:** A zero-based index into the currently occupied stack bytes.
- **Output:** Returns the indexed stack byte, or zero when the index is negative or not below the current depth.
- **Side-effects:** Code path and state changes: Returns zero for an index outside [0, depth); otherwise returns the byte at that slot.

## Detailed explanation

Returns zero for an index outside [0, depth); otherwise returns the byte at that slot.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

Zero cannot be distinguished from an invalid-index result.
