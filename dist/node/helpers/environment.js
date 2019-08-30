"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Environment
//--------------------------------------------------------

/**
 * Environment.
 *
 * @hideconstructor
 */
class Environment {
  /**
   * Temporary env variable to pass custom config to Jest.
   *
   * @type {string}
   */
  get jestConfigVariable() {
    return '__TEMP__ABSOLUNET_TESTER_JEST_CONFIG';
  }

}

var _default = new Environment();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;