//--------------------------------------------------------
//-- @absolunet/tester
//--------------------------------------------------------
import Tester from './Tester';


const tester = new Tester();


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
export {

	/**
	 * Instance of Tester.
	 *
	 * @type {Tester}
	 **/
	tester,

	/**
	 * Class definition of Tester.
	 *
	 * @type {class}
	 **/
	Tester
};
