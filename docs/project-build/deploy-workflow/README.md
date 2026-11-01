# `.github/workflows/deploy.yml`

## Purpose

Automated build and GitHub Pages publication triggered on main pushes or manual dispatch.

## Detailed flow

Workflow starts on pushes to `main` and on manual dispatch. A single `deploy` job checks out the repository, installs Node 22 with npm caching and Emscripten 5.0.2, runs `npm ci`, then `npm run deploy`. The final action publishes only `./dist` to `gh-pages` using `GITHUB_TOKEN` and an orphaned publication history. The `github-pages` concurrency group cancels an older run when a newer deployment starts.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `.github/workflows/deploy.yml`
- **Chapter:** [Project build and delivery](../README.md)
- **Direct dependencies/data:** GitHub Actions, npm lockfile, Emscripten setup and generated `dist/` output.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
