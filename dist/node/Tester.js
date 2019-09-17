"use strict";

exports.default = void 0;

var _minimist = _interopRequireDefault(require("minimist"));

var _terminal = require("@absolunet/terminal");

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
  constructor({
    nameScope = '@absolunet',
    source,
    author,
    license,
    ciEngine
  } = {}) {
    customization.nameScope = nameScope ? `${nameScope}/` : '';
    customization.source = source || 'github.com/absolunet';
    customization.author = author || {
      name: 'Absolunet',
      url: 'https://absolunet.com'
    };
    customization.license = license || 'MIT';
    customization.ciEngine = ciEngine || _environment.default.CI_ENGINE.travis;
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
    options.scope = (0, _minimist.default)(process.argv.slice(2)).scope;
    options.customization = customization;
    const iocTests = [];

    if (options.packageType === _environment.default.PACKAGE_TYPE.ioc) {
      if (options.scope === 'all') {
        iocTests.push(..._environment.default.TEST_TYPE);
      } else if (Object.values(..._environment.default.TEST_TYPE).includes(options.scope)) {
        iocTests.push(options.scope);
      }
    }

    try {
      _terminal.terminal.run(`export ${_environment.default.JEST_CLI_KEY}='${JSON.stringify(options)}'; node ${_paths.default.jestBinary} --config=${_paths.default.config}/jest.js`);

      iocTests.forEach(type => {
        _terminal.terminal.run(`node ioc test --type=${type}`);
      });
    } catch (error) {
      process.exit(1); // eslint-disable-line no-process-exit, unicorn/no-process-exit
    }
  }

}

var _default = Tester;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;