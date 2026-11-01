# `getPC`

## Essence
Reads the current program-counter address from Wasm.

## Contract
- **Input:** None.
- **Output:** `_get_pc()` result.
- **Side effects:** Calls the module export.

## Internals
Returns the module's current PC value unchanged.

## Potential weak points
Calls `_get_pc` without checking export availability or validating the returned address; an absent export throws and an out-of-range result is passed through unchanged.

## Glossary
- **Program counter (PC):** address used by the machine to track instruction execution.
