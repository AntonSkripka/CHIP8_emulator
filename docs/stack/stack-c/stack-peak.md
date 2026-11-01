# `stack_peak`

**Function essence:** Copies the top stack byte without removing it.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_peak(uint8_t reg_index)`

## Input / Output / Side-effects

- **Input:** A V-register index to receive the current top byte without popping it.
- **Output:** Returns no value; copies the top byte when the pointer/index is valid without changing depth; an empty stack records underflow, while invalid pointer/index returns silently.
- **Side-effects:** Code path and state changes: Writes the top byte to the selected register; validates pointer/index and records underflow on empty stack.

## Detailed explanation

Writes the top byte to the selected register; validates pointer/index and records underflow on empty stack.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

Invalid indices are ignored without a fault.
