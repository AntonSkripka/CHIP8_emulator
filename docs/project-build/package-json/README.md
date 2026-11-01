# `package.json`

## Purpose

npm scripts and the React, Emotion, Vite and React-plugin dependency declarations.

## Detailed flow

The npm-facing `dev`, `build`, and `deploy` scripts delegate to the corresponding root Make targets, preserving the Emscripten-before-site-build ordering. `dev:server` starts Vite directly, while `build:site` invokes `vite build`. `test` runs the four non-WASM Node suites; `test:runtime` builds WASM first and then runs the full runtime suite. `preview` serves the already-built output. Runtime dependencies are React 19 and Emotion; Vite 6 and the React plugin are development dependencies.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `package.json`
- **Chapter:** [Project build and delivery](../README.md)
- **Direct dependencies/data:** Node/npm; build commands delegate to the root `Makefile`; React/Emotion/Vite packages.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
