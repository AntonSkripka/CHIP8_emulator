# supports importing every module export and rejects unselected or missing exports

**Source:** `tests/compiler.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Exercises `supports importing every module export and rejects unselected or missing exports` with an injected module/source fixture and checks the resulting import, export, resolution or source-map behavior.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `supports importing every module export and rejects unselected or missing exports`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `supports importing every module export and rejects unselected or missing exports` and runs in `tests/compiler.test.js` using its local fixture. It exercises `compile()`. Its assertions use `assert.doesNotThrow`, `assert.throws`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

This case covers the named failure mode and assertion only; it does not prove that every malformed input maps to the same diagnostic or remains side-effect free.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
