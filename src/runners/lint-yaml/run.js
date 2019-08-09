//--------------------------------------------------------
//-- Lint YAML runner - Run
//--------------------------------------------------------
import { pass, fail } from 'create-jest-runner';
import yamlLint       from 'yaml-lint';
import runner         from '../../helpers/runner';


export default ({ testPath }) => {

	const testResult = runner.initTestResult({ testPath, title: 'YAML Lint' });

//	if (cli.isPathIgnored(testPath)) {
//		return skip(testResult());
//	}

	return yamlLint.lintFile(testPath)
		.then(() => {
			return pass(testResult());
		})
		.catch((error) => {
			return fail(testResult(runner.formatError(error)));
		})
	;

};
