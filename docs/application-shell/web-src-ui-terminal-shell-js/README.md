# `web/src/ui/terminal_shell.js`

## Purpose

Screen state, boot animation, menus, themes, emulator initialization and store mounting.

## Detailed flow

Module evaluation binds the real `document`/`window`, constructs theme/background managers, caches shell elements and initializes boot/theme state. Delegated click and keydown listeners handle menu/theme selection, screen changes and escape behavior. Emulator setup is memoized through `emulatorStartPromise`; store setup reuses one bridge and dynamically imports/mounts React only once. The closing handlers are local helpers and the React app owns its own modal event listener.

## Function/component pages

- [`animateBoot`](./functions/animateboot.md)
- [`showScreen`](./functions/showscreen.md)
- [`handleMenuKey`](./functions/handlemenukey.md)
- [`handleSettingsKey`](./functions/handlesettingskey.md)
- [`handleAction`](./functions/handleaction.md)
- [`openEmulator`](./functions/openemulator.md)
- [`initializeEmulator`](./functions/initializeemulator.md)
- [`openGameStore`](./functions/opengamestore.md)
- [`selectThemeOption`](./functions/selectthemeoption.md)
- [`applySelectedTheme`](./functions/applyselectedtheme.md)
- [`updateThemeOptions`](./functions/updatethemeoptions.md)
- [`updateMenuSelection`](./functions/updatemenuselection.md)
- [`focusMenuOption`](./functions/focusmenuoption.md)

## Dependencies and exact paths

- **File:** `web/src/ui/terminal_shell.js`
- **Chapter:** [Application shell](../README.md)
- **Direct dependencies/data:** `../app/main.js`, `../themes/theme_manager.js`, `./animated_background.js`, and `../shop/services/emulator_bridge.js`; dynamically imports `../shop/main.jsx`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
