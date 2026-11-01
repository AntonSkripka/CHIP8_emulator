# `src/disk_storage.h` — Source file

**Source path:** `src/disk_storage.h`

## Responsibility

Declares disk size and access, dirty-state, and clearing operations. The file defines types/constants and declarations; function behavior is specified by the implementation pages linked below.

## Functions in this file

- [`get_disk_memory_ptr`](../disk-storage-c/get-disk-memory-ptr.md)
- [`get_is_dirty`](../disk-storage-c/get-is-dirty.md)
- [`set_is_dirty`](../disk-storage-c/set-is-dirty.md)
- [`mark_disk_as_dirty`](../disk-storage-c/mark-disk-as-dirty.md)
- [`clear_disk_memory`](../disk-storage-c/clear-disk-memory.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
