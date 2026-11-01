# `web/styles/style.css`

## Purpose

Global shell, screen, terminal, emulator, editor, disk, responsive and motion styles.

## Detailed flow

The stylesheet consumes the custom properties from `themes.css` to provide the fixed background canvas and terminal shell, boot/home/settings/about/shop screens, emulator panels, display/memory canvases, register/stack monitor, editor overlays, disk list and ROM drop zone. State classes such as `.is-selected`, `.dragover`, `.panning`, `.success` and `.error` reflect JavaScript-controlled interaction/status. Breakpoints at 1050, 640 and 480 pixels rearrange controls; a `prefers-reduced-motion` rule suppresses nonessential animation.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `web/styles/style.css`
- **Chapter:** [Themes and styles](../README.md)
- **Direct dependencies/data:** Theme tokens from `themes.css`; class/id hooks in `web/index.html` and the UI modules.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
