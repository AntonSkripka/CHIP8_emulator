# CHIP-8 Emulator function reference

This document describes source-code functions and explains how they work.
Modules are grouped by responsibility. Paths are relative to the repository
root. React functions are covered separately and in more detail than other
functions, including hook ordering and effects on the UI lifecycle.

## 1. Application startup and module composition

### `web/src/ui/terminal_shell.js` — terminal shell

At module scope, the file gets references to screens and menu entries,
creates `ThemeManager` and `AnimatedBackground`, registers delegated `click`
and `keydown` handlers, and starts the boot animation. The click handler looks
for the nearest element with `data-action` or `data-theme-option`, so handlers
do not need to be attached to each UI element individually.

- **`animateBoot()`** updates the ten-block boot indicator using
  `setInterval`, synchronizes `aria-valuenow` and the status message, and,
  after the final step, clears the interval, adds the completed-boot CSS class,
  and switches to the home screen.
- **`showScreen(name)`** sets the current screen, resets scrolling when
  changing screens, and shows only the screen whose `id` matches. On the home,
  settings, or emulator screen it also moves focus to the appropriate
  interactive element.
- **`handleMenuKey(event)`** implements keyboard navigation in the main menu:
  arrow keys cycle the selection, Enter launches the selected item, and a
  digit selects the item with that number. It prevents normal page scrolling
  while handling menu navigation.
- **`handleSettingsKey(event)`** similarly moves selection between themes;
  Enter applies the current selection, digits 1–4 select and apply a theme
  immediately, and Escape returns home.
- **`handleAction(action)`** routes an action identifier to a screen,
  settings, help, catalog, or user/developer emulator mode.
- **`openEmulator(mode)`** writes the mode to `data-mode`, updates the
  heading and status, shows the screen, and then waits for application
  initialization.
- **`initializeEmulator()`** lazily starts `startApplication()` on first use.
  The shared `emulatorStartPromise` prevents parallel calls from creating
  multiple instances. On success it stores the application and updates
  status; on failure it logs the error, shows an understandable error state,
  and clears the Promise so initialization can be retried.
- **`openGameStore()`** shows the catalog screen, starts the same emulator
  services, creates `EmulatorBridge` once, and dynamically imports the React
  entry point. `gameStoreMounted` prevents remounting; if import fails, the
  flag is cleared and the error is displayed in the status.
- **`selectThemeOption(index)`** ignores invalid indexes, changes the selected
  theme, redraws the options, and moves focus to the selected option.
- **`applySelectedTheme()`** makes the selected theme active, applies and
  saves it through `ThemeManager`, then updates the indicator.
- **`updateThemeOptions()`** synchronizes `aria-checked` and CSS classes for
  each theme option; a text cursor indicates the focused selection.
- **`updateMenuSelection()`** updates the main-menu selection and cursor, then
  focuses the active option.
- **`focusMenuOption()`** moves DOM focus to the active menu option if it
  exists.

The document-level `keydown` handler also opens the file picker with Enter or
Space when focus is on the drop zone; does not intercept the catalog's Escape
while a React dialog is open; and returns home from the catalog, help, or
emulator screens.

### `web/src/app/main.js` — emulator composition entry point

- **`startApplication({ documentRef, windowRef, logger, confirmDelete, showAlert })`**
  first checks for `#app-grid`, so it does not create an emulator on a page
  without the app UI. It loads the Emscripten module and opens IndexedDB in
  parallel. It then creates `StorageBridge`, restores the disk image,
  initializes VFS, and adds Pong to an empty disk if it is not already there.
  Next it connects the WASM core, display canvas, monitors, memory map, and
  frame scheduler; attaches the editor, disk UI, keyboard, run/save buttons,
  and drag-and-drop. Finally, it starts the emulator loop and returns the
  created services to the caller.
- **`saveAssembly({...})`** trims the filename, removes unsupported
  characters, appends `.asm`, checks the virtual-filesystem filename limit and
  non-empty source text. After successfully writing UTF-8 bytes it refreshes
  the disk list, clears the editor, highlighting, and line numbers, then
  briefly displays a success message. Invalid input or a failed write exits
  before clearing the source.

### `web/src/core/load_wasm_module.js`

- **`loadWasmModule({ documentRef, globalObject, scriptUrl })`** creates and
  appends the Emscripten loader `<script>`. Once loaded, it checks for
  `createChip8`, calls the WASM factory, and resolves its Promise with the
  module. Script-load errors, a missing factory, and module-initialization
  errors reject the Promise so the caller can display a startup error.

### `web/src/shop/main.jsx`

- **`mountGameStore(element, bridge)`** creates a React root for the specified
  DOM element and renders `<App bridge={bridge} />`. Mounting is separate from
  the main terminal, so the catalog is loaded dynamically the first time it
  is opened.

## 2. React game catalog

### `web/src/shop/App.jsx` — state, catalog loading, and details handling

`App({ bridge })` is the catalog container component. It connects the
asynchronous `bridge` service to the cards and details dialog.

#### Component state: `useState`

- **`catalog`** starts as `null`. This distinguishes loading from a loaded
  catalog (which may contain no games); `null` displays `LOADING CATALOG...`.
- **`selectedSlug`** contains the selected game's identifier or `null`. The
  selected game object is derived from it; a non-null value opens
  `GameDetails`.
- **`isDetailsClosing`** separates the start of the exit animation from
  actual dialog unmounting. Closing first sets this flag; only the CSS
  animation-completion callback clears the selected game.
- **`error`** stores a catalog-loading error or an error from a game action.
  It is cleared before a new selection/action. Loading and action errors are
  displayed in an element with `role="alert"` for screen readers.
- **`busy`** prevents saving/loading buttons from being clicked again while
  an asynchronous action is in progress.

`useState` provides independent UI values; each setter triggers a render.
State is not mutated directly.

#### Catalog-loading effect: `useEffect(..., [bridge])`

After mount (and when the `bridge` object changes), the effect calls
`bridge.loadCatalog()`. A local `active` variable is a freshness flag:
cleanup sets it to `false`, so a request completing after unmount or a bridge
change cannot update the old component's state. Success stores the catalog
with `setCatalog`; failure is logged and sets a user-facing message with
`setError` only while the effect remains active. Dependency `[bridge]`
repeats loading when the service changes, but not on every render.

#### Preparing the list: `useMemo(..., [catalog])`

Before a catalog is available, the memoized value is an empty array.
Otherwise the function converts `catalog.programs` into `{ slug, ...game }`
items and sorts games by `title` using locale-aware string comparison.
`useMemo` repeats this work only when `catalog` changes, providing a
deterministic order between renders.

`selectedGame` is derived from `selectedSlug` and `catalog`: it is `null`
until a game and data are available; otherwise the matching record is
returned with its `slug`. This does not need separate state, so it cannot
become inconsistent with the list.

#### Scroll-lock effect: `useEffect(..., [selectedSlug])`

When a game is selected, the effect saves the current `window.scrollY` and
the original inline value of `document.documentElement.style.overflow`, then
sets `overflow = 'hidden'` so the background beneath the modal cannot scroll.
Cleanup restores the exact previous value rather than assuming a default.
It then restores the saved scroll position if the catalog screen is still
shown; if that screen is hidden, it scrolls to the top. With
`selectedSlug === null`, no scroll lock is applied.

#### Escape-key effect: `useEffect(..., [selectedSlug, isDetailsClosing])`

The handler is registered only while the dialog is open and not already
closing. It intercepts Escape in the capture phase, prevents the default
action and propagation, then calls `closeDetails()`. Cleanup removes the same
handler. The dependencies keep the listener aligned with the current
selection and prevent repeated close calls during the animation. When the
React dialog is open, the terminal shell separately avoids intercepting this
Escape key.

#### Action-handling functions

- **`closeDetails()`** starts closing only when a game is selected and closing
  has not already started. It sets `isDetailsClosing` and clears an old
  error, but does not clear `selectedSlug`; that keeps the dialog in the DOM
  until the exit animation ends.
- **`finishClosingDetails()`** runs when the `gameDetailsBackdropOut`
  animation ends. It clears `selectedSlug` and the closing flag, after which
  React unmounts the portal and effect cleanup restores scrolling and removes
  the keyboard listener.
- **`performAction(action)`** clears the previous error, sets `busy`, awaits
  the supplied operation, and on an exception logs it and displays its
  `message` or a fallback. `finally` clears `busy` regardless of outcome, so
  the UI is not left locked.

#### Rendering and interactions

When `catalog` is available, the component renders `GameCard` entries with
stable `key={game.slug}` values; author data and image URLs are computed
through the bridge. Selecting a card clears errors/closing state and selects
the slug. The selected game renders `GameDetails` with the current flags and
callbacks: `onSave` calls
`performAction(() => bridge.saveGame(slug))`; `onLoad` first loads the ROM
with the game's options, then starts closing the dialog on success. The
`onAnimationEnd` handler filters events and completes closing only for the
expected animation, ignoring animations on child elements.

### `web/src/shop/components/GameCard.jsx`

- **`GameCard({ game, authors, imageUrl, onSelect })`** creates a compact
  button card. `releaseYear()` extracts the year from the release date and
  `authorLine()` formats authors. When a URL exists it renders a lazily
  loaded decorative image with an empty `alt`; otherwise it shows a
  placeholder. Title, authors, year, and description are text children of the
  button, so the whole card is keyboard-activatable through `onSelect`.

### `web/src/shop/components/GameDetails.jsx`

- **`GameDetails({...})`** renders the game dialog through
  `createPortal(..., document.body)`, so the modal is not constrained by the
  catalog grid's layout context. `DISPLAYED_FIELDS` excludes fields already
  shown from the additional-metadata section. `supportsEmulator` permits
  loading and saving only when the game has no platform or
  `platform === 'chip8'`; unsupported buttons are disabled with an
  explanation in `title`. A backdrop click closes the dialog only when
  `event.target === event.currentTarget`, so clicks inside the panel do not
  count as backdrop clicks. The panel has `role="dialog"`, `aria-modal`, and
  an `aria-labelledby` relationship to its heading. Closing, saving, loading,
  and animation handling are delegated to the parent.
- **`formatValue(value)`** converts unknown metadata to readable text:
  `null`, `undefined`, and an empty string become `UNKNOWN`; objects are
  traversed recursively and rendered as `key: value` pairs separated by
  periods; primitives are converted with `String()`. This allows additional
  nested catalog fields to be displayed without a separate template for
  every shape.

### `web/src/shop/utils/catalog.js`

- **`authorLine(authors, keys = [])`** resolves author keys to display names,
  retaining the original key when no record exists. Multiple authors are
  comma-separated; an empty result becomes `UNKNOWN AUTHOR`.
- **`releaseYear(release)`** extracts only four year digits at the start of a
  release string. An unrecognized date becomes an empty string so the card
  does not show a fictitious year.
- **`releaseDate(release)`** returns the date as-is, or `UNKNOWN` if the field
  is empty.

### `web/src/shop/services/emulator_bridge.js`

- **`constructor({...})`** stores catalog/emulator dependencies (disk,
  controller, update callback), network `fetch`, base URL, document, and
  launch callback. Default `fetch` and `document` values allow browser use
  while permitting external APIs to be replaced in tests.
- **`loadCatalog()`** loads program and author JSON in parallel through
  `assetUrl()`. It checks both HTTP response statuses, parses both JSON
  documents in parallel, and verifies that both results are objects rather
  than arrays or `null`. Invalid formats and HTTP errors throw an exception
  that `App` displays to the user.
- **`loadGame(slug, options)`** loads ROM bytes, resets the emulator, runs the
  ROM with its options (for example quirks/tick rate), and calls `onLaunch`
  so the shell can switch to the emulator screen.
- **`saveGame(slug)`** loads ROM bytes, creates an unused filename, writes the
  bytes to the virtual disk, and reports a disk rejection as an error. On a
  successful write it refreshes the disk UI and returns the actual filename.
- **`assetUrl(path)`** resolves a relative path from the base URL against
  `document.baseURI`, preserving correct paths for local and subdirectory
  deployments.
- **`fetchRom(slug)`** encodes the slug for a URL, downloads the corresponding
  `.ch8`, checks the HTTP response, and converts the body to `Uint8Array`.
- **`createDiskFilename(slug)`** builds an uppercase name from safe
  characters and truncates its base to the FAT limit. It tries the name
  without a suffix and then `-2`…`-64`, checking case-insensitive collisions
  and enforcing a total limit of 17 characters including `.CH8`. It throws an
  explicit error if no free variant exists.

## 3. Assembler and code editor

### `web/src/assembler/asm.js`

- **`AssemblerError`** contains the error line number and source text. The
  exception message includes the line number and a readable explanation.
- **`asmToBin(code)`** checks that the source is a string, removes comments
  after `;`, gathers labels and addresses, then encodes instructions and
  `DB` into segments. It supports case-insensitive labels, including a label
  before an instruction on the same line, `ORG`, `DB`, decimal and `0x`
  literals; negative values are allowed only where they fit in a byte.
  Duplicate labels/addresses, crossing the 4 KiB boundary, unknown
  instructions, incorrect argument counts, invalid registers, and invalid
  values raise `AssemblerError` rather than producing a zero opcode.
- **`encodeInstruction(statement, labels)`** encodes supported base mnemonics
  and project extensions, checking operand count and type. `JP V0, addr` is
  encoded as `Bnnn`.
- **`encodeLoad(statement, args, labels)`** encodes `LD` forms for `I`, delay
  and sound timers, fonts, BCD, `[I]` operations, register-to-register
  copies, key waits, and immediate loads.
- **`parseNumber(token)`**, **`parseRegister(token)`**,
  **`requireNumber(...)`**, and **`resolveAddress(...)`** perform strict
  checks on numbers, registers, ranges, and label references; errors are
  attached to the source line.
- **`tokenize(line)`** parses arguments with optional commas and detects
  repeated, leading, and trailing commas.
- **`getSegmentSize(seg)`** sums the size of every byte element in a segment;
  it is used to check whether the next address continues that segment.
- **`escapeHtml(text)`** replaces `&`, `<`, and `>` with safe HTML entities
  before source is inserted into `innerHTML`.
- **`highlightCode(text)`** escapes source, uses a regular expression to
  highlight known mnemonics and registers with CSS classes, and appends a
  space when the text ends in a newline so the final line displays correctly
  in the overlay.

### `web/src/ui/editor_manager.js`

- **`constructor({ editor, highlightOverlay, lineNumbers, highlightCode })`**
  stores the textarea, overlay, line-number panel, and highlighting
  function. It binds handlers so the same callback can be used to subscribe
  and unsubscribe.
- **`attach()`** attaches editor input and scroll handlers, then immediately
  creates line numbers and highlighting for existing text. If there is no
  editor, it attaches nothing.
- **`detach()`** removes the same handlers without changing editor contents.
- **`handleInput()`** synchronously updates line numbers and HTML highlighting
  after text changes.
- **`handleScroll()`** synchronizes scrolling of the overlay and line panel
  with the textarea.
- **`updateLineNumbers()`** counts lines by `\n`, creates the number sequence,
  and retains a reference to the inner element for later positioning. If the
  editor or container is missing, it stops without updating.
- **`updateHighlight()`** passes current text to `highlightCode`, puts the
  result in the overlay, and synchronizes scrolling.
- **`syncHighlightScroll()`** copies the textarea's `scrollTop` and
  `scrollLeft` to the overlay and moves line-number content by the same
  vertical amount.

## 4. CHIP-8 core, display, and input

### `web/src/core/emulator_core.js` — JavaScript-to-WASM adapter

- **`constructor(module, assemble)`** stores the WASM module and assembler
  function; memory pointers remain uninitialized until `init()`.
- **`init()`** calls C initialization, then gets the addresses of V registers,
  display, and memory. If WASM exports the user-stack interface, it passes
  that interface the register pointer.
- **`step()`** executes one C interpreter step.
- **`updateTimers()`** delegates timer decrementing to the C core.
- **`setQuirks({...})`** normalizes every compatibility flag: only `true`,
  `1`, and `'1'` count as enabled, then passes four boolean values to the
  core.
- **`loadBin(code)`** calls the assembler, then validates every segment and
  element size before writing. A malformed segment is rejected before any
  memory changes.
- **`loadSegments(segments)`** validates address ranges and values for the
  entire set of segments, then writes two-byte elements as opcodes and
  one-byte elements as data.
- **`loadDataAt(addr, data)`** writes one byte through a WASM export.
- **`getDisplayPtr()`, `getMemoryPtr()`, `getVRegsPtr()`** return saved
  addresses in linear WASM memory for UI modules.
- **`getDisplayPixels(length)`** creates a `Uint8ClampedArray` view into WASM
  memory beginning at the display pointer; it returns `null` until the core
  is initialized. The view reuses the WASM buffer rather than copying pixels.
- **`getVRegistersView()`** similarly exposes a view of the 16 V-register
  bytes.
- **`getMemoryView()`** exposes a view of the 4096 bytes of CHIP-8 memory.
- **`getDrawFlag()` / `clearDrawFlag()`** read and clear the redraw flag so
  the UI does not copy the display when there are no new changes.
- **`getPC()`, `getI()`, `getSpd()`, `getStackValue(index)`,
  `getCallStackPtr()`** provide register/stack values to monitors.
- **`getStackFault()` / `getExecutionFault()`** return the sticky code for a
  user-stack or call-stack fault; if a compatible WASM module lacks the
  corresponding export, they report no fault.
- **`hasStackSupport()`** checks for the WASM function that reads user-stack
  depth and lets the UI disable stack display when the build lacks this
  extension.

### `web/src/core/chip8_emulator.js` — run control

- **`constructor({...})`** connects the core, display, monitor, memory map,
  scheduler abstraction, and logger. It sets the initial speed, loads Pong
  into memory, and initializes stack display.
- **`start()`** creates a continuous loop through the supplied
  `requestFrame` scheduler. Each frame executes instructions at
  `tickrate × 60`, limiting catch-up work after a delayed frame; timers are
  updated separately at 60 Hz. It then renders the display, updates the
  debugger and memory map, and schedules the next frame.
- **`loadBin(source)`** passes assembly source text to the core adapter.
- **`loadRom(rom, options)`** applies quirks and constrains speed to 1–10000
  (default 20). It writes each ROM byte to memory starting at `0x200`.
- **`loadDefaultPong()`** loads the demonstration Pong array as an ordinary
  ROM.
- **`reset()`** initializes the core again, restores default speed, resets
  stack UI, and clears the display.
- **`runAsm(source)`** compiles source first, and resets the machine and loads
  segments only after successful compilation. On error the previous program
  is not erased; the error is returned for the UI and written to the logger.

### `web/src/core/display.js`

- **`constructor({ canvas, core })`** stores the canvas and core, gets the
  2D context, and pre-creates a 64×32 `ImageData` buffer.
- **`render()`** checks the core's draw flag, gets a pixel view of size
  `64 × 32 × 4`, copies bytes into `ImageData`, draws it to the canvas, and
  clears the flag. If no redraw is needed or the core is not ready, it exits.
- **`clear()`** zeroes the local `ImageData` pixels and paints the entire
  canvas black.

### `web/src/input/keyboard.js`

- **`constructor({ setKey, eventTarget })`** stores the key-state callback
  and event target; it binds handlers to the instance in advance so they can
  be removed correctly by `detach()`.
- **`attach()` / `detach()`** add or remove global key-down and key-up
  handlers.
- **`handleKeyDown(event)`** maps `event.code` to a CHIP-8 hexadecimal key
  through `KEY_MAP` and sends the pressed state to the core.
- **`handleKeyUp(event)`** uses the same mapping to release the key.
  Unrecognized keys are ignored.

## 5. File loading and browser virtual disk

### `web/src/input/drop_zone.js`

- **`constructor({...})`** stores DOM elements and callbacks for writing,
  running ROMs, and refreshing the disk. It sets the ROM limit to 3584 bytes,
  binds handlers to the instance, and connects DOM events.
- **`setupEventListeners()`** prevents the browser from opening files during
  drag/drop both on the zone and on an outer event target; it sets up zone
  highlighting and drag, click, and file-selection handling.
- **`preventDragDefaults(event)`** blocks the event's default behavior and
  propagation.
- **`highlightDropZone()`** adds the visual drag-over state class.
- **`handleDragLeave(event)`** removes highlighting only when the pointer
  leaves the zone itself, preventing flicker when it moves between children.
- **`handleFileDrop(event)`** removes highlighting, takes the first file from
  `dataTransfer`, and passes it to the file handler.
- **`handleFileSelect(event)`** handles the first file from the picker and
  clears the input value so the same file can be selected again.
- **`processFile(file)`** checks the `.ch8` extension, 3584-byte maximum, and
  non-empty content. It then reads an `ArrayBuffer`, writes the ROM to the
  virtual disk, and passes bytes to the emulator only after a successful
  write. It updates status and disk listing; exceptions are logged and shown
  as a load error.
- **`isValidRomFile(filename)`** checks the `.ch8` suffix without regard to
  case.
- **`showStatus(message, type)`** sets status text and CSS class; a success
  message is cleared after two seconds.

### `web/src/storage/indexed_db_store.js`

- **`constructor(database)`** stores the open IndexedDB connection used for
  read and write transactions.
- **`IndexedDbStore.open({ indexedDBRef, name, version })`** opens the
  database and creates the `disk_store` object store during upgrade when
  needed. Success returns the adapter; an IndexedDB error rejects the
  Promise.
- **`get(key)`** reads a key in a readonly transaction and returns a Promise
  for the request result.
- **`put(key, value)`** stores a value in a readwrite transaction and
  resolves the Promise after the request succeeds.

### `web/src/storage/storage.js` — persistent disk-image storage

- **`constructor({...})`** stores WASM/IndexedDB, window/document, logger,
  and timer functions. It creates instance-bound emergency-sync handlers and
  sets image size to 1 MiB.
- **`init()`** gets the WASM disk-memory pointer and reads the saved
  `disk_image`. It either restores an image of the correct size or clears
  memory and creates an empty saved image. It starts periodic and emergency
  synchronization after initialization.
- **`startSyncLoop()`** checks disk state every three seconds.
- **`syncToDatabase()`** checks the C dirty flag and copies nothing when there
  are no changes. If dirty, it clears the flag, copies the full 1 MiB image
  into a separate `ArrayBuffer`, and writes it to IndexedDB. If the write
  fails, it logs the error and marks the image dirty again so the next
  synchronization retries.
- **`setupEmergencySync()`** registers synchronization before the tab closes
  and when the document becomes hidden.
- **`dispose()`** stops the timer and removes both emergency handlers.

### `web/src/storage/virtual_disk.js` — WASM data conversion

- **`constructor(wasmModule, { logger })`** stores the WASM interface and
  logger for C filesystem operations.
- **`_allocateString(str)`** encodes a filename as UTF-8, allocates room in
  the WASM heap, writes the bytes and a trailing NUL, and returns a pointer
  to the C string.
- **`writeFile(filename, fileBytes)`** allocates filename and content
  buffers, copies data into the heap, and invokes VFS write. C error codes
  become log messages and `false`; success returns `true`. `finally` frees
  every allocated pointer even when an exception occurs.
- **`readFile(filename)`** requests the file size by name, then allocates a
  buffer and reads the data. A missing/zero-size file or failed read returns
  `null`; success is copied into a new JS memory area before the WASM buffer
  is freed.
- **`deleteFile(filename)`** removes the entry through VFS and returns a
  boolean. Errors are logged, and the filename pointer is freed in `finally`.
- **`getFilesList()`** walks the maximum number of FAT entries, checks
  `is_used`, reads the NUL-terminated name from WASM, and adds the file size.
  Unused slots are omitted.
- **`getDiskSpaceInfo()`** obtains free bytes from FAT and calculates used
  space relative to the 1 MiB disk.

## 6. Terminal UI, diagnostics, and visualization

### `web/src/ui/disk_ui.js`

- **`constructor({...})`** stores the disk, DOM containers, editor,
  confirmation/notification functions, and callbacks for loading source or
  running ROM. Callback dependencies mean the UI need not know emulator
  implementation details directly.
- **`refresh()`** updates the disk heading and rebuilds the file list. An
  empty disk gets its own message. For each entry it creates DOM nodes,
  attaches RUN/DELETE handlers, and uses `textContent` for filenames.
  Deletion first requires confirmation; cancellation shows an alert, while
  success redraws the list.
- **`handleFileAction(filename)`** reads a file from the virtual disk. It
  decodes `.asm` as text and loads it into the editor through a callback;
  other files are passed to the ROM-run callback. Missing files trigger an
  alert, and successful actions are logged.

### `web/src/ui/emulator_monitor.js`

- **`constructor({...})`** stores the core and DOM references, initializes
  the stack UI cache, and immediately builds debugger rows.
- **`updateDebug()`** gets a live view of V registers and updates DOM only for
  registers whose values changed. It then displays PC, `I`, call-stack
  pointer, and extra-stack depth in hexadecimal/decimal format.
- **`updateStackUI()`** checks for the container and WASM stack API. If depth
  and visible range are unchanged, it does not redraw the DOM. Otherwise it
  clears the container and displays up to the 64 most recent stack values,
  from top downward.
- **`reset()`** invalidates the stack-depth cache so the next update rebuilds
  the UI.
- **`createDebugUI(debugPanel)`** creates rows for `V0`–`VF` and for PC/I/SP/SPD,
  stores references to value elements, and adds the container to the debug
  panel or falls back to `body`.
- **`appendValueRow(container, label, initialValue, className)`** creates a
  standard DOM row for a label and value, adds an optional CSS class, and
  returns the value span for future updates.

### `web/src/ui/memory_map_view.js`

- **`constructor({...})`** stores the core, canvas, tooltip, and window;
  creates a 2D context and 64×64 `ImageData` if a canvas exists; initializes
  scale, position, geometry, and selected address; centers and clamps the
  map; then connects mouse interactions.
- **`draw()`** renders 4096 memory cells as a 64×64 grid. Cell color depends
  on memory region and byte value; PC, `I`, and selected address get
  different outlines. Canvas rendering uses the current translation and
  scale.
- **`getCellColor(address, value)`** selects different colors for the system
  region below `0x200`, zero bytes, and nonzero data.
- **`drawAddressMarker(...)`** draws the PC (two-byte instruction), `I`, and
  current selection markers on their cells.
- **`strokeCell(...)`** draws a cell outline and calculates the inner/outer
  rectangle according to `inset`.
- **`attachInteractions()`** connects the mouse wheel for zoom, mouse press
  for panning, and pointer move/release on `window` so dragging continues
  outside the canvas.
- **`zoom(event)`** prevents page scrolling, finds the pointer position, and
  adjusts translation so the point beneath the cursor remains in place.
  Scale is clamped to `MIN_SCALE` and `MAX_SCALE`, then panning is clamped.
- **`beginPan(event)`** records where the pointer grabbed the map, enables
  dragging state, and adds a CSS class.
- **`movePointer(event)`** calculates and clamps a new translation while
  dragging; otherwise it updates the selected-address tooltip.
- **`endPan()`** ends dragging and removes the CSS class.
- **`getCanvasPosition(clientX, clientY)`** converts window pointer
  coordinates to the canvas's internal bitmap coordinates, accounting for
  its CSS size.
- **`clampPan()`** constrains horizontal and vertical translation to content
  and viewport dimensions.
- **`centerMap()`** calculates the initial grid centering in the canvas.
- **`clampAxis(offset, contentSize, viewportSize)`** clamps one axis while
  keeping small content aligned and preventing a large map from moving
  completely out of view.
- **`updateSelectedAddress(clientX, clientY)`** converts the pointer through
  pan/zoom into a grid column and row, checks the range `0…4095`, and shows
  hexadecimal address, hexadecimal value, and decimal byte. Outside the map
  it clears the selection and shows an empty tooltip.

### `web/src/ui/animated_background.js`

- **`constructor({...})`** creates main and auxiliary canvases, immediately
  checks for 2D contexts, reads the system reduced-motion setting, adds the
  canvas to its container, and registers resize, visibility, theme, and
  motion-setting listeners. It then calculates sizes/colors and schedules
  the first frame.
- **`resize()`** calculates physical canvas dimensions with device pixel
  ratio capped at 2, sets CSS dimensions, and recreates sprites for the new
  size.
- **`refreshTheme()`** reads background/accent CSS variables from computed
  styles, determines special blue-theme brightness, updates glow, and
  redraws the background.
- **`createGlowSprite()`** creates a radial bloom and multilayer pixel tile
  with an accent color and deterministic noise on auxiliary canvases. These
  pre-drawn images are reused repeatedly by the main canvas.
- **`requestFrame()`** does not schedule another frame if one is already
  pending or the document is hidden. It uses `requestAnimationFrame` for
  reduced motion and the first frame; normal animation is throttled by an
  80 ms timer.
- **`handleVisibilityChange()`** cancels the frame and timer when the page is
  hidden; on return it resets the time base and resumes drawing.
- **`handleThemeChange()`** refreshes the palette through `refreshTheme()`.
- **`handleMotionPreferenceChange(event)`** responds to system
  `prefers-reduced-motion` changes: enabling it stops continuous animation
  and draws one static frame; disabling it starts a new loop.
- **`draw(timestamp)`** clears the background, calculates smoothly
  interpolated pseudorandom noise for each cell, and draws glow and tile
  using the current theme brightness. It schedules the next frame only when
  animation is allowed.
- **`hash(seed, step)`** deterministically mixes cell coordinates and time
  step with integer operations to get a reproducible number from 0 to 1,
  avoiding random jumps between frames.

## 7. Appearance settings

### `web/src/themes/theme_manager.js`

- **`constructor({ documentRef, storage, logger })`** stores dependencies,
  reads a safe saved theme, and immediately updates the DOM/theme event so
  CSS and visual components have the correct palette at startup.
- **`readSavedTheme()`** reads the selected value from `localStorage`, accepts
  only members of `THEMES`, and returns the default theme if the value is
  missing or invalid. Storage-access errors are logged as warnings.
- **`setTheme(theme)`** validates the theme and throws `RangeError` for an
  unknown name. A valid theme is applied to the DOM and then saved; a storage
  write failure is logged but does not undo the applied theme.
- **`apply(theme)`** sets `data-theme` on the root HTML element and dispatches
  a `themechange` event so, for example, the animated background can reread
  its colors.
- **`getTheme()`** returns the active theme.

The constructor loads and applies the saved theme immediately, so other
modules can read current CSS variables at startup.

## 8. Interpreter and supporting C modules

### `src/chip8.c` and `src/chip8.h`

- **`render_sprite(cpu, x, y, n)`** gets coordinates from V registers, wraps
  them around display width/height, reads `n` sprite bytes from memory at
  address `I`, and XORs enabled pixels. If an enabled pixel erases a pixel
  that was already on, it sets the `VF` collision flag; it then sets the draw
  flag.
- **`init()`** clears machine state, sets `PC = 0x200`, and copies the
  built-in 4×5 font to the beginning of memory.
- **`set_key(key, is_pressed)`** changes key state only for indexes 0–15.
- **`set_quirks(...)`** sets four compatibility flags used by shifts,
  load/store operations, subtraction comparison, and changes to `VF` when
  adding to `I`.
- **`update_timers()`** decrements delay and sound timers by one if they are
  above zero; JavaScript calls it at 60 Hz.
- **`step()`** reads two bytes at PC, decodes `nnn`, `x`, `y`, and `kk`, first
  advances PC by two bytes, and then executes the instruction. Implemented
  operations include clear/return, jumps and calls using the internal stack,
  skip comparisons, constant loads, base arithmetic/logic, carry/borrow and
  shift flags, address `I`, jump with `V0`, random number, drawing, keypad
  checks, and the `Fx` family (timers, key wait, `I`, font, BCD, and register
  transfers through memory). After the standard switch, user-stack extensions
  and `MUL`/`DIV`/`REM` are recognized separately. Quirks affect selected
  registers and `VF`.
- **`load_opcode_at(addr, opcode)`** writes an opcode high byte first only
  when the pair of bytes remains inside 4096-byte memory.
- **`load_data_at(addr, data)`** writes a byte when the address is inside
  memory.
- **`get_display_ptr()` / `get_v_regs_ptr()` / `get_mem_ptr()`** export
  pointers to display, V registers, and RAM so JavaScript can read the WASM
  heap without copying.
- **`get_pc()` / `get_i()` / `get_call_stack_ptr()`** export PC, `I`, and the
  internal call-stack pointer for the monitor.
- **`get_draw_flag()` / `clear_draw_flag()`** let the UI check and clear the
  screen-update flag.

The `Chip8` structure in `chip8.h` stores 4096 bytes of RAM, 16 V registers,
`I`/`PC`, call stack, timers, quirk flags, a 64×32 buffer, keyboard, and draw
flag.

### `src/stack.c` and `src/stack.h` — user stack

- **`init_stack_interface(ptr)`** stores a pointer to the WASM core registers,
  resets stack depth, and clears the full 1024-byte extra stack.
- **`stack_push(reg_index)`** pushes the selected V register onto the top
  only when the interface and index are valid and space is available.
- **`stack_pop(reg_index)`** pops the last value into the selected register;
  popping an empty stack records underflow.
- **`stack_pusha()`** saves all 16 registers as one block only when there is
  room for the entire block; insufficient room records overflow.
- **`stack_popa()`** restores registers in reverse order only when all 16
  bytes are present; otherwise it records underflow.
- **`stack_peak(reg_index)`** copies the top value to a register without
  removing it; reading an empty stack records underflow.
- **`stack_size(reg_index)`** places current stack depth in the selected
  register.
- **`stack_clear()`** clears all cells and resets depth.
- **`get_spd()`** returns current extra-stack depth.
- **`get_stack_value(index)`** returns a value at a valid index or `0` outside
  the bounds.

The data stack has a capacity of 1024 bytes. Overflow/underflow is recorded
with the sticky code returned by `get_stack_fault()`. The call stack has a
depth of 16; `CALL` overflow and `RET` on an empty stack are recorded
separately. `get_execution_fault()` combines these errors; after any such
fault the emulator stops executing instructions until reset. The
monitor-oriented `get_stack_value(index)` returns `0` outside current data.

### `src/math_core.c` and `src/math_core.h`

- **`math_mul(x, y)`** multiplies `Vx` by `Vy` using a 16-bit intermediate,
  writes the low byte to `Vx`, and writes the overflow flag to `VF`.
- **`math_div(x, y)`** for a zero divisor writes `VF = 1` and `Vx = 0`;
  otherwise it performs integer division into `Vx` and clears `VF`.
- **`math_rem(x, y)`** handles a zero divisor in the same way; otherwise it
  writes the remainder to `Vx` and clears `VF`.

### `src/disk_storage.c` and `src/disk_storage.h`

- **`get_disk_memory_ptr()`** returns the address of the static 1 MiB disk
  image for VFS/WASM access.
- **`get_is_dirty()` / `set_is_dirty(dirty)`** read and change the flag that
  signals JavaScript to synchronize the disk image.
- **`mark_disk_as_dirty()`** marks the image dirty after disk data or metadata
  changes.
- **`clear_disk_memory()`** clears the complete image and marks it dirty.

### `src/fat.c` and `src/fat.h` — FAT-like filesystem

- **`init_fs_pointers()`** lays out pointers to the boot sector, allocation
  table, root directory, and data area inside the 1 MiB array; calculates the
  number of clusters.
- **`format_disk()`** clears the image, initializes pointers again, writes
  the `CH8F` signature, area sizes, and free-space information, reserves the
  first FAT entries, and marks the disk changed.
- **`vfs_init()`** finds the disk structures and formats the image if the
  filesystem signature is missing; otherwise it reports the number of free
  clusters.
- **`find_free_cluster()`** linearly searches for a free cluster starting at
  index 2 and returns a special code if no space is available.
- **`get_cluster_address(cluster)`** calculates the address of a cluster's
  payload in the data area, accounting for the FAT index offset.
- **`write_cluster_payload(cluster, source, size)`** copies data into a
  cluster and zeroes the remainder so old content does not remain as a tail.
- **`fat_write_data(data, size)`** calculates required cluster count,
  compares it with free space, finds clusters, and links them in a FAT chain
  ending at EOF. It writes 512-byte chunks, decrements free-space count, and
  marks the disk changed. If space runs out partway through allocation, it
  frees the already allocated chain.
- **`is_valid_cluster(cluster)`** checks that the index is in the range of
  valid user-data clusters.
- **`fat_read_data(start_cluster, size, out_buffer)`** copies the requested
  bytes through the cluster chain into the output buffer, stopping at EOF or
  an invalid next index.
- **`fat_free_chain(start_cluster)`** walks a file's chain, marks clusters
  free, restores free-space count, then marks the disk changed.
- **`fat_get_directory_entry(index)`** returns the directory entry for a
  valid slot 0–63; otherwise it returns `NULL`.
- **`fat_get_max_files()`** returns root-directory capacity (64 entries).
- **`fat_get_entry_size(index)`** returns the size of a file in a valid entry,
  or `0`.
- **`fat_get_free_space_bytes()`** converts free cluster count to bytes.

### `src/vfs.c` and `src/vfs.h` — file operations

- **`safe_copy_filename(dest, src)`** copies no more than 17 filename
  characters and guarantees a terminating NUL in the 18-byte field.
- **`match_filename(entry_name, search_name)`** compares up to 17 bytes of
  the directory-entry name and requested name.
- **`find_directory_entry(name)`** rejects an empty name, then searches
  directory entries and returns the first active match.
- **`vfs_write(name, data, size)`** validates arguments, deletes an existing
  file of the same name, finds a free directory slot, and writes contents as
  a FAT chain. After allocating data it fills filename, size, first cluster,
  in-use flag, and dirty flag. It returns `0` on success, `-1` for invalid
  parameters or insufficient space, and `-2` for a full directory.
- **`vfs_get_file_size(name)`** finds the entry and returns its size; a
  missing name returns `0`.
- **`vfs_read(name, out_buffer)`** checks for a file and buffer, then reads
  contents through the FAT chain; it returns a result code.
- **`vfs_delete(name)`** finds the file, frees its FAT chain, clears the
  in-use flag, size, starting cluster, and name, then marks the image dirty.

## 9. Built-in data

`web/src/core/default_rom.js` contains `DEFAULT_PONG_ROM`, the bytes of the
demonstration Pong ROM. This file defines no separate function; the array is
loaded when the virtual disk is empty and can be used by
`Chip8Emulator.loadDefaultPong()`.

**CHIP Language compiler and assembler chapters.**

The source-specific documentation for the compiler requested in this
documentation set is available in the [CHIP Language chapter](chip-language/README.md).
The [assembler chapter](assembler/README.md) contains the detailed
`web/src/assembler/asm.js` pages.
