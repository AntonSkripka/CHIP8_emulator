# `get_i`

**Function essence:** Returns the index register.

Signature: `EMSCRIPTEN_KEEPALIVE uint16_t get_i()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the current 16-bit I register value.
- **Side-effects:** Code path and state changes: Returns I without modifying machine state.

## Detailed explanation

Returns I without modifying machine state.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The accessor does not validate I as an address; it returns the stored register value even if it is outside emulated memory.
