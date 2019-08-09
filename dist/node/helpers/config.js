"use strict";

exports.default = void 0;

var _fss = _interopRequireDefault(require("@absolunet/fss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Project configuration helper
//--------------------------------------------------------
const __ = {};
/**
 * xyz
 */

class Config {
  /**
   * xyz
   */
  constructor() {
    __.config = _fss.default.readYaml('./test/config.yaml');
  }
  /**
   * xyz
   */


  get repositoryType() {
    return __.config.repositoryType;
  }

}

var _default = new Config();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;