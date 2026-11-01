# Math Operations

## Purpose

Implements the multiply, divide, and remainder extensions over the CHIP-8 register bank.

## Operation and data flow

`chip8.c` decodes the project's arithmetic extension opcodes and calls these helpers. They read and write `instance.V` directly; division-by-zero behavior depends on development mode.

## Source files

- [`src/math_core.c`](./math-core-c/README.md) — Implements three register arithmetic helpers and accesses the shared runtime instance.
- [`src/math_core.h`](./math-core-h/README.md) — Declares the arithmetic helper API and includes the CHIP-8 state type definitions.

## Terminology

- **Register:** One byte of working state in the emulated CPU.
- **Remainder:** What remains after integer division.
- **Development mode:** A runtime mode in which selected invalid operations set a fault.
