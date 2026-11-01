# `handleKeyDown`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `handleKeyDown(event)`

## Essence

Intercepts Escape while the details dialog is open and initiates its close animation.

## Contract

- **Input:** `event` from the source declaration.
- **Output:** No value; for an Escape event it prevents default/propagation and calls `closeDetails()`. The effect registers this callback only while details are open and not closing.
- **Side effects:** May prevent the Escape event and start the details close transition.

## Deep explanation

Intercepts Escape while the details dialog is open and initiates its close animation. Control is gated by `event.key === 'Escape'`. The concrete calls in this body are `preventDefault()`, `stopPropagation()`, `closeDetails()`.

## Potential weak points

The listener handles only Escape and only while details are open; it does not trap Tab focus or return focus to the card that opened the dialog.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
