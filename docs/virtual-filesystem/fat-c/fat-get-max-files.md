# `fat_get_max_files`

**Function essence:** Returns the fixed directory capacity.

Signature: `EMSCRIPTEN_KEEPALIVE int fat_get_max_files(void)`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the compile-time directory capacity, MAX_FILES (64).
- **Side-effects:** Code path and state changes: Returns MAX_FILES (64).

## Detailed explanation

Returns MAX_FILES (64).

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

The capacity is fixed at 64 by MAX_FILES; the directory cannot be enlarged through this API.
