//--------------------------------------------------------
//-- @absolunet/tester
//--------------------------------------------------------
import AbsolunetTester from './AbsolunetTester';

const tester = new AbsolunetTester();






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

/**
 * Class definition of Tester.
 *
 * @name Tester
 * @type {AbsolunetTester}
 **/
export { AbsolunetTester as Tester };


/**
 * Instance of Tester.
 *
 * @name tester
 * @type {AbsolunetTester}
 **/
export { tester };
