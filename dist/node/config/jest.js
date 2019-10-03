"use strict";

exports.projects = void 0;

var _environment = _interopRequireDefault(require("../helpers/environment"));

var _runner = _interopRequireDefault(require("../helpers/runner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
const runners = [];
exports.projects = runners;
const {
  repositoryType,
  packageType,
  scope,
  customization
} = JSON.parse(process.env[_environment.default.JEST_CLI_KEY]); // eslint-disable-line no-process-env

_runner.default.config.globals = {
  repositoryType,
  packageType,
  customization
};
const STANDARDS = [_runner.default.config.lintJS, _runner.default.config.lintJSON, _runner.default.config.lintYAML, _runner.default.config.lintBash, _runner.default.config.lintSCSS, _runner.default.config.lintFileStyles, _runner.default.config.genericTests, _runner.default.config.projectStandardsTests];
const UNIT = [_runner.default.config.projectUnitTests];
const FEATURE = [_runner.default.config.projectFeatureTests];
const INTEGRATION = [_runner.default.config.projectIntegrationTests];
const ENDTOEND = [_runner.default.config.projectEndtoendTests]; //-- Scope

switch (scope) {
  case 'all':
    runners.push(...STANDARDS, ...UNIT, ...FEATURE, ...INTEGRATION, ...ENDTOEND);
    break;

  case 'standards':
    if (packageType !== _environment.default.PACKAGE_TYPE.ioc) {
      runners.push(...STANDARDS);
    }

    break;

  case 'unit':
    if (packageType !== _environment.default.PACKAGE_TYPE.ioc) {
      runners.push(...UNIT);
    }

    break;

  case 'feature':
    if (packageType !== _environment.default.PACKAGE_TYPE.ioc) {
      runners.push(...FEATURE);
    }

    break;

  case 'integration':
    if (packageType !== _environment.default.PACKAGE_TYPE.ioc) {
      runners.push(...INTEGRATION);
    }

    break;

  case 'endtoend':
    if (packageType !== _environment.default.PACKAGE_TYPE.ioc) {
      runners.push(...ENDTOEND);
    }

    break;

  default:
    throw new Error('No scope defined');
}