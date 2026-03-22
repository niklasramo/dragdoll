import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';
import 'dotenv/config';

const bsUser = process.env.BROWSERSTACK_USERNAME;
const bsKey = process.env.BROWSERSTACK_ACCESS_KEY;

if (!bsUser || !bsKey) {
  throw new Error(
    'Missing BrowserStack credentials. Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY.',
  );
}

const bsBase = {
  hostname: 'hub.browserstack.com',
  user: bsUser,
  key: bsKey,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 5,
};

const bsCapabilities = {
  local: true,
  idleTimeout: 300,
  buildName: 'dragdoll-tests',
};

export default defineConfig({
  server: {
    allowedHosts: ['localhost', 'bs-local.com'],
  },
  test: {
    globals: true,
    testTimeout: 60000,
    slowTestThreshold: Infinity,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    globalSetup: ['./global-setup.bs.ts'],
    retry: 2,
    browser: {
      enabled: true,
      connectTimeout: 180000,
      provider: webdriverio(bsBase),
      instances: [
        {
          browser: 'chrome',
          name: 'Chrome on Windows 11',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                ...bsCapabilities,
                browserName: 'Chrome',
                browserVersion: 'latest',
                os: 'Windows',
                osVersion: '11',
              },
            },
          }),
        },
        {
          browser: 'firefox',
          name: 'Firefox on Windows 11',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                ...bsCapabilities,
                browserName: 'Firefox',
                browserVersion: 'latest',
                os: 'Windows',
                osVersion: '11',
              },
            },
          }),
        },
        {
          browser: 'chrome',
          name: 'Chrome on MacOS Tahoe',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                ...bsCapabilities,
                browserName: 'Chrome',
                browserVersion: 'latest',
                os: 'OS X',
                osVersion: 'Tahoe',
              },
            },
          }),
        },
        {
          browser: 'firefox',
          name: 'Firefox on MacOS Tahoe',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                ...bsCapabilities,
                browserName: 'Firefox',
                browserVersion: 'latest',
                os: 'OS X',
                osVersion: 'Tahoe',
              },
            },
          }),
        },
        {
          browser: 'safari',
          name: 'Safari on MacOS Tahoe',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                ...bsCapabilities,
                browserName: 'Safari',
                browserVersion: 'latest',
                os: 'OS X',
                osVersion: 'Tahoe',
              },
            },
          }),
        },
        {
          browser: 'chrome',
          name: 'Chrome on Samsung Galaxy S23',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                ...bsCapabilities,
                browserName: 'Chrome',
                browserVersion: 'latest',
                os: 'Android',
                osVersion: '13.0',
                deviceName: 'Samsung Galaxy S23',
                // BrowserStack expects string 'true',
                // not boolean, despite the type definitions.
                realMobile: 'true' as unknown as boolean,
              },
            },
          }),
        },
      ],
    },
  },
});
