# `constructor`

## Essence
Prepares a canvas rendering context and a CHIP-8-sized pixel buffer.

## Contract
- **Input:** `{ canvas, core }`.
- **Output:** A `Chip8Display` instance.
- **Side effects:** Calls `canvas.getContext('2d')` and `ctx.createImageData(64, 32)`.

## Internals
Stores the canvas/core, uses the canvas's 2D context, sets logical dimensions to 64 by 32, and creates reusable image data for that size.

## Potential weak points
If `canvas.getContext('2d')` returns `null`, the subsequent `createImageData` call throws during construction.

## Glossary
- **Image data:** mutable pixel storage used by the canvas API.
