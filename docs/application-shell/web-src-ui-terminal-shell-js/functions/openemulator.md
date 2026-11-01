# `openEmulator`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `openEmulator(mode)`

## Essence

Sets the requested user/developer mode, updates status text, shows the emulator and awaits startup.

## Contract

- **Input:** `mode` from the source declaration.
- **Output:** A Promise resolving to `undefined` after the emulator initialization Promise settles.
- **Side effects:** Updates emulator mode/title/status and changes the visible screen before awaiting initialization.

## Deep explanation

Sets the requested user/developer mode, updates status text, shows the emulator and awaits startup. The concrete calls in this body are `getElementById()`, `showScreen()`, `initializeEmulator()`.

## Potential weak points

The caller awaits initialization but relies on its error-to-status handling; UI screen/title elements must already exist.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
