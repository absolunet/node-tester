//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
import minimist     from 'minimist';
import { terminal } from '@absolunet/terminal';
import env          from './helpers/environment';
import paths        from './helpers/paths';


const customization = {};






/**
 * Absolunet's npm packages tester.
 */
class Tester {

	/**
	 * Customization options when extending.
	 *
	 * @param {object} [options] - Customization parameters.
	 * @param {string} [options.nameScope='@absolunet'] - Package name scope.
	 * @param {string} [options.source='github.com/absolunet'] - Package source.
	 * @param {object<string>} [options.author={ name: 'Absolunet', url: 'https://absolunet.com' }] - Package author.
	 * @param {string} [options.license='MIT'] - Package license.
	 * @param {CIEngine} [options.ciEngine='travis'] - Package CI engine.
	 */
	constructor({ nameScope = '@absolunet', source, author, license, ciEngine } = {}) {
		customization.nameScope = nameScope ? `${nameScope}/` : '';
		customization.source    = source   || 'github.com/absolunet';
		customization.author    = author   || { name: 'Absolunet', url: 'https://absolunet.com' };
		customization.license   = license  || 'MIT';
		customization.ciEngine  = ciEngine || env.CI_ENGINE.travis;
	}


	/**
	 * List of subpackages.
	 *
	 * @type {object<string>}
	 */
	get subpackages() {
		return env.projectSubpackages;
	}


	/**
	 * Get a readable relative path from an absolute path.
	 *
	 * @param {string} absolutePath - Absolute path.
	 * @returns {string} Stripped relative path to project root.
	 */
	getReadablePath(absolutePath) {
		return env.getReadablePath(absolutePath);
	}


	/**
	 * Initialize tests.
	 *
	 * @param {object} options - Project options.
	 * @param {RepositoryType} options.repositoryType - Type of repository.
	 * @param {PackageType} options.packageType - Type of package.
	 *
	 * @example
	 * tester.init({
	 * 		repositoryType: 'single-package',
	 * 		packageType:    'common'
	 * });
	 */
	init(options = {}) {
		options.scope         = minimist(process.argv.slice(2)).scope;
		options.customization = customization;

		const iocTests = [];
		if (options.packageType === env.PACKAGE_TYPE.ioc) {
			if (options.scope === 'all') {
				iocTests.push(...env.TEST_TYPE);
			} else if (Object.values(...env.TEST_TYPE).includes(options.scope)) {
				iocTests.push(options.scope);
			}
		}



		try {
			terminal.run(`export ${env.JEST_CLI_KEY}='${JSON.stringify(options)}'; node ${paths.jestBinary} --config=${paths.config}/jest.js`);

			iocTests.forEach((type) => {
				terminal.run(`node ioc test --type=${type}`);
			});
		} catch (error) {
			process.exit(1);  // eslint-disable-line no-process-exit, unicorn/no-process-exit
		}
	}

}


export default Tester;
