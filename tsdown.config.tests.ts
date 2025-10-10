import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    tests: 'tests/src/tests.ts',
  },
  outDir: './tests/dist',
  format: 'umd',
  noExternal: ['eventti', 'tikki', 'mezr/getRect', 'mezr/getDistance', 'mezr/getOffsetContainer'],
});
