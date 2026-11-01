# `clear_disk_memory`

**Function essence:** Zeroes the full disk buffer and marks it changed.

Signature: `void clear_disk_memory()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns no value; zeroes all disk bytes and marks the disk dirty.
- **Side-effects:** Code path and state changes: Loops through all DISK_SIZE bytes and then calls mark_disk_as_dirty.

## Detailed explanation

Loops through all DISK_SIZE bytes and then calls mark_disk_as_dirty.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

The filesystem structures remain uninitialized until FAT setup/formatting.
