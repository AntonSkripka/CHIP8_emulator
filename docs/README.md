# CHIP-8 Emulator Architecture

This documentation is organized as a navigable tree. Start with a chapter for a subsystem, then open a file page to understand its role, and follow its function pages for contracts and implementation details.

## Reading the tree

- Each chapter directory groups files that work together to provide one capability.
- Each subdirectory inside a chapter documents one source file. Its `README.md` explains the file; the other Markdown files describe its individual functions or methods.
- Function pages use the same contract format: plain-language purpose, inputs, outputs, side effects, implementation details, and potential weak points.
- Terms used in a chapter or file page are explained in a short glossary at the end of that page.
- `graph-data.json` contains the English documentation tree as machine-readable nodes and links. Its links describe chapter/file/function containment and only add other relationships when supported by the code.

## Chapter map

| Chapter | Scope |
|---|---|
| [Project build and delivery](./project-build/README.md) | Repository entry points, build, tests, and deployment |
| [CHIP-8 runtime](./chip8-runtime/README.md) | C virtual machine state, instruction execution, and runtime API |
| [Math operations](./math/README.md) | Arithmetic extensions |
| [Data stack](./stack/README.md) | The project data stack and its interface |
| [Virtual filesystem](./virtual-filesystem/README.md) | Disk image, FAT allocation, VFS operations, and system-call boundary |
| [WASM emulator](./wasm-emulator/README.md) | Browser-facing emulator core, display, and WebAssembly loading |
| [Assembler](./assembler/README.md) | CHIP-8 assembly parsing and bytecode generation |
| [CHIP Language](./chip-language/README.md) | Compiler pipeline, modules, built-ins, and language specification |
| [Application shell](./application-shell/README.md) | Browser entry points, application composition, and terminal navigation |
| [Developer interface](./developer-ui/README.md) | Editor, emulator diagnostics, disk interface, and visual utilities |
| [Input and ROM loading](./input-and-rom-loading/README.md) | Keyboard mapping and file/drag-and-drop ROM import |
| [Browser storage](./browser-storage/README.md) | IndexedDB and virtual-disk persistence |
| [Themes and styles](./themes-and-styles/README.md) | Theme state, CSS tokens, and visual presentation |
| [Game store](./game-store/README.md) | React catalogue, game details, and emulator bridge |
| [Catalogue data](./catalogue-data/README.md) | Catalogue metadata, ROMs, and preview assets |
| [Tests](./tests/README.md) | Test suites and the behaviors they verify |

## System entry points and data flow

The browser starts from `web/index.html`, which loads the terminal shell. The shell opens the emulator, developer tools, settings, or game store on demand. `web/src/app/main.js` composes the emulator services: the WebAssembly module exposes the C runtime, the browser core adapts its API, and UI/input modules call into that core. The virtual disk is backed by the C VFS and persisted by the browser storage adapter. Assembly and CHIP Language source take separate compiler paths before their bytecode is loaded into the same emulator.

The production pipeline compiles the C sources with Emscripten, builds the browser site with Vite, and publishes the generated site through GitHub Actions. Unit and runtime tests cover the source-language tools and the emulator at their respective boundaries.

## Related documents

- [CHIP Language specification](./CHIP-LANGUAGE.md)
- [Function reference](./FUNCTIONS.md)
- [Architecture graph data](./graph-data.json)
