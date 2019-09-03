"use strict";

exports.projects = void 0;

var _environment = _interopRequireDefault(require("../helpers/environment"));

var _runner = _interopRequireDefault(require("../helpers/runner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------

/**
 * Types of repositories: 'single-package', 'multi-package'.
 *
 * @typedef {string} RepositoryType
 */
const REPOSITORY_TYPE = {
  singlePackage: 'single-package'
};
/**
 * Types of package: 'common'.
 *
 * @typedef {string} PackageType
 */

const PACKAGE_TYPE = {
  common: 'common'
};
const STANDARD = [_runner.default.config.lintJS, _runner.default.config.lintJSON, _runner.default.config.lintYAML, _runner.default.config.lintBash, _runner.default.config.lintSCSS, _runner.default.config.lintFileStyles];
const FEATURE = [_runner.default.config.projectFeatureTests];
const UNIT = [_runner.default.config.projectUnitTests];
/**
 * Options to customize the testing process.
 *
 * @typedef {object} TesterOptions
 * @property {RepositoryType} repositoryType - Type of repository.
 * @property {PackageType} packageType - Type of package.
 */

const runners = [];
exports.projects = runners;
const {
  repositoryType,
  packageType,
  scope
} = JSON.parse(process.env[_environment.default.jestConfigVariable]); // eslint-disable-line no-process-env
//-- Repository type

switch (repositoryType) {
  case REPOSITORY_TYPE.singlePackage:
    STANDARD.push(...[_runner.default.config.validateSinglePackage]);
    break;

  default:
    throw new Error('No repositoryType defined');
} //-- Package type


switch (packageType) {
  case PACKAGE_TYPE.common:
    break;

  default:
    throw new Error('No packageType defined');
} //-- Scope


switch (scope) {
  case 'all':
    runners.push(...STANDARD, ...FEATURE, ...UNIT);
    break;

  case 'standard':
    runners.push(...STANDARD);
    break;

  case 'feature':
    runners.push(...FEATURE);
    break;

  case 'unit':
    runners.push(...UNIT);
    break;

  default:
    throw new Error('No scope defined');
}