//--------------------------------------------------------
//-- Runner config helper
//--------------------------------------------------------
import fss   from '@absolunet/fss';
import env   from '../environment';
import paths from '../paths';


const JEST_PLUGINS = [
	require.resolve('jest-chain'),
	require.resolve('jest-expect-message'),
	require.resolve('jest-extended')
];

const JEST_TRANSFORM = {
	'\\.js$': `${paths.transformers}/babel`
};

const __ = {};






/**
 * Configurations for Jest {@link https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig project} runners.
 *
 * @hideconstructor
 */
class RunnerHelperConfig {

	/**
	 * Set Jest globals variables.
	 *
	 * @param {object} globals - Data to be exposed globally by Jest.
	 */
	set globals(globals) {
		__.globals = globals;
	}


	/**
	 * Jest globals variables.
	 *
	 * @type {object}
	 */
	get globals() {
		return { [env.JEST_GLOBALS_KEY]: __.globals };
	}


	/* eslint-disable unicorn/prevent-abbreviations */

	/**
	 * Configuration for linting JavaScript files.
	 *
	 * @type {object}
	 */
	get lintJS() {
		return {
			displayName: 'Standards: Lint JS',
			runner:      `${paths.runners}/lint-js`,
			rootDir:     paths.project.root,
			testMatch:   ['**/*.js'],
			globals:     this.globals
		};
	}


	/**
	 * Configuration for linting JSON files.
	 *
	 * @type {object}
	 */
	get lintJSON() {
		return {
			displayName: 'Standards: Lint JSON',
			runner:      `${paths.runners}/lint-json`,
			rootDir:     paths.project.root,
			testMatch:   ['**/*.json', '!**/package-lock.json'],
			globals:     this.globals
		};
	}


	/**
	 * Configuration for linting YAML files.
	 *
	 * @type {object}
	 */
	get lintYAML() {
		return {
			displayName:          'Standards: Lint YAML',
			runner:               `${paths.runners}/lint-yaml`,
			rootDir:              paths.project.root,
			moduleFileExtensions: ['yaml', 'yml'],
			testMatch:            ['**/*.{yaml,yml}'],
			globals:              this.globals
		};
	}


	/**
	 * Configuration for linting Bash files.
	 *
	 * @type {object}
	 */
	get lintBash() {
		return {
			displayName:          'Standards: Lint Bash',
			runner:               `${paths.runners}/lint-bash`,
			rootDir:              paths.project.root,
			moduleFileExtensions: ['sh'],
			testMatch:            ['**/*.sh'],
			globals:              this.globals
		};
	}


	/**
	 * Configuration for linting SCSS files.
	 *
	 * @type {object}
	 */
	get lintSCSS() {
		return {
			displayName:          'Standards: Lint SCSS',
			runner:               `${paths.runners}/lint-scss`,
			rootDir:              paths.project.root,
			moduleFileExtensions: ['scss'],
			testMatch:            ['**/*.scss'],
			globals:              this.globals
		};
	}


	/**
	 * Configuration for linting files styling.
	 *
	 * @type {object}
	 */
	get lintFileStyles() {
		const rawConfig   = fss.readFile(`${paths.project.root}/.editorconfig`, 'utf8');
		const rawPatterns = [...rawConfig.matchAll(/^\[(?<pattern>.+)\]$/gum)];
		const patterns    = rawPatterns.map((item) => {
			return `**/${item[1]}`;
		});

		return {
			displayName:          'Standards: Lint file styles',
			runner:               `${paths.runners}/lint-file-styles`,
			rootDir:              paths.project.root,
			moduleFileExtensions: ['*'],
			testMatch:            [...patterns, '!**/*.{js,scss}', '!**/package-lock.json'],
			globals:              this.globals
		};
	}


	/**
	 * Configuration for validating a repository.
	 *
	 * @type {object}
	 */
	get validateRepository() {
		return {
			displayName:        'Standards: Repository',
			rootDir:            `${paths.tests}/repository`,
			setupFilesAfterEnv: JEST_PLUGINS,
			globals:            this.globals,

			// Allow tests from node_modules
			testPathIgnorePatterns: [],
			haste: {
				providesModuleNodeModules: ['.*']
			}
		};
	}


	/**
	 * Configuration for running a project's custom standards tests.
	 *
	 * @type {object}
	 */
	get projectStandardsTests() {
		return {
			displayName:        'Standards: Project tests',
			rootDir:            `${paths.project.test}/standards`,
			setupFilesAfterEnv: JEST_PLUGINS,
			transform:          JEST_TRANSFORM
		};
	}


	/**
	 * Configuration for running a project's custom unit tests.
	 *
	 * @type {object}
	 */
	get projectUnitTests() {
		return {
			displayName:        'Unit: Project tests',
			rootDir:            `${paths.project.test}/unit`,
			setupFilesAfterEnv: JEST_PLUGINS,
			transform:          JEST_TRANSFORM
		};
	}


	/**
	 * Configuration for running a project's custom feature tests.
	 *
	 * @type {object}
	 */
	get projectFeatureTests() {
		return {
			displayName:        'Feature: Project tests',
			rootDir:            `${paths.project.test}/feature`,
			setupFilesAfterEnv: JEST_PLUGINS,
			transform:          JEST_TRANSFORM
		};
	}


	/**
	 * Configuration for running a project's custom integration tests.
	 *
	 * @type {object}
	 */
	get projectIntegrationTests() {
		return {
			displayName:        'Integration: Project tests',
			rootDir:            `${paths.project.test}/integration`,
			setupFilesAfterEnv: JEST_PLUGINS,
			transform:          JEST_TRANSFORM
		};
	}


	/**
	 * Configuration for running a project's custom end-to-end tests.
	 *
	 * @type {object}
	 */
	get projectEndtoendTests() {
		return {
			displayName:        'End-to-end: Project tests',
			rootDir:            `${paths.project.test}/endtoend`,
			setupFilesAfterEnv: JEST_PLUGINS,
			transform:          JEST_TRANSFORM
		};
	}

	/* eslint-enable unicorn/prevent-abbreviations */

}


export default new RunnerHelperConfig();
