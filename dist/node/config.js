"use strict";

exports.projects = void 0;

var _config = _interopRequireDefault(require("./helpers/config"));

var _runner = _interopRequireDefault(require("./helpers/runner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
const runners = [_runner.default.config.lintJS, _runner.default.config.lintJSON, _runner.default.config.lintYAML, _runner.default.config.lintBash, _runner.default.config.lintSCSS, _runner.default.config.lintFileStyles, _runner.default.config.projectFeatureTests, _runner.default.config.projectUnitTests];
exports.projects = runners;

if (_config.default.repositoryType === 'single-package') {
  runners.push(...[_runner.default.config.validateSinglePackage]);
} else {
  throw new Error('No config found');
}