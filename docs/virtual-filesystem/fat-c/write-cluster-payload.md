# `write_cluster_payload`

**Function essence:** Copies and zero-pads one cluster payload.

Signature: `static void write_cluster_payload(uint16_t cluster, const uint8_t* source, uint32_t size)`

## Input / Output / Side-effects

- **Input:** A cluster index, source-byte pointer, and payload length (at most one cluster).
- **Output:** Returns no value; copies and zero-pads valid payloads, and silently ignores invalid inputs.
- **Side-effects:** Code path and state changes: Returns without action for invalid cluster, null source, or size above one cluster; otherwise copies bytes and zero-fills the rest.

## Detailed explanation

Returns without action for invalid cluster, null source, or size above one cluster; otherwise copies bytes and zero-fills the rest.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Invalid input is silently ignored and does not report failure.
