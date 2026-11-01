# `mark_disk_as_dirty`

**Function essence:** Marks the disk image as changed.

Signature: `void mark_disk_as_dirty()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns no value; sets the dirty flag to true.
- **Side-effects:** Code path and state changes: Sets the static dirty flag to true.

## Detailed explanation

Sets the static dirty flag to true.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Repeated calls only leave the same boolean set; there is no version count or persistence operation here.
