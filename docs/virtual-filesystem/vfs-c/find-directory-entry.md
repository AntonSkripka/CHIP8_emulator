# `find_directory_entry`

**Function essence:** Finds a used directory entry by exact fixed-width name.

Signature: `static FAT_DirEntry* find_directory_entry(const char* name)`

## Input / Output / Side-effects

- **Input:** A filename pointer; null, empty, or over-17-byte names are rejected.
- **Output:** Returns the first used exact-name FAT_DirEntry, or NULL when invalid or absent.
- **Side-effects:** Code path and state changes: Rejects null, empty, and over-17-byte names; scans slots and returns the first used exact match.

## Detailed explanation

Rejects null, empty, and over-17-byte names; scans slots and returns the first used exact match.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Names are compared bytewise and are case-sensitive.
