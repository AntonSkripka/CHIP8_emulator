# `getMemoryPtr`

## Essence
Returns the cached base address of core memory.

## Contract
- **Input:** None.
- **Output:** `memoryPtr`, or `null` before initialization.
- **Side effects:** None.

## Internals
Returns the pointer last captured by `init`.

## Potential weak points
Before `init`, the cached value is `null`; this getter does not request or validate the memory pointer itself.

## Glossary
- **Base address:** first numbered position of a memory region.
