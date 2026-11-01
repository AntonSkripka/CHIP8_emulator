# `getStackValue`

## Essence
Reads one stack entry by index.

## Contract
- **Input:** Index of the stack value to query, passed unchanged to `_get_stack_value`.
- **Output:** The raw value returned by `_get_stack_value(index)`, with no wrapper-side transformation.
- **Side effects:** Calls the module export.

## Internals
Calls the module's `_get_stack_value(index)` export and returns its value unchanged.

## Potential weak points
JavaScript does not check whether `index` refers to an existing stack entry; it passes even an out-of-range value to `_get_stack_value`.

## Glossary
- **Stack entry:** one stored value in the machine's stack.
