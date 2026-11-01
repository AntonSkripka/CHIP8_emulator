# `tests/assembler.test.js`

## Purpose

Assembly encoding, validation, labels, segments and profile behavior.

## Detailed flow

The suite calls `asmToBin` through `encoded` and checks bytecode for common and supported instruction forms, labels, CHIP-8-dev extensions, inline labels, `ORG`, `DB` and discontiguous segments. Negative cases assert source-located diagnostics for unknown mnemonics, malformed operands, duplicate labels/memory, and invalid addresses. Tests also verify segment validation occurs before memory writes and that the dev profile is opt-in. It uses `Chip8Core` to check profile behavior.

## Function/component pages

- [`encoded`](./functions/encoded.md)
- [`assembles common instructions and case-insensitive labels`](./functions/assembles-common-instructions-and-case-insensitive-labels.md)
- [`encodes register and immediate instruction forms`](./functions/encodes-register-and-immediate-instruction-forms.md)
- [`encodes every supported instruction instead of silently emitting zero`](./functions/encodes-every-supported-instruction-instead-of-silently-emitting-zero.md)
- [`encodes chip8-dev frame instructions as two-word extensions`](./functions/encodes-chip8-dev-frame-instructions-as-two-word-extensions.md)
- [`rejects classic skip instructions immediately before chip8-dev extensions`](./functions/rejects-classic-skip-instructions-immediately-before-chip8-dev-extensions.md)
- [`supports inline labels, ORG, DB and discontiguous segments`](./functions/supports-inline-labels-org-db-and-discontiguous-segments.md)
- [`reports unknown instructions with source line information`](./functions/reports-unknown-instructions-with-source-line-information.md)
- [`rejects invalid operand counts, registers, numbers and malformed commas`](./functions/rejects-invalid-operand-counts-registers-numbers-and-malformed-commas.md)
- [`rejects duplicate labels, duplicate memory and invalid addresses`](./functions/rejects-duplicate-labels-duplicate-memory-and-invalid-addresses.md)
- [`rejects non-string source`](./functions/rejects-non-string-source.md)
- [`validates every segment before writing any bytes to emulator memory`](./functions/validates-every-segment-before-writing-any-bytes-to-emulator-memory.md)
- [`enables chip8-dev mode only for an explicit profile selection`](./functions/enables-chip8-dev-mode-only-for-an-explicit-profile-selection.md)

## Dependencies and exact paths

- **File:** `tests/assembler.test.js`
- **Chapter:** [Tests](../README.md)
- **Direct dependencies/data:** The imports and input paths listed in this file's source; callers provide browser/runtime collaborators.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
