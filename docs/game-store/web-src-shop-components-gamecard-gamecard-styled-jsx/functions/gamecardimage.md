# `GameCardImage`

**Source:** `web/src/shop/components/GameCard/GameCard.styled.jsx` · **Declaration:** `GameCardImage`

## Essence

Defines the `GameCardImage` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, image props including src/alt/loading.
- **Output:** An Emotion styled `img` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The image fills the frame with `object-fit: contain`, uses `--shop-image-filter`, and transitions scale/filter.

## Potential weak points

The `--shop-image-filter` variable has no local fallback declaration.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
