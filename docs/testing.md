# Testing

## Running Tests

- Run tests from the repository root.
- Always run `npm run build` at the root before running tests to make sure the library and tests are built.
- ALWAYS use `npm run test:local` (core) and `npm run test:react:local` (React) for local runs; they're much faster than the `:bs` (BrowserStack) variants. Only use cloud tests when explicitly requested.

## Test Infrastructure

Both test suites use **Vitest browser mode** with `@vitest/browser-webdriverio`, which runs tests in real browsers (not jsdom).

- **Core tests** (`dragdoll-tests`): Vitest + webdriverio provider, Chrome and Firefox locally, Chrome/Firefox/Safari + Android on BrowserStack.
- **React tests** (`dragdoll-react-tests`): Same stack, plus `vitest-browser-react` for React component/hook testing.

### BrowserStack

BrowserStack tests require credentials. Create an `.env` file in the project root with `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` variables.

The BrowserStack config (`vitest.bs.config.ts`) uses:
- `global-setup.bs.ts` to start/stop the BrowserStack Local tunnel with `forceLocal: true` (routes all traffic through tunnel).
- `server.allowedHosts: ['localhost', 'bs-local.com']` — **required for Safari**, which redirects `localhost` to `bs-local.com` on BrowserStack.
- Per-instance browser capabilities via the webdriverio provider — no `@wdio/browserstack-service` involved.

### Known Issues

**"error during close" after BrowserStack runs.** After all tests pass, vitest may log a `WebDriverRequestError` when trying to close browser sessions that BrowserStack already terminated. This is cosmetic noise from `@vitest/browser-webdriverio` not gracefully handling already-closed sessions. It does **not** affect the exit code or test results.

**Orphaned BrowserStack Local processes.** If a test run is interrupted, a `BrowserStackLocal` process may remain on port 45691, causing the next run to fail. The `global-setup.bs.ts` automatically kills orphans before starting, but if needed: `lsof -ti :45691 | xargs kill -9`.

## Git

- Do NOT add `Co-Authored-By` lines in commit messages if the co-author is not a human.
