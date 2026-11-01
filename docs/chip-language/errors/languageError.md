# languageError

**Summary:** Build location-aware error.

**Source:** `web/src/compiler/errors.js` (line 16)

## Contract

- **Input:** `code`: source program text to assemble; `message`: human-readable diagnostic message; `tokenOrNode`: token or AST node that may carry a `span` field
- **Output:** A `LanguageError` instance (the helper returns it; it does not throw it).
- **Side effects:** Creates and returns an error object; it does not throw it itself.

## Implementation

Chooses `tokenOrNode.span`, the argument itself, or a default location, then returns a `LanguageError`. The helper prefers `tokenOrNode.span`, falls back to the argument itself, then uses `{ line: 1, column: 1 }`; it returns a constructed error rather than throwing it.

**Possible weak points**: A truthy `span` is used as-is when it has no `.span`; malformed location objects are not normalized.

## Terms

A **span** stores source coordinates. A **diagnostic code** identifies the error category; the message carries its readable explanation.
