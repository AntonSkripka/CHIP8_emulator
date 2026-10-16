# CHIP-8 WebAssembly Ecosystem

A browser-based CHIP-8 emulator and development environment. The emulator core and virtual file-system components are written in **C** and compiled to **WebAssembly (WASM)**, with a JavaScript frontend and a React-based game catalogue.

---

## Legal Disclaimer, Credits, Licensing & Attributions

The CHIP-8 ROM catalogue is sourced from [The Chip8 Archive](https://github.com/JohnEarnest/chip8Archive), maintained by John Earnest. Thank you to John Earnest, the archive contributors, and the independent authors who created and shared freely licensed CHIP-8 software. Any additional ROM collections will be credited individually when added; no other external ROM collection is currently bundled.

The built-in **Pong** ROM is a separate demo and is not part of The Chip8 Archive. It is included to verify emulator functionality; copyright in the original game and any associated material remains with its respective rights holders.

The upstream archive states that contributed programs and materials are released under the **Creative Commons Zero v1.0 Universal (CC0 1.0)** dedication. The catalogue ROMs, descriptions, and preview media are included in reliance on that statement or are believed to be in the public domain. This project does not claim authorship of those contributions and has not independently verified the rights status of every historical item. Please consult the upstream archive and individual authors for source attribution and licensing details.

This project is provided for educational and historical purposes. That purpose does not grant copyright permission, and the age or unmaintained status of a work ("abandonware") does not by itself place it in the public domain. All rights to third-party works remain with their respective rights holders.

**If you are the rights holder of any material included here and would like it removed, please create an Issue in this GitHub repository, and the content will be removed immediately.**

The prepared catalogue data is in `web/public/roms/`: `programs.json` and `authors.json` are at its root, game binaries are in `roms/`, and previews are in `media/`. Image paths in `programs.json` are relative to that data root.

---

## Features

* **WebAssembly CHIP-8 Core:** The CHIP-8 interpreter and supporting C modules are compiled to WebAssembly. Super-CHIP and XO-CHIP extensions are not supported.
* **Virtual Disk:** A C-based FAT/VFS layer provides a 1 MB virtual disk. Its contents are saved in browser IndexedDB and can be managed through the disk interface.
* **Developer Tools:** The browser interface includes a CHIP-8 assembler, register and stack monitors, and a memory map.
* **ROM Loading:** Load `.ch8` ROM files using the file picker, drag and drop, or the virtual disk.
* **React Game Store:** Browse the bundled catalogue, view game details and previews, run supported CHIP-8 games, or add supported games to the virtual disk. SCHIP/XO-CHIP games are listed but cannot be run or added to the disk.
* **Color Themes:** Choose monochrome, green, amber, or blue; the selection is persisted in `localStorage`.

---

## Build & Installation

### Prerequisites
Install **Node.js**, **npm**, **GNU Make**, and **Emscripten**. Emscripten must be available as `emcc`.

### Development
Install the frontend dependencies and start the Vite development server from the repository root:

```bash
npm install
npm run dev
```

The dev script compiles the C sources into WebAssembly before starting the server.

### Production build and deployment
Build the production site with:

```bash
make deploy
```

The Makefile compiles the C core, then Vite builds `web/index.html` and its assets into `dist/`. Both the generated WebAssembly files and `dist/` are ignored by Git, so a deploy job should run `make deploy` before publishing the contents of `dist/`. Preview that output locally with `npm run preview` or `make preview`.

Use `make clean` to remove the generated WebAssembly files and production output. Start the Vite development server with `npm run dev` or `make dev`; both commands generate the WebAssembly files first.

### GitHub Pages
The workflow in `.github/workflows/deploy.yml` builds and publishes the site to the `gh-pages` branch whenever code is pushed to `main`, or when started manually. The workflow compiles WebAssembly and Vite output on GitHub Actions; generated build files do not need to be committed. Its `contents: write` permission allows the workflow to create and update `gh-pages`.

In **Settings → Actions → General**, allow **Read and write permissions** so the workflow token can publish. After the first successful run creates `gh-pages`, select **Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` → `/(root)`**. Vite uses relative asset paths so the site works both on a repository Pages URL and on a custom domain.

### Project layout
- `src/`: C/WebAssembly emulator source
- `web/src/`: browser application modules, grouped by responsibility
- `web/styles/`: application styles
- `web/public/wasm/`: generated Emscripten loader and WebAssembly binary
- `dist/`: Vite production output

### Application architecture
`web/src/app/main.js` is the emulator composition root: it creates infrastructure adapters and injects them into the UI and emulator components. The emulator controller receives the core, display, monitor, memory-map view, and scheduler through constructor dependencies. Disk and ROM UI components communicate with emulator actions through callbacks. The React store lives in `web/src/shop/`: `main.jsx` mounts `App.jsx`, components render the catalogue and details, and `services/emulator_bridge.js` connects store actions to the existing emulator and virtual-disk APIs.

### Terminal interface
The browser UI opens with a BIOS-style boot sequence and keyboard-operated main menu. User Mode presents the CHIP-8 display and ROM loader; Developer Mode adds the assembler, register and stack monitors, memory map, and virtual disk. The Game Store lists the bundled catalogue at `web/public/roms/programs.json`, with author details in `authors.json`, ROMs in `roms/`, and previews in `media/`. The CHIP-8 keypad maps to physical keys `1 2 3 4 / Q W E R / A S D F / Z X C V` (for example, CHIP-8 key `5` is physical `W`). Settings offer monochrome, green phosphor, amber, and blue palettes, with the selected theme persisted in `localStorage`. The terminal navigation and theme manager live in `web/src/ui/terminal_shell.js` and `web/src/themes/`; shared palette tokens are in `web/styles/themes.css`, which also themes the React store.

---

## Roadmap & Development Progress

### Phase 1: Interaction & Input
- [x] **Keyboard Mapping:** CHIP-8's 4×4 keypad is mapped to physical keys `1 2 3 4 / Q W E R / A S D F / Z X C V`.
- [x] **Drag-and-Drop Loader:** Instant loading via web-native drop zones for `.ch8` files.

### Phase 2: Embedded Development IDE
- [x] **Integrated Web Assembler:** Write raw mnemonics (e.g., `LD V0, 0xFF`) and compile them to bytecode on the fly.
- [x] **Low-Level Diagnostics:** Real-time visual monitoring of the 4KB RAM, Stack pointers, and V-registers.

### Phase 3: Storage & File Systems
- [x] **C-Based VFS:** Custom Virtual File System and FAT layer running inside the WebAssembly instance.
- [x] **Disk UI:** Graphical browser interface managing the compiled `virtual_disk` layer via IndexedDB.

### Phase 4: Compatibility & Extensions
- [ ] **Extended Instruction Sets:** Support for SCHIP (Super-CHIP) and XO-CHIP high-resolution graphics.
- [ ] **CHIP-OS Application suite:** Expanding the lightweight system menu into a micro-operating system written in pure CHIP-8 Assembly.
