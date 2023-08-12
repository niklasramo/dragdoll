import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    dragdoll: 'src/index.ts',
  },
  outDir: './dist',
  format: ['esm', 'cjs'],
  minify: true,
  dts: true,
});
