# `_allocateString`

## Essence
Allocates Wasm memory and writes a UTF-8 filename followed by a zero terminator.

## Contract
- **Input:** `str`, expected to be a string.
- **Output:** Pointer to the allocated bytes.
- **Side effects:** Calls Wasm `_malloc`, writes into `HEAPU8`, and may call `_free`.
- **Errors:** Throws if allocation is zero/out of bounds or if writing fails.

## Internals
Encodes the string, allocates byte length plus one, checks the pointer and heap bounds, copies bytes, appends byte zero, and returns the pointer. Invalid allocation is freed when nonzero; an exception while writing also frees the allocation before rethrowing.

## Potential weak points
This helper accepts any string and performs no filename-policy checks: it can allocate a string longer than 17 UTF-8 bytes or one containing NUL. The file-operation methods validate filenames before calling it.

## Glossary
- **Pointer:** address returned by the module allocator.
- **Terminator:** final zero byte marking the end of encoded text.
