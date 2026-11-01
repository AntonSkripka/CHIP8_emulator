# `init_fs_pointers`

**Function essence:** Maps disk offsets to filesystem structures.

Signature: `void init_fs_pointers()`

## Input / Output / Side-effects

- **Input:** No parameters; obtains the backing array from disk storage.
- **Output:** Returns no value; maps cached pointers to fixed disk regions and computes the cluster count.
- **Side-effects:** Code path and state changes: Obtains the disk pointer, assigns boot/FAT/root/data pointers at fixed offsets, and computes cluster count from remaining bytes.

## Detailed explanation

Obtains the disk pointer, assigns boot/FAT/root/data pointers at fixed offsets, and computes cluster count from remaining bytes.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

It trusts the fixed disk buffer and its compile-time layout.
