"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _environment = _interopRequireDefault(require("../environment"));

var _paths = _interopRequireDefault(require("../paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Runner config helper
//--------------------------------------------------------
const JEST_GENERIC_PLUGINS = [require.resolve('jest-expect-message'), require.resolve('jest-extended')];
const JEST_PROJECT_PLUGINS = [require.resolve('jest-extended')];
const JEST_TRANSFORM = {
  '\\.js$': `${_paths.default.transformers}/babel`
};
const __ = {};
/**
 * Configurations for Jest {@link https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig project} runners.
 *
 * @hideconstructor
 */

class RunnerHelperConfig {
  /**
   * Jest globals variables.
   *
   * @type {object}
   */
  get globals() {
    return {
      [_environment.default.JEST_GLOBALS_KEY]: __.globals
    };
  }
  /**
   * Set Jest globals variables.
   *
   * @param {object} globals - Data to be exposed globally by Jest.
   */


  set globals(globals) {
    __.globals = globals;
  }
  /* eslint-disable unicorn/prevent-abbreviations */

  /**
   * Configuration for linting JavaScript files.
   *
   * @type {object}
   */


  get lintJS() {
    return {
      displayName: 'Standards: Lint JS',
      runner: `${_paths.default.runners}/lint-js`,
      rootDir: _paths.default.project.root,
      testMatch: ['**/*.js'],
      globals: this.globals
    };
  }
  /**
   * Configuration for linting JSON files.
   *
   * @type {object}
   */


  get lintJSON() {
    return {
      displayName: 'Standards: Lint JSON',
      runner: `${_paths.default.runners}/lint-json`,
      rootDir: _paths.default.project.root,
      testMatch: ['**/*.json', '!**/package-lock.json', '!**/packages/**/*'],
      globals: this.globals
    };
  }
  /**
   * Configuration for linting YAML files.
   *
   * @type {object}
   */


  get lintYAML() {
    return {
      displayName: 'Standards: Lint YAML',
      runner: `${_paths.default.runners}/lint-yaml`,
      rootDir: _paths.default.project.root,
      moduleFileExtensions: ['yaml', 'yml'],
      testMatch: ['**/*.{yaml,yml}', '!**/packages/**/*'],
      globals: this.globals
    };
  }
  /**
   * Configuration for linting Bash files.
   *
   * @type {object}
   */


  get lintBash() {
    return {
      displayName: 'Standards: Lint Bash',
      runner: `${_paths.default.runners}/lint-bash`,
      rootDir: _paths.default.project.root,
      moduleFileExtensions: ['sh'],
      testMatch: ['**/*.sh', '!**/packages/**/*'],
      globals: this.globals
    };
  }
  /**
   * Configuration for linting SCSS files.
   *
   * @type {object}
   */


  get lintSCSS() {
    return {
      displayName: 'Standards: Lint SCSS',
      runner: `${_paths.default.runners}/lint-scss`,
      rootDir: _paths.default.project.root,
      moduleFileExtensions: ['scss'],
      testMatch: ['**/*.scss'],
      globals: this.globals
    };
  }
  /**
   * Configuration for linting files styling.
   *
   * @param {RepositoryType} repositoryType - Repository type.
   * @returns {object} Configuration.
   */


  lintFileStyles(repositoryType) {
    const prefix = repositoryType === _environment.default.REPOSITORY_TYPE.subPackage ? `/../..` : '';

    const rawConfig = _fss.default.readFile(`${_paths.default.project.root}${prefix}/.editorconfig`, 'utf8');

    const rawPatterns = [...rawConfig.matchAll(/^\[(?<pattern>.+)\]$/gum)];
    const patterns = rawPatterns.map(item => {
      return `**/${item[1]}`;
    });
    return {
      displayName: 'Standards: Lint file styles',
      runner: `${_paths.default.runners}/lint-file-styles`,
      rootDir: _paths.default.project.root,
      moduleFileExtensions: ['*'],
      testMatch: [...patterns, '!**/*.{js,scss}', '!**/package-lock.json', '!**/packages/**/*'],
      globals: this.globals
    };
  }
  /**
   * Configuration for validating a repository.
   *
   * @type {object}
   */


  get genericTests() {
    return {
      displayName: 'Standards: Generic tests',
      rootDir: `${_paths.default.project.test}/generic`,
      setupFilesAfterEnv: JEST_GENERIC_PLUGINS,
      transform: JEST_TRANSFORM,
      globals: this.globals
    };
  }
  /**
   * Configuration for running a project's custom standards tests.
   *
   * @type {object}
   */


  get projectStandardsTests() {
    return {
      displayName: 'Standards: Project tests',
      rootDir: `${_paths.default.project.test}/standards`,
      setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
      transform: JEST_TRANSFORM
    };
  }
  /**
   * Configuration for running a project's custom unit tests.
   *
   * @type {object}
   */


  get projectUnitTests() {
    return {
      displayName: 'Unit: Project tests',
      rootDir: `${_paths.default.project.test}/unit`,
      setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
      transform: JEST_TRANSFORM
    };
  }
  /**
   * Configuration for running a project's custom feature tests.
   *
   * @type {object}
   */


  get projectFeatureTests() {
    return {
      displayName: 'Feature: Project tests',
      rootDir: `${_paths.default.project.test}/feature`,
      setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
      transform: JEST_TRANSFORM
    };
  }
  /**
   * Configuration for running a project's custom integration tests.
   *
   * @type {object}
   */


  get projectIntegrationTests() {
    return {
      displayName: 'Integration: Project tests',
      rootDir: `${_paths.default.project.test}/integration`,
      setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
      transform: JEST_TRANSFORM
    };
  }
  /**
   * Configuration for running a project's custom end-to-end tests.
   *
   * @type {object}
   */


  get projectEndtoendTests() {
    return {
      displayName: 'End-to-end: Project tests',
      rootDir: `${_paths.default.project.test}/endtoend`,
      setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
      transform: JEST_TRANSFORM
    };
  }
  /* eslint-enable unicorn/prevent-abbreviations */


}

var _default = new RunnerHelperConfig();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;