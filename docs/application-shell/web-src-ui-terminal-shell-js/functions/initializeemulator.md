# `initializeEmulator`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `initializeEmulator()`

## Essence

Shares one in-flight emulator startup promise, records a successful application, and converts failures to a status message.

## Contract

- **Input:** No arguments.
- **Output:** The shared startup Promise resolving to the application object on success or `null` after a handled failure.
- **Side effects:** Starts the application once and updates status; on rejection logs the failure, displays an error status and clears the retryable Promise.

## Deep explanation

It returns the existing application immediately after startup, or shares the in-flight `emulatorStartPromise` across callers. Success stores the application, marks the system started and updates status. Failure is logged, changes status, clears the promise for retry, and resolves `null` rather than rejecting.

## Potential weak points

A failed startup is converted to `null` and retry is enabled by clearing the shared Promise; callers must check the nullable result before using application services.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
