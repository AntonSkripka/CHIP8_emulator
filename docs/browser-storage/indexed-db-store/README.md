# `IndexedDbStore`

**Source:** `web/src/storage/indexed_db_store.js`

## Purpose

Provides a small Promise-based wrapper around IndexedDB database opening and keyed reads/writes.

## Operation

The static `open` method opens the named/versioned database and creates `disk_store` during an upgrade only if it does not already exist. On success it wraps the database instance. `get` performs a readonly transaction; `put` performs a readwrite transaction. Both settle their Promise from the request's success or error event.

## Method pages

Each class method, including static `open`, has an individual page in this directory.

## Terms

- **IndexedDB:** browser database for persistent structured data.
- **Object store:** named IndexedDB collection of keyed values.
- **Transaction:** database operation context with a selected access mode.
