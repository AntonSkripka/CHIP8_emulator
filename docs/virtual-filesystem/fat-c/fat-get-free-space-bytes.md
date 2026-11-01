# `fat_get_free_space_bytes`

**Function essence:** Reports free space from the boot-sector count.

Signature: `EMSCRIPTEN_KEEPALIVE uint32_t fat_get_free_space_bytes(void)`

## Input / Output / Side-effects

- **Input:** No parameters; reads the free-cluster count from the boot sector.
- **Output:** Returns boot_sector->free_clusters multiplied by CLUSTER_SIZE, or zero if the boot-sector pointer is null.
- **Side-effects:** Code path and state changes: Returns zero if boot pointer is unavailable; otherwise multiplies free cluster count by cluster size.

## Detailed explanation

Returns zero if boot pointer is unavailable; otherwise multiplies free cluster count by cluster size.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

It trusts the stored count until recount is called.
