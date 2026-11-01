# `refresh`

**Source:** `web/src/ui/disk_ui.js` · **Declaration:** `refresh()`

## Essence

Rebuilds disk statistics and file-list DOM from the virtual disk; binds run and confirmed-delete actions.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates DOM nodes or focus/selection state. Registers/removes DOM or window listeners. Changes disk, emulator or theme state. Replaces the file-list DOM and installs per-file button listeners.

## Deep explanation

Rebuilds disk statistics and file-list DOM from the virtual disk; binds run and confirmed-delete actions. Control is gated by `!this.fileListElement`, `this.diskHeaderElement`, `files.length === 0`. The concrete calls in this body are `getDiskSpaceInfo()`, `toFixed()`, `getFilesList()`, `forEach()`, `createElement()`.

## Potential weak points

It rebuilds the entire list DOM on every refresh and attaches fresh per-row listeners; frequent refreshes therefore recreate every row.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
