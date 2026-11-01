# `mountGameStore`

**Source:** `web/src/shop/main.jsx` · **Declaration:** `mountGameStore(element, bridge)`

## Essence

Creates a React root for the supplied element and renders App inside an Emotion ThemeProvider.

## Contract

- **Input:** `element, bridge` from the source declaration.
- **Output:** No explicit value; creates a React root and calls `root.render(...)`.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Creates a React root for the supplied element and renders App inside an Emotion ThemeProvider. The concrete calls in this body are `createRoot()`, `render()`.

## Potential weak points

Its behavior is scoped to the specific state and DOM region it updates; it does not reconcile unrelated screen state or rebuild missing markup.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
