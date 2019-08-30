"use strict";

exports.default = void 0;

var _fss = _interopRequireDefault(require("@absolunet/fss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Paths
//--------------------------------------------------------
const __ = {};
__.root = _fss.default.realpath(`${__dirname}/../../..`);
__.code = `${__.root}/dist/node`;
__.projectRoot = _fss.default.realpath(`.`);
/**
 * Paths.
 *
 * @hideconstructor
 */

class Paths {
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
   * @typedef {object} ProjectPaths
   * @property {string} root - Project root.
   */

  /**
   * Current project paths.
   *
   * @type {ProjectPaths}
   */


  get project() {
    return {
      root: __.projectRoot,
      test: `${__.projectRoot}/test`
    };
  }

}

var _default = new Paths();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;