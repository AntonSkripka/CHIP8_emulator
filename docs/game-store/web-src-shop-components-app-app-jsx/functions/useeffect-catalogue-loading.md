# `useEffect-catalogue-loading`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useEffect(() => bridge.loadCatalog().then(...), [bridge])`

## Essence

Loads catalogue metadata when the bridge changes and ignores completion after the component unmounts.

## Contract

- **Input:** `bridge` prop; performs the catalogue Promise request and returns cleanup.
- **Output:** No rendered value; React runs the effect after commit and returns a cleanup that sets `active = false`.
- **Side effects:** Starts `bridge.loadCatalog()` and may set catalogue/error state; cleanup blocks late state writes but does not abort fetch.

## Deep explanation

An `active` closure flag prevents a late Promise result/error from setting state after cleanup. The dependency list is `[bridge]`; load failures are logged and converted to a catalogue error message.

## Potential weak points

Cleanup only flips the `active` flag; it prevents stale state updates but does not abort the underlying fetch request.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
