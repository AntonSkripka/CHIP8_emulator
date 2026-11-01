# `web/src/shop/components/GameDetails/GameDetails.jsx`

## Purpose

Portal-based detail dialog, metadata display and save/run controls.

## Detailed flow

The detail view creates a portal in `document.body`, presents an accessible modal dialog and handles backdrop-only clicks. Known fields are rendered in dedicated sections; other game properties become metadata rows via `formatValue`. It disables run/save for busy actions and non-CHIP-8 platforms. The caller owns animation completion and action behavior.

## Function/component pages

- [`GameDetails`](./functions/gamedetails.md)
- [`formatValue`](./functions/formatvalue.md)

## Dependencies and exact paths

- **File:** `web/src/shop/components/GameDetails/GameDetails.jsx`
- **Chapter:** [Game store](../README.md)
- **Direct dependencies/data:** React `createPortal`, catalog formatters, and `GameDetails.styled.jsx` components.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
