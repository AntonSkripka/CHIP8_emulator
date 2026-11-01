# `get`

## Essence
Reads a value by key from `disk_store`.

## Contract
- **Input:** `key`.
- **Output:** Promise resolving to the request result (which may be `undefined` if the key is absent).
- **Side effects:** Opens a readonly transaction and issues a `get` request.
- **Errors:** Rejects with `request.error` on request error.

## Internals
Creates a transaction on `disk_store` with mode `readonly`, obtains the object store, calls `get(key)`, and settles the Promise from the request handlers.

## Potential weak points
When the key is absent, the request succeeds with `undefined`; this method does not substitute a default value or distinguish absence from a stored `undefined`.

## Glossary
- **Readonly:** operation mode that does not request writes.
