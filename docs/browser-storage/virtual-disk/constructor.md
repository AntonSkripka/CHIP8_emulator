# `constructor`

## Essence
Stores the Wasm module and optional logger for disk operations.

## Contract
- **Input:** `wasmModule`; optional `{ logger = console }`.
- **Output:** A `VirtualDisk` instance.
- **Side effects:** None.

## Internals
Assigns both values to instance properties; memory allocation and file operations are deferred to later calls.

## Potential weak points
Construction succeeds even if `_malloc`, `HEAPU8`, or a VFS export is missing; the first file operation that uses the missing member then throws.

## Glossary
- **Logger:** object used to report messages and errors.
