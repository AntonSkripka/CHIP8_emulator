# `fat_free_chain`

**Function essence:** Marks a cluster chain free and adjusts the free count.

Signature: `void fat_free_chain(uint16_t start_cluster)`

## Input / Output / Side-effects

- **Input:** The first cluster of the chain to release.
- **Output:** Returns no value; clears traversed FAT entries, updates the free count, and marks disk dirty for a valid starting cluster.
- **Side-effects:** Code path and state changes: Walks at most the number of allocatable clusters, remembers each next link, clears FAT entries, increments the header count up to its cap, and marks dirty.

## Detailed explanation

Walks at most the number of allocatable clusters, remembers each next link, clears FAT entries, increments the header count up to its cap, and marks dirty.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

A corrupted chain is bounded by the visit limit but may still free linked clusters that are not owned by the intended file.
