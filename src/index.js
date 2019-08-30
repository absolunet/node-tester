//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
import minimist     from 'minimist';
import { terminal } from '@absolunet/terminal';
import env          from './helpers/environment';
import paths        from './helpers/paths';


/**
 * xyz
 */
class Tester {

	/**
	 * xyz
	 */
	init(options = {}) {
		options.scope = minimist(process.argv.slice(2)).scope;

		try {
			terminal.run(`export ${env.jestConfigVariable}='${JSON.stringify(options)}'; jest --config=${paths.config}/jest.js`);
		} catch (error) {
			process.exit(1);  // eslint-disable-line no-process-exit, unicorn/no-process-exit
		}
	}

}


export default new Tester();
