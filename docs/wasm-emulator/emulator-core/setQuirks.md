# `setQuirks`

## Essence
Converts four supported quirk settings to strict booleans and passes them to Wasm.

## Contract
- **Input:** Optional object: `shiftQuirks`, `loadStoreQuirks`, `subEqualityQuirk`, `addIPreserveVFQuirk`; all default to `false`.
- **Output:** None.
- **Side effects:** Calls `_set_quirks` with four booleans.

## Internals
A local `enabled` check accepts only `true`, numeric `1`, or string `'1'`. Each option is converted independently in the listed order.

## Potential weak points
Other truthy values, including `'true'`, are treated as disabled. Passing `null` instead of an object causes parameter destructuring to fail.

## Glossary
- **Quirk:** an optional instruction-behavior variation.
