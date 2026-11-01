# `render_sprite`

**Function essence:** XOR-draws an 8-pixel-wide sprite and sets collision in VF.

Signature: `void render_sprite(Chip8 *cpu, uint8_t x, uint8_t y, uint8_t n)`

## Input / Output / Side-effects

- **Input:** A Chip8 state pointer, X/Y register indices, and sprite height in bytes.
- **Output:** Returns no value; changes display pixels, VF collision state, and draw_flag.
- **Side-effects:** Code path and state changes: Reads n bytes from I, wraps coordinates at screen edges, toggles lit pixels, sets VF when a lit pixel is erased, and raises the draw flag.

## Detailed explanation

Reads n bytes from I, wraps coordinates at screen edges, toggles lit pixels, sets VF when a lit pixel is erased, and raises the draw flag.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

Memory is checked only for sprite bytes when n>0; x and y register indices are not checked, and n=0 still clears VF and raises draw_flag.
