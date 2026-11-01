# `constructor`

## Essence
Stores Wasm, database, browser, logging, and timer dependencies and prepares lifecycle callbacks.

## Contract
- **Input:** `{ wasmModule, database, windowRef, documentRef, logger = console, setIntervalRef, clearIntervalRef }`.
- **Output:** A `StorageBridge` instance.
- **Side effects:** Sets `DISK_SIZE` to 1 MiB and creates callback closures; it does not start synchronization.

## Internals
Stores injected references, initializes `diskPtr` to `null`, sets the fixed disk size, and defines handlers that call `syncToDatabase`; the visibility handler does so only when state is `hidden`.

## Potential weak points
The constructor accepts the injected timer functions as-is; if `setIntervalRef` or `clearIntervalRef` is missing/non-callable, `startSyncLoop` or `dispose` will throw when invoked. The document/window references are likewise used directly when listeners are installed or removed.

## Glossary
- **MiB:** 1,048,576 bytes.
