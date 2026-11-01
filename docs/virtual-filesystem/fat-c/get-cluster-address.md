# `get_cluster_address`

**Function essence:** Calculates a cluster's disk-memory address.

Signature: `static inline uint8_t* get_cluster_address(uint16_t cluster)`

## Input / Output / Side-effects

- **Input:** A cluster index; callers provide a cluster already checked as valid.
- **Output:** Returns the calculated data-area address for the cluster; it performs no cluster-range check.
- **Side-effects:** Code path and state changes: Offsets from data_area by (cluster-2)*CLUSTER_SIZE.

## Detailed explanation

Offsets from data_area by (cluster-2)*CLUSTER_SIZE.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

There is no bounds check here: a cluster below 2 underflows `cluster - 2`, while an oversized index can form an address beyond the data area.
