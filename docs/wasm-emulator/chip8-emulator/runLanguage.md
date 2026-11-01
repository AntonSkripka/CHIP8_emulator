# `runLanguage`

## Essence
Compiles CHIP Language source and installs its ROM and read-only data into the core.

## Contract
- **Input:** Source text; optional `{ sourceName }`.
- **Output:** `null` on success, otherwise the caught error object.
- **Side effects:** Compiles using `moduleResolver`, resets the emulator, configures CHIP-8 quirks/dev mode, writes ROM bytes, marks the read-only section, stores compiler output, and logs status.

## Internals
Calls `compile` with `resolveModule: this.moduleResolver` and `sourceName`, then logs the program object. It resets, applies default quirks, enables CHIP-8 dev mode, writes each compiled byte at `program.baseAddress + index`, and configures the read-only interval from `program.sections.rodata`. It stores the complete program for exit/source mapping. Errors from compilation or later setup are caught, logged, and returned.

## Potential weak points
The compiled program is logged through global `console.log`, not the injected logger. Compilation errors occur before reset; an error during reset, byte loading, or read-only-range setup is caught after state changes may have begun, so the prior program is not restored.

## Glossary
- **Read-only:** memory range designated as not writable by the emulated program.
- **Source name:** optional name identifying the input source.
