# `get_stack_fault`

**Function essence:** Returns the stored stack fault code.

Signature: `EMSCRIPTEN_KEEPALIVE int get_stack_fault(void)`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the stored StackFault enum value as an int.
- **Side-effects:** Code path and state changes: Returns the fault enum as an integer without clearing it.

## Detailed explanation

Returns the fault enum as an integer without clearing it.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

Fault state persists until stack initialization; stack_clear does not clear it.
