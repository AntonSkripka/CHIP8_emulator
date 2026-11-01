# `getVRegsPtr`

## Essence
Returns the cached address of the V-register block.

## Contract
- **Input:** None.
- **Output:** `vRegsPtr`, or `null` before initialization.
- **Side effects:** None.

## Internals
Returns the pointer populated by `init`.

## Potential weak points
Before `init`, the cached value is `null`; the method neither initializes the core nor fetches the register pointer.

## Glossary
- **V registers:** CHIP-8's general-purpose register block.
