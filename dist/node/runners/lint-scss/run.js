"use strict";

exports.default = void 0;

var _createJestRunner = require("create-jest-runner");

var _stylelint = _interopRequireDefault(require("stylelint"));

var _runner = _interopRequireDefault(require("../../helpers/runner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Lint SCSS runner - Run
//--------------------------------------------------------
var _default = ({
  testPath
}) => {
  const testResult = _runner.default.initTestResult({
    testPath,
    title: 'stylelint'
  });

  return _stylelint.default.lint({
    files: testPath,
    syntax: 'scss',
    formatter: 'string',
    allowEmptyInput: true
  }).then(data => {
    const [results] = data.results;

    if (results === undefined) {
      return (0, _createJestRunner.skip)(testResult());
    }

    if (results.warnings.length !== 0 || results.deprecations.length !== 0 || results.invalidOptionWarnings.length !== 0) {
      const rawOutput = data.output.split('\n');
      rawOutput.splice(0, 2);
      return (0, _createJestRunner.fail)(testResult(rawOutput.join('\n')));
    }

    return (0, _createJestRunner.pass)(testResult());
  }).catch(error => {
    return (0, _createJestRunner.fail)(testResult(_runner.default.formatError(`${error.stack}\n`)));
  });
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;