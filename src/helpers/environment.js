//--------------------------------------------------------
//-- Environment
//--------------------------------------------------------

/**
 * Environment.
 *
 * @hideconstructor
 */
class EnvironmentHelper {

	/**
	 * Temporary env variable to pass custom config to Jest.
	 *
	 * @type {string}
	 */
	get jestConfigVariable() {
		return '__TEMP__ABSOLUNET_TESTER_JEST_CONFIG';
	}

}


export default new EnvironmentHelper();
