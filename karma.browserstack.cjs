require('dotenv').config();

module.exports = function (config) {
  config.set({
    browserStack: {
      project: 'DragDoll',
      name: 'DragDoll test',
      video: false,
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    },

    basePath: '',
    frameworks: ['mocha'],
    plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-browserstack-launcher'],
    files: ['./tests/dist/tests.global.js'],
    reporters: ['mocha', 'BrowserStack'],
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    singleRun: true,

    customLaunchers: {
      // Windows 11
      bs_Windows_11_Chrome_Latest: {
        name: 'DragDoll: Windows 11 - Chrome Latest',
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '11',
      },
      bs_Windows_11_Firefox_Latest: {
        name: 'DragDoll: Windows 11 - Firefox Latest',
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '11',
      },

      // OS X Sonoma
      bs_OSX_Sonoma_Chrome_Latest: {
        name: 'DragDoll: OS X Sonoma - Chrome Latest',
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Sonoma',
      },
      bs_OSX_Sonoma_Safari_Latest: {
        name: 'DragDoll: OS X Sonoma - Safari Latest',
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Sonoma',
      },

      // iOS
      bs_iPhone_15_iOS_17_Safari_Latest: {
        name: 'DragDoll: iPhone 15 - iOS 17 - Safari Latest',
        base: 'BrowserStack',
        device: 'iPhone 15',
        os: 'ios',
        os_version: '17',
        real_mobile: true,
      },

      // Android
      bs_Google_Pixel_8_Android_14_Chrome_Latest: {
        name: 'DragDoll: Google Pixel 8 - Android 14 - Chrome Latest',
        base: 'BrowserStack',
        device: 'Google Pixel 8',
        os: 'android',
        os_version: '14.0',
        browser: 'chrome',
        browser_version: 'latest',
        real_mobile: true,
      },
    },

    browsers: [
      'bs_Windows_11_Chrome_Latest',
      'bs_Windows_11_Firefox_Latest',
      'bs_OSX_Sonoma_Chrome_Latest',
      'bs_OSX_Sonoma_Safari_Latest',
      'bs_iPhone_15_iOS_17_Safari_Latest',
      'bs_Google_Pixel_8_Android_14_Chrome_Latest',
    ],
  });
};
