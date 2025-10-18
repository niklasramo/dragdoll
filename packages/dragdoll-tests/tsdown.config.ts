import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    tests: 'src/tests.ts',
  },
  outDir: './dist',
  format: 'umd',
  noExternal: ['eventti', 'tikki', 'mezr/getRect', 'mezr/getDistance', 'mezr/getOffsetContainer'],
});
