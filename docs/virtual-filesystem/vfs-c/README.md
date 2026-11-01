# `src/vfs.c` — Source file

**Source path:** `src/vfs.c`

## Responsibility

Provides filename-based file operations over FAT directory entries and cluster chains.

## Functions in this file

- [`safe_copy_filename`](./safe-copy-filename.md)
- [`match_filename`](./match-filename.md)
- [`find_directory_entry`](./find-directory-entry.md)
- [`vfs_delete`](./vfs-delete.md)
- [`mark_disk_as_dirty`](./mark-disk-as-dirty.md)
- [`vfs_write`](./vfs-write.md)
- [`vfs_get_file_size`](./vfs-get-file-size.md)
- [`vfs_read`](./vfs-read.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
