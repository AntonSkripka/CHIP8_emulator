# `write_be_u32`

**Function essence:** Stores a 32-bit value in big-endian order.

Signature: `static void write_be_u32(uint8_t* bytes, uint32_t value)`

## Input / Output / Side-effects

- **Input:** A destination for four bytes and the 32-bit value to encode.
- **Output:** Returns no value; writes `value` to four destination bytes, most-significant byte first.
- **Side-effects:** Code path and state changes: Writes the most significant byte first into four consecutive bytes.

## Detailed explanation

Writes the most significant byte first into four consecutive bytes.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The helper writes four consecutive bytes without a size check; the current syscall path passes an already validated 11-byte request and writes at offset 7.
