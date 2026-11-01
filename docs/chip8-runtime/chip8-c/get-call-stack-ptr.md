# `get_call_stack_ptr`

**Function essence:** Returns the CHIP-8 call-stack depth.

Signature: `EMSCRIPTEN_KEEPALIVE uint8_t get_call_stack_ptr()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the current CHIP-8 call-stack depth (`sp`).
- **Side-effects:** Code path and state changes: Returns the instance's call-stack pointer, not the separate data-stack depth.

## Detailed explanation

Returns the instance's call-stack pointer, not the separate data-stack depth.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

This is the call-stack depth only; it does not report the separate data stack's `spd`.
