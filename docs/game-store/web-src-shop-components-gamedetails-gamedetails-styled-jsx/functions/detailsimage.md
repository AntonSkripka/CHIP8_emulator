# `DetailsImage`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `DetailsImage`

## Essence

Defines the `DetailsImage` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, image props including src/alt.
- **Output:** An Emotion styled `img` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The preview is contained within a maximum 44vh/420px height, has a 120px minimum height and theme border/background.

## Potential weak points

`--shop-image-filter` has no local fallback, and `object-fit: contain` may leave letterboxing.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
