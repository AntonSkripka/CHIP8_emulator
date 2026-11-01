# `getStackFault`

## Essence
Reads the optional stack fault code, defaulting to zero when unavailable.

## Contract
- **Input:** None.
- **Output:** `_get_stack_fault()` result, or `0` if that export is not a function.
- **Side effects:** May call the optional module export.

## Internals
Uses a type check before invoking the export.

## Potential weak points
When `_get_stack_fault` is absent, `0` is returned, so callers cannot distinguish an unsupported export from a reported zero fault code.

## Glossary
- **Fault code:** numeric value identifying a reported error condition.
