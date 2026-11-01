# `StoreRoot`

**Source:** `web/src/shop/components/App/App.styled.jsx` · **Declaration:** `StoreRoot`

## Essence

Defines the `StoreRoot` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, standard element props and children.
- **Output:** An Emotion styled `<div>` component; it renders its children inside the themed root styling.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The root uses a 60vh minimum, clamp-based padding, theme border/surface and layered shadow.

## Potential weak points

The translucent surface relies on CSS `color-mix()` support; the declaration has no fallback color-mix branch.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
