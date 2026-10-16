# CHIP-8 WebAssembly Ecosystem

A high-performance CHIP-8 emulator and development environment. The core CPU, virtual file system, and custom operating system modules are written in **C** and compiled to **WebAssembly (WASM)**, paired with a feature-rich, responsive JavaScript/HTML5 frontend.

---

## Legal Disclaimer
This project is developed for educational and research purposes only.

ROMs: The "Pong" game included in this repository is a classic 1970s implementation provided as a built-in demo to verify the emulator's functionality.

Copyright: All rights to the original game logic and assets belong to their respective creators.<br>

Removal: If you are the copyright holder of any material included here and wish for it to be removed, please open an Issue in this repository and I will remove it immediately.

---

## Credits, Licensing & Attributions

The CHIP-8 ROM catalogue is sourced from [The Chip8 Archive](https://github.com/JohnEarnest/chip8Archive), maintained by John Earnest. Thank you to John Earnest, the archive contributors, and the independent authors who created and shared freely licensed CHIP-8 software. Any additional ROM collections will be credited individually when added; no other external ROM collection is currently bundled.

The upstream archive states that its contributed programs and materials are released under the **Creative Commons Zero v1.0 Universal (CC0 1.0)** dedication. The retained catalogue ROMs, descriptions, and preview media are included under CC0 1.0 or as public-domain material in reliance on that upstream licensing statement. This project does not claim authorship of those contributions and has not independently verified every historical contributor's chain of title.

This project is provided for educational and historical purposes. That purpose does not grant copyright permission, and the age or unmaintained status of a work ("abandonware") does not by itself place it in the public domain. Rights holders may request removal at any time.

**If you are the rights holder of any material included here and would like it removed, please create an Issue in this GitHub repository, and the content will be removed immediately.**

The prepared catalogue data is in `web/public/roms/`: `programs.json` and `authors.json` are at its root, game binaries are in `roms/`, and previews are in `media/`. Image paths in `programs.json` are relative to that data root.

---

## Features

* **Hybrid WASM Core:** Low-level CPU emulation, custom math core, and execution written in C for native-like performance.
* **Virtual File System (VFS):** Includes a low-level FAT implementation and virtual disk storage compiled into the core, exposed to the web UI.
* **Blazing Fast Rendering:** Direct memory sharing between WebAssembly and the JavaScript frontend using `Uint8ClampedArray` for seamless 60 FPS rendering.
* **Web-Based IDE:** Integrated assembler, live register trackers, stack monitors, and memory visualization tools.
* **Local Storage OS:** A menu-driven interface to manage, save, and browse multiple ROMs directly inside the browser's storage.
* **React Game Store:** Browse the bundled CHIP-8 catalogue, preview games, launch ROMs, download them, or add them to the virtual disk.

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
`web/src/app/main.js` is the composition root: it creates infrastructure adapters and injects them into the UI and emulator components. The emulator controller depends on the core, display, monitor, memory-map view, and scheduler through constructor dependencies. Disk and ROM UI components communicate with emulator actions through callbacks rather than importing or invoking the emulator directly. Browser APIs, assembly compilation, and IndexedDB access are injected at the application boundary. The React catalogue is mounted from the main menu and uses `web/src/shop/emulator_bridge.js` to call the existing emulator and virtual-disk APIs.

### Terminal interface
The browser UI opens with a BIOS-style boot sequence and keyboard-operated main menu. User Mode presents the CHIP-8 display and ROM loader; Developer Mode adds the assembler, register and stack monitors, memory map, and virtual disk. The Game Store lists the bundled catalogue at `web/public/roms/programs.json`, with author details in `authors.json`, ROMs in `roms/`, and previews in `media/`. Settings offer monochrome, green phosphor, amber, and blue palettes, with the selected theme persisted in `localStorage`. The terminal navigation and theme manager live in `web/src/ui/terminal_shell.js` and `web/src/themes/`; shared palette tokens are in `web/styles/themes.css`, which also themes the React store.

---

## Roadmap & Development Progress

### Phase 1: Interaction & Input
- [x] **Keyboard Mapping:** Standard 4x4 hex keypad layout mapping (1-4, Q-R, A-F, Z-V).
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
