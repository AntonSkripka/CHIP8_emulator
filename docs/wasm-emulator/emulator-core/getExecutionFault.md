# `getExecutionFault`

## Essence
Reads the execution fault code, falling back to the stack-fault API for older modules.

## Contract
- **Input:** None.
- **Output:** `_get_execution_fault()` result when available; otherwise `getStackFault()`.
- **Side effects:** Calls the available module export/query.

## Internals
Checks whether `_get_execution_fault` is a function. If so, calls it; if not, delegates to `getStackFault`.

## Potential weak points
For modules without the newer export, only the stack-fault code is visible to the caller.

## Glossary
- **Fallback:** alternate behavior used when the preferred option is unavailable.
