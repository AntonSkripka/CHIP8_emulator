# `showStatus`

## Essence
Displays a status message and clears successful messages after two seconds.

## Contract
- **Input:** `message`; optional `type`, default empty string.
- **Output:** None.
- **Side effects:** Sets `textContent` and `className`; for `success`, schedules a 2-second clearing timeout.

## Internals
Assigns the message and type directly to the status element. Only the exact type `'success'` schedules a callback that empties both fields.

## Potential weak points
There is no timeout cancellation or stale-message check; an earlier success timeout can clear a newer status. Other statuses do not auto-clear.

## Glossary
- **Status element:** DOM element used to display the operation result.
