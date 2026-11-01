# `can_write_memory`

**Function essence:** Checks a guest-memory write and enforces the optional protected range.

Signature: `static bool can_write_memory(uint32_t address, uint32_t length)`

## Input / Output / Side-effects

- **Input:** A guest-memory start address and byte count for a write.
- **Output:** Returns true only when the whole write is within memory and not protected in development mode; otherwise false.
- **Side-effects:** Code path and state changes: Rejects ranges outside 4096 bytes; in development mode it also rejects overlap with the configured read-only interval and records the corresponding runtime fault.

## Detailed explanation

Rejects ranges outside 4096 bytes; in development mode it also rejects overlap with the configured read-only interval and records the corresponding runtime fault.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

A zero-length write at address 4096 is rejected by the address check.
