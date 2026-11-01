# `getFilesList`

## Essence
Reads available directory entries and returns valid nonempty files as `{ name, size }` records.

## Contract
- **Input:** None.
- **Output:** Array of objects with `name` and `size`.
- **Side effects:** Allocates an 18-byte Wasm buffer, queries FAT exports, and frees the buffer.
- **Errors:** Throws when allocation fails or a directory entry cannot be read.

## Internals
Reads `_fat_get_max_files()`, allocates space for an 18-byte name, and iterates indices below that maximum. A negative name result throws; result `1` means an entry is present. It decodes the 18-byte slice up to the first NUL, obtains the entry size, and includes only sizes greater than zero and at most `MAX_FILE_SIZE`.

## Potential weak points
Names returned by the module are decoded without applying `isValidFilename`; the resulting list can therefore include a name that this class's write/delete methods would reject. Entries with size zero or above `MAX_FILE_SIZE` are silently omitted.

## Glossary
- **Directory entry:** one item in a file listing.
- **TextDecoder:** converts encoded bytes into a JavaScript string.
