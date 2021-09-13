//--------------------------------------------------------
//-- Runner helper
//--------------------------------------------------------
import chalk from "chalk";
import { createJestRunner } from "create-jest-runner";
import RunnerHelperConfig from "./config.js";

/**
 * Jest {@link https://jestjs.io/docs/en/configuration#runner-string runner} helper.
 *
 * @hideconstructor
 */
class RunnerHelper {
	/**
	 * Runners configurations.
	 *
	 * @type {RunnerHelperConfig}
	 */
	get config() {
		return RunnerHelperConfig;
	}

	/**
	 * Create a Jest runner.
	 *
	 * @param {string} directory - Path to the runner directory containing a run.js file.
	 * @returns {TestRunner} Jest {@link https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-runner/src/index.ts#L37-L186 TestRunner} object.
	 */
	create(directory) {
		return createJestRunner(`${directory}/run`);
	}

	/**
	 * Initialize a method to create {@link CreatejestrunnerConfig} .
	 *
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.testPath - Path to the test file.
	 * @param {string} parameters.title - Test title.
	 * @returns {CreatejestrunnerConfigInitializer} TestResult initializer.
	 */
	initTestResult({ testPath, title }) {
		const start = new Date();

		/**
		 * Creates a create-jest-runner configuration object for pass(), fail(), skip() methods.
		 *
		 * @typedef {Function} CreatejestrunnerConfigInitializer
		 * @param {object} [errorMessage] - Error message.
		 * @returns {CreatejestrunnerConfig} A create-jest-runner config object to generate a Jest {@link https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-test-result/src/types.ts#L103-L135 TestResult} object.
		 */
		return (errorMessage) => {
			/**
			 * A create-jest-runner configuration object for pass(), fail(), skip() methods.
			 *
			 * @typedef {object} CreatejestrunnerConfig
			 * @property {Date} start - When test started.
			 * @property {Date} end - When test ended.
			 * @property {object} test - Test parameters.
			 * @property {string} test.path - Path to the test file.
			 * @property {string} test.title - Test title.
			 * @property {string} test.errorMessage - Error message.
			 */
			return {
				start,
				end: new Date(),
				test: {
					path: testPath,
					title,
					errorMessage,
				},
			};
		};
	}

	/**
	 * Returns the message with error styling.
	 *
	 * @param {string} message - Error message.
	 * @returns {string} Error styled message.
	 */
	formatError(message) {
		return chalk.red(`\n${message}\n\n`);
	}
}

export default new RunnerHelper();
