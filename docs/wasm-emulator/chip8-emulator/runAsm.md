# `runAsm`

## Essence
Assembles, validates, and loads assembly source, returning any error instead of throwing it.

## Contract
- **Input:** Assembly `source`; optional `{ profile = 'chip8' }`.
- **Output:** `null` on success, otherwise the caught error object.
- **Side effects:** On success resets the emulator, selects dev mode only for profile `chip8-dev`, loads segments, and logs success; on failure logs an assembler error.

## Internals
Calls `core.assemble(source)` and `core.validateSegments(segments)` before resetting. If both succeed, it resets, configures `setChip8DevMode(profile === 'chip8-dev')`, loads segments, and logs success. A `try/catch` returns the error on any failure in this sequence.

## Potential weak points
Assembly and segment-validation errors happen before `reset`, leaving the current machine state untouched. If a later reset or segment write throws, the machine may already be reset or partially loaded. Only the exact profile string `'chip8-dev'` enables dev mode; every other value selects regular mode.

## Glossary
- **Assemble:** translate assembly text into machine-code segments.
- **Segment:** a block of bytes with a starting memory address.
