# `web/src/ui/disk_ui.js`

## Purpose

Virtual-disk list, delete confirmation, and source-versus-ROM file actions.

## Detailed flow

The class treats the injected disk as the source of truth. `refresh` replaces the file-list markup from disk snapshots and attaches per-item actions. Delete requires confirmation and only refreshes after a successful deletion. `handleFileAction` classifies `.asm` and `.chip` case-insensitively; source is decoded as text and passed to `onLoadSource`, while other bytes are passed to `onRunRom`.

## Function/component pages

- [`constructor`](./functions/constructor.md)
- [`refresh`](./functions/refresh.md)
- [`handleFileAction`](./functions/handlefileaction.md)

## Dependencies and exact paths

- **File:** `web/src/ui/disk_ui.js`
- **Chapter:** [Developer interface](../README.md)
- **Direct dependencies/data:** Injected virtual-disk API and UI callbacks from `web/src/app/main.js`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
