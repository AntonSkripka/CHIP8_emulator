# `fat_recount_free_clusters`

**Function essence:** Recomputes the free-cluster count from FAT entries.

Signature: `void fat_recount_free_clusters(void)`

## Input / Output / Side-effects

- **Input:** No parameters; inspects FAT entries and the boot-sector count.
- **Output:** Returns no value; writes the recalculated count only when it differs from the boot-sector value.
- **Side-effects:** Code path and state changes: Counts free entries in the allocatable range and updates the boot sector and dirty flag only when the count differs.

## Detailed explanation

Counts free entries in the allocatable range and updates the boot sector and dirty flag only when the count differs.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

The count is limited to the in-memory FAT table's interpreted range.
