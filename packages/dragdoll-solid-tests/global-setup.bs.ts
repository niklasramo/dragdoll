import { execSync } from 'node:child_process';
import BrowserStackLocal from 'browserstack-local';

let bsLocal: BrowserStackLocal.Local;

export async function setup() {
  // Kill any orphaned BrowserStack Local processes from previous runs.
  try {
    execSync('lsof -ti :45691 | xargs kill -9 2>/dev/null', { stdio: 'ignore' });
  } catch {
    // No process to kill — expected.
  }

  bsLocal = new BrowserStackLocal.Local();
  await new Promise<void>((resolve, reject) => {
    bsLocal.start(
      { key: process.env.BROWSERSTACK_ACCESS_KEY, force: true, forceLocal: true },
      (err) => (err ? reject(err) : resolve()),
    );
  });
}

export async function teardown() {
  await new Promise<void>((resolve) => {
    bsLocal.stop(() => resolve());
  });
}
