# `GameDetails`

**Source:** `web/src/shop/components/GameDetails/GameDetails.jsx` · **Declaration:** `GameDetails({ game, authors, imageUrl, busy, error, isClosing, onClose, onAnimationEnd, onSave, onLoad })`

## Essence

Renders the selected game's accessible portal dialog, optional metadata/description/instructions, and guarded save/run buttons.

## Contract

- **Input:** Props `{ game, authors, imageUrl, busy, error, isClosing, onClose, onAnimationEnd, onSave, onLoad }`.
- **Output:** A portal-backed dialog element with preview, metadata, optional description/instructions, alert and run/save controls.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

It portals into `document.body`, derives extra fields by excluding `DISPLAYED_FIELDS`, and regards missing platform or case-insensitive `chip8` as runnable. Backdrop clicks close only when target equals currentTarget; callbacks are delegated to props.

## Potential weak points

It gives the dialog ARIA modal semantics but does not itself trap focus or restore focus to the opener; those behaviors are not implemented in this component.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
