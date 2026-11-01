# `updateMenuSelection`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `updateMenuSelection()`

## Essence

Updates selected-menu styling and cursor markers, then focuses the selected option.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates DOM nodes or focus/selection state.

## Deep explanation

Updates selected-menu styling and cursor markers, then focuses the selected option. The concrete calls in this body are `forEach()`, `toggle()`, `querySelector()`, `focusMenuOption()`.

## Potential weak points

Each option is assumed to contain `.menu-cursor`; missing markup throws during the update.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
