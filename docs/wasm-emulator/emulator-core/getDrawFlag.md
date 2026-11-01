# `getDrawFlag`

## Essence
Reads the core's pending-display-draw flag.

## Contract
- **Input:** None.
- **Output:** The value returned by `_get_draw_flag()`.
- **Side effects:** Calls that Wasm export.

## Internals
Directly forwards the result without converting it.

## Potential weak points
Calls `_get_draw_flag` without checking export availability; if the module does not provide it, the call throws.

## Glossary
- **Pending draw:** indication that display pixels have changed or need refreshing.
