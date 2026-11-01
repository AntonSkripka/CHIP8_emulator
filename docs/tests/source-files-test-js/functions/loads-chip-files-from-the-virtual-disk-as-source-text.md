# loads .chip files from the virtual disk as source text

**Source:** `tests/source-files.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Exercises `loads .chip files from the virtual disk as source text` against the runtime memory/VFS fixture and asserts the resulting bytes, size, stack state or fault.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `loads .chip files from the virtual disk as source text`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `loads .chip files from the virtual disk as source text` and runs in `tests/source-files.test.js` using its local fixture. It exercises `handleFileAction()`. Its assertions use `assert.fail`, `assert.deepEqual`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The tested addresses, sizes and bytes are bounded fixture values; this case alone does not exhaust address-space limits or all allocation patterns.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
