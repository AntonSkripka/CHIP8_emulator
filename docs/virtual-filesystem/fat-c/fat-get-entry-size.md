# `fat_get_entry_size`

**Function essence:** Returns a valid used file's recorded size.

Signature: `EMSCRIPTEN_KEEPALIVE uint32_t fat_get_entry_size(int index)`

## Input / Output / Side-effects

- **Input:** A zero-based directory slot index.
- **Output:** Returns the stored size for a used in-range entry, or zero when checks fail.
- **Side-effects:** Code path and state changes: Checks index, root pointer, used flag and maximum file size; returns zero when any check fails.

## Detailed explanation

Checks index, root pointer, used flag and maximum file size; returns zero when any check fails.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Zero is ambiguous between invalid/missing entry and an empty file.
