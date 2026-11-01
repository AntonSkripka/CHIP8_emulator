# `set_quirks`

**Function essence:** Sets four instruction-variant switches.

Signature: `EMSCRIPTEN_KEEPALIVE void set_quirks( bool shift_quirks, bool load_store_quirks, bool sub_equality_quirk, bool add_i_preserve_vf_quirk)`

## Input / Output / Side-effects

- **Input:** Four booleans selecting shift, load/store, subtraction-equality, and I-add behavior.
- **Output:** Returns no value; replaces the four quirk flags in the global Chip8 state.
- **Side-effects:** Code path and state changes: Copies the supplied shift, load/store, subtraction-equality, and I-add behavior flags into the instance.

## Detailed explanation

Copies the supplied shift, load/store, subtraction-equality, and I-add behavior flags into the instance.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The switches are not validated or derived from a named profile.
