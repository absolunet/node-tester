//--------------------------------------------------------
//-- Runner config helper
//--------------------------------------------------------
import { createRequire } from "module";
import fss from "@absolunet/fss";
import environment from "../environment.js";
import paths from "../paths.js";

const require = createRequire(__filename);

const JEST_GENERIC_PLUGINS = [require.resolve("@alex_neo/jest-expect-message"), require.resolve("jest-extended")];

const JEST_PROJECT_PLUGINS = [require.resolve("jest-extended")];

const JEST_TRANSFORM = {
	"\\.js$": `${paths.transformers}/babel`,
};

const __ = {};

/**
 * Configurations for Jest {@link https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig project} runners.
 *
 * @hideconstructor
 */
class RunnerHelperConfig {
	/**
	 * Jest globals variables.
	 *
	 * @type {object}
	 */
	get globals() {
		return { [environment.JEST_GLOBALS_KEY]: __.globals };
	}

	/**
	 * Set Jest globals variables.
	 *
	 * @param {object} globals - Data to be exposed globally by Jest.
	 */
	set globals(globals) {
		__.globals = globals;
	}

	/* eslint-disable unicorn/prevent-abbreviations */

	/**
	 * Configuration for checking files with Prettier.
	 *
	 * @type {object}
	 */
	get checkPrettier() {
		return {
			displayName: "Standards: Check Prettier",
			runner: `${paths.runners}/check-prettier`,
			rootDir: paths.project.root,
			moduleFileExtensions: ["js", "cjs", "mjs"],
			testMatch: ["**/*.{js,cjs,mjs}"],
			globals: this.globals,
		};
	}

	/**
	 * Configuration for linting JavaScript files.
	 *
	 * @type {object}
	 */
	get lintJS() {
		return {
			displayName: "Standards: Lint JS",
			runner: `${paths.runners}/lint-js`,
			rootDir: paths.project.root,
			moduleFileExtensions: ["js", "cjs", "mjs"],
			testMatch: ["**/*.{js,cjs,mjs}"],
			globals: this.globals,
		};
	}

	/**
	 * Configuration for linting JSON files.
	 *
	 * @type {object}
	 */
	get lintJSON() {
		return {
			displayName: "Standards: Lint JSON",
			runner: `${paths.runners}/lint-json`,
			rootDir: paths.project.root,
			testMatch: ["**/*.json", "!**/packages/**/*"],
			globals: this.globals,
		};
	}

	/**
	 * Configuration for linting YAML files.
	 *
	 * @type {object}
	 */
	get lintYAML() {
		return {
			displayName: "Standards: Lint YAML",
			runner: `${paths.runners}/lint-yaml`,
			rootDir: paths.project.root,
			moduleFileExtensions: ["yaml", "yml"],
			testMatch: ["**/*.{yaml,yml}", "!**/packages/**/*"],
			globals: this.globals,
		};
	}

	/**
	 * Configuration for linting Bash files.
	 *
	 * @type {object}
	 */
	get lintBash() {
		return {
			displayName: "Standards: Lint Bash",
			runner: `${paths.runners}/lint-bash`,
			rootDir: paths.project.root,
			moduleFileExtensions: ["sh"],
			testMatch: ["**/*.sh", "!**/packages/**/*"],
			globals: this.globals,
		};
	}

	/**
	 * Configuration for linting SCSS files.
	 *
	 * @type {object}
	 */
	get lintSCSS() {
		return {
			displayName: "Standards: Lint SCSS",
			runner: `${paths.runners}/lint-scss`,
			rootDir: paths.project.root,
			moduleFileExtensions: ["scss"],
			testMatch: ["**/*.scss"],
			globals: this.globals,
		};
	}

	/**
	 * Configuration for linting files styling.
	 *
	 * @param {RepositoryType} repositoryType - Repository type.
	 * @returns {object} Configuration.
	 */
	lintFileStyles(repositoryType) {
		const prefix = repositoryType === environment.REPOSITORY_TYPE.subPackage ? `/../..` : "";

		const rawConfig = fss.readFile(`${paths.project.root}${prefix}/.editorconfig`, "utf8");
		const rawPatterns = [...rawConfig.matchAll(/^\[(?<pattern>.+)\]$/gmu)];
		const patterns = rawPatterns.map((item) => {
			return `**/${item[1]}`;
		});

		return {
			displayName: "Standards: Lint file styles",
			runner: `${paths.runners}/lint-file-styles`,
			rootDir: paths.project.root,
			moduleFileExtensions: ["*"],
			testMatch: [...patterns, "!**/*.{js,scss}", "!**/packages/**/*"],
			globals: this.globals,
		};
	}

	/**
	 * Configuration for validating a repository.
	 *
	 * @type {object}
	 */
	get genericTests() {
		return {
			displayName: "Standards: Generic tests",
			rootDir: `${paths.project.test}/generic`,
			setupFilesAfterEnv: JEST_GENERIC_PLUGINS,
			transform: JEST_TRANSFORM,
			globals: this.globals,
		};
	}

	/**
	 * Configuration for running a project's custom standards tests.
	 *
	 * @type {object}
	 */
	get projectStandardsTests() {
		return {
			displayName: "Standards: Project tests",
			rootDir: `${paths.project.test}/standards`,
			setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
			transform: JEST_TRANSFORM,
		};
	}

	/**
	 * Configuration for running a project's custom unit tests.
	 *
	 * @type {object}
	 */
	get projectUnitTests() {
		return {
			displayName: "Unit: Project tests",
			rootDir: `${paths.project.test}/unit`,
			setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
			transform: JEST_TRANSFORM,
		};
	}

	/**
	 * Configuration for running a project's custom feature tests.
	 *
	 * @type {object}
	 */
	get projectFeatureTests() {
		return {
			displayName: "Feature: Project tests",
			rootDir: `${paths.project.test}/feature`,
			setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
			transform: JEST_TRANSFORM,
		};
	}

	/**
	 * Configuration for running a project's custom integration tests.
	 *
	 * @type {object}
	 */
	get projectIntegrationTests() {
		return {
			displayName: "Integration: Project tests",
			rootDir: `${paths.project.test}/integration`,
			setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
			transform: JEST_TRANSFORM,
		};
	}

	/**
	 * Configuration for running a project's custom end-to-end tests.
	 *
	 * @type {object}
	 */
	get projectEndtoendTests() {
		return {
			displayName: "End-to-end: Project tests",
			rootDir: `${paths.project.test}/endtoend`,
			setupFilesAfterEnv: JEST_PROJECT_PLUGINS,
			transform: JEST_TRANSFORM,
		};
	}

	/* eslint-enable unicorn/prevent-abbreviations */
}

export default new RunnerHelperConfig();
