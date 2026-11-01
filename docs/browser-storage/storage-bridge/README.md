# `StorageBridge`

**Source:** `web/src/storage/storage.js`

## Purpose

Copies a fixed-size disk image between Wasm memory and an IndexedDB-compatible database adapter.

## Operation

`init` obtains the disk pointer, restores a correctly sized `disk_image` value or initializes a zero-filled disk and saves it, then starts periodic and emergency synchronization. The periodic loop runs every 3,000 ms. Synchronization checks the Wasm dirty flag; when dirty, it clears the flag, copies the full disk buffer, and stores the copy. A failed write is logged and marks the Wasm disk dirty again. `dispose` stops the interval and removes lifecycle listeners.

## Method pages

Every class method and named callback helper has an individual page in this directory.

## Terms

- **Dirty flag:** marker that memory contents have changed since the last save.
- **Disk image:** byte-for-byte representation of the virtual disk.
- **Emergency sync:** extra save request on page visibility change or unload.
