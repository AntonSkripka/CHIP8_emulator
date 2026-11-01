# `src/disk_storage.c` — Source file

**Source path:** `src/disk_storage.c`

## Responsibility

Owns the fixed-size disk byte array and its dirty marker, exposing the pointer used by FAT.

## Functions in this file

- [`get_disk_memory_ptr`](./get-disk-memory-ptr.md)
- [`get_is_dirty`](./get-is-dirty.md)
- [`set_is_dirty`](./set-is-dirty.md)
- [`mark_disk_as_dirty`](./mark-disk-as-dirty.md)
- [`clear_disk_memory`](./clear-disk-memory.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
