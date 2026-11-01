# Catalogue data

## Purpose

Program and author JSON metadata, 76 CHIP-8 ROM binaries, and associated preview images under `web/public/roms/`.

## Data and control flow

The build serves `web/public/roms/` as static files. `EmulatorBridge.loadCatalog()` fetches `programs.json` and `authors.json`; each program object is keyed by a slug. `images` values are paths relative to the catalogue base URL, while the ROM is fetched from `roms/<slug>.ch8`. Authors are joined by the values in a game's `authors` array. Image previews are presentation assets only and are not passed to the emulator.

## Covered files

- [web/public/roms/programs.json](./programs-json/README.md) — Program schema and the 76 slug-keyed catalogue records.
- [web/public/roms/authors.json](./authors-json/README.md) — Author-keyed display metadata with optional contact fields.
- [web/public/roms/roms/](./roms/README.md) — Raw CHIP-8 `.ch8` program byte streams; one filename per catalogue slug.
- [web/public/roms/media/](./media/README.md) — GIF/PNG preview artwork grouped by game/slug.

## Glossary

- **Slug:** A stable lower/camel-case identifier used as a metadata key and ROM basename.
- **ROM:** Read-only memory image/program bytes loaded into the CHIP-8 virtual machine.
- **Relative asset path:** A path resolved against the store's configured base URL.
