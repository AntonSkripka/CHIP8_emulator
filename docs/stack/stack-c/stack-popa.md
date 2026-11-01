# `stack_popa`

**Function essence:** Restores 16 registers in reverse pop order.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_popa()`

## Input / Output / Side-effects

- **Input:** No parameters; writes all 16 registers through the connected register pointer.
- **Output:** Returns no value; restores 16 bytes only when the pointer is non-null and depth is at least 16; insufficient depth records underflow, while a null pointer returns silently.
- **Side-effects:** Code path and state changes: When at least 16 bytes are present, fills registers V15 down to V0 while popping; otherwise records underflow.

## Detailed explanation

When at least 16 bytes are present, fills registers V15 down to V0 while popping; otherwise records underflow.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

The routine cannot identify whether the top 16 bytes came from `stack_pusha`; any 16 bytes are assigned to V15 down to V0 in reverse pop order.
