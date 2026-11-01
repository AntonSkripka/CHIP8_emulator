# `stack_push`

**Function essence:** Pushes one register value.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_push(uint8_t reg_index)`

## Input / Output / Side-effects

- **Input:** A V-register index to copy onto the data stack.
- **Output:** Returns no value; appends the selected register byte only with a non-null register pointer and index below 16; a full stack records overflow, while invalid pointer/index returns silently.
- **Side-effects:** Code path and state changes: Ignores missing register pointer or index >=16; otherwise pushes when capacity allows, or records overflow.

## Detailed explanation

Ignores missing register pointer or index >=16; otherwise pushes when capacity allows, or records overflow.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

Invalid arguments do not set a stack fault.
