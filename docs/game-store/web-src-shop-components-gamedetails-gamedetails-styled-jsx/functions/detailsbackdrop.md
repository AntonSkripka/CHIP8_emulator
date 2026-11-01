# `DetailsBackdrop`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `DetailsBackdrop`

## Essence

Defines the `DetailsBackdrop` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, `$isClosing` plus overlay props/children.
- **Output:** An Emotion styled `<div>` overlay; `$isClosing` chooses its keyframe animation.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The fixed full-screen overlay selects fade-in/fade-out keyframes; its direct `aside` selects panel motion and loses pointer events while closing.

## Potential weak points

Both entrance and exit animations use fixed 250ms timing; this declaration does not reduce motion for `prefers-reduced-motion`.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
