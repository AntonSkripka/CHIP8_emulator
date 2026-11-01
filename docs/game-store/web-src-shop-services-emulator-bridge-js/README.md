# `web/src/shop/services/emulator_bridge.js`

## Purpose

Catalog/ROM fetches and transfer to the virtual disk or emulator.

## Detailed flow

The bridge resolves URL paths against the configured base and document URI. Catalog JSON fetches run concurrently and receive shallow root-shape validation. ROM fetches check HTTP status and convert the body to bytes. Loading resets/starts the emulator and invokes `onLaunch`; saving creates a case-insensitive collision-free disk name, writes the ROM and refreshes the disk.

## Function/component pages

- [`constructor`](./functions/constructor.md)
- [`loadCatalog`](./functions/loadcatalog.md)
- [`loadGame`](./functions/loadgame.md)
- [`saveGame`](./functions/savegame.md)
- [`assetUrl`](./functions/asseturl.md)
- [`fetchRom`](./functions/fetchrom.md)
- [`createDiskFilename`](./functions/creatediskfilename.md)

## Dependencies and exact paths

- **File:** `web/src/shop/services/emulator_bridge.js`
- **Chapter:** [Game store](../README.md)
- **Direct dependencies/data:** Fetch API, `programs.json`, `authors.json`, ROM assets, virtual-disk methods and emulator methods.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
