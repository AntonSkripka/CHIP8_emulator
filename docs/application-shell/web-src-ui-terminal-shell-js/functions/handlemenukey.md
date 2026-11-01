# `handleMenuKey`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `handleMenuKey(event)`

## Essence

Maps arrow keys, Enter and numeric shortcuts to selection movement or the selected menu action.

## Contract

- **Input:** `event` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates the instance or shell's retained state.

## Deep explanation

Arrow keys wrap the selected index modulo `menuOptions.length`; Enter runs its action, and a digit 1–9 runs the corresponding option only when that index exists. Arrow/Enter/numeric paths prevent the browser default.

## Potential weak points

The numeric shortcut path indexes `menuOptions` directly; it assumes the menu has at least one entry and that the selected index remains in range.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
