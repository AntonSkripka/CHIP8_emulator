# `get_mem_ptr`

**Function essence:** Returns the emulated memory address.

Signature: `EMSCRIPTEN_KEEPALIVE void* get_mem_ptr()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns a pointer to the 4096-byte emulated memory array.
- **Side-effects:** Code path and state changes: Returns the global memory array as a host-visible pointer.

## Detailed explanation

Returns the global memory array as a host-visible pointer.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

External writes can bypass runtime bounds and protection checks.
