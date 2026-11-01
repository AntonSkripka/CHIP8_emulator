# `refreshTheme`

**Source:** `web/src/ui/animated_background.js` · **Declaration:** `refreshTheme()`

## Essence

Reads CSS background/accent tokens and the active blue-theme flag, then rebuilds sprites and schedules rendering.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Changes root theme state and/or dispatches a document event.

## Deep explanation

Reads CSS background/accent tokens and the active blue-theme flag, then rebuilds sprites and schedules rendering. The concrete calls in this body are `getComputedStyle()`, `getPropertyValue()`, `trim()`, `createGlowSprite()`, `requestFrame()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
