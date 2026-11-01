# `set_vfs_status`

**Function essence:** Writes the syscall result size and status register.

Signature: `static void set_vfs_status(Chip8VfsStatus status, uint8_t* request, uint32_t result_size)`

## Input / Output / Side-effects

- **Input:** A VFS status enum, writable request pointer, and result size.
- **Output:** Returns no value; stores result size in request bytes 7–10 and the status code in V0.
- **Side-effects:** Code path and state changes: Stores a 32-bit result size in request bytes 7–10 and the status enum in V0.

## Detailed explanation

Stores a 32-bit result size in request bytes 7–10 and the status enum in V0.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

Assumes the request pointer addresses a complete writable request.
