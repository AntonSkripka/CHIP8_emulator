# `ranges_overlap`

**Function essence:** Tests whether two half-open ranges intersect.

Signature: `static bool ranges_overlap(uint32_t first_address, uint32_t first_length, uint32_t second_address, uint32_t second_length)`

## Input / Output / Side-effects

- **Input:** Start addresses and lengths for two half-open memory ranges.
- **Output:** Returns true when the two ranges intersect, otherwise false.
- **Side-effects:** Code path and state changes: Compares each start against the other range's end; it is used to forbid syscall request/buffer aliasing.

## Detailed explanation

Compares each start against the other range's end; it is used to forbid syscall request/buffer aliasing.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

End-address addition can wrap if given arbitrary oversized values.
