"use strict";

exports.default = void 0;

var _readPackageJson = _interopRequireDefault(require("read-package-json"));

var _semver = _interopRequireDefault(require("semver"));

var _fss = _interopRequireDefault(require("@absolunet/fss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- package.json helper
//--------------------------------------------------------

/**
 * Package.json validation helper.
 *
 * @hideconstructor
 */
class PackageJsonHelper {
  /**
   * Parse the package.json.
   *
   * @async
   * @param {string} directoryPath - Path to the packge.json file.
   * @returns {Promise<{ config: object, parsedConfig: object }>} Parsed package.json file: config by raw JSON, parsedConfig by npm's parser.
   */
  readConfig(directoryPath) {
    const filePath = `${directoryPath}/package.json`;
    return new Promise((resolve, reject) => {
      // Parse via npm's parser
      (0, _readPackageJson.default)(filePath, _readPackageJson.default.log, true, (error, parsedConfig) => {
        // If valid
        if (!error) {
          const config = _fss.default.readJson(filePath);

          resolve({
            config,
            parsedConfig
          });
        } else {
          reject(error);
        }
      });
    });
  }
  /**
   * Validates that the raw JSON parsing is identical to npm's parsing.
   *
   * @param {object} config - Raw JSON parsing.
   * @param {object} parsedConfig - Clean npm's parsing.
   */


  validateIntegrity(config, parsedConfig) {
    Object.keys(config).forEach(key => {
      expect(config[key], `Raw config must be identical to parsed config for '${key}'`).toEqual(parsedConfig[key]);
    });
  }
  /**
   * Validates that the package.json contains all fields (no more, no less) and that their value is also respects the standards.
   *
   * @param {object} config - Parsed package.json.
   */


  validateFields(config) {
    expect(config.name, 'Name must be valid').toMatch(/^@absolunet\/(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u);
    expect(config.version === _semver.default.valid(config.version), 'Version must be valid').toBeTrue();
    expect(config.description, 'Description must be defined').toBeString().not.toBeEmpty();
    expect(config.homepage, 'Homepage must be valid').toMatch(/^https:\/\/(?<domain>github.com\/absolunet\/|absolunet.github.io\/).+/u);
    expect(config.author, 'Author must be valid').toContainAllEntries([['name', 'Absolunet'], ['url', 'https://absolunet.com']]);
    expect(config.keywords, 'Keywords must be defined').toBeArray().not.toBeEmpty();
    expect(config.license, 'License must be valid').toBe('MIT');
    expect(config.private, 'Private must not be defined').toBeUndefined();
    expect(config.repository, 'Repository must be valid').toContainAllEntries([['type', 'git'], ['url', expect.stringMatching(/git:\/\/github.com\/absolunet\/(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*\.git/u)]]);
    expect(config.bugs, 'Bugs must be valid').toContainAllEntries([['url', expect.stringMatching(/https:\/\/github.com\/absolunet\/(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*\/issues/u)]]);
    expect({
      main: config.main,
      browser: config.browser
    }, 'Main or browser must be defined').toSatisfy(({
      main,
      browser
    }) => {
      return typeof main === 'string' && main !== '' || typeof browser === 'string' && browser !== '';
    });

    if (config.main) {
      expect(config.engines, 'Engines must be valid').toContainAllEntries([['node', expect.stringMatching(/^>= \d+\.\d+\.\d+$/u)]]);
    }

    expect(config.scripts, 'Scripts must be valid').toContainEntries([['manager:install', 'node manager --task=install'], ['manager:outdated', 'node manager --task=outdated'], ['manager:build', 'node manager --task=build'], ['manager:watch', 'node manager --task=watch'], ['manager:documentation', 'node manager --task=documentation'], ['manager:prepare', 'node manager --task=prepare'], ['manager:rebuild', 'node manager --task=rebuild'], ['manager:publish', 'node manager --task=publish'], ['manager:publish:unsafe', 'node manager --task=publish:unsafe'], ['test', 'node test --scope=all'], ['test:standard', 'node test --scope=standard'], ['test:feature', 'node test --scope=feature'], ['test:unit', 'node test --scope=unit']]);
    expect(config.files, 'Files must not be defined').toBeUndefined();
    expect(config.config, 'Config must not be defined').toBeUndefined();
  }
  /**
   * Validates that the package.json respect Absolunet's format and standards.
   */


  validate() {
    describe(`Validate package.json`, () => {
      let packageConfig;
      let packageParsedConfig;
      beforeAll(() => {
        return this.readConfig('.').then(({
          config,
          parsedConfig
        }) => {
          packageConfig = config;
          packageParsedConfig = parsedConfig;
        }).catch(error => {
          throw new Error(error);
        });
      });
      test('Ensure parsed config integrity', () => {
        this.validateIntegrity(packageConfig, packageParsedConfig);
      });
      test('Ensure contains minimum fields', () => {
        this.validateFields(packageConfig);
      });
    });
  }

}

var _default = new PackageJsonHelper();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;