# `get_pc`

**Function essence:** Returns the current program counter.

Signature: `EMSCRIPTEN_KEEPALIVE uint16_t get_pc()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the current 16-bit program counter.
- **Side-effects:** Code path and state changes: Returns the instance's 16-bit PC without changing it.

## Detailed explanation

Returns the instance's 16-bit PC without changing it.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The value can point outside valid memory if state was externally altered.
