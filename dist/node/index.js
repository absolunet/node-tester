"use strict";

Object.defineProperty(exports, "Tester", {
  enumerable: true,
  get: function () {
    return _Tester.default;
  }
});
exports.tester = void 0;

var _Tester = _interopRequireDefault(require("./Tester"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- @absolunet/tester
//--------------------------------------------------------
const tester = new _Tester.default();
/**
 * Exports a default instance of the tester and also the main class.
 *
 * @module @absolunet/tester
 *
 * @example
 * import { tester } from '@absolunet/tester';
 *
 * tester.init({
 * 	repositoryType: 'single-package',
 * 	packageType:    'common'
 * });
 *
 * @example
 * import { Tester } from '@absolunet/tester';
 *
 * class MyTester extends Tester {
 * 	constructor(options) {
 * 		super(options);
 * 	}
 * }
 */

exports.tester = tester;