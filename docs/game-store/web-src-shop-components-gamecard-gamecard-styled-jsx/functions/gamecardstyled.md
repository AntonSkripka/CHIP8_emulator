# `GameCardStyled`

**Source:** `web/src/shop/components/GameCard/GameCard.styled.jsx` · **Declaration:** `GameCardStyled`

## Essence

Defines the `GameCardStyled` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, standard element props and children.
- **Output:** An Emotion styled `article` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The article lifts and gains accent border/shadow on hover; descendant images scale slightly.

## Potential weak points

Hover elevation and image zoom are visual-only and are not mirrored by an equivalent non-hover selected state.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
