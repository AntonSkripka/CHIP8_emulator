# `web/src/shop/main.jsx`

## Purpose

React root mounting and Emotion ThemeProvider composition.

## Detailed flow

The entry creates a React root for the supplied DOM element and wraps the `App` in `ThemeProvider`. The bridge is passed as a prop, so catalogue/network/emulator operations remain behind the service adapter.

## Function/component pages

- [`mountGameStore`](./functions/mountgamestore.md)

## Dependencies and exact paths

- **File:** `web/src/shop/main.jsx`
- **Chapter:** [Game store](../README.md)
- **Direct dependencies/data:** React `createRoot`, `ThemeProvider`, `App`, and `web/src/shop/constans/theme.js`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
