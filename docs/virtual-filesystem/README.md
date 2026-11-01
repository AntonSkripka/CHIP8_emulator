# Virtual Filesystem

## Purpose

Implements an in-memory disk image, a compact FAT-like cluster allocator and directory, and filename-based file operations.

## Operation and data flow

The CHIP-8 development syscall in `chip8.c` validates guest memory and request data before calling `vfs.c`. VFS resolves names through FAT directory entries and stores file bytes through FAT cluster chains. `disk_storage.c` owns the backing byte array and dirty flag; `fat.c` lays metadata and data regions into it.

## Source files

- [`src/disk_storage.c`](./disk-storage-c/README.md) — Owns the fixed-size disk byte array and its dirty marker, exposing the pointer used by FAT.
- [`src/disk_storage.h`](./disk-storage-h/README.md) — Declares disk size and access, dirty-state, and clearing operations.
- [`src/fat.c`](./fat-c/README.md) — Maps the disk image into boot-sector, FAT, root-directory, and data-area regions; formats it and allocates, reads, and frees cluster chains.
- [`src/fat.h`](./fat-h/README.md) — Defines the on-disk boot-sector and directory-entry layouts, FAT constants, and low-level filesystem declarations.
- [`src/vfs.c`](./vfs-c/README.md) — Provides filename-based file operations over FAT directory entries and cluster chains.
- [`src/vfs.h`](./vfs-h/README.md) — Declares the filename-based virtual filesystem read, write, size, and delete API.

## Terminology

- **Disk image:** A byte array that acts as the complete virtual disk.
- **Cluster:** A fixed-size block used to hold file data.
- **FAT chain:** Links from one file-data cluster to the next.
- **Directory entry:** Metadata naming a file and locating its first cluster.
- **Dirty flag:** A marker that disk contents have changed.
