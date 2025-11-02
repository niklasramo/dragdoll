export const config = {
  runner: 'browser',
  specs: ['src/index.ts'],
  maxInstances: 2,
  injectGlobals: true,
  capabilities: [
    {
      browserName: 'chrome',
    },
    {
      browserName: 'firefox',
    },
  ],
  logLevel: 'silent',
  bail: 0,
  waitforTimeout: 1000,
  framework: 'mocha',
  specFileRetries: 0,
  reporters: [
    [
      'spec',
      {
        addConsoleLogs: true,
        showPreface: false,
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
