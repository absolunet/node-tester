//--------------------------------------------------------
//-- ESLint helper
//--------------------------------------------------------
import chalk                from 'chalk';
import { pass, fail, skip } from 'create-jest-runner';
import { CLIEngine }        from 'eslint';
import runner               from './runner';


/**
 * xyz
 */
class ESLint {

	/**
	 * xyz
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


export default new ESLint();
