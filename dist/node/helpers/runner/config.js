"use strict";

exports.default = void 0;

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _paths = _interopRequireDefault(require("../paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Runner config helper
//--------------------------------------------------------
const JEST_PLUGINS = ['jest-chain', 'jest-expect-message', 'jest-extended'];
const JEST_TRANSFORM = {
  '\\.js$': `${_paths.default.transformers}/babel`
};
/**
 * Configurations for Jest {@link https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig project} runners.
 *
 * @hideconstructor
 */

class RunnerHelperConfig {
  /* eslint-disable unicorn/prevent-abbreviations */

  /**
   * Configuration for linting JavaScript files.
   *
   * @type {object}
   */
  get lintJS() {
    return {
      displayName: 'Lint JS',
      runner: `${_paths.default.runners}/lint-js`,
      rootDir: _paths.default.project.root,
      testMatch: ['**/*.js']
    };
  }
  /**
   * Configuration for linting JSON files.
   *
   * @type {object}
   */


  get lintJSON() {
    return {
      displayName: 'Lint JSON',
      runner: `${_paths.default.runners}/lint-json`,
      rootDir: _paths.default.project.root,
      testMatch: ['**/*.json', '!**/package-lock.json']
    };
  }
  /**
   * Configuration for linting YAML files.
   *
   * @type {object}
   */


  get lintYAML() {
    return {
      displayName: 'Lint YAML',
      runner: `${_paths.default.runners}/lint-yaml`,
      rootDir: _paths.default.project.root,
      moduleFileExtensions: ['yaml', 'yml'],
      testMatch: ['**/*.{yaml,yml}']
    };
  }
  /**
   * Configuration for linting Bash files.
   *
   * @type {object}
   */


  get lintBash() {
    return {
      displayName: 'Lint Bash',
      runner: `${_paths.default.runners}/lint-bash`,
      rootDir: _paths.default.project.root,
      moduleFileExtensions: ['sh'],
      testMatch: ['**/*.sh']
    };
  }
  /**
   * Configuration for linting SCSS files.
   *
   * @type {object}
   */


  get lintSCSS() {
    return {
      displayName: 'Lint SCSS',
      runner: `${_paths.default.runners}/lint-scss`,
      rootDir: _paths.default.project.root,
      moduleFileExtensions: ['scss'],
      testMatch: ['**/*.scss']
    };
  }
  /**
   * Configuration for linting files styling.
   *
   * @type {object}
   */


  get lintFileStyles() {
    const rawConfig = _fss.default.readFile(`${_paths.default.project.root}/.editorconfig`, 'utf8');

    const rawPatterns = [...rawConfig.matchAll(/^\[(?<pattern>.+)\]$/gum)];
    const patterns = rawPatterns.map(item => {
      return `**/${item[1]}`;
    });
    return {
      displayName: 'Lint file styles',
      runner: `${_paths.default.runners}/lint-file-styles`,
      rootDir: _paths.default.project.root,
      moduleFileExtensions: ['*'],
      testMatch: [...patterns, '!**/*.{js,scss}', '!**/package-lock.json']
    };
  }
  /**
   * Configuration for validating a single package.
   *
   * @type {object}
   */


  get validateSinglePackage() {
    return {
      displayName: 'Single package',
      rootDir: `${_paths.default.tests}/single-package`,
      setupFilesAfterEnv: JEST_PLUGINS
    };
  }
  /**
   * Configuration for running a project's custom feature tests.
   *
   * @type {object}
   */


  get projectFeatureTests() {
    return {
      displayName: 'Project feature tests',
      rootDir: `${_paths.default.project.test}/feature`,
      setupFilesAfterEnv: JEST_PLUGINS,
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
      displayName: 'Project unit tests',
      rootDir: `${_paths.default.project.test}/unit`,
      setupFilesAfterEnv: JEST_PLUGINS,
      transform: JEST_TRANSFORM
    };
  }
  /* eslint-enable unicorn/prevent-abbreviations */


}

var _default = new RunnerHelperConfig();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;