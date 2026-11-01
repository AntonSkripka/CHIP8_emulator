# `createDiskFilename`

**Source:** `web/src/shop/services/emulator_bridge.js` · **Declaration:** `createDiskFilename(slug)`

## Essence

Creates a sanitized uppercase `.CH8` filename, checks existing disk names case-insensitively and searches bounded collision suffixes.

## Contract

- **Input:** `slug` from the source declaration.
- **Output:** An available uppercase `.CH8` filename; throws after 64 occupied candidates.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Creates a sanitized uppercase `.CH8` filename, checks existing disk names case-insensitively and searches bounded collision suffixes. Control is gated by `!existingNames.has(filename)`. The concrete calls in this body are `Set()`, `getFilesList()`, `map()`, `toUpperCase()`, `replace()`. Return paths include `filename`.

## Potential weak points

The 12-character base and 64 suffix attempts are fixed; unusually many collisions throw rather than trying an unbounded or alternate naming strategy.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
