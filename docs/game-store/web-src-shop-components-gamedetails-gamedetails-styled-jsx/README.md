# `web/src/shop/components/GameDetails/GameDetails.styled.jsx`

## Purpose

Dialog/backdrop, animation keyframes, metadata, sections, errors and action buttons.

## Detailed flow

Defines paired entrance/exit keyframes and theme-aware styled elements for the fixed backdrop, sliding panel, metadata, sections and buttons. Transient `$isClosing` chooses animations and disables panel pointer events while closing. Responsive rules make the panel full width on narrow screens.

## Function/component pages

- [`DetailsBackdrop`](./functions/detailsbackdrop.md)
- [`DetailsPanel`](./functions/detailspanel.md)
- [`DetailsHeader`](./functions/detailsheader.md)
- [`DetailsKicker`](./functions/detailskicker.md)
- [`DetailsTitle`](./functions/detailstitle.md)
- [`buttonStyles`](./functions/buttonstyles.md)
- [`DetailsCloseButton`](./functions/detailsclosebutton.md)
- [`DetailsImage`](./functions/detailsimage.md)
- [`DetailsImagePlaceholder`](./functions/detailsimageplaceholder.md)
- [`DetailsMeta`](./functions/detailsmeta.md)
- [`DetailsMetaItem`](./functions/detailsmetaitem.md)
- [`DetailsMetaLabel`](./functions/detailsmetalabel.md)
- [`DetailsMetaValue`](./functions/detailsmetavalue.md)
- [`DetailsSection`](./functions/detailssection.md)
- [`DetailsSectionTitle`](./functions/detailssectiontitle.md)
- [`DetailsSectionBody`](./functions/detailssectionbody.md)
- [`StoreError`](./functions/storeerror.md)
- [`DetailsActions`](./functions/detailsactions.md)
- [`StoreButton`](./functions/storebutton.md)
- [`StorePrimaryButton`](./functions/storeprimarybutton.md)

## Dependencies and exact paths

- **File:** `web/src/shop/components/GameDetails/GameDetails.styled.jsx`
- **Chapter:** [Game store](../README.md)
- **Direct dependencies/data:** Emotion `styled` and theme values from `ThemeProvider`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
