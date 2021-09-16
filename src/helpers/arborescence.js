//--------------------------------------------------------
//-- Arborescence helper
//--------------------------------------------------------
import fss from "@absolunet/fss";
import environment from "./environment.js";
import paths from "./paths.js";

const GITHUB_ISSUES = Symbol("github-issues");
const GITHUB_PR = Symbol("github-pullrequests");
const EDITORCONFIG = Symbol("editorconfig");
const ESLINTIGNORE = Symbol("eslintignore");
const ESLINTRC = Symbol("eslintrc");
const GITIGNORE = Symbol("gitignore");
const NPMIGNORE = Symbol("npmignore");
const PRETTIERRC = Symbol("prettierrc");
const PRETTIERIGNORE = Symbol("prettierignore");
const GITHUB_ACTIONS = Symbol("github-actions");
const PIPELINES = Symbol("pipelines");
const CHANGELOG = Symbol("changelog");
const CODEOFCONDUCT = Symbol("code-of-conduct");
const CONTRIBUTING = Symbol("contributing");
const LICENSE = Symbol("license");
const MANAGER = Symbol("manager");
const PACKAGE = Symbol("package");
const README = Symbol("readme");
const SECURITY = Symbol("security");
const SUPPORT = Symbol("support");
const DISTRIBUTION = Symbol("distribution");
const DOCUMENTATION = Symbol("documentation");
const SOURCE = Symbol("source");
const TEST = Symbol("test");

const IGNORE = {
	[environment.REPOSITORY_TYPE.singlePackage]: [],
	[environment.REPOSITORY_TYPE.multiPackage]: [NPMIGNORE, DOCUMENTATION, DISTRIBUTION, SOURCE],
	[environment.REPOSITORY_TYPE.subPackage]: [
		GITHUB_ISSUES,
		GITHUB_PR,
		EDITORCONFIG,
		ESLINTRC,
		GITIGNORE,
		PRETTIERRC,
		PRETTIERIGNORE,
		GITHUB_ACTIONS,
		PIPELINES,
		CHANGELOG,
		CODEOFCONDUCT,
		CONTRIBUTING,
		MANAGER,
		SECURITY,
		SUPPORT,
		DOCUMENTATION,
	],
};

const extractEntries = (filename) => {
	return fss.readFile(filename, "utf8").split(`\n`).filter(Boolean);
};

const matrix = (filename, type, nodeType, fileMatrix) => {
	const cleaned = filename.replace(
		/^(?<prefix>(?<remove>[\w./-])+\/)?\.(?<filename>[\w./-]+)/u,
		`$<prefix>$<filename>`
	);
	const matrixPath = `${paths.matrix}/root/${cleaned}`;
	const typePath = `${paths.matrix}/${type}/${cleaned}`;

	// If custom matrix
	if (fileMatrix[filename]) {
		return fss.realpath(fileMatrix[filename]);

		// If type - CommonJS
	} else if (nodeType === environment.NODE_TYPE.commonjs && fss.existsCase(`${typePath}-${nodeType}`)) {
		return fss.realpath(`${typePath}-${nodeType}`);

		// If type
	} else if (fss.existsCase(typePath)) {
		return fss.realpath(typePath);

		// If root - CommonJS
	} else if (nodeType === environment.NODE_TYPE.commonjs && fss.existsCase(`${matrixPath}-${nodeType}`)) {
		return fss.realpath(`${matrixPath}-${nodeType}`);
	}

	return fss.realpath(matrixPath);
};

/**
 * Arborescence validation helper.
 *
 * @hideconstructor
 */
class ArborescenceHelper {
	/**
	 * Validates if file exists (case-sensitive).
	 *
	 * @param {string} filename - Name of the file.
	 * @param {string} directoryPath - Absolute directory path to the file.
	 */
	fileExists(filename, directoryPath) {
		const exists = fss.existsCase(`${directoryPath}/${filename}`);
		expect(exists, `'${filename}' must exists`).toBeTrue();
	}

	/**
	 * Validates if file is identical to a defined matrix.
	 *
	 * @param {string} filename - Name of the file.
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.directoryPath - Absolute directory path to the file.
	 * @param {RepositoryType} parameters.repositoryType - Type of repository.
	 * @param {NodeType} parameters.nodeType - Type of Node.js resolver.
	 */
	fileIsMatrix(filename, { directoryPath, repositoryType, nodeType }) {
		const content = fss.readFile(`${directoryPath}/${filename}`, "utf8");
		const matrixContent = fss.readFile(matrix(filename, repositoryType, nodeType, this.fileMatrix), "utf8");
		expect(content, `'${filename}' must be identical to matrix`).toBe(matrixContent);
	}

	/**
	 * Validates if file contains all entries in a defined matrix.
	 *
	 * @param {string} filename - Name of the file.
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.directoryPath - Absolute directory path to the file.
	 * @param {RepositoryType} parameters.repositoryType - Type of repository.
	 * @param {NodeType} parameters.nodeType - Type of Node.js resolver.
	 */
	fileContainsMatrix(filename, { directoryPath, repositoryType, nodeType }) {
		const entries = extractEntries(`${directoryPath}/${filename}`);
		const matrixEntries = extractEntries(matrix(filename, repositoryType, nodeType, this.fileMatrix));
		expect(entries, `'${filename}' must contain matrix`).toIncludeAllMembers(matrixEntries);
	}

	/**
	 * Validates that the package's arborescence respect Absolunet's standards.
	 *
	 * @param {object} [parameters] - Parameters.
	 * @param {string} [parameters.root=paths.project.root] - Root directory of the package.
	 * @param {RepositoryType} [parameters.repositoryType=environment.repositoryType] - Type of repository.
	 * @param {NodeType} [parameters.nodeType=environment.nodeType] - Type of Node.js resolver.
	 * @param {object<string>} [parameters.fileMatrix] - Files matrix overwrites.
	 */
	validate({
		root = paths.project.root,
		repositoryType = environment.repositoryType,
		nodeType = environment.nodeType,
		fileMatrix = {},
	} = {}) {
		this.fileMatrix = fileMatrix;

		describe(`Validate arborescence`, () => {
			const directoryPath = fss.realpath(root);
			const readablePath = environment.getReadablePath(directoryPath);
			const ignore = IGNORE[repositoryType];
			const ltsVersions = Object.keys(environment.LTS_VERSIONS)
				.map((value) => {
					return Number(value);
				})
				.sort()
				.reverse();
			if (!ignore.includes(GITHUB_ISSUES)) {
				test(`Ensure '${readablePath}/.github/ISSUE_TEMPLATE' is valid`, () => {
					this.fileExists(".github/ISSUE_TEMPLATE/bug_report.md", directoryPath);
					this.fileIsMatrix(".github/ISSUE_TEMPLATE/bug_report.md", { directoryPath, repositoryType, nodeType });

					this.fileExists(".github/ISSUE_TEMPLATE/feature_request.md", directoryPath);
					this.fileIsMatrix(".github/ISSUE_TEMPLATE/feature_request.md", { directoryPath, repositoryType, nodeType });

					this.fileExists(".github/ISSUE_TEMPLATE/vulnerability_report.md", directoryPath);
					this.fileIsMatrix(".github/ISSUE_TEMPLATE/vulnerability_report.md", {
						directoryPath,
						repositoryType,
						nodeType,
					});
				});
			}

			if (!ignore.includes(GITHUB_PR)) {
				test(`Ensure '${readablePath}/.github/pull_request_template.md' is valid`, () => {
					this.fileExists(".github/pull_request_template.md", directoryPath);
					this.fileIsMatrix(".github/pull_request_template.md", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(EDITORCONFIG)) {
				test(`Ensure '${readablePath}/.editorconfig' is valid`, () => {
					this.fileExists(".editorconfig", directoryPath);
					this.fileIsMatrix(".editorconfig", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(ESLINTIGNORE)) {
				test(`Ensure '${readablePath}/.eslintignore' is valid`, () => {
					this.fileExists(".eslintignore", directoryPath);
					this.fileContainsMatrix(".eslintignore", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(ESLINTRC)) {
				test(`Ensure '${readablePath}/.eslintrc.yaml' is valid`, () => {
					this.fileExists(".eslintrc.yaml", directoryPath);
					this.fileContainsMatrix(".eslintrc.yaml", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(GITIGNORE)) {
				test(`Ensure '${readablePath}/.gitignore' is valid`, () => {
					this.fileExists(".gitignore", directoryPath);
					this.fileContainsMatrix(".gitignore", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(NPMIGNORE)) {
				test(`Ensure '${readablePath}/.npmignore' is valid`, () => {
					this.fileExists(".npmignore", directoryPath);
					this.fileContainsMatrix(".npmignore", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(PRETTIERRC)) {
				test(`Ensure '${readablePath}/.prettierrc.cjs' is valid`, () => {
					this.fileExists(".prettierrc.cjs", directoryPath);
					this.fileContainsMatrix(".prettierrc.cjs", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(PRETTIERIGNORE)) {
				test(`Ensure '${readablePath}/.prettierignore' is valid`, () => {
					this.fileExists(".prettierignore", directoryPath);
					this.fileContainsMatrix(".prettierignore", { directoryPath, repositoryType, nodeType });
				});
			}

			if (
				!ignore.includes(GITHUB_ACTIONS) &&
				environment.packageCustomization.ciEngine[environment.CI_ENGINE.githubActions].enabled === true
			) {
				test(`Ensure '${readablePath}/.github/workflows/tests.yaml' is valid`, () => {
					this.fileExists(".github/workflows/tests.yaml", directoryPath);

					/* eslint-disable no-template-curly-in-string, camelcase */
					expect(
						fss.readYaml(`${root}/.github/workflows/tests.yaml`),
						".github/workflows/tests.yaml must be valid"
					).toContainAllEntries([
						["name", "tests"],
						["on", ["push", "pull_request"]],
						[
							"jobs",
							{
								build: {
									"runs-on": "${{ matrix.os }}",
									strategy: {
										matrix: {
											os: ["ubuntu-latest", "macos-latest"],
											node_version: [
												...ltsVersions.filter((version) => {
													return version >= environment.nodeVersion;
												}),
											],
										},
									},
									name: "Node ${{ matrix.node_version }} - on ${{ matrix.os }}",
									steps: [
										{ uses: "actions/checkout@v2" },
										{
											name: "Setup node",
											uses: "actions/setup-node@v2",
											with: {
												"check-latest": true,
												"node-version": "${{ matrix.node_version }}",
											},
										},
										{ run: "npm ci" },
										{ run: "npm run manager:build" },
										{ run: "npm test" },
									],
								},
							},
						],
					]);
					/* eslint-enable no-template-curly-in-string, camelcase */
				});
			}

			if (
				!ignore.includes(PIPELINES) &&
				environment.packageCustomization.ciEngine[environment.CI_ENGINE.pipelines].enabled === true
			) {
				const stepDefinition = (version) => {
					const step = {
						name: `Test ${Number.isInteger(version) ? "LTS " : ""}${version} Node.js version`,
						image: `node:${version}`,
						script: ["npm ci --unsafe-perm", "npm run manager:build", "npm test"],
					};

					if (environment.packageCustomization.ciEngine[environment.CI_ENGINE.pipelines].cache) {
						step.caches = ["node"];
					}

					return { step };
				};

				test(`Ensure '${readablePath}/bitbucket-pipelines.yml' is valid`, () => {
					this.fileExists("bitbucket-pipelines.yml", directoryPath);

					expect(
						fss.readYaml(`${root}/bitbucket-pipelines.yml`),
						"bitbucket-pipelines.yml must be valid"
					).toContainAllEntries([
						[
							"pipelines",
							{
								default: [
									{
										parallel: [
											stepDefinition("latest"),
											...ltsVersions
												.filter((version) => {
													return version >= environment.nodeVersion;
												})
												.map((version) => {
													return stepDefinition(version);
												}),
										],
									},
								],
							},
						],
					]);
				});
			}

			if (!ignore.includes(CODEOFCONDUCT)) {
				test(`Ensure '${readablePath}/CODE_OF_CONDUCT.md' is valid`, () => {
					this.fileExists("CODE_OF_CONDUCT.md", directoryPath);
					this.fileIsMatrix("CODE_OF_CONDUCT.md", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(CONTRIBUTING)) {
				test(`Ensure '${readablePath}/CONTRIBUTING.md' is valid`, () => {
					this.fileExists("CONTRIBUTING.md", directoryPath);
					this.fileIsMatrix("CONTRIBUTING.md", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(LICENSE)) {
				test(`Ensure '${readablePath}/LICENSE' is valid`, () => {
					this.fileExists("LICENSE", directoryPath);
					this.fileIsMatrix("LICENSE", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(CHANGELOG)) {
				test(`Ensure '${readablePath}/CHANGELOG.md' is valid`, () => {
					this.fileExists("CHANGELOG.md", directoryPath);
				});
			}

			if (!ignore.includes(MANAGER)) {
				const extension = nodeType === environment.NODE_TYPE.commonjs ? "mjs" : "js";

				test(`Ensure '${readablePath}/manager.${extension}' is valid`, () => {
					this.fileExists(`manager.${extension}`, directoryPath);
				});
			}

			if (!ignore.includes(PACKAGE)) {
				test(`Ensure '${readablePath}/package.json' is valid`, () => {
					this.fileExists("package.json", directoryPath);
				});
			}

			if (!ignore.includes(README)) {
				test(`Ensure '${readablePath}/README.md' is valid`, () => {
					this.fileExists("README.md", directoryPath);
				});
			}

			if (!ignore.includes(SECURITY)) {
				test(`Ensure '${readablePath}/SECURITY.md' is valid`, () => {
					this.fileExists("SECURITY.md", directoryPath);
					this.fileIsMatrix("SECURITY.md", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(SUPPORT)) {
				test(`Ensure '${readablePath}/SUPPORT.md' is valid`, () => {
					this.fileExists("SUPPORT.md", directoryPath);
					this.fileIsMatrix("SUPPORT.md", { directoryPath, repositoryType, nodeType });
				});
			}

			if (!ignore.includes(DISTRIBUTION)) {
				test(`Ensure '${readablePath}/dist/*' is valid`, () => {
					this.fileExists("dist", directoryPath);
				});
			}

			if (!ignore.includes(DOCUMENTATION)) {
				test(`Ensure '${readablePath}/docs/*' is valid`, () => {
					this.fileExists("docs/index.html", directoryPath);
					this.fileExists("docs/api/index.html", directoryPath);
				});
			}

			if (!ignore.includes(SOURCE)) {
				test(`Ensure '${readablePath}/src/*' is valid`, () => {
					this.fileExists("src/index.js", directoryPath);
				});
			}

			if (!ignore.includes(TEST)) {
				test(`Ensure '${readablePath}/test/*' is valid`, () => {
					this.fileExists("test/index.js", directoryPath);
					this.fileExists("test/.eslintrc.yaml", directoryPath);
					this.fileContainsMatrix("test/.eslintrc.yaml", { directoryPath, repositoryType, nodeType });
				});
			}
		});
	}
}

export default new ArborescenceHelper();
