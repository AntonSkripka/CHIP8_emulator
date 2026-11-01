# `vite.config.js`

## Purpose

Vite root/base, React plugin and production output configuration.

## Detailed flow

The config derives the repository root from its own module URL, sets Vite's application root to `web/`, and uses `./` as the base so generated links work from a relative deployment path. The React plugin transforms JSX. Production output is written to the repository-level `dist/`, which is emptied before each build so stale assets are not retained.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `vite.config.js`
- **Chapter:** [Project build and delivery](../README.md)
- **Direct dependencies/data:** Vite, `@vitejs/plugin-react`, and source assets in `web/`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
