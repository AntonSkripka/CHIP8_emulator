# `load_data_at`

**Function essence:** Writes one byte into memory.

Signature: `EMSCRIPTEN_KEEPALIVE void load_data_at(uint16_t addr, uint8_t data)`

## Input / Output / Side-effects

- **Input:** A guest-memory address and one byte to store.
- **Output:** Returns no value; writes one memory byte when the address is below MEMORY_SIZE.
- **Side-effects:** Code path and state changes: Stores the value only when the address is below MEMORY_SIZE.

## Detailed explanation

Stores the value only when the address is below MEMORY_SIZE.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

It bypasses protected-range checks and silently ignores out-of-range addresses.
