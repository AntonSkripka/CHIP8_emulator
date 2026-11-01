# executes VFS size, read, write, and delete syscalls through bounded requests

**Source:** `tests/runtime.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Exercises `executes VFS size, read, write, and delete syscalls through bounded requests` against the runtime memory/VFS fixture and asserts the resulting bytes, size, stack state or fault.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `executes VFS size, read, write, and delete syscalls through bounded requests`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `executes VFS size, read, write, and delete syscalls through bounded requests` and runs in `tests/runtime.test.js` using its local fixture. It exercises `executeVfsSyscall()`. Its assertions use `assert.equal`, `assert.deepEqual`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The tested addresses, sizes and bytes are bounded fixture values; this case alone does not exhaust address-space limits or all allocation patterns.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
