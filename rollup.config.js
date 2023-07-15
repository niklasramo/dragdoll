import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

export default [
  // Build library.
  {
    input: pkg.source,
    output: [
      {
        file: pkg.main,
        format: 'es',
      },
      {
        name: 'DragDoll',
        file: pkg['umd:main'],
        format: 'umd',
        globals: {
          eventti: 'eventti',
          tikki: 'tikki',
        },
      },
    ],
    external: ['eventti', 'tikki'],
    plugins: [typescript()],
  },
  // Build type defintions.
  {
    input: pkg.source,
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
  // Build tests.
  {
    input: './tests/src/tests.ts',
    output: [
      {
        file: './tests/dist/tests.js',
        format: 'es',
      },
      {
        file: './tests/dist/tests.umd.js',
        format: 'umd',
        name: `${pkg.name}_tests`,
        globals: { chai: 'chai', eventti: 'eventti', tikki: 'tikki' },
      },
    ],
    external: ['chai', 'eventti', 'tikki'],
    plugins: [typescript()],
  },
];