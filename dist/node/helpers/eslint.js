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
 * xyz
 */
class ESLint {
  /**
   * xyz
   */
  run(testPath, options = {}) {
    const testResult = _runner.default.initTestResult({
      testPath,
      title: 'ESLint'
    });

    const cli = new _eslint.CLIEngine(options);

    if (cli.isPathIgnored(testPath)) {
      return (0, _createJestRunner.skip)(testResult());
    }

    const {
      results: [report]
    } = cli.executeOnFiles([testPath]);
    const problemCount = report.errorCount + report.warningCount;

    if (problemCount > 0) {
      let output;

      if (problemCount > 100) {
        output = `\n  [Too many to show...]\n\n${_chalk.default.red.bold(`✖ ${problemCount} problems (${report.errorCount} error${report.errorCount === 1 ? '' : 's'}, ${report.warningCount} warning${report.errorCount === 1 ? '' : 's'})`)}\n\n\n`;
      } else {
        const rawOutput = cli.getFormatter()([report]).split('\n');
        rawOutput.splice(1, 1);
        output = `${rawOutput.join('\n')}\n\n`;
      }

      return (0, _createJestRunner.fail)(testResult(output));
    }

    return (0, _createJestRunner.pass)(testResult());
  }

}

var _default = new ESLint();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;