# `init`

**Function essence:** Resets machine state and installs the built-in font.

Signature: `EMSCRIPTEN_KEEPALIVE void init()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns no value; resets machine state, sets PC to 0x200, and copies the font to memory bytes 0–79.
- **Side-effects:** Code path and state changes: Zeroes the global Chip8 object and protected-range state, sets PC to 0x200, then copies 80 font bytes to memory start.

## Detailed explanation

Zeroes the global Chip8 object and protected-range state, sets PC to 0x200, then copies 80 font bytes to memory start.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

Does not initialize the separate data stack or format the virtual disk.
