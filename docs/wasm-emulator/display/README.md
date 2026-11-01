# `Chip8Display`

**Source:** `web/src/core/display.js`

## Purpose

Connects the CHIP-8 core's pixel buffer to a 2D canvas.

## Operation

Construction stores the canvas and core, obtains the 2D rendering context, and creates a 64×32 `ImageData` buffer. `render` does nothing unless the core reports a pending draw; otherwise it obtains RGBA pixel data, copies it into the image buffer, draws it at the canvas origin, and clears the core draw flag. `clear` zeroes the image buffer and paints the full canvas black.

## Terms

- **Canvas:** browser surface that can be drawn into.
- **RGBA:** four color/opacity components per pixel.
- **Draw flag:** core state indicating that display pixels should be refreshed.
