//--------------------------------------------------------
//-- ESLint helper
//--------------------------------------------------------
import chalk                from 'chalk';
import { pass, fail, skip } from 'create-jest-runner';
import { CLIEngine }        from 'eslint';
import runner               from './runner';


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
	 * @param {object} options - ESLint {@link https://eslint.org/docs/developer-guide/nodejs-api#cliengine CLIEngine} options.
	 * @returns {TestResult} Jest {@link https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-test-result/src/types.ts#L103-L135 TestResult} object.
	 */
	run(testPath, options = {}) {
		const testResult = runner.initTestResult({ testPath, title: 'ESLint' });

		options.reportUnusedDisableDirectives = true;

		const cli = new CLIEngine(options);

		if (cli.isPathIgnored(testPath)) {
			return skip(testResult());
		}

		const { results: [report] } = cli.executeOnFiles([testPath]);
		const problemCount = report.errorCount + report.warningCount;

		if (problemCount > 100) {
			return fail(testResult(`\n  [Too many to show...]\n\n${chalk.red.bold(`✖ ${problemCount} problems (${report.errorCount} error${report.errorCount === 1 ? '' : 's'}, ${report.warningCount} warning${report.errorCount === 1 ? '' : 's'})`)}\n\n\n`));
		}

		let linterOutput;
		if (problemCount > 0) {
			const rawOutput = cli.getFormatter()([report]).split('\n');
			rawOutput.splice(1, 1);
			linterOutput = `${rawOutput.join('\n')}\n\n`;
		}

		// Fails
		if (report.errorCount > 0) {
			return fail(testResult(linterOutput));
		}

		// Passes
		const passResult = pass(testResult());

		if (report.warningCount > 0) {
			passResult.console = [{ message: linterOutput, origin: testPath, type: 'warn' }];
		}

		return passResult;
	}

}


export default new ESLintHelper();
