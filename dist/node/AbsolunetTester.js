"use strict";

exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _child_process = require("child_process");

var _minimist = _interopRequireDefault(require("minimist"));

var _spdxLicenseIds = _interopRequireDefault(require("spdx-license-ids"));

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _joi = require("@absolunet/joi");

var _terminal = require("@absolunet/terminal");

var _environment = _interopRequireDefault(require("./helpers/environment"));

var _paths = _interopRequireDefault(require("./helpers/paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- AbsolunetTester
//--------------------------------------------------------
const customization = {}; // Temporary workaround for unit tests until this method is implemented in @absolunet/terminal

if (!_terminal.terminal.runWithOptions) {
  _terminal.terminal.runWithOptions = (cmd, options) => {
    const {
      cwd
    } = options;
    const environment = options.env || {};
    (0, _child_process.execSync)(cmd, {
      stdio: 'inherit',
      cwd,
      env: { ...process.env,
        ...environment
      }
    }); // eslint-disable-line unicorn/prevent-abbreviations, no-process-env
  };
}
/**
 * Absolunet's npm packages tester.
 */


class AbsolunetTester {
  /**
   * Customization options when extending.
   *
   * @param {object} [options] - Customization parameters.
   * @param {string} [options.nameScope='@absolunet'] - Package name scope.
   * @param {string} [options.source='github.com/absolunet'] - Package source.
   * @param {object<string>} [options.author={ name: 'Absolunet', url: 'https://absolunet.com' }] - Package author.
   * @param {string} [options.license='MIT'] - Package license.
   * @param {Array<CIEngine>} [options.ciEngine=['pipelines', 'travis']] - Package CI engines.
   */
  constructor(options = {}) {
    (0, _joi.validateArgument)('options', options, _joi.Joi.object({
      nameScope: _joi.Joi.alternatives().try('', _joi.Joi.string().pattern(/^@[a-z0-9]+(?:-[a-z0-9]+)*$/u, 'npm scope')),
      source: _joi.Joi.string().replace(/^(?<all>\.+)$/u, 'https://$<all>').uri(),
      author: _joi.Joi.object({
        name: _joi.Joi.string().required(),
        url: _joi.Joi.string().uri().required()
      }),
      license: _joi.Joi.string().valid(..._spdxLicenseIds.default),
      ciEngine: _joi.Joi.array().items(_joi.Joi.string().valid(...Object.values(_environment.default.CI_ENGINE))).min(1).unique()
    }));
    const nameScope = options.nameScope === undefined ? '@absolunet' : options.nameScope;
    customization.nameScope = nameScope ? `${nameScope}/` : '';
    customization.source = options.source || 'github.com/absolunet';
    customization.author = options.author || {
      name: 'Absolunet',
      url: 'https://absolunet.com'
    };
    customization.license = options.license || 'MIT';
    customization.ciEngine = options.ciEngine || Object.values(_environment.default.CI_ENGINE);
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
    (0, _joi.validateArgument)('absolutePath', absolutePath, _joi.Joi.absolutePath());
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
    (0, _joi.validateArgument)('options', options, _joi.Joi.object({
      repositoryType: _joi.Joi.string().valid(...Object.values(_environment.default.REPOSITORY_TYPE)).required(),
      packageType: _joi.Joi.string().valid(...Object.values(_environment.default.PACKAGE_TYPE)).required()
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
    options.customization = customization; // Validate scope

    if (![_environment.default.TEST_ALL, ...Object.values(_environment.default.TEST_TYPE)].includes(options.scope)) {
      throw new Error(`Test scope '${options.scope}' is invalid`);
    }

    const iocTests = [];
    let shouldRunIocTestOnly = false;

    if (options.packageType === _environment.default.PACKAGE_TYPE.ioc && options.scope !== _environment.default.TEST_TYPE.standards) {
      if (options.scope === _environment.default.TEST_ALL) {
        options.scope = _environment.default.TEST_TYPE.standards;
        iocTests.push(...Object.values(_environment.default.TEST_TYPE_IOC));
      } else if (Object.values(_environment.default.TEST_TYPE).includes(options.scope)) {
        iocTests.push(options.scope);
        shouldRunIocTestOnly = true;
      }
    } //-- Run tests


    try {
      if (!shouldRunIocTestOnly) {
        _terminal.terminal.runWithOptions(`node ${_paths.default.jestBinary} --errorOnDeprecated --passWithNoTests --config=${_paths.default.config}/jest.js`, {
          env: {
            [_environment.default.JEST_CLI_KEY]: JSON.stringify(options)
          }
        } // eslint-disable-line unicorn/prevent-abbreviations
        ); //-- Multi package


        if (options.repositoryType === _environment.default.REPOSITORY_TYPE.multiPackage) {
          Object.values(_environment.default.projectSubpackages).forEach(subpackageRoot => {
            _terminal.terminal.spacer(3);

            _terminal.terminal.runWithOptions(`npm run test${options.scope !== _environment.default.TEST_ALL ? `:${options.scope}` : ''}`, {
              cwd: subpackageRoot
            });
          });
        }
      }

      iocTests.forEach(type => {
        _terminal.terminal.runWithOptions(`node ioc test --type=${type}`);
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

var _default = AbsolunetTester;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;