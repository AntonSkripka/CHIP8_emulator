# `showScreen`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `showScreen(name)`

## Essence

Makes exactly the requested shell screen visible and moves focus to the appropriate control.

## Contract

- **Input:** `name` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates DOM nodes or focus/selection state.

## Deep explanation

When changing screens it resets page scroll, records the new screen name and toggles `hidden` across the cached screen list. It then places focus on the menu item, selected theme option or emulator title for the supported destinations.

## Potential weak points

The requested name must correspond to one of the cached screen IDs; an unknown name hides every known screen and focuses none.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
