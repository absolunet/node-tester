//--------------------------------------------------------
//-- AbsolunetTester
//--------------------------------------------------------
import { createRequire } from "module";
import fss from "@absolunet/fss";
import { Joi, validateArgument } from "@absolunet/joi";
import { terminal } from "@absolunet/terminal";
import chalk from "chalk";
import deepmerge from "deepmerge";
import minimist from "minimist";
import spdxLicenseIds from "spdx-license-ids";
import environment from "./helpers/environment.js";
import paths from "./helpers/paths.js";

const require = createRequire(__filename);

const customization = {};

/**
 * Absolunet's npm packages tester.
 */
class AbsolunetTester {
	/**
	 * Customization options when extending.
	 *
	 * @param {object} [options] - Customization parameters.
	 * @param {string} [options.nameScope='@absolunet'] - Package name scope.
	 * @param {string} [options.source='github.com/absolunet'] - Package source.
	 * @param {object<string>} [options.author={ name: 'Absolunet', url: 'https://absolunet.com' }] - Package author.
	 * @param {string} [options.license='MIT'] - Package license.
	 * @param {object<CIEngine, object>} [options.ciEngine] - Package CI engines.
	 * @param {boolean} [options.ciEngine.pipelines.enabled=true] - If Bitbucket Pipelines is enabled.
	 * @param {boolean} [options.ciEngine.pipelines.cache=true] - If cache is enabled.
	 * @param {boolean} [options.ciEngine.githubActions.enabled=true] - If GitHub Actions is enabled.
	 */
	constructor(options = {}) {
		validateArgument(
			"options",
			options,
			Joi.object({
				nameScope: Joi.alternatives().try("", Joi.string().pattern(/^@[a-z0-9]+(?:-[a-z0-9]+)*$/u, "npm scope")),
				source: Joi.string()
					.replace(/^(?<all>.+)$/u, "https://$<all>")
					.uri(),
				author: Joi.object({ name: Joi.string().required(), url: Joi.string().uri().required() }),
				license: Joi.string().valid(...spdxLicenseIds),
				ciEngine: Joi.object({
					[environment.CI_ENGINE.pipelines]: Joi.object({ enabled: Joi.boolean(), cache: Joi.boolean() }),
					[environment.CI_ENGINE.githubActions]: Joi.object({ enabled: Joi.boolean() }),
				}),
			})
		);

		const nameScope = options.nameScope === undefined ? "@absolunet" : options.nameScope;

		customization.nameScope = nameScope ? `${nameScope}/` : "";
		customization.source = options.source || "github.com/absolunet";
		customization.author = options.author || { name: "Absolunet", url: "https://absolunet.com" };
		customization.license = options.license || "MIT";
		customization.ciEngine = deepmerge(
			{
				[environment.CI_ENGINE.pipelines]: { enabled: true, cache: true },
				[environment.CI_ENGINE.githubActions]: { enabled: true },
			},
			options.ciEngine || {}
		);
	}

	/**
	 * List of subpackages.
	 *
	 * @type {object<string>}
	 */
	get subpackages() {
		return environment.projectSubpackages;
	}

	/**
	 * Get a readable relative path from an absolute path.
	 *
	 * @param {string} absolutePath - Absolute path.
	 * @returns {string} Stripped relative path to project root.
	 */
	getReadablePath(absolutePath) {
		validateArgument("absolutePath", absolutePath, Joi.absolutePath());

		return environment.getReadablePath(absolutePath);
	}

	/**
	 * Initialize tests.
	 *
	 * @param {object} options - Project options.
	 * @param {RepositoryType} options.repositoryType - Type of repository.
	 * @param {PackageType} options.packageType - Type of package.
	 * @param {NodeType} [options.nodeType="module"] - Type of Node.js resolver.
	 *
	 * @throws {Error} If scope is invalid.
	 *
	 * @example
	 * tester.init({
	 * 		repositoryType: 'single-package',
	 * 		packageType:    'common'
	 * });
	 */
	init(options = {}) {
		options.nodeType = options.nodeType || environment.NODE_TYPE.module;

		validateArgument(
			"options",
			options,
			Joi.object({
				repositoryType: Joi.string()
					.valid(...Object.values(environment.REPOSITORY_TYPE))
					.required(),
				packageType: Joi.string()
					.valid(...Object.values(environment.PACKAGE_TYPE))
					.required(),
				nodeType: Joi.string()
					.valid(...Object.values(environment.NODE_TYPE))
					.required(),
			})
		);

		//-- Check if generic tests are present
		const genericTests = `${paths.project.test}/generic/index.test.js`;
		if (fss.existsCase(genericTests)) {
			const esprima = require("esprima");

			const code = fss.readFile(genericTests, "utf8");
			const found = esprima.tokenize(code).some(({ type, value }) => {
				return type === "Identifier" && value === "genericRepositoryTests";
			});

			if (!found) {
				terminal.exit(`Generic tests must be called: ${chalk.underline("tester.genericRepositoryTests()")}`);
			}
		} else {
			terminal.exit(`Generic tests must exist: ${chalk.underline(genericTests)}`);
		}

		//-- Gather configurations
		options.scope = minimist(process.argv.slice(2)).scope;
		options.customization = customization;

		// Validate scope
		if (![environment.TEST_ALL, ...Object.values(environment.TEST_TYPE)].includes(options.scope)) {
			throw new Error(`Test scope '${options.scope}' is invalid`);
		}

		const iocTests = [];
		let shouldRunIocTestOnly = false;
		if (options.packageType === environment.PACKAGE_TYPE.ioc && options.scope !== environment.TEST_TYPE.standards) {
			if (options.scope === environment.TEST_ALL) {
				options.scope = environment.TEST_TYPE.standards;
				iocTests.push(...Object.values(environment.TEST_TYPE_IOC));
			} else if (Object.values(environment.TEST_TYPE).includes(options.scope)) {
				iocTests.push(options.scope);
				shouldRunIocTestOnly = true;
			}
		}

		//-- Run tests
		try {
			if (!shouldRunIocTestOnly) {
				terminal.process.run(
					`node ${paths.jestBinary} --errorOnDeprecated --passWithNoTests --config=${paths.config}/jest.js`,
					{ environment: { [environment.JEST_CLI_KEY]: JSON.stringify(options) } }
				);

				//-- Multi package
				if (options.repositoryType === environment.REPOSITORY_TYPE.multiPackage) {
					Object.values(environment.projectSubpackages).forEach((subpackageRoot) => {
						terminal.spacer(3);
						terminal.process.run(`npm run test${options.scope !== environment.TEST_ALL ? `:${options.scope}` : ""}`, {
							directory: subpackageRoot,
						});
					});
				}
			}

			iocTests.forEach((type) => {
				terminal.process.run(`node ioc test --type=${type}`, { environment: { NODE_ENV: "test" } });
			});
		} catch {
			process.exit(1); // eslint-disable-line node/no-process-exit, unicorn/no-process-exit
		}
	}

	/**
	 * Run generic repository tests.
	 *
	 * @param {object} [options] - Options.
	 * @param {object<string>} [options.fileMatrix] - Files matrix overwrites.
	 */
	genericRepositoryTests(options = {}) {
		validateArgument(
			"options",
			options,
			Joi.object({
				fileMatrix: Joi.object().pattern(Joi.string(), Joi.string()),
			})
		);

		const repositoryPath = `${paths.tests}/repository`;

		fss.readdir(repositoryPath).forEach((file) => {
			require(`${repositoryPath}/${file}`).default(options); // eslint-disable-line import/no-dynamic-require
		});
	}
}

export default AbsolunetTester;
