# `executeVfsSyscall`

**Source:** `tests/runtime.test.js` · **Declaration:** `executeVfsSyscall(operation, { requestAddress = 0x300, filename = 'syscall-test.bin', filenameBytes = encode(filename), filenameAddress = 0x320, bufferAddress = 0x340, bufferLength = 0, bufferBytes = new Uint8Array(), readonlyRange = null } = {})`

## Essence

Exercises `executeVfsSyscall` against the runtime memory/VFS fixture and asserts the resulting bytes, size, stack state or fault.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `executeVfsSyscall`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `executeVfsSyscall` and runs in `tests/runtime.test.js` using its local fixture. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The tested addresses, sizes and bytes are bounded fixture values; this case alone does not exhaust address-space limits or all allocation patterns.

## Glossary

- **Fixture:** Controlled state used by a test.
- **WASM heap:** Linear memory exposed by the WebAssembly module.
- **VFS:** The emulator's virtual filesystem.
