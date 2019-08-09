"use strict";

exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _createJestRunner = require("create-jest-runner");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Runner helper
//--------------------------------------------------------

/**
 * xyz
 */
class Runner {
  /**
   * xyz
   */
  get config() {
    return _config.default;
  }
  /**
   * xyz
   */


  create(directory) {
    return (0, _createJestRunner.createJestRunner)(`${directory}/run`);
  }
  /**
   * xyz
   */


  initTestResult({
    testPath,
    title
  }) {
    const start = new Date();
    return errorMessage => {
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
   * xyz
   */


  formatError(message) {
    return _chalk.default.red(`\n${message}\n\n`);
  }

}

var _default = new Runner();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;