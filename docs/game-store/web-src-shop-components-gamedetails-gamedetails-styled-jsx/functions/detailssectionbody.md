# `DetailsSectionBody`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `DetailsSectionBody`

## Essence

Defines the `DetailsSectionBody` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, standard element props and children.
- **Output:** An Emotion styled `p` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

`white-space: pre-wrap` preserves line breaks from catalogue text while allowing wrapping.

## Potential weak points

`pre-wrap` preserves whitespace, including long unbroken text that may still stress narrow layouts.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
