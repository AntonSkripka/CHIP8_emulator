# Developer interface

## Purpose

Editor synchronization, virtual-disk controls, register/stack inspection, memory-map visualization and the animated canvas background. The terminal shell is documented in the application-shell chapter.

## Data and control flow

Managers receive browser elements and emulator/disk adapters from the application bootstrap. Input events update editor overlays or view state; emulator frames refresh debugger information and draw memory/display data. Disk actions either load source into the editor or hand binary bytes to the emulator.

## Covered files

- [web/src/ui/animated_background.js](./web-src-ui-animated-background-js/README.md) — DPR-aware, theme-aware tiled canvas background respecting visibility and reduced-motion preferences.
- [web/src/ui/disk_ui.js](./web-src-ui-disk-ui-js/README.md) — Virtual-disk list, delete confirmation, and source-versus-ROM file actions.
- [web/src/ui/editor_manager.js](./web-src-ui-editor-manager-js/README.md) — Editor input/scroll synchronization for line numbers and syntax highlighting.
- [web/src/ui/emulator_monitor.js](./web-src-ui-emulator-monitor-js/README.md) — Register and data-stack inspector rendering.
- [web/src/ui/memory_map_view.js](./web-src-ui-memory-map-view-js/README.md) — Canvas visualization and pan/zoom/address inspection of 4 KiB memory.

## Glossary

- **DPR:** Device-pixel ratio: physical pixels per CSS pixel.
- **Overlay:** A visual layer aligned with another control.
- **VFS:** The virtual filesystem exposed by the emulator.
