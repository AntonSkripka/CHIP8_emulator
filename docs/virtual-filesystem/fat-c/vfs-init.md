# `vfs_init`

**Function essence:** Validates the image header or formats the disk.

Signature: `EMSCRIPTEN_KEEPALIVE void vfs_init()`

## Input / Output / Side-effects

- **Input:** No parameters; reads and may reformat the shared disk image.
- **Output:** Returns no value; formats when selected header/layout checks fail, otherwise recounts free clusters.
- **Side-effects:** Code path and state changes: Maps pointers, compares magic and layout metadata with expected values; invalid metadata triggers format_disk, otherwise free clusters are recounted.

## Detailed explanation

Maps pointers, compares magic and layout metadata with expected values; invalid metadata triggers format_disk, otherwise free clusters are recounted.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Validation checks selected header fields, not every directory or chain invariant.
