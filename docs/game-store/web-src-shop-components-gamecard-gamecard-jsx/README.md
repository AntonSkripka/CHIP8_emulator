# `web/src/shop/components/GameCard/GameCard.jsx`

## Purpose

A single selectable title card with preview, author/year and optional description.

## Detailed flow

This presentational component derives the displayed release year and author line, then renders a button-like card. It uses lazy image loading when a URL exists, an accessible-hidden placeholder otherwise, and invokes the supplied selection callback from the card button.

## Function/component pages

- [`GameCard`](./functions/gamecard.md)

## Dependencies and exact paths

- **File:** `web/src/shop/components/GameCard/GameCard.jsx`
- **Chapter:** [Game store](../README.md)
- **Direct dependencies/data:** `authorLine`/`releaseYear` from `../../utils/catalog.js` and styled components in this directory.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
