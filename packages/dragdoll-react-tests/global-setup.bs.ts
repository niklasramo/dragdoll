import BrowserStackLocal from 'browserstack-local';

let bsLocal: BrowserStackLocal.Local;

export async function setup() {
  bsLocal = new BrowserStackLocal.Local();
  await new Promise<void>((resolve, reject) => {
    bsLocal.start({ key: process.env.BROWSERSTACK_ACCESS_KEY, force: true }, (err) =>
      err ? reject(err) : resolve(),
    );
  });
}

export async function teardown() {
  await new Promise<void>((resolve) => {
    bsLocal.stop(() => resolve());
  });
}
