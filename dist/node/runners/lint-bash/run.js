"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _child_process = require("child_process");

var _createJestRunner = require("create-jest-runner");

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _runner = _interopRequireDefault(require("../../helpers/runner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Lint Bash runner - Run
//--------------------------------------------------------
var _default = ({
  testPath
}) => {
  const testResult = _runner.default.initTestResult({
    testPath,
    title: 'bash -n'
  });

  return new Promise((resolve, reject) => {
    (0, _child_process.exec)(`bash -n ${_fss.default.realpath(testPath)}`, {}, (error
    /* , stdout, stderr */
    ) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  }).then(() => {
    return (0, _createJestRunner.pass)(testResult());
  }).catch(error => {
    const rawError = error.message.split('\n');
    rawError.shift();
    const cleanedError = rawError.map(line => {
      return line.replace(`${testPath}: `, '');
    });
    return (0, _createJestRunner.fail)(testResult(_runner.default.formatError(cleanedError.join('\n'))));
  });
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;