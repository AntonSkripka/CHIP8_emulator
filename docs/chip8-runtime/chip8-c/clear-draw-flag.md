# `clear_draw_flag`

**Function essence:** Clears the draw-update flag.

Signature: `EMSCRIPTEN_KEEPALIVE void clear_draw_flag()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns no value; sets draw_flag to false without clearing display pixels.
- **Side-effects:** Code path and state changes: Sets the instance draw flag to false.

## Detailed explanation

Sets the instance draw flag to false.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

It does not alter display pixels.
