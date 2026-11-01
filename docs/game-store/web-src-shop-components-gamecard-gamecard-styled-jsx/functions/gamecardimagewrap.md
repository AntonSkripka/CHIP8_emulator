# `GameCardImageWrap`

**Source:** `web/src/shop/components/GameCard/GameCard.styled.jsx` · **Declaration:** `GameCardImageWrap`

## Essence

Defines the `GameCardImageWrap` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, standard element props and children.
- **Output:** An Emotion styled `span` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The wrapper keeps a 16:10 frame, centers content, clips overflow and uses theme border/background.

## Potential weak points

Its fixed 16:10 frame can leave empty space around images because the child uses `object-fit: contain`.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
