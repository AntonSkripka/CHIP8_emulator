# `constructor`

**Source:** `web/src/ui/disk_ui.js` · **Declaration:** `constructor({ disk, documentRef, fileListElement, diskHeaderElement, editor, confirmDelete, showAlert, onLoadSource, onRunRom, logger = console })`

## Essence

Stores disk, DOM nodes, editor, confirmation/alert callbacks, source/ROM callbacks and logger; it performs no initial disk mutation or listener registration.

## Contract

- **Input:** `{ disk, documentRef, fileListElement, diskHeaderElement, editor, confirmDelete, showAlert, onLoadSource, onRunRom, logger = console }` from the source declaration.
- **Output:** No explicit value; `new` creates the initialized instance.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Stores disk, DOM nodes, editor, confirmation/alert callbacks, source/ROM callbacks and logger; it performs no initial disk mutation or listener registration. Stores disk, DOM nodes, editor, confirmation/alert callbacks, source/ROM callbacks and logger; it performs no initial disk mutation or listener registration.

## Potential weak points

The file action classifies source only by `.asm`/`.chip` suffix and treats every other nonempty file as a ROM.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
