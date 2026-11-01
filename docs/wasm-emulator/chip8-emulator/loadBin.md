# `loadBin`

## Essence
Passes assembly source to the core so it can assemble and load the resulting program.

## Contract
- **Input:** Assembly source text accepted by `core.loadBin`.
- **Output:** `undefined`; this method does not return the core call's result.
- **Side effects:** Calls `core.loadBin(source)`, which assembles and loads segments through the core wrapper.

## Internals
Calls `core.loadBin(source)` once. It does not reset emulator state, configure quirks, or catch errors; assembly and segment-validation failures propagate.

## Potential weak points
This method does not verify that `source` is text or that the injected core has `loadBin`; a missing method or invalid source therefore fails in the delegated call.

## Glossary
- **Delegate:** pass an operation to another object.
