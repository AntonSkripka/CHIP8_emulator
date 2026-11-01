# `writeFile`

## Essence
Attempts to save nonempty bytes under a valid filename in the virtual disk.

## Contract
- **Input:** Valid `filename`; nonempty `Uint8Array` `fileBytes`.
- **Output:** `true` only when `_vfs_write` returns `0`; otherwise `false`.
- **Side effects:** Logs outcomes, allocates/copies filename and data into Wasm heap, calls `_vfs_write`, and frees allocations in `finally`.

## Internals
Rejects invalid names, non-byte-array/empty contents, and contents exceeding the computed file limit. It allocates a NUL-terminated name and data buffer, checks the data allocation bounds, copies bytes, and calls `_vfs_write(namePtr, dataPtr, length)`. Return `0` logs success; `-1` logs insufficient space; `-2` logs the 64-file limit; other values return false without a specific message. Allocated pointers are freed on every exit path.

## Potential weak points
The file-size limit is computed from fixed disk/layout constants in this file. Any unlisted Wasm result is reported only as `false`; allocation and export errors may throw.

## Glossary
- **VFS write:** Wasm operation that stores a named file.
- **File limit:** the module-reported behavior described here as a maximum of 64 files.
