# `fetchRom`

**Source:** `web/src/shop/services/emulator_bridge.js` · **Declaration:** `fetchRom(slug)`

## Essence

Fetches the slug's `.ch8` URL, rejects HTTP failures and returns the response body as a Uint8Array.

## Contract

- **Input:** `slug` from the source declaration.
- **Output:** A Promise resolving to a `Uint8Array` of the ROM response body; rejects for non-OK HTTP responses.
- **Side effects:** Performs asynchronous fetch/data loading.

## Deep explanation

Fetches the slug's `.ch8` URL, rejects HTTP failures and returns the response body as a Uint8Array. Control is gated by `!response.ok`. The concrete calls in this body are `fetch()`, `assetUrl()`, `encodeURIComponent()`, `Error()`, `Uint8Array()`. Return paths include `new Uint8Array(await response.arrayBuffer())`.

## Potential weak points

Only HTTP status is checked before accepting ROM bytes; content type, byte length and compatibility with the slug metadata are not independently validated.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
