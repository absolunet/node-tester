//--------------------------------------------------------
//-- ESLint helper
//--------------------------------------------------------
import chalk from "chalk";
import { pass, fail, skip } from "create-jest-runner";
import { ESLint } from "eslint";
import runner from "./runner/index.js";

/**
 * ESLint helper.
 *
 * @hideconstructor
 */
class ESLintHelper {
	/**
	 * Parse the package.json.
	 *
	 * @param {string} testPath - File to lint.
	 * @param {object} options - ESLint {@link https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions ESLint} options.
	 * @returns {TestResult} Jest {@link https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-test-result/src/types.ts#L103-L135 TestResult} object.
	 */
	async run(testPath, options = {}) {
		const testResult = runner.initTestResult({ testPath, title: "ESLint" });

		options.reportUnusedDisableDirectives = "error";

		const eslint = new ESLint(options);

		if (await eslint.isPathIgnored(testPath)) {
			return skip(testResult());
		}

		const reports = await eslint.lintFiles([testPath]);

		let warningCount = 0;
		let errorCount = 0;
		let problemCount = 0;
		for (const report of reports) {
			warningCount += report.warningCount;
			errorCount += report.errorCount;
			problemCount += report.warningCount + report.errorCount;
		}

		if (problemCount > 100) {
			return fail(
				testResult(
					`\n  [Too many to show...]\n\n${chalk.red.bold(
						`✖ ${problemCount} problems (${errorCount} error${errorCount === 1 ? "" : "s"}, ${warningCount} warning${
							errorCount === 1 ? "" : "s"
						})`
					)}\n\n\n`
				)
			);
		}

		let linterOutput;
		if (problemCount > 0) {
			const rawOutput = (await eslint.loadFormatter()).format(reports).split("\n");
			rawOutput.splice(1, 1);
			linterOutput = `${rawOutput.join("\n")}\n\n`;
		}

		// Fails
		if (errorCount > 0) {
			return fail(testResult(linterOutput));
		}

		// Passes
		const passResult = pass(testResult());

		if (warningCount > 0) {
			passResult.console = [{ message: linterOutput, origin: testPath, type: "warn" }];
		}

		return passResult;
	}
}

export default new ESLintHelper();
