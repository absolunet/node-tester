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
 * xyz
 */
class RunnerConfig {

	/* eslint-disable unicorn/prevent-abbreviations */

	/**
	 * xyz
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
	 * xyz
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
	 * xyz
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
	 * xyz
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
	 * xyz
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
	 * xyz
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
	 * xyz
	 */
	get validateSinglePackage() {
		return {
			displayName:        'Single package',
			rootDir:            `${paths.tests}/single-package`,
			setupFilesAfterEnv: JEST_PLUGINS
		};
	}

	/**
	 * xyz
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
	 * xyz
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


export default new RunnerConfig();
