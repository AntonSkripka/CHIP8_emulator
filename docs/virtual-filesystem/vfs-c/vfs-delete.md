# `vfs_delete`

**Function essence:** Deletes a named file and frees its data chain.

Signature: `EMSCRIPTEN_KEEPALIVE int vfs_delete(const char* name)`

## Input / Output / Side-effects

- **Input:** A filename used to locate a directory entry.
- **Output:** Returns 0 after deleting a found entry, or -1 when no entry matches.
- **Side-effects:** Code path and state changes: Finds the entry, frees its clusters, clears metadata/name, marks disk dirty, and returns 0; missing name returns -1.

## Detailed explanation

Finds the entry, frees its clusters, clears metadata/name, marks disk dirty, and returns 0; missing name returns -1.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

It trusts the entry's start cluster and chain contents.
