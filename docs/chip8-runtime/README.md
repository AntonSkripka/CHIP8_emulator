# CHIP-8 Runtime

## Purpose

Owns the CHIP-8 machine state, instruction execution, runtime controls, and the development-mode VFS syscall boundary.

## Operation and data flow

`init` prepares the global `instance`; a caller loads bytes and steps the machine with `step`. The runtime updates display, keypad, timers, registers, and memory. Extended arithmetic calls `math_core`; stack opcodes call `stack`; the development syscall delegates file operations to `vfs`.

## Source files

- [`src/chip8.c`](./chip8-c/README.md) — Owns the global CPU instance, decodes and executes opcodes, renders sprites, checks memory, manages runtime settings, and implements the guest VFS request protocol.
- [`src/chip8.h`](./chip8-h/README.md) — Defines the CHIP-8 state layout, memory/display constants, fault and VFS status codes, and the runtime API declarations.

## Terminology

- **Machine state:** The registers and arrays that represent the emulated computer.
- **Instruction:** A two-byte command read from emulated memory.
- **Quirk:** A switch that selects one of several CHIP-8 behavior variants.
- **Fault:** A recorded execution error that can stop later steps.
