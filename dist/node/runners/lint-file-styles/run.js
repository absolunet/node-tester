"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createJestRunner = require("create-jest-runner");

var _eclint = _interopRequireDefault(require("eclint"));

var _gulpReporter = _interopRequireDefault(require("gulp-reporter"));

var _vinylFs = _interopRequireDefault(require("vinyl-fs"));

var _runner = _interopRequireDefault(require("../../helpers/runner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Lint file styles - Run
//--------------------------------------------------------
var _default = ({
  testPath
}) => {
  const testResult = _runner.default.initTestResult({
    testPath,
    title: 'EditorConfig'
  }); // Bad patch


  if (testPath.endsWith('.md')) {
    return (0, _createJestRunner.skip)(testResult());
  }

  return new Promise((resolve, reject) => {
    _vinylFs.default.src(testPath).pipe(_eclint.default.check()).pipe((0, _gulpReporter.default)({
      blame: false,
      fail: false,
      output: output => {
        reject(output);
      }
    })).on('finish', () => {
      resolve();
    });
  }).then(() => {
    return (0, _createJestRunner.pass)(testResult());
  }).catch(error => {
    const rawError = error.split('\n');
    rawError.shift();
    return (0, _createJestRunner.fail)(testResult(_runner.default.formatError(rawError.join('\n'))));
  });
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;