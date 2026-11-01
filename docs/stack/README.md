# Data Stack

## Purpose

Provides a separate 1024-byte data stack, register save/restore operations, and a frame-based extension used by development opcodes.

## Operation and data flow

`chip8.c` calls the stack API for extension opcodes. `init_stack_interface` receives the register-array pointer; stack operations then transfer bytes between that array and private stack storage. Stack faults are surfaced by the runtime's `get_execution_fault`.

## Source files

- [`src/stack.c`](./stack-c/README.md) — Implements private stack storage, register save/restore, frame operations, and stack status queries.
- [`src/stack.h`](./stack-h/README.md) — Defines stack capacity and fault codes, and declares the stack interface.

## Terminology

- **Data stack:** A last-in, first-out area separate from the CHIP-8 call stack.
- **Stack pointer:** An index marking the next free stack byte.
- **Frame pointer:** An index used to address a function-like data-stack frame.
- **Underflow/overflow:** Trying to remove from an empty stack or add beyond its capacity.
