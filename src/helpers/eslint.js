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

		const cli = new CLIEngine(options);

		if (cli.isPathIgnored(testPath)) {
			return skip(testResult());
		}

		const { results: [report] } = cli.executeOnFiles([testPath]);
		const problemCount = report.errorCount + report.warningCount;

		if (problemCount > 0) {
			let output;

			if (problemCount > 100) {
				output = `\n  [Too many to show...]\n\n${chalk.red.bold(`✖ ${problemCount} problems (${report.errorCount} error${report.errorCount === 1 ? '' : 's'}, ${report.warningCount} warning${report.errorCount === 1 ? '' : 's'})`)}\n\n\n`;
			} else {
				const rawOutput = cli.getFormatter()([report]).split('\n');
				rawOutput.splice(1, 1);
				output = `${rawOutput.join('\n')}\n\n`;
			}

			return fail(testResult(output));
		}

		return pass(testResult());
	}

}


export default new ESLintHelper();
