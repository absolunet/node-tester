//--------------------------------------------------------
//-- package.json helper
//--------------------------------------------------------
import readPackageJson from 'read-package-json';
import semver          from 'semver';
import fss             from '@absolunet/fss';
import environment     from './environment';
import paths           from './paths';

const MANAGER_SCRIPTS = [
	['manager:install',        'node manager --task=install'],
	['manager:outdated',       'node manager --task=outdated'],
	['manager:build',          'node manager --task=build'],
	['manager:watch',          'node manager --task=watch'],
	['manager:documentation',  'node manager --task=documentation'],
	['manager:prepare',        'node manager --task=prepare'],
	['manager:rebuild',        'node manager --task=rebuild'],
	['manager:publish',        'node manager --task=publish'],
	['manager:publish:unsafe', 'node manager --task=publish:unsafe']
];

const TEST_SCRIPTS = [
	['test',             'node test --scope=all'],
	['test:standards',   'node test --scope=standards'],
	['test:unit',        'node test --scope=unit'],
	['test:feature',     'node test --scope=feature'],
	['test:integration', 'node test --scope=integration'],
	['test:endtoend',    'node test --scope=endtoend']
];





/**
 * Package.json validation helper.
 *
 * @hideconstructor
 */
class PackageJsonHelper {

	/**
	 * Parse the package.json.
	 *
	 * @async
	 * @param {string} directoryPath - Path to the packge.json file.
	 * @returns {Promise<{ config: object, parsedConfig: object }>} Parsed package.json file: config by raw JSON, parsedConfig by npm's parser.
	 */
	readConfig(directoryPath) {
		const filePath = `${directoryPath}/package.json`;

		return new Promise((resolve, reject) => {

			// Parse via npm's parser
			readPackageJson(filePath, readPackageJson.log, true, (error, parsedConfig) => {

				// If valid
				if (!error) {
					const config = fss.readJson(filePath);
					resolve({ config, parsedConfig });
				} else {
					reject(error);
				}
			});
		});
	}


	/**
	 * Validates that the raw JSON parsing is identical to npm's parsing.
	 *
	 * @param {object} reference - Referenced object to be populated by beforeAll.
	 * @param {string} directoryPath - Path to the package.json file.
	 */
	validateIntegrity(reference, directoryPath) {
		let packageConfig;
		let packageParsedConfig;

		beforeAll(() => {
			return this.readConfig(directoryPath)
				.then(({ config, parsedConfig }) => {
					packageConfig       = config;
					packageParsedConfig = parsedConfig;
					reference.config    = packageConfig;
				})
				.catch((error) => {
					throw new Error(error);
				})
			;
		});

		test('Ensure parsed config integrity', () => {
			Object.keys(packageConfig).forEach((key) => {
				expect(packageConfig[key], `Raw config must be identical to parsed config for '${key}'`).toEqual(packageParsedConfig[key]);
			});
		});
	}


	/**
	 * Validates that the package.json respect Absolunet's format and standards.
	 *
	 * @param {string} [parameters] - Parameters.
	 * @param {string} [parameters.directoryPath=paths.project.root] - Path to the package.json file.
	 * @param {RepositoryType} [parameters.repositoryType=environment.repositoryType] - Type of repository.
	 * @param {PackageType} [parameters.packageType=environment.packageType] - Type of package.
	 */
	validatePackage({ directoryPath = paths.project.root, repositoryType = environment.repositoryType /* , packageType = environment.packageType */ } = {}) {
		describe(`Validate ${environment.getReadablePath(directoryPath)}/package.json`, () => {

			const escapedScope      = environment.packageCustomization.nameScope.replace('/', '\\/');
			const escapedSource     = environment.packageCustomization.source.replace('/', '\\/');
			const namePattern       = new RegExp(`^${escapedScope}(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$`, 'u');
			const repositoryPattern = new RegExp(`^git:\\/\\/${escapedSource}\\/(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*\\.git$`, 'u');
			const bugsPattern       = new RegExp(`^https:\\/\\/${escapedSource}\\/(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*\\/issues$`, 'u');
			const homepagePattern   = new RegExp(`^https:\\/\\/(?<domain>${escapedSource}\\/|documentation.absolunet.com\\/).+`, 'u');
			const testerConfig      = fss.readJson(`${paths.root}/package.json`);


			const reference = {};
			this.validateIntegrity(reference, directoryPath);

			test('Ensure mandatory identification fields are valid', () => {
				// TODO [>=4.0.0]: Make special check for packageType IoC
				expect(reference.config.name,    'Name must be valid').toMatch(namePattern);
				expect(reference.config.version, 'Version must be valid').toBe(semver.valid(reference.config.version));
				expect(reference.config.license, 'License must be valid').toBe(environment.packageCustomization.license);
				expect(reference.config.private, 'Private must not be defined').toBeUndefined();
			});


			test('Ensure meta identification fields are valid', () => {
				expect(reference.config.description, 'Description must be a text').toBeString();
				expect(reference.config.description, 'Description must be defined').not.toBeEmpty();

				expect(reference.config.author, 'Author must be valid').toContainAllEntries(Object.entries(environment.packageCustomization.author));

				expect(reference.config.keywords, 'Keywords must be a list').toBeArray();
				expect(reference.config.keywords, 'Keywords must be defined').not.toBeEmpty();
			});


			test('Ensure url fields are valid', () => {
				expect(reference.config.homepage,   'Homepage must be valid').toMatch(homepagePattern);
				expect(reference.config.repository, 'Repository must be valid').toContainAllEntries([
					['type', 'git'],
					['url', expect.stringMatching(repositoryPattern)]
				]);
				expect(reference.config.bugs, 'Bugs must be valid').toContainAllEntries([
					['url', expect.stringMatching(bugsPattern)]
				]);
			});


			test('Ensure functional fields are valid', () => {
				expect({ main: reference.config.main, browser: reference.config.browser }, 'Main or browser must be defined').toSatisfy(({ main, browser }) => {
					return (typeof main === 'string' && main !== '') || (typeof browser === 'string' && browser !== '');
				});

				if (reference.config.main) {
					expect(reference.config.engines, 'Engines must be valid').toContainAllEntries([
						['node', testerConfig.engines.node]
					]);
				}

				expect(reference.config, 'Files must not be defined').not.toContainKey('files');
				expect(reference.config, 'Config must not be defined').not.toContainKey('config');
			});


			test('Ensure scripts are valid', () => {
				let scripts = TEST_SCRIPTS;

				if (repositoryType === environment.REPOSITORY_TYPE.singlePackage) {
					scripts = scripts.concat(MANAGER_SCRIPTS);
				}

				expect(reference.config.scripts, 'Scripts must be valid').toContainEntries(scripts);
			});


			test('Ensure dependencies are valid', () => {
				const dependencies = [`@absolunet/tester`];

				if (repositoryType === environment.REPOSITORY_TYPE.singlePackage) {
					dependencies.push('@absolunet/manager');
				}

				expect(reference.config.devDependencies, 'devDependencies must be valid').toContainKeys(dependencies);
			});

		});
	}


	/**
	 * Validates that the multi package.json respects Absolunet's format and standards.
	 *
	 * @param {string} [parameters] - Parameters.
	 * @param {string} [parameters.directoryPath=paths.project.root] - Path to the package.json file.
	 */
	validateMulti({ directoryPath = paths.project.root } = {}) {
		describe(`Validate ${environment.getReadablePath(directoryPath)}/package.json`, () => {

			const reference = {};
			this.validateIntegrity(reference, directoryPath);

			test('Ensure mandatory identification fields are valid', () => {
				expect(reference.config.name,    'Name must be valid').toMatch(/^(?<kebab1>[a-z][a-z0-9]+)(?<kebab2>-[a-z0-9]+)*$/u);
				expect(reference.config.private, 'Private must be valid').toBeTrue();
				expect(reference.config,         'Version must not be defined').not.toContainKey('version');
			});


			test('Ensure meta identification fields are valid', () => {
				expect(reference.config, 'Author must not be defined').not.toContainKey('author');
			});


			test('Ensure functional fields are valid', () => {
				expect(reference.config.scripts, 'Scripts must be valid').toContainEntries([...MANAGER_SCRIPTS, ...TEST_SCRIPTS, ['postinstall', 'npm run manager:install']]);
			});


			test('Ensure dependencies are valid', () => {
				expect(reference.config.devDependencies, 'devDependencies must be valid').not.toContainKey('lerna');
				expect(reference.config,                 'Dependencies must not be defined').not.toContainKey('dependencies');
			});

		});
	}

}


export default new PackageJsonHelper();
