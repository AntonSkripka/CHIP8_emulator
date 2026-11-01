# `loadRom`

## Essence
Configures the core and copies ROM bytes into CHIP-8 program memory.

## Contract
- **Input:** `rom`, expected to provide `forEach`; optional `options` used for quirks and `tickrate`.
- **Output:** None.
- **Side effects:** Clears compiled-program tracking, resumes execution, disables CHIP-8 development mode, sets quirks and instruction rate, and writes bytes starting at address `0x200`.

## Internals
Resets `lastCompiledProgram` and `executionStopped`, disables dev mode, and passes `options` to `core.setQuirks`. It converts `options.tickrate` to a number; a finite positive value is floored and clamped from 1 through 10,000, otherwise 20 is used. Each ROM byte is written with `core.loadDataAt(0x200 + index, byte)`.

## Potential weak points
The method does not validate the ROM type, byte values, or total address range before writing. It does not initialize or clear the rest of core memory.

## Glossary
- **Quirk:** a selectable behavior variant for CHIP-8 instructions.
- **Clamp:** limit a value to a minimum and maximum.
