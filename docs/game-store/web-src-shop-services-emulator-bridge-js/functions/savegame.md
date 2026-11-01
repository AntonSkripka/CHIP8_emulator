# `saveGame`

**Source:** `web/src/shop/services/emulator_bridge.js` · **Declaration:** `saveGame(slug)`

## Essence

Fetches a ROM, finds a disk filename, writes it, refreshes the disk list and returns the chosen filename.

## Contract

- **Input:** `slug` from the source declaration.
- **Output:** A Promise resolving to the generated disk filename; fetch/write failures reject it.
- **Side effects:** Changes disk, emulator or theme state. Performs asynchronous fetch/data loading.

## Deep explanation

Fetches a ROM, finds a disk filename, writes it, refreshes the disk list and returns the chosen filename. Control is gated by `!this.disk.writeFile(filename, bytes)`. The concrete calls in this body are `fetchRom()`, `createDiskFilename()`, `writeFile()`, `Error()`, `refreshDisk()`. Return paths include `filename`.

## Potential weak points

Only HTTP status is checked before accepting ROM bytes; content type, byte length and compatibility with the slug metadata are not independently validated.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
