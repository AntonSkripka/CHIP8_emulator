# `stack_enter`

**Function essence:** Creates a frame with saved parent pointer and zero local slot.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_enter(void)`

## Input / Output / Side-effects

- **Input:** No parameters; current depth and frame pointer are internal state.
- **Output:** Returns no value; when three slots fit, saves the parent pointer and creates a frame with one zero byte.
- **Side-effects:** Code path and state changes: Checks room for three bytes, stores the previous frame pointer as two bytes, advances depth, sets the new frame pointer, and appends a zero byte.

## Detailed explanation

Checks room for three bytes, stores the previous frame pointer as two bytes, advances depth, sets the new frame pointer, and appends a zero byte.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

A successful entry does not clear a previously recorded StackFault; the runtime continues to report that fault until the stack interface is reinitialized.
