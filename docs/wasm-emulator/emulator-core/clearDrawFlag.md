# `clearDrawFlag`

## Essence
Clears the core's display-draw flag.

## Contract
- **Input:** None.
- **Output:** `undefined`; the wrapper does not return the export's result.
- **Side effects:** Calls that Wasm export.

## Internals
Calls `_clear_draw_flag()` once. In `Chip8Display.render`, it is called after pixel bytes have been copied to `ImageData` and `putImageData` has drawn them.

## Potential weak points
The method calls `_clear_draw_flag` without checking whether the export exists; a missing export or a thrown module error propagates to the caller.

## Glossary
- **Clear a flag:** reset a stored yes/no state to its inactive value.
