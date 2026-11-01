# `loadGame`

**Source:** `web/src/shop/services/emulator_bridge.js` · **Declaration:** `loadGame(slug, options = {})`

## Essence

Fetches a ROM, resets the emulator, loads bytes with supplied options, then invokes the launch callback.

## Contract

- **Input:** `slug, options = {}` from the source declaration.
- **Output:** A Promise resolving to `undefined` after the ROM is loaded and `onLaunch` has run; fetch/load errors reject it.
- **Side effects:** Changes disk, emulator or theme state. Performs asynchronous fetch/data loading.

## Deep explanation

Fetches a ROM, resets the emulator, loads bytes with supplied options, then invokes the launch callback. The concrete calls in this body are `fetchRom()`, `reset()`, `loadRom()`, `onLaunch()`.

## Potential weak points

Only HTTP status is checked before accepting ROM bytes; content type, byte length and compatibility with the slug metadata are not independently validated.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
