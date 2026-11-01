# `web/public/roms/programs.json`

## Purpose and format

UTF-8 JSON object with 76 entries. Each top-level key is the stable game slug used by the store and ROM filename. A record commonly contains `title` (string), `authors` (array of author keys), `images` (array of relative media paths), optional `desc`, `howto`, `genre`, `event`, `release`, `platform`, and `options`.

`release` is represented as a date-like string; the UI extracts a leading four-digit year for cards and displays the full value in details. `platform` is usually `chip8`; missing platform is treated as supported by the UI. `options` is an emulator-options object whose keys vary by title (for example `tickrate`, palette colors and quirk flags); values can be strings, numbers, or booleans and are passed to the emulator bridge without schema coercion.

## References and flow

For slug `example`, ROM bytes are fetched from `web/public/roms/roms/example.ch8`. Each `images` item resolves against the catalogue asset base, e.g. `media/example/preview.gif`; the same path is used by cards/details, not by the CPU. `authors` values join to keys in `web/public/roms/authors.json`; unknown keys remain displayable as their raw key.

## Weak points

There is no complete runtime schema validation: the bridge checks only that the JSON root is a non-array object. Missing fields are handled selectively by the UI, so maintainers must keep slugs, ROM filenames, image paths and author keys aligned.

## Glossary

- **Slug:** Stable key and ROM basename.
- **Options:** Per-program emulator configuration passed through to the emulator.
- **Relative path:** Asset path resolved from the store's base URL.
