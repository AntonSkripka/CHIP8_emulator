# Themes and styles

## Purpose

Theme persistence and notifications, root CSS variables, global layout styling and the Emotion theme object used by the game store.

## Data and control flow

`ThemeManager` validates a saved/selected name, applies it to `document.documentElement.dataset.theme`, dispatches `themechange`, and attempts to persist it. `themes.css` maps the four names to CSS custom properties; `style.css` consumes those tokens to style the shell and tools. Store components read the same CSS-variable references through `web/src/shop/constans/theme.js`.

## Covered files

- [web/src/themes/theme_manager.js](./web-src-themes-theme-manager-js/README.md) — Theme names, persistence, validation, application and change notification.
- [web/styles/themes.css](./web-styles-themes-css/README.md) — Theme-specific values for mono, green, amber and blue palettes.
- [web/styles/style.css](./web-styles-style-css/README.md) — Global shell, screen, terminal, emulator, editor, disk, responsive and motion styles.
- [web/src/shop/constans/theme.js](./web-src-shop-constans-theme-js/README.md) — Frozen Emotion theme object containing references to CSS custom properties.

## Glossary

- **CSS custom property:** A `--name` variable resolved by CSS at runtime.
- **Theme token:** A reusable color/effect value shared by components.
- **Emotion:** The CSS-in-JS library used by store styled components.
