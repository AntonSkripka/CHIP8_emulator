# `formatValue`

**Source:** `web/src/shop/components/GameDetails/GameDetails.jsx` · **Declaration:** `formatValue(value)`

## Essence

Recursively formats nested object values for display and maps empty/nullish values to UNKNOWN.

## Contract

- **Input:** `value` from the source declaration.
- **Output:** A string: `UNKNOWN` for null/undefined/empty string, recursively joined `key: value` pairs for objects, otherwise `String(value)`.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

It maps null/undefined/empty-string to `UNKNOWN`, recursively formats object entries as `key: value` joined by ` · `, and stringifies primitive values. Because arrays are objects, their numeric indexes appear as keys.

## Potential weak points

Nested values are traversed recursively with no cycle detection; circular objects recurse indefinitely, and arrays become numeric-key entries.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
