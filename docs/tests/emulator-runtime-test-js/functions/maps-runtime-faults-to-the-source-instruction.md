# maps runtime faults to the source instruction

**Source:** `tests/emulator-runtime.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Feeds the named invalid or faulting case through the implementation and asserts the expected diagnostic, trap or safe failure.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `maps runtime faults to the source instruction`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The test compiles a CHIP Language program whose `main` returns `1 / 0`, locates source-map entry line 3/column 22, sets the fake PC to that instruction, makes `step()` report fault 5, and invokes one captured frame. It asserts the callback receives fault 5, that PC and source position match, and that execution stops.

## Potential weak points

This case covers the named failure mode and assertion only; it does not prove that every malformed input maps to the same diagnostic or remains side-effect free.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
