# `stack_leave`

**Function essence:** Removes the current frame and restores its parent.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_leave(void)`

## Input / Output / Side-effects

- **Input:** No parameters; current frame metadata is read from the data stack.
- **Output:** Returns no value; for a valid current frame, restores its saved parent pointer and removes the frame from depth.
- **Side-effects:** Code path and state changes: Validates frame/depth, reconstructs the saved parent pointer from the two bytes before the frame, then moves depth back and restores the pointer.

## Detailed explanation

Validates frame/depth, reconstructs the saved parent pointer from the two bytes before the frame, then moves depth back and restores the pointer.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

It validates that the parent is not above the saved-pointer location, but does not check every possible corrupted chain invariant.
