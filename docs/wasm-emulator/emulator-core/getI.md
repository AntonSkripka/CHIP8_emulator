# `getI`

## Essence
Reads the current CHIP-8 index register from Wasm.

## Contract
- **Input:** None.
- **Output:** `_get_i()` result.
- **Side effects:** Calls the module export.

## Internals
Returns the index value unchanged.

## Potential weak points
If `_get_i` is absent, the direct export call throws. A returned index value is otherwise exposed unchanged, with no address-range check in this wrapper.

## Glossary
- **I register:** CHIP-8 register commonly used to hold a memory address.
