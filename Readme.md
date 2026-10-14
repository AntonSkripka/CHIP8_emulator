# CHIP-8 WebAssembly Ecosystem

A high-performance CHIP-8 emulator and development environment. The core CPU, virtual file system, and custom operating system modules are written in **C** and compiled to **WebAssembly (WASM)**, paired with a feature-rich, responsive JavaScript/HTML5 frontend.

---

## Legal Disclaimer
This project is developed for educational and research purposes only.

ROMs: The "Pong" game included in this repository is a classic 1970s implementation provided as a built-in demo to verify the emulator's functionality.

Copyright: All rights to the original game logic and assets belong to their respective creators.<br>

Removal: If you are the copyright holder of any code included here and wish for it to be removed, please open an Issue or contact me, and I will delete it immediately.

---

## Features

* **Hybrid WASM Core:** Low-level CPU emulation, custom math core, and execution written in C for native-like performance.
* **Virtual File System (VFS):** Includes a low-level FAT implementation and virtual disk storage compiled into the core, exposed to the web UI.
* **Blazing Fast Rendering:** Direct memory sharing between WebAssembly and the JavaScript frontend using `Uint8ClampedArray` for seamless 60 FPS rendering.
* **Web-Based IDE:** Integrated assembler, live register trackers, stack monitors, and memory visualization tools.
* **Local Storage OS:** A menu-driven interface to manage, save, and browse multiple ROMs directly inside the browser's storage.

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
- [x] **Disk UI:** Graphical browser interface managing the compiled `virtual_disk` layer via LocalStorage.

### Phase 4: Compatibility & Extensions
- [ ] **Extended Instruction Sets:** Support for SCHIP (Super-CHIP) and XO-CHIP high-resolution graphics.
- [ ] **CHIP-OS Application suite:** Expanding the lightweight system menu into a micro-operating system written in pure CHIP-8 Assembly.
