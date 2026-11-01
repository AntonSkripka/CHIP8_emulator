# `web/src/ui/animated_background.js`

## Purpose

DPR-aware, theme-aware tiled canvas background respecting visibility and reduced-motion preferences.

## Detailed flow

Construction allocates three canvas contexts, stores viewport/motion state, subscribes to resize, visibility, theme and media-query changes, then sizes and draws. Resize and theme events regenerate two offscreen sprites. A bounded timer schedules animation frames; drawing interpolates deterministic cell noise and applies higher brightness for blue. Reduced motion draws a static frame and hidden documents cancel pending work.

## Function/component pages

- [`constructor`](./functions/constructor.md)
- [`resize`](./functions/resize.md)
- [`refreshTheme`](./functions/refreshtheme.md)
- [`createGlowSprite`](./functions/createglowsprite.md)
- [`requestFrame`](./functions/requestframe.md)
- [`handleVisibilityChange`](./functions/handlevisibilitychange.md)
- [`handleThemeChange`](./functions/handlethemechange.md)
- [`handleMotionPreferenceChange`](./functions/handlemotionpreferencechange.md)
- [`draw`](./functions/draw.md)
- [`hash`](./functions/hash.md)

## Dependencies and exact paths

- **File:** `web/src/ui/animated_background.js`
- **Chapter:** [Developer interface](../README.md)
- **Direct dependencies/data:** Injected DOM/window references, canvas 2D contexts, `--background-color`/`--accent-color`, and `themechange`/media-query events.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
