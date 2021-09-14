//--------------------------------------------------------
//-- Paths
//--------------------------------------------------------
import { createRequire } from "module";
import fss from "@absolunet/fss";
import pkgDir from "pkg-dir";

const require = createRequire(__filename);

const __ = {};
__.root = pkgDir.sync(__dirname);
__.code = `${__.root}/dist/node`;
__.projectRoot = fss.realpath(`.`);
__.jestRoot = pkgDir.sync(require.resolve("jest"));

/**
 * Internal and project's paths.
 *
 * @hideconstructor
 */
class PathsHelper {
	/**
	 * Jest binary path.
	 *
	 * @type {string}
	 */
	get jestBinary() {
		return `${__.jestRoot}/bin/jest.js`;
	}

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
	 * @type {object}
	 * @property {string} root - Project root.
	 * @property {string} subpackages - Project subpackages.
	 * @property {string} test - Project tests.
	 */
	get project() {
		return {
			root: __.projectRoot,
			subpackages: `${__.projectRoot}/packages`,
			test: `${__.projectRoot}/test`,
		};
	}
}

export default new PathsHelper();
