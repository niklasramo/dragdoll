# Dragdoll Drag and Drop Library

## Project Context

Vanilla TypeScript drag and drop library with a modular architecture (sensors, draggables, droppables). Framework integration packages provide hooks wrapping the core library:
- `dragdoll-react` — React hooks (built with tsdown)
- `dragdoll-solid` — Solid hooks (built with tsdown)

Documentation is built with VitePress.

## Architecture

- Sensors: Handle input events (pointer, keyboard, etc.) and emit events when user interactions occur.
- Draggable: Manages draggable elements and their movement (listen to sensors and move elements).
- Droppable: Defines drop targets (areas/elements where elements can be dropped).
- DndObserver: Orchestrates interactions between draggables and droppables (manages collision detection and event propagation).

## Core Principles

- Performance is the top priority — optimize for speed and minimal DOM operations.
- Accessibility compliance is essential.
- Support both mouse and touch interactions.
- Cross-browser compatibility for modern browsers.
- Minimal dependencies, vanilla implementation.

## Non-Negotiable Rules

- **Keep docs up to date.** After every code change, verify that both LLM docs (`docs/`) and user-facing docs (`packages/dragdoll-docs/`) are still accurate. Update them if the change affects documented behavior, APIs, structure, dependencies, or examples. We do not tolerate stale docs.
- Do NOT add `Co-Authored-By` lines in commit messages if the co-author is not a human.
- **Architect for performance from the start.** Every piece of code must be designed with optimal performance in mind. This is not optional — it is a core requirement.
  - **Think 1000s of items.** Always architect as if there are thousands of items, even when real-world usage is hundreds. This mindset catches performance problems before they ship.
  - **No O(n²) when O(n) is possible.** Use index maps, reverse lookups, and cached computations. Never use `array.indexOf()` or `array.find()` in hot paths when a Map or pre-computed index achieves O(1).
  - **Minimize DOM reads.** Cache `getBoundingClientRect()` and other layout-triggering reads. Never call them repeatedly for the same element in the same frame or batch.
  - **Batch DOM writes.** Use the ticker system. Never interleave reads and writes.
  - **Let the core library do the heavy lifting.** Do not bypass the core's transform normalization, position calculation, or container reparenting with manual hacks (e.g., custom `applyPosition` overrides). The core handles matrix math, coordinate system conversions, and cross-browser edge cases. Use the provided APIs (`container`, `positionModifiers`, `computeClientRect`) instead.
  - **Read [Performance Patterns](docs/performance-patterns.md)** before writing any library or example code.

## Quick Reference

- **Format:** `npm run format` — run after code changes to auto-fix lint/formatting. You don't need to worry about style issues manually.
- **Build:** `npm run build` — run before testing or starting the docs dev server. Formats, builds dragdoll + dragdoll-react + dragdoll-solid + docs examples.
- **Dev server:** `npm run dev` — starts VitePress docs site. Run `npm run build` first.
- **Test locally:** `npm run test:local` (core) / `npm run test:react:local` (React) / `npm run test:solid:local` (Solid). Run `npm run build` first.
- **Test BrowserStack:** `npm run test:bs` / `npm run test:react:bs` / `npm run test:solid:bs`
- **Lint:** `npm run lint` — read-only check (TypeScript + Prettier + ESLint). Use `npm run format` to fix.

## Detailed Documentation

Read these docs before starting work on related areas:

- [Coding Guidelines](docs/coding-guidelines.md) — code style, naming conventions, general rules.
- [Monorepo Structure](docs/monorepo-structure.md) — package layout and all root commands.
- [Dependencies](docs/dependencies.md) — key dependencies.
- [Testing](docs/testing.md) — how to run tests, test infrastructure, and known issues.
- [Performance Patterns](docs/performance-patterns.md) — 11 patterns actively used in the codebase (pooling, caching, phase batching, etc.). **Read this before writing any library code.**
- [Transform Handling](docs/transform-handling.md) — how dragged elements stay in sync with the pointer across nested CSS transforms (matrix math pipeline, caching, 3D limitations).
