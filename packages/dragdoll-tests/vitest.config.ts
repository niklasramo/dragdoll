import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    browser: {
      enabled: true,
      headless: true,
      provider: webdriverio(),
      instances: [{ browser: 'chrome' }, { browser: 'firefox' }],
    },
  },
});
