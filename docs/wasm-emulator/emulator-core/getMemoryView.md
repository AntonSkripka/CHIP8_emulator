# `getMemoryView`

## Essence
Returns a byte view of the 4096-byte core memory region, or `null` before initialization.

## Contract
- **Input:** None.
- **Output:** `Uint8Array` of length 4096 over the module heap, or `null`.
- **Side effects:** None beyond creating a view.

## Internals
Constructs the view at cached `memoryPtr` over current `HEAPU8.buffer`.

## Potential weak points
Before `init` the method returns `null`; afterward, an invalid pointer or insufficient heap range makes the `Uint8Array` constructor throw.

## Glossary
- **4 KiB memory:** a region containing 4096 bytes.
