# `stack_load_frame_u16`

**Function essence:** Loads two adjacent frame bytes as a big-endian word.

Signature: `EMSCRIPTEN_KEEPALIVE uint16_t stack_load_frame_u16(int8_t offset)`

## Input / Output / Side-effects

- **Input:** A signed frame-relative offset of the first of two bytes.
- **Output:** Returns two adjacent frame bytes as a big-endian uint16_t; returns zero when address resolution or the second-byte check fails.
- **Side-effects:** Code path and state changes: Resolves the offset, verifies the following byte is also in the active stack range, and returns high byte then low byte; errors return zero.

## Detailed explanation

Resolves the offset, verifies the following byte is also in the active stack range, and returns high byte then low byte; errors return zero.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

The zero error result is ambiguous with valid stored zero.
