# `can_read_memory`

**Function essence:** Checks that a guest-memory read fits.

Signature: `static bool can_read_memory(uint32_t address, uint32_t length)`

## Input / Output / Side-effects

- **Input:** A guest-memory start address and byte count for a read.
- **Output:** Returns true when the range passes its bounds check; false for an out-of-bounds nonempty range.
- **Side-effects:** Code path and state changes: Uses subtraction-based bounds checking for nonzero lengths and records a memory-bounds fault on failure.

## Detailed explanation

Uses subtraction-based bounds checking for nonzero lengths and records a memory-bounds fault on failure.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

A zero-length range is accepted regardless of address.
