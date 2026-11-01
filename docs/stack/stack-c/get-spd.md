# `get_spd`

**Function essence:** Returns the current stack depth.

Signature: `EMSCRIPTEN_KEEPALIVE int get_spd(void)`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the current occupied data-stack byte count.
- **Side-effects:** Code path and state changes: Returns the private depth counter in bytes.

## Detailed explanation

Returns the private depth counter in bytes.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

The result is a raw count, not free capacity.
