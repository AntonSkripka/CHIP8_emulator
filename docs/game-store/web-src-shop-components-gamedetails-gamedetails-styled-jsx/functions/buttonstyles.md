# `buttonStyles`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `buttonStyles({ theme })`

## Essence

Builds shared action-button CSS from theme tokens, including hover and disabled states.

## Contract

- **Input:** `theme` and the transient props destructured by the style helper: `{ theme }`.
- **Output:** A CSS template string parameterized by `theme` for shared button colors, hover styling and disabled behavior.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The shared template sets border/text/background, enabled hover transition and disabled cursor/opacity rules.

## Potential weak points

It interpolates theme tokens directly and has no explicit focus-visible outline.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
