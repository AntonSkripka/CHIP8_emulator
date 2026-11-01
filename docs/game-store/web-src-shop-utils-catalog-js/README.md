# `web/src/shop/utils/catalog.js`

## Purpose

Author and release display helpers.

## Detailed flow

These pure formatting helpers map author IDs through the author metadata and provide stable display fallbacks. Year parsing only recognizes a four-digit prefix; releaseDate otherwise preserves its input.

## Function/component pages

- [`authorLine`](./functions/authorline.md)
- [`releaseYear`](./functions/releaseyear.md)
- [`releaseDate`](./functions/releasedate.md)

## Dependencies and exact paths

- **File:** `web/src/shop/utils/catalog.js`
- **Chapter:** [Game store](../README.md)
- **Direct dependencies/data:** Catalogue author/release values from `web/public/roms/programs.json` and `authors.json`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
