# `src/fat.c` — Source file

**Source path:** `src/fat.c`

## Responsibility

Maps the disk image into boot-sector, FAT, root-directory, and data-area regions; formats it and allocates, reads, and frees cluster chains.

## Functions in this file

- [`is_valid_cluster`](./is-valid-cluster.md)
- [`init_fs_pointers`](./init-fs-pointers.md)
- [`format_disk`](./format-disk.md)
- [`vfs_init`](./vfs-init.md)
- [`find_free_cluster`](./find-free-cluster.md)
- [`get_cluster_address`](./get-cluster-address.md)
- [`write_cluster_payload`](./write-cluster-payload.md)
- [`fat_write_data`](./fat-write-data.md)
- [`fat_read_data`](./fat-read-data.md)
- [`fat_free_chain`](./fat-free-chain.md)
- [`fat_recount_free_clusters`](./fat-recount-free-clusters.md)
- [`fat_get_directory_entry`](./fat-get-directory-entry.md)
- [`fat_get_entry_name`](./fat-get-entry-name.md)
- [`fat_get_max_files`](./fat-get-max-files.md)
- [`fat_get_entry_size`](./fat-get-entry-size.md)
- [`fat_get_free_space_bytes`](./fat-get-free-space-bytes.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
