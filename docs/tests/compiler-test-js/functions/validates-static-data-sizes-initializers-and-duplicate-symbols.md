# validates static data sizes, initializers, and duplicate symbols

**Source:** `tests/compiler.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Exercises `validates static data sizes, initializers, and duplicate symbols` against the runtime memory/VFS fixture and asserts the resulting bytes, size, stack state or fault.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `validates static data sizes, initializers, and duplicate symbols`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `validates static data sizes, initializers, and duplicate symbols` and runs in `tests/compiler.test.js` using its local fixture. It exercises `compile()`. Its assertions use `assert.throws`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The tested addresses, sizes and bytes are bounded fixture values; this case alone does not exhaust address-space limits or all allocation patterns.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
