"use strict";

exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _createJestRunner = require("create-jest-runner");

var _eslint = require("eslint");

var _runner = _interopRequireDefault(require("./runner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- ESLint helper
//--------------------------------------------------------

/**
 * ESLint helper.
 *
 * @hideconstructor
 */
class ESLintHelper {
  /**
   * Parse the package.json.
   *
   * @param {string} testPath - File to lint.
   * @param {object} options - ESLint {@link https://eslint.org/docs/developer-guide/nodejs-api#cliengine CLIEngine} options.
   * @returns {TestResult} Jest {@link https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-test-result/src/types.ts#L103-L135 TestResult} object.
   */
  run(testPath, options = {}) {
    const testResult = _runner.default.initTestResult({
      testPath,
      title: 'ESLint'
    });

    options.reportUnusedDisableDirectives = true;
    const cli = new _eslint.CLIEngine(options);

    if (cli.isPathIgnored(testPath)) {
      return (0, _createJestRunner.skip)(testResult());
    }

    const {
      results: [report]
    } = cli.executeOnFiles([testPath]);
    const problemCount = report.errorCount + report.warningCount;

    if (problemCount > 100) {
      return (0, _createJestRunner.fail)(testResult(`\n  [Too many to show...]\n\n${_chalk.default.red.bold(`✖ ${problemCount} problems (${report.errorCount} error${report.errorCount === 1 ? '' : 's'}, ${report.warningCount} warning${report.errorCount === 1 ? '' : 's'})`)}\n\n\n`));
    }

    let linterOutput;

    if (problemCount > 0) {
      const rawOutput = cli.getFormatter()([report]).split('\n');
      rawOutput.splice(1, 1);
      linterOutput = `${rawOutput.join('\n')}\n\n`;
    } // Fails


    if (report.errorCount > 0) {
      return (0, _createJestRunner.fail)(testResult(linterOutput));
    } // Passes


    const passResult = (0, _createJestRunner.pass)(testResult());

    if (report.warningCount > 0) {
      passResult.console = [{
        message: linterOutput,
        origin: testPath,
        type: 'warn'
      }];
    }

    return passResult;
  }

}

var _default = new ESLintHelper();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;