# `openGameStore`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `openGameStore()`

## Essence

Shows the store, ensures emulator services exist, creates a bridge once, then dynamically mounts the React store once.

## Contract

- **Input:** No arguments.
- **Output:** A Promise resolving to `undefined` after emulator readiness and the dynamic store-import path.
- **Side effects:** Changes screen/status, initializes or reuses the emulator bridge, dynamically imports the React store and mounts it once.

## Deep explanation

It first shows the shop and loading status, awaits the shared emulator initialization, then creates the bridge only once. The React entry is dynamically imported only when not mounted; import failure resets the mount flag and reports an error, allowing another attempt.

## Potential weak points

The store mount is guarded by a boolean set before the dynamic import resolves; the catch resets it, but a synchronous failure during mount can leave partial UI state.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
