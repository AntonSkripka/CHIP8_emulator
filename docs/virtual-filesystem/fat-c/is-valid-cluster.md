# `is_valid_cluster`

**Function essence:** Checks whether a cluster index is allocatable.

Signature: `static bool is_valid_cluster(uint16_t cluster)`

## Input / Output / Side-effects

- **Input:** A cluster index to check against the initialized data-cluster range.
- **Output:** Returns true for indices from 2 inclusive to total_disk_clusters exclusive.
- **Side-effects:** Code path and state changes: Accepts indices from 2 inclusive to total_disk_clusters exclusive.

## Detailed explanation

Accepts indices from 2 inclusive to total_disk_clusters exclusive.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

It depends on the cached cluster count having been initialized.
