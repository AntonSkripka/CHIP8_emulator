# `web/src/ui/emulator_monitor.js`

## Purpose

Register and data-stack inspector rendering.

## Detailed flow

Construction creates one register row per V0–VF and rows for PC, I, SP and SPD. Per frame, `updateDebug` formats hexadecimal values and avoids rewriting unchanged registers. Stack rendering is skipped when stack support is absent or the top/depth range is unchanged; otherwise it renders only the newest 64 entries, newest first.

## Function/component pages

- [`constructor`](./functions/constructor.md)
- [`updateDebug`](./functions/updatedebug.md)
- [`updateStackUI`](./functions/updatestackui.md)
- [`reset`](./functions/reset.md)
- [`createDebugUI`](./functions/createdebugui.md)
- [`appendValueRow`](./functions/appendvaluerow.md)

## Dependencies and exact paths

- **File:** `web/src/ui/emulator_monitor.js`
- **Chapter:** [Developer interface](../README.md)
- **Direct dependencies/data:** `Chip8Core` view/accessor methods and debugger/stack DOM containers.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
