//--------------------------------------------------------
//-- Lint SCSS runner - Run
//--------------------------------------------------------
import { pass, fail } from 'create-jest-runner';
import runner         from '../../helpers/runner';


export default ({ testPath }) => {
	const stylelint = require('stylelint'); // eslint-disable-line global-require

	const testResult = runner.initTestResult({ testPath, title: 'stylelint' });

//	if (cli.isPathIgnored(testPath)) {
//		return skip(testResult());
//	}

	return stylelint.lint({
		files:     testPath,
		syntax:    'scss',
		formatter: 'string'
	})
		.then((data) => {
			const [results] = data.results;
			if (results.warnings.length !== 0 || results.deprecations.length !== 0 || results.invalidOptionWarnings.length !== 0) {
				const rawOutput = data.output.split('\n');
				rawOutput.splice(0, 2);

				return fail(testResult(rawOutput.join('\n')));
			}

			return pass(testResult());
		})
		.catch((error) => {
			return fail(testResult(runner.formatError(`${error.stack}\n`)));
		})
	;

};

