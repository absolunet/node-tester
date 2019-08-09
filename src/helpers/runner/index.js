//--------------------------------------------------------
//-- Runner helper
//--------------------------------------------------------
import chalk                from 'chalk';
import { createJestRunner } from 'create-jest-runner';
import RunnerConfig         from './config';


/**
 * xyz
 */
class Runner {


	/**
	 * xyz
	 */
	get config() {
		return RunnerConfig;
	}



	/**
	 * xyz
	 */
	create(directory) {
		return createJestRunner(`${directory}/run`);
	}


	/**
	 * xyz
	 */
	initTestResult({ testPath, title }) {
		const start = new Date();

		return (errorMessage) => {
			return {
				start,
				end:   new Date(),
				test: {
					path:  testPath,
					title,
					errorMessage
				}
			};
		};
	}


	/**
	 * xyz
	 */
	formatError(message) {
		return chalk.red(`\n${message}\n\n`);
	}

}

export default new Runner();
