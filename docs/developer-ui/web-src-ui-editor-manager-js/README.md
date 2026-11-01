# `web/src/ui/editor_manager.js`

## Purpose

Editor input/scroll synchronization for line numbers and syntax highlighting.

## Detailed flow

The manager binds stable handlers once so `detach` can remove the same references. Input refreshes both line numbers and highlighter output; scroll synchronizes overlay offsets. `highlightLine` calculates the text offset from preceding lines and selects only a valid line. Missing editor/overlay/line-number elements are guarded, so the manager can be wired to optional UI.

## Function/component pages

- [`constructor`](./functions/constructor.md)
- [`attach`](./functions/attach.md)
- [`detach`](./functions/detach.md)
- [`handleInput`](./functions/handleinput.md)
- [`handleScroll`](./functions/handlescroll.md)
- [`updateLineNumbers`](./functions/updatelinenumbers.md)
- [`updateHighlight`](./functions/updatehighlight.md)
- [`highlightLine`](./functions/highlightline.md)
- [`syncHighlightScroll`](./functions/synchighlightscroll.md)

## Dependencies and exact paths

- **File:** `web/src/ui/editor_manager.js`
- **Chapter:** [Developer interface](../README.md)
- **Direct dependencies/data:** Editor/highlight/line-number DOM elements and the `highlightCode` function from `web/src/assembler/asm.js`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
