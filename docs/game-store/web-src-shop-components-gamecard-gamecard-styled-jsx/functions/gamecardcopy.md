# `GameCardCopy`

**Source:** `web/src/shop/components/GameCard/GameCard.styled.jsx` · **Declaration:** `GameCardCopy`

## Essence

Defines the `GameCardCopy` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, standard element props and children.
- **Output:** An Emotion styled `span` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The component's CSS declaration sets `display, width, min-width, gap, padding`. It adds presentation only, without component state or event handlers.

## Potential weak points

The title/meta/description share one grid and can expand vertically with long catalogue text.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
