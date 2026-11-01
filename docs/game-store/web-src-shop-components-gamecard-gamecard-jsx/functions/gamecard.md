# `GameCard`

**Source:** `web/src/shop/components/GameCard/GameCard.jsx` · **Declaration:** `GameCard({ game, authors, imageUrl, onSelect })`

## Essence

Renders a selectable game summary using formatted author/release metadata and either an image or preview placeholder.

## Contract

- **Input:** Props `{ game, authors, imageUrl, onSelect }`.
- **Output:** A React element tree containing a selectable summary card, lazy preview image or placeholder, title, author/year and optional description.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

It reads `game.release`, `game.authors`, `game.title`, optional `game.desc`, and `imageUrl`; the button invokes `onSelect`. An image is lazy-loaded when present, otherwise the placeholder is hidden from assistive technology.

## Potential weak points

The preview image uses empty alt text because it is decorative; if an image conveys game-specific information beyond the card copy, that information is not exposed here.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
