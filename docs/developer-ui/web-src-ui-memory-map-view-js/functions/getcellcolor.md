# `getCellColor`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `getCellColor(address, value)`

## Essence

Maps a memory address/value pair to different colors for interpreter/font memory and program memory.

## Contract

- **Input:** `address, value` from the source declaration.
- **Output:** A CSS color string selected from address region and byte value.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Maps a memory address/value pair to different colors for interpreter/font memory and program memory. Control is gated by `address < 0x200`, `value === 0`. The concrete calls in this body are `rgba()`, `rgb()`, `min()`. Return paths include `value === 0 ? 'rgba(20, 30, 50, 0.5)' : `rgb(0, 100, ${50 + value * 0.5})``, `'rgba(30, 30, 30, 0.5)'`, ``rgb(0, ${Math.min(255, 50 + value * 0.8)}, 50)``.

## Potential weak points

The mapping assumes a fixed 64×64 grid and a 4096-byte address space; changing the core memory geometry would make the hard-coded bound stale.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
