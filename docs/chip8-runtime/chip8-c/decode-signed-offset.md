# `decode_signed_offset`

**Function essence:** Converts an encoded byte to a signed frame offset.

Signature: `static int8_t decode_signed_offset(uint16_t extension)`

## Input / Output / Side-effects

- **Input:** The 16-bit extension word; only its low byte is interpreted.
- **Output:** Returns the signed 8-bit interpretation of the extension word's low byte.
- **Side-effects:** Code path and state changes: Uses the low byte and subtracts 256 for values at or above 0x80, yielding the signed 8-bit interpretation.

## Detailed explanation

Uses the low byte and subtracts 256 for values at or above 0x80, yielding the signed 8-bit interpretation.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

Only the low eight bits matter.
