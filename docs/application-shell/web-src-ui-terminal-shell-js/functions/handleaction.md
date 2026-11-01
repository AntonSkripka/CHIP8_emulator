# `handleAction`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `handleAction(action)`

## Essence

Routes a menu action to its screen, emulator mode or store-opening workflow.

## Contract

- **Input:** `action` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

The action string is a small router: `home`, `settings`, and `about` show their screens; `shop` opens the store; `user`/`developer` call emulator startup with the matching mode. Other values have no branch.

## Potential weak points

Unknown action strings intentionally fall through with no feedback; callers must use one of the declared `data-action` values.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
