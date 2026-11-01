# `stack_adjust`

**Function essence:** Reserves and zero-fills frame bytes.

Signature: `EMSCRIPTEN_KEEPALIVE void stack_adjust(uint8_t amount)`

## Input / Output / Side-effects

- **Input:** A byte count to append as zero-initialized storage in the active frame.
- **Output:** Returns no value; appends and zeroes the requested number of bytes in a valid frame.
- **Side-effects:** Code path and state changes: Requires a structurally present frame; checks remaining capacity, zeroes the appended amount, and advances depth.

## Detailed explanation

Requires a structurally present frame; checks remaining capacity, zeroes the appended amount, and advances depth.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

An amount of zero is accepted after frame validation.
