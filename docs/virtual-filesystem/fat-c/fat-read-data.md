# `fat_read_data`

**Function essence:** Reads a bounded file byte range through a cluster chain.

Signature: `bool fat_read_data(uint16_t start_cluster, uint32_t size, uint8_t* out_buffer, uint32_t capacity)`

## Input / Output / Side-effects

- **Input:** Starting cluster, requested byte count, output buffer, and its capacity.
- **Output:** Returns true only after all requested bytes are copied; validation or chain failure returns false.
- **Side-effects:** Code path and state changes: Checks size, capacity, pointers, starting cluster and maximum size; copies up to needed clusters and follows FAT links until all requested bytes are read.

## Detailed explanation

Checks size, capacity, pointers, starting cluster and maximum size; copies up to needed clusters and follows FAT links until all requested bytes are read.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Bytes copied before a later broken-link check remain in `out_buffer` even though the function then returns false; it does not roll back partial output.
