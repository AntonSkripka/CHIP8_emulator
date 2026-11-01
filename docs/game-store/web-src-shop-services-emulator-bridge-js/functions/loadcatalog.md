# `loadCatalog`

**Source:** `web/src/shop/services/emulator_bridge.js` · **Declaration:** `loadCatalog()`

## Essence

Fetches both metadata JSON files concurrently, validates that each root is a non-array object, and returns them together.

## Contract

- **Input:** No arguments.
- **Output:** A Promise resolving to `{ programs, authors }`; rejects on failed HTTP responses or non-object/array roots.
- **Side effects:** Performs asynchronous fetch/data loading.

## Deep explanation

Fetches both metadata JSON files concurrently, validates that each root is a non-array object, and returns them together. Control is gated by `!programsResponse.ok || !authorsResponse.ok`, `!programs || typeof programs !== 'object' || Array.isArray(programs) ||
            !authors || typeof authors !== 'object' || Array.isArray(authors)`. The concrete calls in this body are `all()`, `fetch()`, `assetUrl()`, `Error()`, `json()`. Return paths include `{ programs, authors }`.

## Potential weak points

Metadata receives only shallow root validation; malformed per-game fields can still reach rendering and asset resolution.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
