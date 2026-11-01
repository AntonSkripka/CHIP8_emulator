# `web/src/ui/memory_map_view.js`

## Purpose

Canvas visualization and pan/zoom/address inspection of 4 KiB memory.

## Detailed flow

The view maps each of the 4096 addresses to a 64×64 cell, colors it by value and highlights current instruction bytes, I and pointer-selected cells. Pointer coordinates are converted from CSS client space to backing-canvas space. Wheel zoom anchors the world point under the cursor; drag moves the map; axis clamps constrain movement. Address information is cleared outside the valid grid.

## Function/component pages

- [`constructor`](./functions/constructor.md)
- [`draw`](./functions/draw.md)
- [`getCellColor`](./functions/getcellcolor.md)
- [`drawAddressMarker`](./functions/drawaddressmarker.md)
- [`strokeCell`](./functions/strokecell.md)
- [`attachInteractions`](./functions/attachinteractions.md)
- [`zoom`](./functions/zoom.md)
- [`beginPan`](./functions/beginpan.md)
- [`movePointer`](./functions/movepointer.md)
- [`endPan`](./functions/endpan.md)
- [`getCanvasPosition`](./functions/getcanvasposition.md)
- [`clampPan`](./functions/clamppan.md)
- [`centerMap`](./functions/centermap.md)
- [`clampAxis`](./functions/clampaxis.md)
- [`updateSelectedAddress`](./functions/updateselectedaddress.md)

## Dependencies and exact paths

- **File:** `web/src/ui/memory_map_view.js`
- **Chapter:** [Developer interface](../README.md)
- **Direct dependencies/data:** `Chip8Core` memory/PC/I views and a 2D canvas context.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
