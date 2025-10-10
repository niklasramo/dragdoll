module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
    ],
    files: ['./tests/dist/tests.umd.js'],
    reporters: ['mocha'],
    singleRun: true,
    logLevel: config.LOG_INFO,
    colors: true,
    browsers: ['Chrome', 'Firefox'],
    client: {
      mocha: {
        timeout: 10000,
      },
    },
  });
};
