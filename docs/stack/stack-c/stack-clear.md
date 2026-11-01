# `stack_clear`

**Function essence:** Clears stack bytes and frame state.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_clear()`

## Input / Output / Side-effects

- **Input:** No parameters; the connected register pointer is used as a gate for clearing.
- **Output:** Returns no value; with a non-null register pointer, zeroes stack storage and resets depth/frame pointer; without one, it returns without clearing anything.
- **Side-effects:** Code path and state changes: With a connected register pointer, zeroes the whole backing array and resets depth/frame pointer.

## Detailed explanation

With a connected register pointer, zeroes the whole backing array and resets depth/frame pointer.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

It does not clear an already recorded stack fault.
