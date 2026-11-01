# `load_opcode_at`

**Function essence:** Writes a two-byte opcode into memory.

Signature: `EMSCRIPTEN_KEEPALIVE void load_opcode_at(uint16_t addr, uint16_t opcode)`

## Input / Output / Side-effects

- **Input:** A guest-memory address and a 16-bit opcode.
- **Output:** Returns no value; writes the opcode's high and low bytes only if both addresses fit in memory.
- **Side-effects:** Code path and state changes: For an address below MEMORY_SIZE-1, stores the high then low byte.

## Detailed explanation

For an address below MEMORY_SIZE-1, stores the high then low byte.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

It does not enforce the read-only interval or set a fault on an invalid address.
