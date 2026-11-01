# `math_rem`

**Function essence:** Computes the remainder of register division.

Signature: `void math_rem(uint8_t x, uint8_t y)`

## Input / Output / Side-effects

- **Input:** Two V register indices: dividend Vx and divisor Vy.
- **Output:** No C value; for nonzero Vy, Vx receives the integer remainder. Zero-divisor behavior is mode-dependent.
- **Side-effects:** Code path and state changes: For nonzero Vy, writes Vx%Vy to Vx and clears VF. With Vy zero, development mode records a fault; normal mode sets VF to 1 and Vx to zero.

## Detailed explanation

For nonzero Vy, writes Vx%Vy to Vx and clears VF. With Vy zero, development mode records a fault; normal mode sets VF to 1 and Vx to zero.

## Terminology

- **Vx / Vy:** The selected source and destination registers in the V array.
- **VF:** Register V15, used here for overflow or division status.
- **Integer division:** Division that discards any fractional part.

## Potential weak points

If `y` is VF and its original value is nonzero, clearing VF before `%` makes the divisor zero; this can invoke undefined C remainder behavior. If `x` is VF, the result write replaces the status flag.
