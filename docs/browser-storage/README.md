# Browser storage

## Purpose

Documents the browser persistence bridge, IndexedDB adapter, and Wasm-backed virtual disk. This chapter covers only `web/src/storage/*`.

## Operation

`IndexedDbStore` creates or opens a database with a `disk_store` object store and exposes keyed reads/writes. `StorageBridge` loads the one-megabyte disk image into Wasm memory, initializes an empty image when there is no correctly sized saved copy, and periodically saves dirty contents; it also requests saves on page lifecycle events. `VirtualDisk` provides file read/write/delete/list operations and reports space by calling Wasm exports, using temporary allocations for names and file data.

## Source files

- [`indexed-db-store/`](indexed-db-store/README.md) — `web/src/storage/indexed_db_store.js`, Promise-based access to the `disk_store` object store.
- [`storage-bridge/`](storage-bridge/README.md) — `web/src/storage/storage.js`, restoring and synchronizing a one-megabyte disk image.
- [`virtual-disk/`](virtual-disk/README.md) — `web/src/storage/virtual_disk.js`, file operations and disk information through Wasm exports.

## Terms

- **IndexedDB:** persistent database available in the browser.
- **Disk image:** bytes representing the entire virtual disk.
- **Dirty:** marked as changed and needing to be saved.
- **VFS:** virtual file system exposed by the Wasm module.
