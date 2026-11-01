# `safe_copy_filename`

**Function essence:** Copies a short filename into its fixed-width field.

Signature: `static void safe_copy_filename(char* dest, const char* src)`

## Input / Output / Side-effects

- **Input:** An 18-byte destination field and a NUL-terminated source name.
- **Output:** Returns no value; copies source bytes and zero-fills the rest of the 18-byte destination field.
- **Side-effects:** Code path and state changes: Uses strlen/memcpy then zero-fills the remainder of the 18-byte destination.

## Detailed explanation

Uses strlen/memcpy then zero-fills the remainder of the 18-byte destination.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

The helper does not check the source length before copying; its current VFS caller rejects names longer than 17 bytes, leaving a terminator in the 18-byte field.
