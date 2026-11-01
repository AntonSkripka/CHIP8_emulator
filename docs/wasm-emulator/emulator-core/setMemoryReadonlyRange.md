# `setMemoryReadonlyRange`

## Essence
Validates and marks a memory range read-only through a supported Wasm export.

## Contract
- **Input:** Integer `start` and `size`, both non-negative.
- **Output:** None on success.
- **Side effects:** Calls `_set_memory_readonly_range(start, size)`.
- **Errors:** `Error` if unsupported; `TypeError` for invalid integers/negative values; `RangeError` unless Wasm returns `1`.

## Internals
Checks the export first, validates both inputs with `Number.isInteger`, then treats any result other than `1` as an invalid range and includes the start address and size in the error.

## Potential weak points
JavaScript checks only that `start` and `size` are non-negative integers; it does not cap `start + size` at the CHIP-8 memory size. Such out-of-range values are passed to Wasm and rejected only if its export returns a value other than `1`. A zero-sized range passes the JavaScript checks.

## Glossary
- **Read-only range:** memory interval that the module is asked to protect from writes.
