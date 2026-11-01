# `handleSettingsKey`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `handleSettingsKey(event)`

## Essence

Changes the focused theme with arrow/numeric keys, applies it with Enter, or returns home with Escape.

## Contract

- **Input:** `event` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Arrow keys wrap across `THEMES`; Enter applies the current choice, while keys 1–4 select and immediately apply. Escape prevents default and returns to home.

## Potential weak points

Numeric shortcuts explicitly cover keys 1–4, matching the current four theme constants; adding themes requires updating this branch and the radio presentation together.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
