import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    tests: 'tests/src/tests.ts',
  },
  outDir: './tests/dist',
  format: ['esm', 'iife'],
});
