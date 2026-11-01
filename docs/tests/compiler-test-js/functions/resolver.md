# `resolver`

**Source:** `tests/compiler.test.js` · **Declaration:** `resolver()`

## Essence

Runs a focused fixture for `resolver` and asserts the corresponding compiler, emulator or UI behavior.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `resolver`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `resolver` and runs in `tests/compiler.test.js` using its local fixture. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The fixture covers the module shape and import/export combination in this case; other combinations and resolver implementations are outside this assertion.

## Glossary

- **Resolver:** A callback that returns source bytes for a requested module.
- **Export:** A module declaration made available to importers.
