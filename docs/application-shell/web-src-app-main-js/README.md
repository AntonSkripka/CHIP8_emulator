# `web/src/app/main.js`

## Purpose

Application composition and assembly-source save flow.

## Detailed flow

The bootstrap returns early without `#app-grid`; otherwise it loads WASM and IndexedDB concurrently, initializes storage/VFS and emulator services, composes view managers, registers controls and starts frame execution. Assembly and CHIP Language buttons call different emulator compile/run paths. Disk source callbacks update editor text and dispatch `input`; ROM callbacks reset and load the emulator. `saveAssembly` sanitizes the entered name and writes only nonempty editor content.

## Function/component pages

- [`startApplication`](./functions/startapplication.md)
- [`refreshDisk`](./functions/refreshdisk.md)
- [`saveAssembly`](./functions/saveassembly.md)

## Dependencies and exact paths

- **File:** `web/src/app/main.js`
- **Chapter:** [Application shell](../README.md)
- **Direct dependencies/data:** `../assembler/asm.js`, emulator core/display/runtime modules, `../storage/*`, `../input/*`, and the UI managers in `../ui/`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
