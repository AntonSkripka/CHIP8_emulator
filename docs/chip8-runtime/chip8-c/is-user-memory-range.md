# `is_user_memory_range`

**Function essence:** Restricts syscall buffers to guest program memory.

Signature: `static bool is_user_memory_range(uint32_t address, uint32_t length)`

## Input / Output / Side-effects

- **Input:** A guest-memory start address and byte count to validate as user memory.
- **Output:** Returns true for a nonempty in-bounds range beginning at 0x200 or later; otherwise false.
- **Side-effects:** Code path and state changes: Requires a nonempty range starting at or above 0x200 and wholly within memory; failure records a bounds fault.

## Detailed explanation

Requires a nonempty range starting at or above 0x200 and wholly within memory; failure records a bounds fault.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

The rule excludes the interpreter's lower memory area by design.
