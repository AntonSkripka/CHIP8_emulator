# `find_free_cluster`

**Function essence:** Scans FAT for the first free data cluster.

Signature: `static uint16_t find_free_cluster()`

## Input / Output / Side-effects

- **Input:** No parameters; scans the initialized FAT and cluster count.
- **Output:** Returns the first free data-cluster index or FAT_ERROR_NO_SPACE.
- **Side-effects:** Code path and state changes: Scans indices 2 through total_disk_clusters-1 and returns the first FAT_ENTRY_FREE or FAT_ERROR_NO_SPACE.

## Detailed explanation

Scans indices 2 through total_disk_clusters-1 and returns the first FAT_ENTRY_FREE or FAT_ERROR_NO_SPACE.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Linear scan cost grows with disk size.
