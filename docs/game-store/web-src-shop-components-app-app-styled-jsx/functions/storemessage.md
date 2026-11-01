# `StoreMessage`

**Source:** `web/src/shop/components/App/App.styled.jsx` · **Declaration:** `StoreMessage`

## Essence

Defines the `StoreMessage` styled component from its element type and Emotion theme rules.

## Contract

- **Input:** `theme` from Emotion ThemeProvider, `$error` plus paragraph props/children.
- **Output:** An Emotion styled `<p>`; `$error` switches border, text, and background to error colors.
- **Side effects:** No application side effect; Emotion evaluates the style rule during render.

## Deep explanation

The `$error` transient prop switches border, text and background; non-error messages use the theme's muted/surface colors.

## Potential weak points

`$error` must be passed by the caller; without it error content receives the normal muted color treatment.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
