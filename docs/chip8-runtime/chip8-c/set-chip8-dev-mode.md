# `set_chip8_dev_mode`

**Function essence:** Enables or disables development behavior.

Signature: `EMSCRIPTEN_KEEPALIVE void set_chip8_dev_mode(bool enabled)`

## Input / Output / Side-effects

- **Input:** Whether development mode should be enabled.
- **Output:** Returns no value; stores the mode and disables the protected-range flag when mode is turned off.
- **Side-effects:** Code path and state changes: Stores the mode; disabling it also disables the protected-memory interval.

## Detailed explanation

Stores the mode; disabling it also disables the protected-memory interval.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

Re-enabling does not restore the prior protected interval.
