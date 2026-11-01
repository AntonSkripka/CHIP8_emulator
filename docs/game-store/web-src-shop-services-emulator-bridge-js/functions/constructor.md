# `constructor`

**Source:** `web/src/shop/services/emulator_bridge.js` · **Declaration:** `constructor({ disk, emulator, refreshDisk, fetchRef = fetch, baseUrl, documentRef = document, onLaunch = () => {} })`

## Essence

Stores disk, emulator, refresh callback, fetch/base URL/document and launch callback; it does not fetch until a public operation is called.

## Contract

- **Input:** `{ disk, emulator, refreshDisk, fetchRef = fetch, baseUrl, documentRef = document, onLaunch = () => {} }` from the source declaration.
- **Output:** No explicit value; `new` creates the initialized instance.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Stores disk, emulator, refresh callback, fetch/base URL/document and launch callback; it does not fetch until a public operation is called. Stores disk, emulator, refresh callback, fetch/base URL/document and launch callback; it does not fetch until a public operation is called.

## Potential weak points

Metadata receives only shallow root validation; malformed per-game fields can still reach rendering and asset resolution.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
