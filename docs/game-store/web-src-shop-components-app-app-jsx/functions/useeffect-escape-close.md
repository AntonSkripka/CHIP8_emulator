# `useEffect-escape-close`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useEffect(() => addEscapeListener(selectedSlug, isDetailsClosing), [selectedSlug, isDetailsClosing])`

## Essence

Adds a capture-phase Escape listener while details are open and removes it when dependencies change or the modal closes.

## Contract

- **Input:** `selectedSlug`, `isDetailsClosing`, and document keydown events.
- **Output:** No rendered value; registers a capture listener only while a slug is selected and closing has not begun.
- **Side effects:** Adds/removes a capture-phase `document` keydown listener.

## Deep explanation

A capture-phase document listener prevents default and propagation for Escape, then invokes `closeDetails`; cleanup removes the same listener.

## Potential weak points

Escape is captured only while details are open and not already closing; other keys and focus containment are not handled by this listener.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
