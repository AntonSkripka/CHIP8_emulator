# `fat_get_entry_name`

**Function essence:** Copies a used entry's filename to a caller buffer.

Signature: `EMSCRIPTEN_KEEPALIVE int fat_get_entry_name(int index, char* out_name, uint32_t capacity)`

## Input / Output / Side-effects

- **Input:** Directory slot index, destination buffer, and destination capacity.
- **Output:** Returns -1 for invalid arguments, 0 for an unused slot, and 1 after copying a used name.
- **Side-effects:** Code path and state changes: Requires a valid slot, output buffer of at least 18 bytes and root pointer; returns -1 on invalid input, 0 with empty string if unused, or 1 after copying and terminating.

## Detailed explanation

Requires a valid slot, output buffer of at least 18 bytes and root pointer; returns -1 on invalid input, 0 with empty string if unused, or 1 after copying and terminating.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Filename storage is 18 bytes but the routine forces the last output byte to NUL.
