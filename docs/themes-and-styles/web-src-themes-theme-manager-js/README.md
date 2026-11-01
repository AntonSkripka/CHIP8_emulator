# `web/src/themes/theme_manager.js`

## Purpose

Theme names, persistence, validation, application and change notification.

## Detailed flow

The manager has four supported names and a green fallback. Construction reads local storage defensively and immediately applies the result. Setting a theme validates before mutation, changes the root dataset and broadcasts `themechange`, then persists it; storage errors are logged without reverting the active theme.

## Function/component pages

- [`constructor`](./functions/constructor.md)
- [`readSavedTheme`](./functions/readsavedtheme.md)
- [`setTheme`](./functions/settheme.md)
- [`apply`](./functions/apply.md)
- [`getTheme`](./functions/gettheme.md)

## Dependencies and exact paths

- **File:** `web/src/themes/theme_manager.js`
- **Chapter:** [Themes and styles](../README.md)
- **Direct dependencies/data:** Browser document/storage interfaces, `CustomEvent`, and CSS theme tokens in `web/styles/themes.css`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
