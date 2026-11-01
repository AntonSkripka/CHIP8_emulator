# compiles numeric formats, unary operators, arithmetic, and comparisons

**Source:** `tests/compiler.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Runs a focused fixture for `compiles numeric formats, unary operators, arithmetic, and comparisons` and asserts the corresponding compiler, emulator or UI behavior.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `compiles numeric formats, unary operators, arithmetic, and comparisons`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `compiles numeric formats, unary operators, arithmetic, and comparisons` and runs in `tests/compiler.test.js` using its local fixture. It exercises `compile()`. Its assertions use `assert.ok`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The assertions establish this named behavior for the selected example, not a proof over all programs, inputs or runtime configurations.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
