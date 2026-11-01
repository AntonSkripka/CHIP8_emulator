# `get_disk_memory_ptr`

**Function essence:** Returns the backing disk array.

Signature: `EMSCRIPTEN_KEEPALIVE uint8_t* get_disk_memory_ptr()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns a pointer to the complete one-megabyte disk byte array.
- **Side-effects:** Code path and state changes: Returns a pointer to the static DISK_SIZE byte buffer.

## Detailed explanation

Returns a pointer to the static DISK_SIZE byte buffer.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Writes through this pointer bypass FAT validation and do not automatically set the dirty flag.
