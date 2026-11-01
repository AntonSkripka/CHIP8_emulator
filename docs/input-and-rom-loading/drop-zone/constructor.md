# `constructor`

## Essence
Stores the file-input collaborators and installs drag/drop and selection handling.

## Contract
- **Input:** `{ dropZone, fileInput, statusElement, eventTarget, onSaveRom, onLoadRom, onDiskUpdated, logger = console }`.
- **Output:** A `DropZoneManager` instance.
- **Side effects:** Sets `maxRomSize` to 3584, binds handlers, and calls `setupEventListeners()`.

## Internals
Retains each element/callback/logger as an instance property, binds `handleFileDrop` and `handleFileSelect`, then wires listeners through the setup method.

## Potential weak points
The constructor immediately calls `setupEventListeners`, which uses `dropZone`, `fileInput`, and `eventTarget`. If one lacks the methods used there, construction throws; if a later action calls a missing callback, the error is not converted into a status message.

## Glossary
- **Bind:** create a function that keeps a chosen object as its `this`.
