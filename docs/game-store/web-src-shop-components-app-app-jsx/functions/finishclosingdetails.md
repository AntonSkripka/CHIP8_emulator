# `finishClosingDetails`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `finishClosingDetails()`

## Essence

Clears the selected slug and closing flag after the exit animation finishes.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Updates React state.

## Deep explanation

Clears the selected slug and closing flag after the exit animation finishes. The concrete calls in this body are `setSelectedSlug()`, `setIsDetailsClosing()`.

## Potential weak points

It depends on the backdrop's animation-end event reaching the handler; removing or overriding the animation can leave the selected slug set.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
