# `get_v_regs_ptr`

**Function essence:** Returns the register bank address.

Signature: `EMSCRIPTEN_KEEPALIVE void *get_v_regs_ptr()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns a pointer to the 16-byte V register array.
- **Side-effects:** Code path and state changes: Returns the address of V for host and stack-interface access.

## Detailed explanation

Returns the address of V for host and stack-interface access.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The returned pointer exposes mutable machine state.
