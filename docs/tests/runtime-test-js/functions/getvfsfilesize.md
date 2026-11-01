# `getVfsFileSize`

**Source:** `tests/runtime.test.js` · **Declaration:** `getVfsFileSize(filename)`

## Essence

Exercises `getVfsFileSize` against the runtime memory/VFS fixture and asserts the resulting bytes, size, stack state or fault.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `getVfsFileSize`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `getVfsFileSize` and runs in `tests/runtime.test.js` using its local fixture. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The tested addresses, sizes and bytes are bounded fixture values; this case alone does not exhaust address-space limits or all allocation patterns.

## Glossary

- **Fixture:** Controlled state used by a test.
- **WASM heap:** Linear memory exposed by the WebAssembly module.
- **VFS:** The emulator's virtual filesystem.
