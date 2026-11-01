# `get_draw_flag`

**Function essence:** Reports whether a draw update was requested.

Signature: `EMSCRIPTEN_KEEPALIVE bool get_draw_flag()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the current draw_flag boolean without clearing it.
- **Side-effects:** Code path and state changes: Returns the current draw flag; it does not clear it.

## Detailed explanation

Returns the current draw flag; it does not clear it.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The getter is non-consuming: repeated calls keep returning true until `clear_draw_flag` resets the shared flag.
