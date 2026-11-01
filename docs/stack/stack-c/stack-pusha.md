# `stack_pusha`

**Function essence:** Pushes all 16 registers in ascending order.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_pusha()`

## Input / Output / Side-effects

- **Input:** No parameters; reads all 16 registers through the connected register pointer.
- **Output:** Returns no value; pushes V0–V15 only when the pointer is non-null and 16 slots are free; a full stack records overflow, while a null pointer returns silently.
- **Side-effects:** Code path and state changes: Requires a register pointer and at least 16 free bytes; otherwise records overflow without partial push.

## Detailed explanation

Requires a register pointer and at least 16 free bytes; otherwise records overflow without partial push.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

The stack stores values only, not a paired register snapshot marker.
