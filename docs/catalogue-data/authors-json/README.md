# `web/public/roms/authors.json`

## Purpose and format

UTF-8 JSON object keyed by author identifier. A value is an object with optional `name`, `email`, and `url` strings; some records are empty objects. Program records refer to these identifiers through their `authors` arrays.

## Data flow

`EmulatorBridge.loadCatalog()` fetches this file alongside `programs.json`. `authorLine()` looks up each author key and uses `name` when present, otherwise the raw key. Contact fields are catalogue metadata and are not used in the current store rendering.

## Weak points

The bridge checks only the root object shape. Duplicate/missing identifiers and invalid contact values are not validated; missing display names fall back to identifiers.

## Glossary

- **Author key:** Identifier referenced from a program record.
- **Fallback:** A safe display value used when optional data is absent.
