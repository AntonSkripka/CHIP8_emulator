# `update_timers`

**Function essence:** Decrements nonzero delay and sound timers.

Signature: `EMSCRIPTEN_KEEPALIVE void update_timers()`

## Input / Output / Side-effects

- **Input:** No parameters; both timers are read from the global machine state.
- **Output:** Returns no value; decrements each timer by one only while that timer is nonzero.
- **Side-effects:** Code path and state changes: Each timer is reduced by one if it is greater than zero.

## Detailed explanation

Each timer is reduced by one if it is greater than zero.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

Timing frequency is controlled by the caller; this function has no clock pacing.
