# `requestFrame`

**Source:** `web/src/ui/animated_background.js` · **Declaration:** `requestFrame()`

## Essence

Schedules one canvas draw while visible, using animation frames for reduced motion/initial paint and a timer throttle otherwise.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Schedules a browser frame or timer callback. Mutates the instance or shell's retained state.

## Deep explanation

Schedules one canvas draw while visible, using animation frames for reduced motion/initial paint and a timer throttle otherwise. Control is gated by `this.frameId !== null || this.frameTimeoutId !== null || this.document.hidden`, `this.reducedMotion || this.startTime === null`, `!this.document.hidden`. The concrete calls in this body are `requestAnimationFrame()`, `setTimeout()`.

## Potential weak points

Pending frame/timeout IDs prevent duplicate scheduling; callers must clear them correctly when visibility or motion preference changes.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
