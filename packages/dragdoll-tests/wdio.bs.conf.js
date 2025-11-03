import 'dotenv/config';

if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
  throw new Error(
    'Missing BrowserStack credentials. Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY.',
  );
}

const PROJECT_NAME = process.env.BS_PROJECT_NAME || 'DragDoll';
const BUILD_NAME = process.env.BS_BUILD_NAME || 'DragDoll Test Suite';
const BUILD_IDENTIFIER = process.env.BS_BUILD_IDENTIFIER || new Date().toISOString();

export const config = {
  runner: [
    'browser',
    {
      viteConfig: () => ({
        server: {
          allowedHosts: ['localhost', 'bs-local.com'],
        },
      }),
    },
  ],
  specs: ['src/index.ts'],
  maxInstances: 6,
  injectGlobals: true,

  // BrowserStack credentials
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  // BrowserStack service configuration
  services: [
    [
      'browserstack',
      {
        testReporting: false,
        browserstackLocal: true,
        forcedStop: true,
        accessibility: false,
        percy: false,
        turboscale: false,
      },
    ],
  ],

  capabilities: [
    // Windows 11 Chrome Latest
    {
      browserName: 'chrome',
      browserVersion: 'latest',
      'bstack:options': {
        os: 'Windows',
        osVersion: '11',
        sessionName: 'Windows 11 - Chrome Latest',
        buildName: BUILD_NAME,
        projectName: PROJECT_NAME,
        buildIdentifier: BUILD_IDENTIFIER,
      },
    },

    // Windows 11 Firefox Latest
    {
      browserName: 'firefox',
      browserVersion: 'latest',
      'bstack:options': {
        os: 'Windows',
        osVersion: '11',
        sessionName: 'Windows 11 - Firefox Latest',
        buildName: BUILD_NAME,
        projectName: PROJECT_NAME,
        buildIdentifier: BUILD_IDENTIFIER,
      },
    },

    // OS X Sonoma Chrome Latest
    {
      browserName: 'chrome',
      browserVersion: 'latest',
      'bstack:options': {
        os: 'OS X',
        osVersion: 'Sonoma',
        sessionName: 'OS X Sonoma - Chrome Latest',
        buildName: BUILD_NAME,
        projectName: PROJECT_NAME,
        buildIdentifier: BUILD_IDENTIFIER,
      },
    },

    // OS X Sonoma Safari Latest
    {
      browserName: 'safari',
      browserVersion: 'latest',
      'bstack:options': {
        os: 'OS X',
        osVersion: 'Sonoma',
        sessionName: 'OS X Sonoma - Safari Latest',
        buildName: BUILD_NAME,
        projectName: PROJECT_NAME,
        buildIdentifier: BUILD_IDENTIFIER,
      },
    },

    // iPhone 15 iOS 17 Safari Latest
    {
      browserName: 'safari',
      'bstack:options': {
        deviceName: 'iPhone 15',
        osVersion: '17',
        sessionName: 'iPhone 15 - iOS 17 - Safari Latest',
        buildName: BUILD_NAME,
        projectName: PROJECT_NAME,
        buildIdentifier: BUILD_IDENTIFIER,
      },
    },

    // Samsung Galaxy S25 Android 15 Chrome Latest
    {
      browserName: 'chrome',
      'bstack:options': {
        deviceName: 'Samsung Galaxy S25',
        osVersion: '15.0',
        sessionName: 'Samsung Galaxy S25 - Android 15 - Chrome Latest',
        buildName: BUILD_NAME,
        projectName: PROJECT_NAME,
        buildIdentifier: BUILD_IDENTIFIER,
      },
    },
  ],

  logLevel: 'silent',
  bail: 0,
  framework: 'mocha',
  specFileRetries: 1,
  specFileRetriesDeferred: true,

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
    retries: 2,
    timeout: 1800000, // 30 minutes
  },
};
