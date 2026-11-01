# `handle_vfs_syscall`

**Function essence:** Validates and dispatches a guest VFS request.

Signature: `static void handle_vfs_syscall(uint8_t operation)`

## Input / Output / Side-effects

- **Input:** The extension opcode's operation byte; request address comes from the machine's I register.
- **Output:** Returns no value; reports outcomes in the request and V0 and may transfer file bytes between guest memory and VFS.
- **Side-effects:** Code path and state changes: Reads the request at I, validates filename and optional buffer ranges, copies data through temporary host allocations, calls the VFS API, and writes status/result size. Read results are copied to guest memory only after a successful VFS read.

## Detailed explanation

Reads the request at I, validates filename and optional buffer ranges, copies data through temporary host allocations, calls the VFS API, and writes status/result size. Read results are copied to guest memory only after a successful VFS read.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

A zero-sized VFS file is treated as not found because size zero is also the API's missing-file result; syscall memory faults can leave the request status untouched.
