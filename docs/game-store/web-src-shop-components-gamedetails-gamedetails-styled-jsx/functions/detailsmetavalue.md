# `DetailsMetaValue`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `DetailsMetaValue`

## Essence

Defines the `DetailsMetaValue` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, standard element props and children.
- **Output:** An Emotion styled `dd` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The component's CSS declaration sets `overflow-wrap, margin`. It adds presentation only, without component state or event handlers.

## Potential weak points

Only `overflow-wrap:anywhere` constrains long values; nested content structure is caller-controlled.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
