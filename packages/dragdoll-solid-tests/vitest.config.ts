import { webdriverio } from '@vitest/browser-webdriverio';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid()],
  test: {
    setupFiles: ['./setup.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: webdriverio(),
      instances: [{ browser: 'chrome' }, { browser: 'firefox' }],
    },
  },
});
