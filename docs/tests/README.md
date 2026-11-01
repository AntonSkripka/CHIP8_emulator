# Tests

## Purpose

Node.js test suites for assembly, CHIP Language compilation, emulator integration/runtime behavior, and source-file storage flows.

## Data and control flow

`npm test` runs the assembler, compiler, emulator-runtime and source-files suites using Node's built-in test runner. `npm run test:runtime` builds the WebAssembly module and executes `tests/runtime.test.js`. Helper functions construct encoded inputs, fake module/disk state or run compiled programs so assertions can verify boundaries and observable behavior.

## Covered files

- [tests/assembler.test.js](./assembler-test-js/README.md) — Assembly encoding, validation, labels, segments and profile behavior.
- [tests/compiler.test.js](./compiler-test-js/README.md) — Compiler syntax, types, modules, static data, code generation and VFS lowering.
- [tests/emulator-runtime.test.js](./emulator-runtime-test-js/README.md) — Integration of compiler output/source maps/runtime faults with emulator orchestration.
- [tests/runtime.test.js](./runtime-test-js/README.md) — Execution semantics, memory safety, stacks, modules and VFS syscall behavior.
- [tests/source-files.test.js](./source-files-test-js/README.md) — Saving and loading CHIP Language source files via virtual-disk UI callbacks.

## Glossary

- **Assertion:** A condition that must hold or the test fails.
- **Harness:** A controlled test environment that substitutes dependencies.
- **Source map:** Metadata mapping generated instructions back to source locations.
