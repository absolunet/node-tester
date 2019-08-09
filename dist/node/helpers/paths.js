"use strict";

exports.default = void 0;

var _fss = _interopRequireDefault(require("@absolunet/fss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Paths
//--------------------------------------------------------
const __ = {
  root: _fss.default.realpath(`${__dirname}/../../..`),
  projectRoot: _fss.default.realpath(`.`)
};
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
   * Runners root path.
   *
   * @type {string}
   */


  get runners() {
    return `${__.root}/dist/node/runners`;
  }
  /**
   * Transformers root path.
   *
   * @type {string}
   */


  get transformers() {
    return `${__.root}/dist/node/transformers`;
  }
  /**
   * Tests root path.
   *
   * @type {string}
   */


  get tests() {
    return `${__.root}/dist/node/tests`;
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