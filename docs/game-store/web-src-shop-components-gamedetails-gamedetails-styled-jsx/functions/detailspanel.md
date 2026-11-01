# `DetailsPanel`

**Source:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx` · **Declaration:** `DetailsPanel`

## Essence

Defines the `DetailsPanel` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, dialog props/children.
- **Output:** An Emotion styled `<aside>` dialog panel sized responsively by viewport width.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The panel is a full-height scrolling column, normally up to 50vw/780px and full width below 760px.

## Potential weak points

The panel is fixed to viewport height and owns its own scrolling; content can be clipped if browser viewport sizing is unusual.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
