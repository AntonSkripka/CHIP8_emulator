# `startApplication`

**Source:** `web/src/app/main.js` · **Declaration:** `startApplication({ documentRef, windowRef, logger = console, confirmDelete = windowRef.confirm.bind(windowRef), showAlert = windowRef.alert.bind(windowRef) })`

## Essence

Creates and wires browser storage, the emulator, debugging views, disk UI, keyboard and file-drop flows; returns their handles after starting the emulator.

## Contract

- **Input:** `{ documentRef, windowRef, logger = console, confirmDelete = windowRef.confirm.bind(windowRef), showAlert = windowRef.alert.bind(windowRef) }` from the source declaration.
- **Output:** A Promise for the constructed application services; resolves to `undefined` if `#app-grid` is missing.
- **Side effects:** Loads/opens WASM and IndexedDB, initializes the virtual filesystem, writes the default ROM when absent, registers UI/input listeners, starts the emulator and returns service handles.

## Deep explanation

It exits before startup if `#app-grid` is absent; otherwise WASM module loading and IndexedDB opening run together. It initializes storage/VFS, seeds `PONG.ch8` only when absent, constructs core/display/monitor/memory/emulator services, then wires disk, keyboard, buttons and drop-zone callbacks. After `emulator.start()`, it returns the service handles and `refreshDisk` closure.

## Potential weak points

It assumes the HTML IDs consumed by startup exist after the initial `#app-grid` guard; several later lookups are dereferenced without null checks, and attached managers are not returned with a global teardown operation.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
