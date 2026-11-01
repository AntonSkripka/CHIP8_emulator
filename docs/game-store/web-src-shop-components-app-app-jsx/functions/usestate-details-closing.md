# `useState` — details closing

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useState(false)` → `[isDetailsClosing, setIsDetailsClosing]`

## Essence

Marks whether the details panel is playing its exit animation.

## Contract

- **Input:** `false` until closing starts. React also returns the matching setter.
- **Output:** Current value and setter; setter schedules a component render.
- **Side effects:** Registers this state slot; later calls to its setter schedule a React render.

## Deep explanation

The close handler flips this flag once; the backdrop animation-end callback clears selection only when the event target is the backdrop.

## Potential weak points

The flag resets only through the animation-end path; an absent animation event can leave it true.

## Glossary

- **Exit animation:** Visual transition played while removing a UI element.
- **Transient prop:** A styling prop not forwarded as a normal HTML attribute.
