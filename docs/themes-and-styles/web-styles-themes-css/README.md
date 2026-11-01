# `web/styles/themes.css`

## Purpose

Theme-specific values for mono, green, amber and blue palettes.

## Detailed flow

The stylesheet defines the initial root tokens and overrides them under `:root[data-theme="mono"]`, `"green"`, `"amber"` and `"blue"`. Each palette supplies background/surface/text/accent/border/shadow and glow values; green is the default when no theme attribute is present. Additional paired selectors tune image/filter or shared accent effects by palette. JavaScript sets only the `data-theme` name; CSS resolves the actual values.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `web/styles/themes.css`
- **Chapter:** [Themes and styles](../README.md)
- **Direct dependencies/data:** Root `data-theme` names written by `ThemeManager` in `web/src/themes/theme_manager.js`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
