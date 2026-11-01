# `render`

## Essence
Updates the canvas from core pixels only when the core has requested a redraw.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** May read the core pixel buffer, update canvas image data, draw it at `(0, 0)`, and clear the draw flag.

## Internals
Returns immediately when `getDrawFlag()` is false. Otherwise it requests `width * height * 4` bytes from `getDisplayPixels`; a falsy result also returns without clearing the flag. On success it copies pixels into the reusable image buffer, calls `putImageData`, then clears the core draw flag.

## Potential weak points
If the pixel view is missing, the method returns without clearing the draw flag. If a supplied view is shorter than `ImageData.data`, `set` updates only its prefix and leaves the remaining pixels from the previous frame; a longer view makes `set` throw.

## Glossary
- **Redraw:** drawing a fresh image after the emulator changes pixels.
- **RGBA byte count:** four bytes per pixel.
