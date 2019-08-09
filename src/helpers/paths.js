//--------------------------------------------------------
//-- Paths
//--------------------------------------------------------
import fss from '@absolunet/fss';


const __ = {
	root:        fss.realpath(`${__dirname}/../../..`),
	projectRoot: fss.realpath(`.`)
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


export default new Paths();
