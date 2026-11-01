# `get_display_ptr`

**Function essence:** Returns the display buffer address.

Signature: `EMSCRIPTEN_KEEPALIVE void *get_display_ptr()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns a pointer to the global 64×32 display array.
- **Side-effects:** Code path and state changes: Returns the address of the global display array for host-side access.

## Detailed explanation

Returns the address of the global display array for host-side access.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The pointer is valid only while the module's memory remains available.
