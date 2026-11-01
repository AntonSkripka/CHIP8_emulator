# `performAction`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `performAction(action)`

## Essence

Clears errors, sets busy state, awaits a store action, presents failures and always clears busy state.

## Contract

- **Input:** `action` from the source declaration.
- **Output:** A Promise resolving to `undefined`; the result of `action()` is awaited but not returned, and action rejection is converted to error state.
- **Side effects:** Updates React state. Logs an error or warning through the supplied logger/console.

## Deep explanation

Clears errors, sets busy state, awaits a store action, presents failures and always clears busy state. The concrete calls in this body are `setError()`, `setBusy()`, `action()`, `error()`.

## Potential weak points

The shared `busy` state serializes visible buttons, but the action wrapper itself does not cancel a pending Promise when the component unmounts.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
