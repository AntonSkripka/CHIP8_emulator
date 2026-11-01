# `math_mul`

**Function essence:** Multiplies two 8-bit registers.

Signature: `void math_mul(uint8_t x, uint8_t y)`

## Input / Output / Side-effects

- **Input:** Two indices into the global V register array: multiplicand Vx and multiplier Vy.
- **Output:** No C value; writes the low product byte to Vx and the overflow indicator to VF.
- **Side-effects:** Code path and state changes: Computes a 16-bit product, writes its low byte to Vx, and writes 1 to VF when the product exceeds 255, otherwise 0.

## Detailed explanation

Computes a 16-bit product, writes its low byte to Vx, and writes 1 to VF when the product exceeds 255, otherwise 0.

## Terminology

- **Vx / Vy:** The selected source and destination registers in the V array.
- **VF:** Register V15, used here for overflow or division status.
- **Integer division:** Division that discards any fractional part.

## Potential weak points

If `x` is VF, the result write overwrites the overflow flag. Register indices are also unchecked; direct calls outside 0–15 access beyond V.
