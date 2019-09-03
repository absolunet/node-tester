//--------------------------------------------------------
//-- Runner config helper
//--------------------------------------------------------
import fss   from '@absolunet/fss';
import paths from '../paths';

const JEST_PLUGINS = [
	'jest-chain',
	'jest-expect-message',
	'jest-extended'
];

const JEST_TRANSFORM = {
	'\\.js$': `${paths.transformers}/babel`
};





 /**
  * Configurations for Jest {@link https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig project} runners.
  *
  * @hideconstructor
  */
class RunnerHelperConfig {

	/* eslint-disable unicorn/prevent-abbreviations */

	/**
	 * Configuration for linting JavaScript files.
	 *
	 * @type {object}
	 */
	get lintJS() {
		return {
			displayName: 'Lint JS',
			runner:      `${paths.runners}/lint-js`,
			rootDir:     paths.project.root,
			testMatch:   ['**/*.js']
		};
	}

	/**
	 * Configuration for linting JSON files.
	 *
	 * @type {object}
	 */
	get lintJSON() {
		return {
			displayName: 'Lint JSON',
			runner:      `${paths.runners}/lint-json`,
			rootDir:     paths.project.root,
			testMatch:   ['**/*.json', '!**/package-lock.json']
		};
	}

	/**
	 * Configuration for linting YAML files.
	 *
	 * @type {object}
	 */
	get lintYAML() {
		return {
			displayName:          'Lint YAML',
			runner:               `${paths.runners}/lint-yaml`,
			rootDir:              paths.project.root,
			moduleFileExtensions: ['yaml', 'yml'],
			testMatch:            ['**/*.{yaml,yml}']
		};
	}

	/**
	 * Configuration for linting Bash files.
	 *
	 * @type {object}
	 */
	get lintBash() {
		return {
			displayName:          'Lint Bash',
			runner:               `${paths.runners}/lint-bash`,
			rootDir:              paths.project.root,
			moduleFileExtensions: ['sh'],
			testMatch:            ['**/*.sh']
		};
	}

	/**
	 * Configuration for linting SCSS files.
	 *
	 * @type {object}
	 */
	get lintSCSS() {
		return {
			displayName:          'Lint SCSS',
			runner:               `${paths.runners}/lint-scss`,
			rootDir:              paths.project.root,
			moduleFileExtensions: ['scss'],
			testMatch:            ['**/*.scss']
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
			displayName:          'Lint file styles',
			runner:               `${paths.runners}/lint-file-styles`,
			rootDir:              paths.project.root,
			moduleFileExtensions: ['*'],
			testMatch:            [...patterns, '!**/*.{js,scss}', '!**/package-lock.json']
		};
	}

	/**
	 * Configuration for validating a single package.
	 *
	 * @type {object}
	 */
	get validateSinglePackage() {
		return {
			displayName:        'Single package',
			rootDir:            `${paths.tests}/single-package`,
			setupFilesAfterEnv: JEST_PLUGINS
		};
	}

	/**
	 * Configuration for running a project's custom feature tests.
	 *
	 * @type {object}
	 */
	get projectFeatureTests() {
		return {
			displayName:        'Project feature tests',
			rootDir:            `${paths.project.test}/feature`,
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
			displayName:        'Project unit tests',
			rootDir:            `${paths.project.test}/unit`,
			setupFilesAfterEnv: JEST_PLUGINS,
			transform:          JEST_TRANSFORM
		};
	}

	/* eslint-enable unicorn/prevent-abbreviations */

}


export default new RunnerHelperConfig();
