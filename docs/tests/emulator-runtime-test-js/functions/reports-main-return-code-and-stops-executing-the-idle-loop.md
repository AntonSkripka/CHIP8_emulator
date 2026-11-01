# reports main return code and stops executing the idle loop

**Source:** `tests/emulator-runtime.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Feeds the named invalid or faulting case through the implementation and asserts the expected diagnostic, trap or safe failure.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `reports main return code and stops executing the idle loop`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `reports main return code and stops executing the idle loop` and runs in `tests/emulator-runtime.test.js` using its local fixture. It exercises `createHarness()`. Its assertions use `assert.equal`, `assert.deepEqual`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

This case covers the named failure mode and assertion only; it does not prove that every malformed input maps to the same diagnostic or remains side-effect free.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
