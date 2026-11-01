# `vfs_get_file_size`

**Function essence:** Returns a named file's recorded byte size.

Signature: `EMSCRIPTEN_KEEPALIVE uint32_t vfs_get_file_size(const char* name)`

## Input / Output / Side-effects

- **Input:** A filename used to locate a directory entry.
- **Output:** Returns the recorded size when an entry is found and within the limit; otherwise returns zero.
- **Side-effects:** Code path and state changes: Finds the entry and returns its size only when it is within the implementation's maximum; zero means absent, invalid-size, or empty.

## Detailed explanation

Finds the entry and returns its size only when it is within the implementation's maximum; zero means absent, invalid-size, or empty.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Zero conflates a missing entry, an empty file, and invalid oversized metadata; its size ceiling is one 512-byte cluster higher than the allocator’s maximum because FAT reserves two cluster indices.
