import react from '@vitejs/plugin-react';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

const bsUser = process.env.BROWSERSTACK_USERNAME;
const bsKey = process.env.BROWSERSTACK_ACCESS_KEY;

const bsBase = {
  hostname: 'hub.browserstack.com',
  user: bsUser,
  key: bsKey,
};

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./setup.ts'],
    globalSetup: ['./global-setup.bs.ts'],
    browser: {
      enabled: true,
      provider: webdriverio(bsBase),
      instances: [
        {
          browser: 'chrome',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                os: 'Windows',
                osVersion: '11',
                buildName: 'dragdoll-react-tests',
                local: 'true',
              },
            },
          }),
        },
        {
          browser: 'firefox',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                os: 'Windows',
                osVersion: '11',
                buildName: 'dragdoll-react-tests',
                local: 'true',
              },
            },
          }),
        },
        {
          browser: 'safari',
          provider: webdriverio({
            ...bsBase,
            capabilities: {
              'bstack:options': {
                os: 'OS X',
                osVersion: 'Sequoia',
                buildName: 'dragdoll-react-tests',
                local: 'true',
              },
            },
          }),
        },
      ],
    },
  },
});
