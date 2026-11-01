# `releaseYear`

**Source:** `web/src/shop/utils/catalog.js` · **Declaration:** `releaseYear(release)`

## Essence

Extracts the leading four-digit year from a release string or returns an empty string.

## Contract

- **Input:** `release` from the source declaration.
- **Output:** The first four-digit year prefix as a string, or an empty string when the release value has no such prefix.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Extracts the leading four-digit year from a release string or returns an empty string. The concrete calls in this body are `exec()`. Return paths include `match?.[1] ?? ''`.

## Potential weak points

Its behavior is scoped to the specific state and DOM region it updates; it does not reconcile unrelated screen state or rebuild missing markup.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
