# Input and ROM loading

## Purpose

Documents browser keyboard input and ROM loading through file selection or drag-and-drop. This chapter covers only `web/src/input/*`.

## Operation

`KeyboardInput` converts the configured keyboard codes to CHIP-8 key indices and reports pressed/released states through a callback. `DropZoneManager` suppresses default drag behavior, accepts the first selected/dropped file, checks its extension and size, reads it into bytes, saves it, passes it to the ROM loader, and reports the result through the status element and disk-update callback. The component accepts `.ch8` filenames, caps size at 3,584 bytes, and rejects empty files.

## Source files

- [`drop-zone/`](drop-zone/README.md) — `web/src/input/drop_zone.js`, file selection/drop handling, ROM validation, and callbacks.
- [`keyboard/`](keyboard/README.md) — `web/src/input/keyboard.js`, mapping physical keyboard codes to CHIP-8 keys.

## Terms

- **CHIP-8 key index:** one of the emulator's 16 hexadecimal key identifiers.
- **Callback:** function supplied by another component for an action.
- **ROM:** CHIP-8 program bytes.
