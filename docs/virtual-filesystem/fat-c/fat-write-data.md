# `fat_write_data`

**Function essence:** Allocates clusters and writes a file's bytes.

Signature: `uint16_t fat_write_data(const uint8_t* data, uint32_t size)`

## Input / Output / Side-effects

- **Input:** A non-null data pointer and nonzero byte count.
- **Output:** Returns the first allocated cluster; 0xFFFF signals failure.
- **Side-effects:** Code path and state changes: Validates input and free-space metadata, finds enough clusters, links them with FAT entries, writes padded payloads, decrements free count, marks dirty, and returns the first cluster.

## Detailed explanation

Validates input and free-space metadata, finds enough clusters, links them with FAT entries, writes padded payloads, decrements free count, marks dirty, and returns the first cluster.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Failure uses 0xFFFF; allocation can rely on the header free count being accurate.
