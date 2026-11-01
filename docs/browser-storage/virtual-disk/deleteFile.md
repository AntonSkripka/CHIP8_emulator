# `deleteFile`

## Essence
Attempts to delete a file by name and converts errors into `false`.

## Contract
- **Input:** `filename`.
- **Output:** `true` if `_vfs_delete` returns `0`; otherwise `false`.
- **Side effects:** Allocates a filename in Wasm, calls the delete export, frees memory, and logs caught exceptions.

## Internals
Invalid names return false. For valid names it allocates a NUL-terminated string, calls `_vfs_delete`, and checks for result zero. Exceptions are logged and converted to false; allocation is freed in `finally`.

## Potential weak points
Nonzero delete result codes are not individually explained or logged.

## Glossary
- **Delete:** remove a named file from the virtual disk.
