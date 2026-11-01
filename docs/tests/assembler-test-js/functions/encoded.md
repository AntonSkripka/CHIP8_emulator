# `encoded`

**Source:** `tests/assembler.test.js` · **Declaration:** `encoded(source)`

## Essence

Runs a focused fixture for `encoded` and asserts the corresponding compiler, emulator or UI behavior.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `encoded`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `encoded` and runs in `tests/assembler.test.js` using its local fixture. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The assertions establish this named behavior for the selected example, not a proof over all programs, inputs or runtime configurations.

## Glossary

- **Fixture:** Controlled state used by a test.
- **WASM heap:** Linear memory exposed by the WebAssembly module.
- **VFS:** The emulator's virtual filesystem.
