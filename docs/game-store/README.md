# Game store

## Purpose

React catalogue and detail views, Emotion styling, metadata formatting, and the adapter that transfers catalogue ROMs to the emulator/virtual disk. Shared theme constants are documented under themes-and-styles.

## Data and control flow

The terminal shell creates one `EmulatorBridge` after emulator startup and dynamically imports the store entry. `mountGameStore` renders `App`; `App` loads metadata, derives genre-filtered games, and opens a portal for details. Store actions call the bridge, which resolves asset URLs, fetches a ROM, and either loads it in the emulator or writes it to the virtual disk.

## Covered files

- [web/src/shop/main.jsx](./web-src-shop-main-jsx/README.md) — React root mounting and Emotion ThemeProvider composition.
- [web/src/shop/components/App/App.jsx](./web-src-shop-components-app-app-jsx/README.md) — Catalogue loading, genre filtering, modal lifecycle and action state.
- [web/src/shop/components/App/App.styled.jsx](./web-src-shop-components-app-app-styled-jsx/README.md) — Styled layout, toolbar, genre controls, grid and status message components.
- [web/src/shop/components/GameCard/GameCard.jsx](./web-src-shop-components-gamecard-gamecard-jsx/README.md) — A single selectable title card with preview, author/year and optional description.
- [web/src/shop/components/GameCard/GameCard.styled.jsx](./web-src-shop-components-gamecard-gamecard-styled-jsx/README.md) — Styled article, button, image, placeholder and text components.
- [web/src/shop/components/GameDetails/GameDetails.jsx](./web-src-shop-components-gamedetails-gamedetails-jsx/README.md) — Portal-based detail dialog, metadata display and save/run controls.
- [web/src/shop/components/GameDetails/GameDetails.styled.jsx](./web-src-shop-components-gamedetails-gamedetails-styled-jsx/README.md) — Dialog/backdrop, animation keyframes, metadata, sections, errors and action buttons.
- [web/src/shop/services/emulator_bridge.js](./web-src-shop-services-emulator-bridge-js/README.md) — Catalog/ROM fetches and transfer to the virtual disk or emulator.
- [web/src/shop/utils/catalog.js](./web-src-shop-utils-catalog-js/README.md) — Author and release display helpers.

## Glossary

- **Bridge:** An adapter between the store UI and emulator/disk services.
- **Portal:** React rendering into a DOM node outside the component's parent tree.
- **Slug:** The stable catalogue key used to locate a ROM file.
