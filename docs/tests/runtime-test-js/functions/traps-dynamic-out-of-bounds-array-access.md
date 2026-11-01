# traps dynamic out-of-bounds array access

**Source:** `tests/runtime.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Feeds the named invalid or faulting case through the implementation and asserts the expected diagnostic, trap or safe failure.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `traps dynamic out-of-bounds array access`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `traps dynamic out-of-bounds array access` and runs in `tests/runtime.test.js` using its local fixture. It exercises `execute()`. Its assertions use `assert.equal`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

This case covers the named failure mode and assertion only; it does not prove that every malformed input maps to the same diagnostic or remains side-effect free.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
