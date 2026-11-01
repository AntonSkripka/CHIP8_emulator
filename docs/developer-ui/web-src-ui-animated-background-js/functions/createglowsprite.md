# `createGlowSprite`

**Source:** `web/src/ui/animated_background.js` · **Declaration:** `createGlowSprite()`

## Essence

Pre-renders the accent bloom and textured tile canvases used repeatedly by the animation.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Draws to canvas.

## Deep explanation

Pre-renders the accent bloom and textured tile canvases used repeatedly by the animation. Control is gated by `!this.accentColor || !this.width`. The concrete calls in this body are `round()`, `setTransform()`, `createRadialGradient()`, `addColorStop()`, `clearRect()`.

## Potential weak points

If accent color or width is absent it returns without rebuilding sprites; callers then depend on prior valid sprite state.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
