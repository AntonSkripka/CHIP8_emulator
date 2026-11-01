# `vfs_read`

**Function essence:** Reads a named file into a caller buffer.

Signature: `EMSCRIPTEN_KEEPALIVE int vfs_read(const char* name, uint8_t* out_buffer, uint32_t capacity)`

## Input / Output / Side-effects

- **Input:** Filename, destination buffer, and maximum writable capacity.
- **Output:** Returns 0 when FAT data is copied successfully, otherwise -1.
- **Side-effects:** Code path and state changes: Rejects missing/empty files, null buffer, insufficient capacity, or oversized metadata; delegates traversal to fat_read_data and returns 0 on success or -1 on failure.

## Detailed explanation

Rejects missing/empty files, null buffer, insufficient capacity, or oversized metadata; delegates traversal to fat_read_data and returns 0 on success or -1 on failure.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Empty and missing files both fail with -1; if FAT detects a broken later cluster, earlier bytes may already have been copied to `out_buffer`. The VFS size ceiling is also one cluster higher than the allocator’s maximum.
