"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _createJestRunner = require("create-jest-runner");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Runner helper
//--------------------------------------------------------

/**
 * Jest {@link https://jestjs.io/docs/en/configuration#runner-string runner} helper.
 *
 * @hideconstructor
 */
class RunnerHelper {
  /**
   * Runners configurations.
   *
   * @type {RunnerHelperConfig}
   */
  get config() {
    return _config.default;
  }
  /**
   * Create a Jest runner.
   *
   * @param {string} directory - Path to the runner directory containing a run.js file.
   * @returns {TestRunner} Jest {@link https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-runner/src/index.ts#L37-L186 TestRunner} object.
   */


  create(directory) {
    return (0, _createJestRunner.createJestRunner)(`${directory}/run`);
  }
  /**
   * Initialize a method to create {@link CreatejestrunnerConfig} .
   *
   * @param {object} parameters - Parameters.
   * @param {string} parameters.testPath - Path to the test file.
   * @param {string} parameters.title - Test title.
   * @returns {CreatejestrunnerConfigInitializer} TestResult initializer.
   */


  initTestResult({
    testPath,
    title
  }) {
    const start = new Date();
    /**
     * Creates a create-jest-runner configuration object for pass(), fail(), skip() methods.
     *
     * @typedef {Function} CreatejestrunnerConfigInitializer
     * @param {object} [errorMessage] - Error message.
     * @returns {CreatejestrunnerConfig} A create-jest-runner config object to generate a Jest {@link https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-test-result/src/types.ts#L103-L135 TestResult} object.
     */

    return errorMessage => {
      /**
       * A create-jest-runner configuration object for pass(), fail(), skip() methods.
       *
       * @typedef {object} CreatejestrunnerConfig
       * @property {Date} start - When test started.
       * @property {Date} end - When test ended.
       * @property {object} test - Test parameters.
       * @property {string} test.path - Path to the test file.
       * @property {string} test.title - Test title.
       * @property {string} test.errorMessage - Error message.
       */
      return {
        start,
        end: new Date(),
        test: {
          path: testPath,
          title,
          errorMessage
        }
      };
    };
  }
  /**
   * Returns the message with error styling.
   *
   * @param {string} message - Error message.
   * @returns {string} Error styled message.
   */


  formatError(message) {
    return _chalk.default.red(`\n${message}\n\n`);
  }

}

var _default = new RunnerHelper();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;