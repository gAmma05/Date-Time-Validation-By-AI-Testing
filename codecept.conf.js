const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
require('dotenv').config();

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      show: false,
      waitForTimeout: 5000
    },
    AIHelper: {
      require: './helpers/ai_helper.js'
    },
    DateHelper: {
      require: './helpers/date_helper.js'
    }
  },
  include: {
    I: './steps_file.js'
  },
  plugins: {
    retryFailedStep: { enabled: true },
    screenshotOnFail: { enabled: true },
    htmlReporter: { enabled: true }
  },
  name: 'ai_testing'
};
