# `hasStackSupport`

## Essence
Reports whether the module exposes the stack-depth function.

## Contract
- **Input:** None.
- **Output:** Boolean: whether `_get_spd` is a function.
- **Side effects:** None.

## Internals
Uses `typeof` to test for that single export.

## Potential weak points
The result reflects only whether `_get_spd` is a function; it does not check `_get_fp`, `_get_stack_fault`, `_get_stack_value`, or `_get_call_stack_ptr`.

## Glossary
- **Capability check:** test for whether a feature is available.
