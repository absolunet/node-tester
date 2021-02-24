//--------------------------------------------------------
//-- Environment
//--------------------------------------------------------
import fromEntries from 'object.fromentries';
import fss         from '@absolunet/fss';
import paths       from './paths';


// TODO [>=5.0.0]: Remove polyfill
if (!Object.fromEntries) {
	fromEntries.shim();
}

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
	get JEST_CLI_KEY() {
		return '__ABSOLUNET_TESTER_JEST_CONFIG__';
	}


	/**
	 * Temporary global variable to use in Jest globals config.
	 *
	 * @type {string}
	 */
	get JEST_GLOBALS_KEY() {
		return '__ABSOLUNET_TESTER_JEST_GLOBALS__';
	}


	/**
	 * Types of repository.
	 *
	 * @type {object<string, RepositoryType>}
	 * @property {RepositoryType} singlePackage - Single package.
	 * @property {RepositoryType} multiPackage - Multi package.
	 * @property {RepositoryType} subPackage - Subpackage.
	 */
	get REPOSITORY_TYPE() {
		return {
			singlePackage: 'single-package',
			multiPackage:  'multi-package',
			subPackage:    'sub-package'
		};
	}


	/**
	 * Types of package.
	 *
	 * @type {object<string, PackageType>}
	 * @property {PackageType} simple - Simple classic package.
	 * @property {PackageType} ioc - IoC package.
	 */
	get PACKAGE_TYPE() {
		return {
			simple: 'simple',
			ioc:    'ioc'
		};
	}


	/**
	 * Types of test.
	 *
	 * @type {object<string, TestType>}
	 * @property {TestType} standards - Standards tests.
	 * @property {TestType} unit - Unit tests.
	 * @property {TestType} feature - Feature tests.
	 * @property {TestType} integration - Integration tests.
	 * @property {TestType} endtoend - End-to-end tests.
	 */
	get TEST_TYPE() {
		return {
			standards:   'standards',
			unit:        'unit',
			feature:     'feature',
			integration: 'integration',
			endtoend:    'endtoend'
		};
	}


	/**
	 * Types of IoC test.
	 *
	 * @type {object<string, TestType>}
	 * @property {TestType} unit - Unit tests.
	 * @property {TestType} feature - Feature tests.
	 * @property {TestType} integration - Integration tests.
	 * @property {TestType} endtoend - End-to-end tests.
	 */
	get TEST_TYPE_IOC() {
		return Object.fromEntries(Object.entries(this.TEST_TYPE).filter(([, value]) => {
			return value !== this.TEST_TYPE.standards;
		}));
	}


	/**
	 * All tests identifier.
	 *
	 * @type {string}
	 */
	get TEST_ALL() {
		return 'all';
	}


	/**
	 * Types of CI engine.
	 *
	 * @type {object<string, CIEngine>}
	 * @property {CIEngine} pipelines - Bitbucket Pipelines.
	 * @property {CIEngine} githubActions - GitHub Actions.
	 */
	get CI_ENGINE() {
		return {
			pipelines:     'pipelines',
			githubActions: 'github-actions'
		};
	}


	/**
	 * Node.js LTS versions.
	 *
	 * @type {Array<number>}
	 */
	get LTS_VERSIONS() {
		return fss.readYaml(`${paths.root}/.github/workflows/tests.yaml`).jobs.build.strategy.matrix.node_version;
	}


	/**
	 * List of subpackages and their path.
	 *
	 * @type {object<string, string>}
	 */
	get projectSubpackages() {
		if (fss.existsCase(paths.project.subpackages)) {
			const rawList = fss.scandir(paths.project.subpackages, 'dir', { fullPath: true });

			const list = {};
			for (const path of rawList) {
				list[path.split('/').pop()] = path;
			}

			return list;
		}

		return {};
	}


	/**
	 * Get package customization.
	 *
	 * @type {object}
	 */
	get packageCustomization() {
		return global[this.JEST_GLOBALS_KEY].customization;
	}


	/**
	 * Current repository type.
	 *
	 * @type {RepositoryType}
	 */
	get repositoryType() {
		return global[this.JEST_GLOBALS_KEY].repositoryType;
	}


	/**
	 * Current package type.
	 *
	 * @type {PackageType}
	 */
	get packageType() {
		return global[this.JEST_GLOBALS_KEY].packageType;
	}


	/**
	 * Current repository version.
	 *
	 * @type {string}
	 */
	get version() {
		return fss.readJson(`${paths.project.root}/${this.repositoryType === this.REPOSITORY_TYPE.multiPackage ? 'lerna' : 'package'}.json`).version;
	}


	/**
	 * Current repository Node.js version.
	 *
	 * @type {number}
	 */
	get nodeVersion() {
		return Number(fss.readJson(`${paths.project.root}/package.json`).engines.node.slice(2));
	}


	/**
	 * Get a readable relative path from an absolute path.
	 *
	 * @param {string} absolutePath - Absolute path.
	 * @returns {string} Stripped relative path to project root.
	 */
	getReadablePath(absolutePath) {
		if (absolutePath.startsWith(paths.project.root)) {
			const relativePath = absolutePath.slice(paths.project.root.length + 1);

			return relativePath === '' ? '.' : `./${relativePath}`;
		}

		return absolutePath;
	}

}


export default new EnvironmentHelper();
