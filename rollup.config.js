import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

module.exports = [
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
        file: './tests/dist/tests.node.js',
        format: 'es',
      },
      {
        file: './tests/dist/tests.browser.js',
        format: 'umd',
        name: `${pkg.name}_testsuite`,
        globals: { chai: 'chai', eventti: 'eventti', tikki: 'tikki' },
      },
    ],
    external: ['chai', 'eventti', 'tikki'],
    plugins: [typescript()],
  },
];
