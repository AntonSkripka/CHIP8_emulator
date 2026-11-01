# `put`

## Essence
Writes or replaces a value under a key in `disk_store`.

## Contract
- **Input:** `key`, `value`.
- **Output:** Promise resolving without a value when the request succeeds.
- **Side effects:** Opens a readwrite transaction and issues `put(value, key)`.
- **Errors:** Rejects with `request.error` on request error.

## Internals
Uses the `disk_store` object store in `readwrite` mode and resolves on request success.

## Potential weak points
The Promise resolves on the request's `onsuccess`, not the transaction's `oncomplete`; it therefore does not expose a separate transaction-commit result to its caller.

## Glossary
- **Readwrite:** transaction mode that permits reads and writes.
