# encodes register and immediate instruction forms

**Source:** `tests/assembler.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Runs a focused fixture for `encodes register and immediate instruction forms` and asserts the corresponding compiler, emulator or UI behavior.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `encodes register and immediate instruction forms`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `encodes register and immediate instruction forms` and runs in `tests/assembler.test.js` using its local fixture. It exercises `encoded()`. Its assertions use `assert.deepEqual`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The assertions establish this named behavior for the selected example, not a proof over all programs, inputs or runtime configurations.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
