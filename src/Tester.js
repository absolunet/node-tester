//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
import chalk          from 'chalk';
import minimist       from 'minimist';
import spdxLicenseIds from 'spdx-license-ids';
import Joi            from '@hapi/joi';
import fss            from '@absolunet/fss';
import { terminal }   from '@absolunet/terminal';
import dataValidation from './helpers/data-validation';
import env            from './helpers/environment';
import paths          from './helpers/paths';


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
	constructor(options = {}) {
		dataValidation.argument('options', options, Joi.object({
			nameScope: Joi.alternatives().try('', Joi.string().pattern(/^@(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u, 'npm scope')),
			source:    Joi.string().replace(/^(?<all>\.+)$/u, 'https://$<all>').uri(),
			author:    Joi.object({ name: Joi.string().required(), url: Joi.string().uri().required() }),
			license:   Joi.string().valid(...spdxLicenseIds),
			ciEngine:  Joi.string().valid(...Object.values(env.CI_ENGINE))
		}));

		const nameScope = options.nameScope === undefined ? '@absolunet' : options.nameScope;

		customization.nameScope = nameScope ? `${nameScope}/` : '';
		customization.source    = options.source   || 'github.com/absolunet';
		customization.author    = options.author   || { name: 'Absolunet', url: 'https://absolunet.com' };
		customization.license   = options.license  || 'MIT';
		customization.ciEngine  = options.ciEngine || env.CI_ENGINE.travis;
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
		dataValidation.argument('absolutePath', absolutePath, dataValidation.absolutePath);

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
		dataValidation.argument('options', options, Joi.object({
			repositoryType: Joi.string().valid(...Object.values(env.REPOSITORY_TYPE)).required(),
			packageType:    Joi.string().valid(...Object.values(env.PACKAGE_TYPE)).required()
		}));


		//-- Check if generic tests are present
		const genericTests = `${paths.project.test}/generic/index.test.js`;
		if (fss.exists(genericTests)) {
			const esprima = require('esprima');  // eslint-disable-line global-require

			const code  = fss.readFile(genericTests, 'utf8');
			const found = esprima.tokenize(code).some(({ type, value }) => { return type === 'Identifier' && value === 'genericRepositoryTests'; });

			if (!found) {
				terminal.exit(`Generic tests must be called: ${chalk.underline('tester.genericRepositoryTests()')}`);
			}
		} else {
			terminal.exit(`Generic tests must exist: ${chalk.underline(genericTests)}`);
		}


		//-- Gather configurations
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


		//-- Run tests
		try {
			terminal.run(`export ${env.JEST_CLI_KEY}='${JSON.stringify(options)}'; node ${paths.jestBinary} --config=${paths.config}/jest.js`);

			iocTests.forEach((type) => {
				terminal.run(`node ioc test --type=${type}`);
			});
		} catch (error) {
			process.exit(1);  // eslint-disable-line no-process-exit, unicorn/no-process-exit
		}
	}


	/**
	 * Run generic repository tests.
	 */
	genericRepositoryTests() {
		const repositoryPath = `${paths.tests}/repository`;

		fss.readdir(repositoryPath).forEach((file) => {
			require(`${repositoryPath}/${file}`)();  // eslint-disable-line global-require
		});
	}

}


export default Tester;