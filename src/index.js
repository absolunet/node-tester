//--------------------------------------------------------
//-- @absolunet/tester
//--------------------------------------------------------
import AbsolunetTester from "./AbsolunetTester.js";

const tester = new AbsolunetTester();

/**
 * Exports a default instance of the tester and also the main class.
 *
 * @module absolunet/tester
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

export {
	/**
	 * Class definition of Tester.
	 *
	 * @name Tester
	 * @type {AbsolunetTester}
	 */
	AbsolunetTester as Tester,
	/**
	 * Instance of Tester.
	 *
	 * @name tester
	 * @type {AbsolunetTester}
	 */
	tester,
};
