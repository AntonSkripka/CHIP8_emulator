# `handleMotionPreferenceChange`

**Source:** `web/src/ui/animated_background.js` · **Declaration:** `handleMotionPreferenceChange(event)`

## Essence

Updates reduced-motion state, stops outstanding callbacks and draws a static frame or restarts animation.

## Contract

- **Input:** `event` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates the instance or shell's retained state.

## Deep explanation

Updates reduced-motion state, stops outstanding callbacks and draws a static frame or restarts animation. Control is gated by `this.reducedMotion`, `this.frameId !== null`, `this.frameTimeoutId !== null`. The concrete calls in this body are `cancelAnimationFrame()`, `clearTimeout()`, `draw()`, `requestFrame()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
