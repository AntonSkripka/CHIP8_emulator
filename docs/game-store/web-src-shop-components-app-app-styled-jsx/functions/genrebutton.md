# `GenreButton`

**Source:** `web/src/shop/components/App/App.styled.jsx` · **Declaration:** `GenreButton`

## Essence

Defines the `GenreButton` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, `$active` plus normal button props/children.
- **Output:** An Emotion styled `<button>` using transient `$active` to select active or inactive theme colors.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The active state uses accent fill/background contrast; hover animates the same contrast and focus-visible adds an outline.

## Potential weak points

The active state is driven by transient `$active`; an omitted/incorrect prop silently renders the inactive appearance.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
