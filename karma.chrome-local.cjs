module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-chrome-launcher'],
    files: [
      './node_modules/chai/chai.js',
      './node_modules/eventti/dist/eventti.umd.js',
      './node_modules/tikki/dist/tikki.umd.js',
      './tests/dist/tests.umd.js',
    ],
    reporters: ['mocha'],
    singleRun: true,
    logLevel: config.LOG_INFO,
    colors: true,
    browsers: ['Chrome'],
  });
};
