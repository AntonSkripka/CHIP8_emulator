# `VirtualDisk`

**Source:** `web/src/storage/virtual_disk.js`

## Purpose

Provides JavaScript file operations over the virtual file system exported by the Wasm module.

## Operation

The module-level filename validator limits names to 1–17 characters and at most 17 UTF-8 bytes, rejects NUL, and requires a string. File methods allocate temporary Wasm memory for NUL-terminated names and content, invoke VFS/FAT exports, translate documented numeric outcomes into booleans or `null`, and free allocations in `finally` blocks. Directory listing reads names and sizes up to the Wasm-reported maximum file count. Disk-space reporting derives used space from a fixed one-megabyte total and the module's free-space result.

## Method pages

All functions and methods in this file, including the module-private filename validator and `_allocateString`, have individual pages in this directory.

## Terms

- **VFS:** virtual file system that stores files inside the emulated disk.
- **FAT:** directory/allocation interface exposed by the module.
- **NUL-terminated:** text bytes followed by a zero byte marking the end.
- **UTF-8:** encoding that represents text as one or more bytes per character.
