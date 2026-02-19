import react from '@vitejs/plugin-react';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
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
