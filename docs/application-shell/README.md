# Application shell

## Purpose

The HTML document, browser entry module, terminal navigation, theme selection and lazy startup of emulator/store services.

## Data and control flow

`web/index.html` defines the screen and control elements and loads `web/src/ui/terminal_shell.js`. The shell initializes theme/background behavior, controls screen visibility and keyboard navigation, and starts `web/src/app/main.js` only when entering emulator or store workflows. The application bootstrap opens browser storage, initializes the WebAssembly VFS and emulator, then wires UI/input managers and event handlers.

## Covered files

- [web/index.html](./web-index-html/README.md) — Static accessible DOM shell, menus, screen containers and emulator/store controls.
- [web/src/app/main.js](./web-src-app-main-js/README.md) — Application composition and assembly-source save flow.
- [web/src/ui/terminal_shell.js](./web-src-ui-terminal-shell-js/README.md) — Screen state, boot animation, menus, themes, emulator initialization and store mounting.

## Glossary

- **Bootstrap:** The code that creates and connects the application's runtime services.
- **Lazy initialization:** Creating a subsystem only when the user first opens it.
- **DOM:** The browser's object representation of the HTML document.
