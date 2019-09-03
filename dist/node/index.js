"use strict";

exports.default = void 0;

var _minimist = _interopRequireDefault(require("minimist"));

var _terminal = require("@absolunet/terminal");

var _environment = _interopRequireDefault(require("./helpers/environment"));

var _paths = _interopRequireDefault(require("./helpers/paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------

/**
 * Absolunet's npm packages tester.
 *
 * @hideconstructor
 */
class Tester {
  /**
   * Initialize tests.
   *
   * @param {TesterOptions} options - Project options.
   * @example
   * tester.init({
   * 		repositoryType: 'single-package',
   * 		packageType:    'common'
   * });
   */
  init(options = {}) {
    options.scope = (0, _minimist.default)(process.argv.slice(2)).scope;

    try {
      _terminal.terminal.run(`export ${_environment.default.jestConfigVariable}='${JSON.stringify(options)}'; jest --config=${_paths.default.config}/jest.js`);
    } catch (error) {
      process.exit(1); // eslint-disable-line no-process-exit, unicorn/no-process-exit
    }
  }

}
/**
 * Exports an instance of {@link Tester}.
 *
 * @module @absolunet/tester
 */


var _default = new Tester();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;