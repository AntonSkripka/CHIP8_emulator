# `StorePrimaryButton`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `StorePrimaryButton`

## Essence

Defines the `StorePrimaryButton` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, inherited `StoreButton` props and children.
- **Output:** An Emotion styled `StoreButton` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

Extends `StoreButton`, starting with accent fill and contrasting foreground.

## Potential weak points

It changes initial colors but inherits the shared button's lack of an explicit focus-visible rule.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
