# `assetUrl`

**Source:** `web/src/shop/services/emulator_bridge.js` · **Declaration:** `assetUrl('programs.json')`

## Essence

Resolves a relative catalogue asset path against the configured base URL and document base URI.

## Contract

- **Input:** `path` from the source declaration.
- **Output:** An absolute URL string resolved from `path`, the bridge base URL, and `document.baseURI`.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Resolves a relative catalogue asset path against the configured base URL and document base URI. The concrete calls in this body are `URL()`, `toString()`. Return paths include `new URL(path, new URL(this.baseUrl, this.document.baseURI)).toString()`.

## Potential weak points

Metadata receives only shallow root validation; malformed per-game fields can still reach rendering and asset resolution.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
