# `web/src/shop/components/App/App.jsx`

## Purpose

Catalogue loading, genre filtering, modal lifecycle and action state.

## Detailed flow

The component fetches metadata in an effect with an active flag to ignore a late result after unmount. Memoized derivations sort programs, count genres and build the filter list. A second effect locks page scrolling while details are open and restores it on cleanup; another capture-phase Escape listener closes the dialog. Async actions share busy/error handling. The JSX renders loading/error states, filters, cards and selected details.

## Function/component pages

- [`App`](./functions/app.md)
- [`closeDetails`](./functions/closedetails.md)
- [`finishClosingDetails`](./functions/finishclosingdetails.md)
- [`performAction`](./functions/performaction.md)
- [`handleKeyDown`](./functions/handlekeydown.md)
- [`useState-catalog`](./functions/usestate-catalog.md)
- [`useState-selected-slug`](./functions/usestate-selected-slug.md)
- [`useState-details-closing`](./functions/usestate-details-closing.md)
- [`useState-error`](./functions/usestate-error.md)
- [`useState-busy`](./functions/usestate-busy.md)
- [`useState-filter-genre`](./functions/usestate-filter-genre.md)
- [`useEffect-catalogue-loading`](./functions/useeffect-catalogue-loading.md)
- [`useMemo-sorted-games`](./functions/usememo-sorted-games.md)
- [`useMemo-genre-counts`](./functions/usememo-genre-counts.md)
- [`useMemo-sorted-genres`](./functions/usememo-sorted-genres.md)
- [`useEffect-scroll-lock`](./functions/useeffect-scroll-lock.md)
- [`useEffect-escape-close`](./functions/useeffect-escape-close.md)
- [`useMemo-filtered-games`](./functions/usememo-filtered-games.md)

## Dependencies and exact paths

- **File:** `web/src/shop/components/App/App.jsx`
- **Chapter:** [Game store](../README.md)
- **Direct dependencies/data:** React state/effect/memo hooks, `GameCard`, `GameDetails`, bridge methods and styled exports.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
