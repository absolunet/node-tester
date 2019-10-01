"use strict";

exports.default = void 0;

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _paths = _interopRequireDefault(require("./paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Environment
//--------------------------------------------------------

/**
 * Environment.
 *
 * @hideconstructor
 */
class EnvironmentHelper {
  /**
   * Temporary env variable to pass custom config to Jest.
   *
   * @type {string}
   */
  get JEST_CLI_KEY() {
    return '__ABSOLUNET_TESTER_JEST_CONFIG__';
  }
  /**
   * Temporary global variable to use in Jest globals config.
   *
   * @type {string}
   */


  get JEST_GLOBALS_KEY() {
    return '__ABSOLUNET_TESTER_JEST_GLOBALS__';
  }
  /**
   * Type of repository: 'single-package', 'multi-package'.
   *
   * @typedef {string} RepositoryType
   */

  /**
   * Types of repository.
   *
   * @type {object<RepositoryType>}
   */


  get REPOSITORY_TYPE() {
    return {
      singlePackage: 'single-package',
      multiPackage: 'multi-package'
    };
  }
  /**
   * Type of package: 'common'.
   *
   * @typedef {string} PackageType
   */

  /**
   * Types of package.
   *
   * @type {object<PackageType>}
   */


  get PACKAGE_TYPE() {
    return {
      simple: 'simple',
      ioc: 'ioc'
    };
  }
  /**
   * Type of group: All {@link PackageType} and 'multi', 'sub'.
   *
   * @typedef {string} GroupType
   */

  /**
   * Types of group.
   *
   * @type {object<GroupType>}
   */


  get GROUP_TYPE() {
    return Object.assign({}, this.PACKAGE_TYPE, {
      multi: 'multi',
      sub: 'sub'
    });
  }
  /**
   * Type of test: 'standards', 'unit', 'feature', 'integration', 'endtoend'.
   *
   * @typedef {string} TestType
   */

  /**
   * Types of test.
   *
   * @type {object<TestType>}
   */


  get TEST_TYPE() {
    return {
      standards: 'standards',
      unit: 'unit',
      feature: 'feature',
      integration: 'integration',
      endtoend: 'endtoend'
    };
  }
  /**
   * Type of CI engine: 'travis', 'pipeline'.
   *
   * @typedef {string} CIEngine
   */

  /**
   * Types of CI engine.
   *
   * @type {object<CIEngine>}
   */


  get CI_ENGINE() {
    return {
      travis: 'travis',
      pipelines: 'pipelines'
    };
  }
  /**
   * List of subpackages and their path.
   *
   * @type {object<string>}
   */


  get projectSubpackages() {
    if (_fss.default.exists(_paths.default.project.subpackages)) {
      return _fss.default.scandir(_paths.default.project.subpackages, 'dir', {
        fullPath: true
      }).reduce((list, path) => {
        list[path.split('/').pop()] = path;
        return list;
      }, {});
    }

    return {};
  }
  /**
   * Get package customization.
   *
   * @type {object}
   */


  get packageCustomization() {
    return global[this.JEST_GLOBALS_KEY].customization;
  }
  /**
   * Current repository type.
   *
   * @type {RepositoryType}
   */


  get repositoryType() {
    return global[this.JEST_GLOBALS_KEY].repositoryType;
  }
  /**
   * Current package type.
   *
   * @type {PackageType}
   */


  get packageType() {
    return global[this.JEST_GLOBALS_KEY].packageType;
  }
  /**
   * Define group.
   *
   * @param {parameters} [parameters] - Parameters.
   * @param {RepositoryType} [parameters.repositoryType=this.repositoryType] - Type of repository.
   * @param {PackageType} [parameters.packageType=this.packageType] - Type of package.
   * @param {boolean} [parameters.subPackage=false] - If is subpackage.
   * @returns {GroupType} Type of group.
   */


  groupType({
    repositoryType = this.repositoryType,
    packageType = this.packageType,
    subpackage = false
  } = {}) {
    let group = packageType;

    if (repositoryType === this.REPOSITORY_TYPE.multiPackage) {
      if (subpackage) {
        if (packageType === this.PACKAGE_TYPE.simple) {
          group = this.GROUP_TYPE.sub;
        }
      } else {
        group = this.GROUP_TYPE.multi;
      }
    }

    return group;
  }
  /**
   * Get a readable relative path from an absolute path.
   *
   * @param {string} absolutePath - Absolute path.
   * @returns {string} Stripped relative path to project root.
   */


  getReadablePath(absolutePath) {
    if (absolutePath.startsWith(_paths.default.project.root)) {
      const relativePath = absolutePath.substring(_paths.default.project.root.length + 1);
      return relativePath === '' ? '.' : `./${relativePath}`;
    }

    return absolutePath;
  }

}

var _default = new EnvironmentHelper();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;