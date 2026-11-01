# `web/public/roms/roms/`

## Purpose

Raw CHIP-8 `.ch8` program byte streams; one filename per catalogue slug.

## Detailed flow

This directory contains raw CHIP-8 `.ch8` byte streams. Files are named from the catalogue slug (`programs.json` key), and the bridge fetches `roms/<slug>.ch8` relative to the configured catalogue base. These bytes are loaded into the virtual machine; they are not JavaScript modules or text assembly. The directory is copied as static public assets by Vite; there is intentionally no page per individual ROM.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `web/public/roms/roms/`
- **Chapter:** [Catalogue data](../README.md)
- **Direct dependencies/data:** Slug keys from `programs.json`; fetched by the store bridge as `roms/<slug>.ch8`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
