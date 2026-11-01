# saves CHIP Language files with the .chip extension

**Source:** `tests/source-files.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Exercises `saves CHIP Language files with the .chip extension` against the runtime memory/VFS fixture and asserts the resulting bytes, size, stack state or fault.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `saves CHIP Language files with the .chip extension`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `saves CHIP Language files with the .chip extension` and runs in `tests/source-files.test.js` using its local fixture. It exercises `saveAssembly()`. Its assertions use `assert.fail`, `assert.deepEqual`, `assert.equal`, `assert.match`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The tested addresses, sizes and bytes are bounded fixture values; this case alone does not exhaust address-space limits or all allocation patterns.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
