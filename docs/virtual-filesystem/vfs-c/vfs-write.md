# `vfs_write`

**Function essence:** Creates or replaces a named file.

Signature: `EMSCRIPTEN_KEEPALIVE int vfs_write(const char* name, const uint8_t* data, uint32_t size)`

## Input / Output / Side-effects

- **Input:** Filename, non-null data pointer, and nonzero file byte count.
- **Output:** Returns 0 on success, -1 for invalid input or allocation failure, and -2 when no directory slot is available.
- **Side-effects:** Code path and state changes: Validates name/data/nonzero size, finds an existing or free slot, writes new data first, frees the old chain after allocation succeeds, updates the directory entry, marks dirty, and returns a status code.

## Detailed explanation

Validates name/data/nonzero size, finds an existing or free slot, writes new data first, frees the old chain after allocation succeeds, updates the directory entry, marks dirty, and returns a status code.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Replacement allocates the new chain before freeing the old one, so it can fail for lack of temporary free clusters even when the old file’s clusters would be enough after deletion.
