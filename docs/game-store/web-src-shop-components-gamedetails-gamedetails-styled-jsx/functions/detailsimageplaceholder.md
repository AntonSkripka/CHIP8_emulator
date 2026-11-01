# `DetailsImagePlaceholder`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `DetailsImagePlaceholder`

## Essence

Defines the `DetailsImagePlaceholder` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, standard element props and children.
- **Output:** An Emotion styled `div` component; it renders its children/content with the declared theme-based CSS.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The fallback occupies the same bounded preview frame and centers its label.

## Potential weak points

The placeholder has no `$isClosing` or loading state; the caller must decide when it appears.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
