# `web/public/roms/media/`

## Purpose

GIF/PNG preview artwork grouped by game/slug.

## Detailed flow

This directory holds GIF and PNG preview artwork grouped into game-named subdirectories. A program record's `images` array contains paths such as `media/<slug>/preview.gif`; the store resolves them against its static asset base and uses the first image as the card/detail preview. These images are presentation-only and do not enter the emulator ROM or virtual disk. No per-image page is maintained.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `web/public/roms/media/`
- **Chapter:** [Catalogue data](../README.md)
- **Direct dependencies/data:** Image paths in each catalogue entry's `images` array.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
