# `handleFileAction`

**Source:** `web/src/ui/disk_ui.js` · **Declaration:** `handleFileAction(file.name)`

## Essence

Reads a disk entry; decodes `.asm`/`.chip` text into the editor and sends other nonempty byte files to the ROM runner.

## Contract

- **Input:** `filename` from the source declaration.
- **Output:** Returns the value described by the source branches.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Reads a disk entry; decodes `.asm`/`.chip` text into the editor and sends other nonempty byte files to the ROM runner. Control is gated by `!romBytes || romBytes.length === 0`, `filename.toLowerCase().endsWith('.asm') || filename.toLowerCase().endsWith('.chip')`, `this.editor`. The concrete calls in this body are `readFile()`, `showAlert()`, `toLowerCase()`, `endsWith()`, `TextDecoder()`.

## Potential weak points

The file action classifies source only by `.asm`/`.chip` suffix and treats every other nonempty file as a ROM.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
