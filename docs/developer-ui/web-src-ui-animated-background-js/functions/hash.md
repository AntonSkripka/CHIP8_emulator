# `hash`

**Source:** `web/src/ui/animated_background.js` · **Declaration:** `hash(seed, step)`

## Essence

Produces a repeatable normalized pseudo-random value from a seed and time step for tile brightness.

## Contract

- **Input:** `seed, step` from the source declaration.
- **Output:** A deterministic number from 0 inclusive to 1 inclusive, normalized from an unsigned 32-bit hash.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Produces a repeatable normalized pseudo-random value from a seed and time step for tile brightness. The concrete calls in this body are `imul()`, `floor()`. Return paths include `value / 0xffffffff`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
