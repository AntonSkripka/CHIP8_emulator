# rejects duplicate labels, duplicate memory and invalid addresses

**Source:** `tests/assembler.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Exercises `rejects duplicate labels, duplicate memory and invalid addresses` against the runtime memory/VFS fixture and asserts the resulting bytes, size, stack state or fault.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `rejects duplicate labels, duplicate memory and invalid addresses`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `rejects duplicate labels, duplicate memory and invalid addresses` and runs in `tests/assembler.test.js` using its local fixture. It exercises `asmToBin()`. Its assertions use `assert.throws`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

This case covers the named failure mode and assertion only; it does not prove that every malformed input maps to the same diagnostic or remains side-effect free.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
