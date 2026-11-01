# `src/chip8.h` — Source file

**Source path:** `src/chip8.h`

## Responsibility

Defines the CHIP-8 state layout, memory/display constants, fault and VFS status codes, and the runtime API declarations. The file defines types/constants and declarations; function behavior is specified by the implementation pages linked below.

## Functions in this file

- [`get_execution_fault`](../chip8-c/get-execution-fault.md)
- [`set_chip8_dev_mode`](../chip8-c/set-chip8-dev-mode.md)
- [`set_memory_readonly_range`](../chip8-c/set-memory-readonly-range.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
