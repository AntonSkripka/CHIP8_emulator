# `init`

## Essence
Restores or creates the persisted disk image, then starts background and lifecycle synchronization.

## Contract
- **Input:** None.
- **Output:** Promise resolving after initial disk read and any initial write.
- **Side effects:** Reads Wasm disk pointer, mutates Wasm disk memory, may write `disk_image`, starts an interval, and registers emergency listeners.

## Internals
Gets `_get_disk_memory_ptr()`, fetches `disk_image`, and views `DISK_SIZE` bytes in `HEAPU8`. If a saved value exists with exactly that byte length, it copies the saved bytes into Wasm memory and logs restoration. Otherwise it zero-fills the view, persists a copied buffer, and logs creation. It then calls `startSyncLoop` and `setupEmergencySync`.

## Potential weak points
An invalid disk pointer or a heap shorter than `DISK_SIZE` makes the typed-array view construction throw. Repeated calls start another interval and register lifecycle listeners again. A rejected `db.get` or initial `db.put` ends `init` before the periodic loop and emergency listeners are installed.

## Glossary
- **Restore:** copy previously saved bytes back into active memory.
