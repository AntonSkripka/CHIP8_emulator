# `constructor`

## Essence
Wraps an already-open IndexedDB database.

## Contract
- **Input:** `database`, an IndexedDB database object.
- **Output:** An `IndexedDbStore` instance.
- **Side effects:** None.

## Internals
Stores the database for use by `get` and `put`.

## Potential weak points
It stores any database object without checking for `disk_store`; `get` or `put` then fails when its transaction requests that missing object store.

## Glossary
- **Database handle:** object representing an opened database connection.
