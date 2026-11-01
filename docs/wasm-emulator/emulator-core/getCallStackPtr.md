# `getCallStackPtr`

## Essence
Reads the core's call-stack pointer.

## Contract
- **Input:** None.
- **Output:** `_get_call_stack_ptr()` result.
- **Side effects:** Calls the module export.

## Internals
Returns the raw exported value.

## Potential weak points
Calls `_get_call_stack_ptr` without checking whether the export exists; it returns any pointer value from the module unchanged.

## Glossary
- **Call stack:** stored return locations used when subroutines call other routines.
