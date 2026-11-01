# LanguageError — constructor

**Summary:** Create source diagnostic.

**Source:** `web/src/compiler/errors.js` (line 2)

## Contract

- **Input:** `code`: source program text to assemble; `message`: human-readable diagnostic message; `span`: source-coordinate object attached to the diagnostic
- **Output:** No value; initializes an `Error` with code, location, span, and optional filename fields.
- **Side effects:** Sets `name`, `code`, `line`, `column`, `span`, optional `fileName`, and formatted message.

## Implementation

Formats the code and source location in the message and stores structured diagnostic fields.

**Possible weak points**: The supplied span is retained by reference; callers must provide usable line/column fields for a meaningful location.

## Terms

A **span** stores source coordinates. A **diagnostic code** identifies the error category; the message carries its readable explanation.
