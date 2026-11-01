# `refreshDisk`

**Source:** `web/src/app/main.js` · **Declaration:** `refreshDisk()`

## Essence

Delegates a disk-list refresh to the already-created disk UI manager.

## Contract

- **Input:** No arguments.
- **Output:** No value; it returns the result of `diskUi.refresh()` only if that method itself returns a value (the current manager returns `undefined`).
- **Side effects:** Calls `diskUi.refresh()` to replace the disk panel's rendered file list.

## Deep explanation

Delegates a disk-list refresh to the already-created disk UI manager. The concrete calls in this body are `_set_key()`.

## Potential weak points

Its behavior is scoped to the specific state and DOM region it updates; it does not reconcile unrelated screen state or rebuild missing markup.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
