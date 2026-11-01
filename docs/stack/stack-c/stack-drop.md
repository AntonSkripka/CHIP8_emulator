# `stack_drop`

**Function essence:** Removes bytes from the current frame tail.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_drop(uint8_t amount)`

## Input / Output / Side-effects

- **Input:** A byte count to remove from the tail of the active frame.
- **Output:** Returns no value; removes and zeroes the requested tail bytes when they do not cross the frame's initial slot.
- **Side-effects:** Code path and state changes: Requires a valid frame and ensures the requested count does not cross the frame's initial slot; then lowers depth and zeroes removed bytes.

## Detailed explanation

Requires a valid frame and ensures the requested count does not cross the frame's initial slot; then lowers depth and zeroes removed bytes.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

Only the current frame's bytes can be dropped.
