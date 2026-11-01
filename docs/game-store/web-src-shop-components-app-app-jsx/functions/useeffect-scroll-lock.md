# `useEffect-scroll-lock`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useEffect(() => lockScroll(selectedSlug), [selectedSlug])`

## Essence

Locks root scrolling while a game is selected and restores prior overflow/scroll position during cleanup.

## Contract

- **Input:** `selectedSlug`; uses `document.documentElement`, `window.scrollY`, and the shop screen's `hidden` state.
- **Output:** No rendered value; React runs it when `selectedSlug` changes and executes cleanup when the slug changes/unmounts.
- **Side effects:** Writes root `style.overflow` and calls `window.scrollTo` during cleanup.

## Deep explanation

It saves root overflow and `window.scrollY`, sets overflow hidden, then restores prior overflow and scrolls to the saved Y only if the shop screen is still visible; otherwise scrolls to zero.

## Potential weak points

It restores the previous overflow but deliberately resets scroll to zero when the shop is no longer visible, rather than restoring the saved position.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
