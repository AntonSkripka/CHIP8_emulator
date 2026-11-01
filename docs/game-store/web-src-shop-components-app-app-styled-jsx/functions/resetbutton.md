# `ResetButton`

**Source:** `web/src/shop/components/App/App.styled.jsx` · **Declaration:** `ResetButton`

## Essence

Defines the `ResetButton` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, inherited `GenreButton` props and children.
- **Output:** An Emotion styled `GenreButton` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

It extends `GenreButton`, inheriting its active/hover/focus behavior and adding auto left margin.

## Potential weak points

It inherits all genre-button styles and active semantics; it has no independent pressed-state rule.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
