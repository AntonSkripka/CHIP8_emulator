# `closeDetails`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `closeDetails()`

## Essence

Begins the details-panel exit animation once and clears any prior action error.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Updates React state.

## Deep explanation

Begins the details-panel exit animation once and clears any prior action error. Control is gated by `selectedSlug && !isDetailsClosing`. The concrete calls in this body are `setIsDetailsClosing()`, `setError()`.

## Potential weak points

The `selectedSlug` remains set until the backdrop animation ends; a missing animation event leaves the dialog mounted.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
