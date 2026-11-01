# `clear`

## Essence
Makes the reusable pixel buffer zero-filled and paints the visible canvas black.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Mutates `imageData.data` and calls `fillRect` over the canvas dimensions.

## Internals
Fills all image-data bytes with zero, sets `fillStyle` to `'black'`, and fills a rectangle from the origin using `canvas.width` and `canvas.height`.

## Potential weak points
It does not clear the core's draw flag. If a draw is already pending, a later `render()` can redraw the core's existing pixels over the black canvas.

## Glossary
- **Fill rectangle:** paint a rectangular area with the current fill style.
