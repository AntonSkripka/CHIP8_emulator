# `authorLine`

**Source:** `web/src/shop/utils/catalog.js` · **Declaration:** `authorLine(authors, keys = [])`

## Essence

Maps author keys to display names, retains unknown keys, joins them with commas and uses a fallback for an empty list.

## Contract

- **Input:** `authors, keys = []` from the source declaration.
- **Output:** A comma-separated author display string, or `UNKNOWN AUTHOR` when no keys are provided.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Maps author keys to display names, retains unknown keys, joins them with commas and uses a fallback for an empty list. The concrete calls in this body are `map()`, `join()`. Return paths include `keys.map((key) => authors[key]?.name ?? key).join(', ') || 'UNKNOWN AUTHOR'`.

## Potential weak points

Its behavior is scoped to the specific state and DOM region it updates; it does not reconcile unrelated screen state or rebuild missing markup.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
