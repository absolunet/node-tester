//--------------------------------------------------------
//-- Lint Bash runner - Run
//--------------------------------------------------------
import { exec }       from 'child_process';
import { pass, fail } from 'create-jest-runner';
import fss            from '@absolunet/fss';
import runner         from '../../helpers/runner/index.js';


export default ({ testPath }) => {

	const testResult = runner.initTestResult({ testPath, title: 'bash -n' });

	return new Promise((resolve, reject) => {
		exec(`bash -n ${fss.realpath(testPath)}`, {}, (error/* , stdout, stderr */) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	})
		.then(() => {
			return pass(testResult());
		})
		.catch((error) => {
			const rawError = error.message.split('\n');
			rawError.shift();

			const cleanedError = rawError.map((line) => {
				return line.replace(`${testPath}: `, '');
			});

			return fail(testResult(runner.formatError(cleanedError.join('\n'))));
		})
	;

};
