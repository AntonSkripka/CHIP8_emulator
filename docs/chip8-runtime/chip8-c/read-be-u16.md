# `read_be_u16`

**Function essence:** Reads a 16-bit big-endian value.

Signature: `static uint16_t read_be_u16(const uint8_t* bytes)`

## Input / Output / Side-effects

- **Input:** A pointer to two bytes stored most-significant byte first.
- **Output:** Returns the 16-bit value formed with the first byte as the high byte.
- **Side-effects:** Code path and state changes: Combines two consecutive bytes with the first byte as the high half.

## Detailed explanation

Combines two consecutive bytes with the first byte as the high half.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The helper has no pointer or length check and reads exactly `bytes[0]` and `bytes[1]`; its syscall caller first validates the complete 11-byte request.
