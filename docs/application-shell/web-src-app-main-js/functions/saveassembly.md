# `saveAssembly`

**Source:** `web/src/app/main.js` · **Declaration:** `saveAssembly({ editor, editorManager, filenameInput, statusElement, disk, refreshDisk, encoder, showAlert })`

## Essence

Validates and normalizes a source filename, writes editor text to the virtual disk, refreshes the list and clears the editor only after a successful write.

## Contract

- **Input:** `{ editor, editorManager, filenameInput, statusElement, disk, refreshDisk, encoder, showAlert }` from the source declaration.
- **Output:** No value. Invalid input or a failed disk write returns before clearing the editor.
- **Side effects:** May show an alert; on successful write it refreshes the disk list, clears editor contents/highlights/line numbers, updates status and schedules its clearing.

## Deep explanation

The function trims the entered name, rejects empty names, removes characters outside Latin letters/digits/dot/hyphen/underscore, and adds `.asm` unless `.asm` or `.chip` is present. It enforces 17 characters and nonempty source before writing encoded bytes. Only a successful `disk.writeFile` refreshes the disk, clears editor/highlights/line numbers, and displays a timed success state.

## Potential weak points

A failed disk write exits without clearing the editor, but the function itself does not display a failure message for that return path.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
