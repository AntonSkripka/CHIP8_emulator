# `animateBoot`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `animateBoot()`

## Essence

Advances the boot progress display on a timer, then marks boot complete and opens the home screen.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates DOM nodes or focus/selection state. Schedules a browser frame or timer callback.

## Deep explanation

Advances the boot progress display on a timer, then marks boot complete and opens the home screen. Control is gated by `completedBlocks === totalBlocks`. The concrete calls in this body are `querySelector()`, `getElementById()`, `setInterval()`, `repeat()`, `setAttribute()`.

## Potential weak points

It assumes the boot progress, fill and status nodes exist, and its timer sequence is not cancelled if the page is torn down mid-boot.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
