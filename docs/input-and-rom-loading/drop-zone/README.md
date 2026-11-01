# `DropZoneManager`

**Source:** `web/src/input/drop_zone.js`

## Purpose

Connects a drop-zone element and file input to ROM validation, saving/loading callbacks, status messages, and disk-update notification.

## Operation

The constructor stores the supplied DOM elements and callbacks, sets the maximum ROM size to 3,584 bytes, binds the two event handlers that need instance context, and installs listeners. Drag defaults are prevented on both the drop zone and the broader event target. Drop and file-input selection each use only the first file. Processing checks the `.ch8` suffix, size limit, and non-empty content; reads the file as bytes; saves it; loads it; shows status; and notifies the caller that the disk changed. Failures are reported via status and, for thrown errors, the injected logger.

## Method pages

Each method, including event handlers and validation/status helpers, has an individual page in this directory.

## Terms

- **Drag-and-drop:** moving a file onto a browser area.
- **Callback:** function supplied by another component for a requested action.
- **ROM:** CHIP-8 program bytes.
