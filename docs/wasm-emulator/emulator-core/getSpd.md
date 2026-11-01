# `getSpd`

## Essence
Reads the stack-depth value exposed by the core.

## Contract
- **Input:** None.
- **Output:** `_get_spd()` result.
- **Side effects:** Calls the module export.

## Internals
Forwards the stack-depth query without conversion.

## Potential weak points
Calls `_get_spd` without a local availability check. If `hasStackSupport()` is false, calling this method can throw because the export is absent.

## Glossary
- **Stack depth:** number of active entries in a stack.
