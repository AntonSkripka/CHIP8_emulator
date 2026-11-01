# `genreButtonStyles`

**Source:** `web/src/shop/components/App/App.styled.jsx` · **Declaration:** `genreButtonStyles({ theme, $active })`

## Essence

Builds genre-button CSS from the Emotion theme and `$active` state, including hover/focus treatments.

## Contract

- **Input:** `theme` and the transient props destructured by the style helper: `{ theme, $active }`.
- **Output:** A CSS template string parameterized by `theme` and `$active` for button colors, borders, hover and focus-visible styles.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

`$active` selects accent fill or transparent background, border and text colors; hover adds a lift/glow and focus-visible adds an outline.

## Potential weak points

It interpolates theme tokens directly; invalid or missing theme values are not checked here.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
