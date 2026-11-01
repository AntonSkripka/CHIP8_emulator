# `getVRegistersView`

## Essence
Returns a JavaScript byte view of the 16 V registers, or `null` before initialization.

## Contract
- **Input:** None.
- **Output:** `Uint8Array` of length 16 over the module heap, or `null`.
- **Side effects:** None beyond creating a view.

## Internals
Uses `vRegsPtr` as the start and the current `HEAPU8.buffer` as backing memory.

## Potential weak points
The view shares memory with Wasm, so edits through it change the machine registers immediately. Before `init` the method returns `null`; invalid pointer bounds after initialization make view construction throw.

## Glossary
- **Shared view:** array object that refers to existing memory rather than copying it.
