# `stack_pop`

**Function essence:** Pops one byte into a register.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_pop(uint8_t reg_index)`

## Input / Output / Side-effects

- **Input:** A V-register index to receive the top data-stack byte.
- **Output:** Returns no value; moves the top byte to the selected register when the pointer/index is valid; an empty stack records underflow, while invalid pointer/index returns silently.
- **Side-effects:** Code path and state changes: Validates pointer/index, then removes the top byte into the selected register or records underflow.

## Detailed explanation

Validates pointer/index, then removes the top byte into the selected register or records underflow.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

An invalid register index is silently ignored.
