# Monorepo Structure

## Packages

- `packages/dragdoll/` - Core library.
  - `src/` - Source code.
    - `sensors/` - Input event handlers
    - `draggable/` - Draggable implementation
      - `modifiers/` - Position modifier functions
      - `plugins/` - Draggable plugins (e.g., snap, scroll)
      - `helpers/` - Internal helper utilities
    - `droppable/` - Droppable implementation
    - `dnd-observer/` - DndObserver implementation
    - `auto-scroll/` - Auto-scroll functionality during drag
    - `singletons/` - Shared singleton instances
    - `utils/` - Utility functions
    - `types.ts` - Common type definitions
    - `constants.ts` - Shared constants
  - `dist/` - Built library files.
- `packages/dragdoll-react/` - React integration package.
  - `src/` - Source code.
    - `hooks/` - React hooks wrapping core library
    - `contexts/` - React context providers
    - `utils/` - React-specific utility functions
  - `dist/` - Built library files.
- `packages/dragdoll-docs/` - VitePress documentation site and examples.
  - `docs/` - VitePress docs content.
  - `docs/react/` - VitePress docs React integration content.
  - `docs/public/` - VitePress docs public assets.
  - `examples/` - Core library examples used in the docs.
  - `react-examples/` - React integration examples used in the docs.
  - `scripts/` - Docs/example build scripts.
- `packages/dragdoll-tests/` - Internal tests (Vitest browser mode with WebDriverIO provider).
  - `src/` - Test sources.
- `packages/dragdoll-react-tests/` - React integration tests (Vitest browser mode with WebDriverIO provider).
  - `src/` - Test sources.
  - `dist/` - Bundled tests.

## Versioning

Each package (`dragdoll`, `dragdoll-react`, `dragdoll-solid`) is versioned independently. Wrappers depend on both the core library and their respective framework (React/Solid), so breaking changes in one wrapper (e.g., React 19 compatibility) should not force version bumps in unrelated packages. Peer dependency ranges in wrapper packages express which core versions are compatible.

## Dependency Management

All `devDependencies` must be declared in the root `package.json` only, never in individual workspace packages. This prevents version drift where different sub-packages end up with different versions of the same dependency.

## Root Commands

- `npm run build` - Runs format, builds `dragdoll` and `dragdoll-react` libraries, builds `dragdoll-docs` examples, then formats again.
- `npm run test:local` - Runs tests (from `dragdoll-tests`) locally in Chrome and Firefox.
- `npm run test:bs` - Runs tests (from `dragdoll-tests`) in BrowserStack.
- `npm run test:react:local` - Runs React integration tests (from `dragdoll-react-tests`) locally.
- `npm run test:react:bs` - Runs React integration tests (from `dragdoll-react-tests`) in BrowserStack.
- `npm run docs:dev` - Runs VitePress docs site in development mode.
- `npm run docs:build` - Builds VitePress docs site.
- `npm run docs:serve` - Serves VitePress docs site.
- `npm run ts:check` - Checks TypeScript types across workspaces.
- `npm run prettier:check` - Checks Prettier formatting across workspaces.
- `npm run prettier:write` - Formats Prettier formatting across workspaces.
- `npm run eslint:check` - Checks ESLint errors across workspaces.
- `npm run eslint:write` - Fixes ESLint errors across workspaces.
- `npm run lint` - Runs TypeScript checks, Prettier checks, and ESLint checks across workspaces.
- `npm run format` - Fixes ESLint errors and formats with Prettier across workspaces.
