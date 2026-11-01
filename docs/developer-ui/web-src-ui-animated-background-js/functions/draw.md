# `draw`

**Source:** `web/src/ui/animated_background.js` · **Declaration:** `draw(0)`

## Essence

Paints a themed tiled glow using deterministic smoothly changing noise; reschedules only when motion is allowed.

## Contract

- **Input:** `timestamp` from the source declaration.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Draws to canvas. Mutates the instance or shell's retained state.

## Deep explanation

Paints a themed tiled glow using deterministic smoothly changing noise; reschedules only when motion is allowed. Control is gated by `this.document.hidden || !this.width || !this.height`, `this.startTime === null`, `!this.reducedMotion`. The concrete calls in this body are `fillRect()`, `floor()`, `hash()`, `drawImage()`, `requestFrame()`.

## Potential weak points

Drawing visits every cell in the fixed 64×64 map each call; there is no dirty-cell or viewport culling.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
