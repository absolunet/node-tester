"use strict";

exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _minimist = _interopRequireDefault(require("minimist"));

var _spdxLicenseIds = _interopRequireDefault(require("spdx-license-ids"));

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _terminal = require("@absolunet/terminal");

var _dataValidation = _interopRequireDefault(require("./helpers/data-validation"));

var _environment = _interopRequireDefault(require("./helpers/environment"));

var _paths = _interopRequireDefault(require("./helpers/paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
const customization = {};
/**
 * Absolunet's npm packages tester.
 */

class Tester {
  /**
   * Customization options when extending.
   *
   * @param {object} [options] - Customization parameters.
   * @param {string} [options.nameScope='@absolunet'] - Package name scope.
   * @param {string} [options.source='github.com/absolunet'] - Package source.
   * @param {object<string>} [options.author={ name: 'Absolunet', url: 'https://absolunet.com' }] - Package author.
   * @param {string} [options.license='MIT'] - Package license.
   * @param {CIEngine} [options.ciEngine='travis'] - Package CI engine.
   */
  constructor(options = {}) {
    _dataValidation.default.argument('options', options, _joi.default.object({
      nameScope: _joi.default.alternatives().try('', _joi.default.string().pattern(/^@(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u, 'npm scope')),
      source: _joi.default.string().replace(/^(?<all>\.+)$/u, 'https://$<all>').uri(),
      author: _joi.default.object({
        name: _joi.default.string().required(),
        url: _joi.default.string().uri().required()
      }),
      license: _joi.default.string().valid(..._spdxLicenseIds.default),
      ciEngine: _joi.default.string().valid(...Object.values(_environment.default.CI_ENGINE))
    }));

    const nameScope = options.nameScope === undefined ? '@absolunet' : options.nameScope;
    customization.nameScope = nameScope ? `${nameScope}/` : '';
    customization.source = options.source || 'github.com/absolunet';
    customization.author = options.author || {
      name: 'Absolunet',
      url: 'https://absolunet.com'
    };
    customization.license = options.license || 'MIT';
    customization.ciEngine = options.ciEngine || _environment.default.CI_ENGINE.travis;
  }
  /**
   * List of subpackages.
   *
   * @type {object<string>}
   */


  get subpackages() {
    return _environment.default.projectSubpackages;
  }
  /**
   * Get a readable relative path from an absolute path.
   *
   * @param {string} absolutePath - Absolute path.
   * @returns {string} Stripped relative path to project root.
   */


  getReadablePath(absolutePath) {
    _dataValidation.default.argument('absolutePath', absolutePath, _dataValidation.default.absolutePath);

    return _environment.default.getReadablePath(absolutePath);
  }
  /**
   * Initialize tests.
   *
   * @param {object} options - Project options.
   * @param {RepositoryType} options.repositoryType - Type of repository.
   * @param {PackageType} options.packageType - Type of package.
   *
   * @example
   * tester.init({
   * 		repositoryType: 'single-package',
   * 		packageType:    'common'
   * });
   */


  init(options = {}) {
    _dataValidation.default.argument('options', options, _joi.default.object({
      repositoryType: _joi.default.string().valid(...Object.values(_environment.default.REPOSITORY_TYPE)).required(),
      packageType: _joi.default.string().valid(...Object.values(_environment.default.PACKAGE_TYPE)).required()
    })); //-- Check if generic tests are present


    const genericTests = `${_paths.default.project.test}/generic/index.test.js`;

    if (_fss.default.exists(genericTests)) {
      const esprima = require('esprima'); // eslint-disable-line global-require


      const code = _fss.default.readFile(genericTests, 'utf8');

      const found = esprima.tokenize(code).some(({
        type,
        value
      }) => {
        return type === 'Identifier' && value === 'genericRepositoryTests';
      });

      if (!found) {
        _terminal.terminal.exit(`Generic tests must be called: ${_chalk.default.underline('tester.genericRepositoryTests()')}`);
      }
    } else {
      _terminal.terminal.exit(`Generic tests must exist: ${_chalk.default.underline(genericTests)}`);
    } //-- Gather configurations


    options.scope = (0, _minimist.default)(process.argv.slice(2)).scope;
    options.customization = customization;
    const iocTests = [];
    let shouldRunIocTestOnly = false;

    if (options.packageType === _environment.default.PACKAGE_TYPE.ioc && options.scope !== _environment.default.TEST_TYPE.standards) {
      if (options.scope === 'all') {
        options.scope = _environment.default.TEST_TYPE.standards;
        iocTests.push(...Object.values(_environment.default.TEST_TYPE).filter(testType => {
          return testType !== _environment.default.TEST_TYPE.standards;
        }));
      } else if (Object.values(_environment.default.TEST_TYPE).includes(options.scope)) {
        iocTests.push(options.scope);
        shouldRunIocTestOnly = true;
      }
    } //-- Run tests


    try {
      if (!shouldRunIocTestOnly) {
        _terminal.terminal.run(`export ${_environment.default.JEST_CLI_KEY}='${JSON.stringify(options)}'; node ${_paths.default.jestBinary} --config=${_paths.default.config}/jest.js`);
      }

      iocTests.forEach(type => {
        _terminal.terminal.run(`node ioc test --type=${type}`);
      });
    } catch (error) {
      process.exit(1); // eslint-disable-line no-process-exit, unicorn/no-process-exit
    }
  }
  /**
   * Run generic repository tests.
   */


  genericRepositoryTests() {
    const repositoryPath = `${_paths.default.tests}/repository`;

    _fss.default.readdir(repositoryPath).forEach(file => {
      require(`${repositoryPath}/${file}`)(); // eslint-disable-line global-require

    });
  }

}

var _default = Tester;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;