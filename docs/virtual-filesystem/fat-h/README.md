# `src/fat.h` — Source file

**Source path:** `src/fat.h`

## Responsibility

Defines the on-disk boot-sector and directory-entry layouts, FAT constants, and low-level filesystem declarations. The file defines types/constants and declarations; function behavior is specified by the implementation pages linked below.

## Functions in this file

- [`fat_get_directory_entry`](../fat-c/fat-get-directory-entry.md)
- [`fat_get_entry_name`](../fat-c/fat-get-entry-name.md)
- [`fat_get_max_files`](../fat-c/fat-get-max-files.md)
- [`init_fs_pointers`](../fat-c/init-fs-pointers.md)
- [`format_disk`](../fat-c/format-disk.md)
- [`fat_write_data`](../fat-c/fat-write-data.md)
- [`fat_read_data`](../fat-c/fat-read-data.md)
- [`fat_free_chain`](../fat-c/fat-free-chain.md)
- [`fat_recount_free_clusters`](../fat-c/fat-recount-free-clusters.md)
- [`fat_get_entry_size`](../fat-c/fat-get-entry-size.md)
- [`fat_get_free_space_bytes`](../fat-c/fat-get-free-space-bytes.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
