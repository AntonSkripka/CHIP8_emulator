# `draw`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `draw()`

## Essence

Clears and redraws the memory canvas, coloring each byte cell and marking the program counter, index register and selected address.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Draws to canvas.

## Deep explanation

Clears and redraws the memory canvas, coloring each byte cell and marking the program counter, index register and selected address. Control is gated by `!this.context || !this.imageData`, `!memory`. The concrete calls in this body are `getMemoryView()`, `save()`, `setTransform()`, `fillRect()`, `restore()`.

## Potential weak points

Drawing visits every cell in the fixed 64×64 map each call; there is no dirty-cell or viewport culling.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
