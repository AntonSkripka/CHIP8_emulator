# Project build and delivery

## Purpose

Build inputs, npm scripts, Vite settings, repository guidance, and the GitHub Pages workflow.

## Data and control flow

`make build` compiles the C virtual machine with Emscripten into `web/public/wasm/chip8.js` and then runs Vite. Vite uses `web/` as its root, copies public assets, and writes the site to `dist/`. `npm run deploy` delegates to this Make target; the GitHub Actions workflow installs Node 22 and Emscripten, builds, and publishes `dist/` to `gh-pages`.

## Covered files

- [README.md](./root-readme/README.md) — Project overview, setup, usage, build/test guidance and feature documentation.
- [package.json](./package-json/README.md) — npm scripts and the React, Emotion, Vite and React-plugin dependency declarations.
- [Makefile](./makefile/README.md) — Emscripten compilation, site build, development, preview and cleanup targets.
- [vite.config.js](./vite-config/README.md) — Vite root/base, React plugin and production output configuration.
- [.github/workflows/deploy.yml](./deploy-workflow/README.md) — Automated build and GitHub Pages publication triggered on main pushes or manual dispatch.

## Glossary

- **Emscripten:** C/C++-to-WebAssembly toolchain.
- **Vite:** Frontend development server and static-site bundler.
- **Artifact:** A generated file or directory passed to a later build/deploy step.
