# `readFile`

## Essence
Returns an independent byte copy of a named file, or `null` when it is invalid, missing, oversized, or unreadable.

## Contract
- **Input:** `filename`.
- **Output:** New `Uint8Array` on successful read; otherwise `null`; allocation failures throw.
- **Side effects:** Allocates filename/output buffers in Wasm, calls size/read exports, and frees buffers in `finally`; may log a missing-file warning.

## Internals
Invalid names return `null`. It gets file size; zero or a value above `MAX_FILE_SIZE` logs a warning and returns `null`. It allocates an output buffer, checks bounds, calls `_vfs_read`, and returns `new Uint8Array(fileData)` only when the result is `0`. The copy is made before the Wasm allocation is freed.

## Potential weak points
Zero-length files are treated as not found. Nonzero read error codes return `null` without logging. The code trusts the size export to describe readable data.

## Glossary
- **Independent copy:** byte array that remains valid after temporary Wasm memory is freed.
