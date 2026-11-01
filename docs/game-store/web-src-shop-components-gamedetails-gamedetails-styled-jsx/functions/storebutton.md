# `StoreButton`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `StoreButton`

## Essence

Defines the `StoreButton` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, standard element props and children.
- **Output:** An Emotion styled `button` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The shared style includes hover only when enabled and reduces opacity/disables cursor for disabled controls.

## Potential weak points

The style has no `:focus-visible` rule; keyboard focus visibility is left to browser defaults.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
