"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pkgDir = _interopRequireDefault(require("pkg-dir"));

var _fss = _interopRequireDefault(require("@absolunet/fss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Paths
//--------------------------------------------------------
const __ = {};
__.root = _pkgDir.default.sync(__dirname);
__.code = `${__.root}/dist/node`;
__.projectRoot = _fss.default.realpath(`.`);
__.jestRoot = _pkgDir.default.sync(require.resolve('jest'));
/**
 * Internal and project's paths.
 *
 * @hideconstructor
 */

class PathsHelper {
  /**
   * Jest binary path.
   *
   * @type {string}
   */
  get jestBinary() {
    return `${__.jestRoot}/bin/jest.js`;
  }
  /**
   * Tester root.
   *
   * @type {string}
   */


  get root() {
    return __.root;
  }
  /**
   * Matrix root path.
   *
   * @type {string}
   */


  get matrix() {
    return `${__.root}/matrix`;
  }
  /**
   * Config root path.
   *
   * @type {string}
   */


  get config() {
    return `${__.code}/config`;
  }
  /**
   * Runners root path.
   *
   * @type {string}
   */


  get runners() {
    return `${__.code}/runners`;
  }
  /**
   * Tests root path.
   *
   * @type {string}
   */


  get tests() {
    return `${__.code}/tests`;
  }
  /**
   * Transformers root path.
   *
   * @type {string}
   */


  get transformers() {
    return `${__.code}/transformers`;
  }
  /**
   * Current project paths.
   *
   * @type {object}
   * @property {string} root - Project root.
   * @property {string} subpackages - Project subpackages.
   * @property {string} test - Project tests.
   */


  get project() {
    return {
      root: __.projectRoot,
      subpackages: `${__.projectRoot}/packages`,
      test: `${__.projectRoot}/test`
    };
  }

}

var _default = new PathsHelper();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;