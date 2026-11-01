# `set_key`

**Function essence:** Updates one keypad key when its index is valid.

Signature: `EMSCRIPTEN_KEEPALIVE void set_key(int key, bool is_pressed)`

## Input / Output / Side-effects

- **Input:** A keypad index and its pressed/released boolean state.
- **Output:** Returns no value; updates the selected keypad byte only for indices 0–15.
- **Side-effects:** Code path and state changes: Accepts indices 0 through 15 and stores the pressed state in the keypad array.

## Detailed explanation

Accepts indices 0 through 15 and stores the pressed state in the keypad array.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

Invalid indices are silently ignored.
