# `open`

## Essence
Opens an IndexedDB database and ensures that the `disk_store` object store exists.

## Contract
- **Input:** `{ indexedDBRef, name = 'Chip8VirtualDiskDB', version = 1 }`.
- **Output:** Promise resolving to an `IndexedDbStore`.
- **Side effects:** Starts an IndexedDB open request and may create an object store during upgrade.
- **Errors:** Rejects with `request.error` on request error.

## Internals
Calls `indexedDBRef.open(name, version)`. In `onupgradeneeded`, creates `disk_store` only if the database's object-store names do not contain it. On success it wraps `request.result`; on error it rejects.

## Potential weak points
If another connection blocks the version upgrade, this Promise has no `onblocked` handler and remains pending until the request later succeeds or errors. The class also exposes no method to close the opened connection.

## Glossary
- **Upgrade event:** event fired when a database is created or its version changes.
