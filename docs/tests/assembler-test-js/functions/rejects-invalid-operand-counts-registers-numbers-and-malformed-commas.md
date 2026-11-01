# rejects invalid operand counts, registers, numbers and malformed commas

**Source:** `tests/assembler.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Feeds the named invalid or faulting case through the implementation and asserts the expected diagnostic, trap or safe failure.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `rejects invalid operand counts, registers, numbers and malformed commas`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `rejects invalid operand counts, registers, numbers and malformed commas` and runs in `tests/assembler.test.js` using its local fixture. It exercises `asmToBin()`. Its assertions use `assert.throws`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

This case covers the named failure mode and assertion only; it does not prove that every malformed input maps to the same diagnostic or remains side-effect free.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
