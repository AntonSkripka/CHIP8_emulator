# `format_disk`

**Function essence:** Clears and initializes the disk filesystem layout.

Signature: `void format_disk()`

## Input / Output / Side-effects

- **Input:** No parameters; formats the shared disk-storage array.
- **Output:** Returns no value; clears the image, writes filesystem header/reserved FAT entries, and marks the image dirty.
- **Side-effects:** Code path and state changes: Zeroes disk memory, maps pointers, writes CH8F metadata and reserved FAT entries, marks dirty, and prints a message.

## Detailed explanation

Zeroes disk memory, maps pointers, writes CH8F metadata and reserved FAT entries, marks dirty, and prints a message.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Formatting destroys all prior disk contents.
