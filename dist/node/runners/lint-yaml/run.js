"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createJestRunner = require("create-jest-runner");

var _yamlLint = _interopRequireDefault(require("yaml-lint"));

var _runner = _interopRequireDefault(require("../../helpers/runner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Lint YAML runner - Run
//--------------------------------------------------------
var _default = ({
  testPath
}) => {
  const testResult = _runner.default.initTestResult({
    testPath,
    title: 'YAML Lint'
  });

  return _yamlLint.default.lintFile(testPath).then(() => {
    return (0, _createJestRunner.pass)(testResult());
  }).catch(error => {
    return (0, _createJestRunner.fail)(testResult(_runner.default.formatError(error)));
  });
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;