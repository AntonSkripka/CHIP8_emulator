# `fat_get_directory_entry`

**Function essence:** Returns a directory entry by slot.

Signature: `FAT_DirEntry* fat_get_directory_entry(int index)`

## Input / Output / Side-effects

- **Input:** A zero-based directory slot index.
- **Output:** Returns a pointer to the slot, or NULL for an invalid index or uninitialized root directory.
- **Side-effects:** Code path and state changes: Returns NULL for invalid index or unavailable root pointer; otherwise returns the indexed entry regardless of is_used.

## Detailed explanation

Returns NULL for invalid index or unavailable root pointer; otherwise returns the indexed entry regardless of is_used.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

The returned pointer allows callers to alter on-disk metadata directly.
