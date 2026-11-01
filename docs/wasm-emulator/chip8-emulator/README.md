# `Chip8Emulator`

**Source:** `web/src/core/chip8_emulator.js`

## Purpose

Coordinates the WebAssembly core, display, monitor, memory map, and scheduler to load and run CHIP-8 or compiled CHIP Language programs.

## Operation

Construction stores the injected collaborators and callbacks, chooses a default instruction rate, loads the built-in Pong ROM, and refreshes the stack UI. `start` schedules recurring frames. Each frame runs as many instructions as the configured rate allows, checks core faults and compiled-program exit, updates the stack UI, advances the 60 Hz timers, renders/debug-draws, and requests another frame. Loading methods configure the core and transfer ROM bytes or validated assembled segments. Language compilation uses the optional module resolver and associates generated code with source locations.

## Methods

See the individual method pages in this directory, including private-by-convention `findSourceLocation`.

## Terms

- **Core:** the WebAssembly-backed CHIP-8 machine.
- **ROM:** a byte sequence loaded as a program.
- **Tick rate:** the configured number of CHIP-8 instruction cycles per display frame, as used in the scheduling interval.
- **Source map:** compiler metadata that associates generated addresses with original source positions.
