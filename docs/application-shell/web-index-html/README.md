# `web/index.html`

## Purpose

Static accessible DOM shell, menus, screen containers and emulator/store controls.

## Detailed flow

The document is a static screen host, not a module with runtime functions. It links the theme and global styles, provides boot/home/settings/about/emulator/shop sections, and exposes the IDs consumed by the shell and managers. The emulator screen contains display and memory canvases, debug/stack panels, source editor and status, virtual-disk list, and accessible file drop/input controls. The final module script loads the terminal shell.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `web/index.html`
- **Chapter:** [Application shell](../README.md)
- **Direct dependencies/data:** `./styles/themes.css`, `./styles/style.css`, and module entry `./src/ui/terminal_shell.js`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
