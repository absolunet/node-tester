//--------------------------------------------------------
//-- Arborescence helper
//--------------------------------------------------------
import fss   from '@absolunet/fss';
import env   from './environment';
import paths from './paths';


const GITHUB_ISSUES = Symbol('github-issues');
const GITHUB_PR     = Symbol('github-pullrequests');
const EDITORCONFIG  = Symbol('editorconfig');
const ESLINTIGNORE  = Symbol('eslintignore');
const ESLINTRC      = Symbol('eslintrc');
const GITIGNORE     = Symbol('gitignore');
const NPMIGNORE     = Symbol('npmignore');
const TRAVIS        = Symbol('travis');
const PIPELINES     = Symbol('pipelines');
const CHANGELOG     = Symbol('changelog');
const CODEOFCONDUCT = Symbol('code-of-conduct');
const CONTRIBUTING  = Symbol('contributing');
const LICENSE       = Symbol('license');
const MANAGER       = Symbol('manager');
const PACKAGE       = Symbol('package');
const README        = Symbol('readme');
const SECURITY      = Symbol('security');
const SUPPORT       = Symbol('support');
const DISTRIBUTION  = Symbol('distribution');
const DOCUMENTATION = Symbol('documentation');
const SOURCE        = Symbol('source');
const TEST          = Symbol('test');

const IGNORE = {
	[env.GROUP_TYPE.simple]: [],
	[env.GROUP_TYPE.ioc]:    [],
	[env.GROUP_TYPE.multi]:  [NPMIGNORE, DOCUMENTATION, DISTRIBUTION, SOURCE],
	[env.GROUP_TYPE.sub]:    [GITHUB_ISSUES, GITHUB_PR, EDITORCONFIG, ESLINTIGNORE, ESLINTRC, GITIGNORE, TRAVIS, PIPELINES, CHANGELOG, CODEOFCONDUCT, CONTRIBUTING, MANAGER, SECURITY, SUPPORT, DOCUMENTATION, TEST]
};






const extractEntries = (filename) => {
	return fss.readFile(filename, 'utf8').split(`\n`).filter(Boolean);
};


const matrix = (filename, type) => {
	const cleaned    = filename.replace(/^(?<prefix>(?<remove>[\w./-])+\/)?\.(?<filename>[\w./-]+)/u, `$<prefix>$<filename>`);
	const rootPath   = `${paths.root}/${filename}`;
	const matrixPath = `${paths.matrix}/root/${cleaned}`;
	const typePath   = `${paths.matrix}/${type}/${cleaned}`;

	if (fss.exists(typePath)) {
		return fss.realpath(typePath);
	} else if (fss.exists(matrixPath)) {
		return fss.realpath(matrixPath);
	}

	return fss.realpath(rootPath);
};





/**
 * Arborescence validation helper.
 *
 * @hideconstructor
 */
class ArborescenceHelper {

	/**
	 * Validates if file exists.
	 *
	 * @param {string} filename - Name of the file.
	 * @param {string} directoryPath - Absolute directory path to the file.
	 */
	fileExists(filename, directoryPath) {
		const exists = fss.exists(`${directoryPath}/${filename}`);
		expect(exists, `'${filename}' must exists`).toBeTrue();
	}


	/**
	 * Validates if file is identical to a defined matrix.
	 *
	 * @param {string} filename - Name of the file.
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.directoryPath - Absolute directory path to the file.
	 * @param {GroupType} parameters.groupType - Type of group.
	 */
	fileIsMatrix(filename, { directoryPath, groupType }) {
		const content       = fss.readFile(`${directoryPath}/${filename}`, 'utf8');
		const matrixContent = fss.readFile(matrix(filename, groupType), 'utf8');
		expect(content, `'${filename}' must be identical to matrix`).toBe(matrixContent);
	}


	/**
	 * Validates if file contains all entries in a defined matrix.
	 *
	 * @param {string} filename - Name of the file.
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.directoryPath - Absolute directory path to the file.
	 * @param {GroupType} parameters.groupType - Type of group.
	 */
	fileContainsMatrix(filename, { directoryPath, groupType }) {
		const entries       = extractEntries(`${directoryPath}/${filename}`);
		const matrixEntries = extractEntries(matrix(filename, groupType));
		expect(entries, `'${filename}' must contain matrix`).toIncludeAllMembers(matrixEntries);
	}


	/**
	 * Validates that the package's arborescence respect Absolunet's standards.
	 *
	 * @param {object} [parameters] - Parameters.
	 * @param {string} [parameters.root=paths.project.root] - Root directory of the package.
	 * @param {RepositoryType} [parameters.repositoryType=env.repositoryType] - Type of repository.
	 * @param {PackageType} [parameters.packageType=env.packageType] - Type of package.
	 * @param {boolean} [parameters.subpackage=false] - If is subpackage.
	 */
	validate({ root = paths.project.root, repositoryType = env.repositoryType, packageType = env.packageType, subpackage = false } = {}) {
		describe(`Validate arborescence`, () => {
			const directoryPath = fss.realpath(root);
			const readablePath  = env.getReadablePath(directoryPath);
			const groupType     = env.groupType({ repositoryType, packageType, subpackage });
			const ignore        = IGNORE[groupType];


			if (!ignore.includes(GITHUB_ISSUES)) {
				test(`Ensure '${readablePath}/.github/ISSUE_TEMPLATE' is valid`, () => {
					this.fileExists('.github/ISSUE_TEMPLATE/bug_report.md', directoryPath);
					this.fileIsMatrix('.github/ISSUE_TEMPLATE/bug_report.md', { directoryPath, groupType });

					this.fileExists('.github/ISSUE_TEMPLATE/feature_request.md', directoryPath);
					this.fileIsMatrix('.github/ISSUE_TEMPLATE/feature_request.md', { directoryPath, groupType });

					this.fileExists('.github/ISSUE_TEMPLATE/vulnerability_report.md', directoryPath);
					this.fileIsMatrix('.github/ISSUE_TEMPLATE/vulnerability_report.md', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(GITHUB_PR)) {
				test(`Ensure '${readablePath}/.github/pull_request_template.md' is valid`, () => {
					this.fileExists('.github/pull_request_template.md', directoryPath);
					this.fileIsMatrix('.github/pull_request_template.md', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(EDITORCONFIG)) {
				test(`Ensure '${readablePath}/.editorconfig' is valid`, () => {
					this.fileExists('.editorconfig', directoryPath);
				});
			}

			if (!ignore.includes(ESLINTIGNORE)) {
				test(`Ensure '${readablePath}/.eslintignore' is valid`, () => {
					this.fileExists('.eslintignore', directoryPath);
					this.fileContainsMatrix('.eslintignore', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(ESLINTRC)) {
				test(`Ensure '${readablePath}/.eslintrc.yaml' is valid`, () => {
					this.fileExists('.eslintrc.yaml', directoryPath);
					this.fileContainsMatrix('.eslintrc.yaml', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(GITIGNORE)) {
				test(`Ensure '${readablePath}/.gitignore' is valid`, () => {
					this.fileExists('.gitignore', directoryPath);
					this.fileContainsMatrix('.gitignore', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(NPMIGNORE)) {
				test(`Ensure '${readablePath}/.npmignore' is valid`, () => {
					this.fileExists('.npmignore', directoryPath);
					this.fileContainsMatrix('.npmignore', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(TRAVIS) && env.packageCustomization.ciEngine === env.CI_ENGINE.travis) {
				test(`Ensure '${readablePath}/.travis.yml' is valid`, () => {
					this.fileExists('.travis.yml', directoryPath);
					this.fileIsMatrix('.travis.yml', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(PIPELINES) && env.packageCustomization.ciEngine === env.CI_ENGINE.pipelines) {
				test(`Ensure '${readablePath}/bitbucket-pipelines.yml' is valid`, () => {
					this.fileExists('bitbucket-pipelines.yml', directoryPath);
					this.fileIsMatrix('bitbucket-pipelines.yml', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(CODEOFCONDUCT)) {
				test(`Ensure '${readablePath}/code_of_conduct.md' is valid`, () => {
					this.fileExists('code_of_conduct.md', directoryPath);
					this.fileIsMatrix('code_of_conduct.md', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(CONTRIBUTING)) {
				test(`Ensure '${readablePath}/contributing.md' is valid`, () => {
					this.fileExists('contributing.md', directoryPath);
					this.fileIsMatrix('contributing.md', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(LICENSE)) {
				test(`Ensure '${readablePath}/license' is valid`, () => {
					this.fileExists('license', directoryPath);
					this.fileIsMatrix('license', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(CHANGELOG)) {
				test(`Ensure '${readablePath}/CHANGELOG.md' is valid`, () => {
					this.fileExists('CHANGELOG.md', directoryPath);
				});
			}

			if (!ignore.includes(MANAGER)) {
				test(`Ensure '${readablePath}/manager.js' is valid`, () => {
					this.fileExists('manager.js', directoryPath);
				});
			}

			if (!ignore.includes(PACKAGE)) {
				test(`Ensure '${readablePath}/package.json' is valid`, () => {
					this.fileExists('package.json', directoryPath);
				});
			}

			// TODO [>=3.1.0]: Add more tests with marked
			if (!ignore.includes(README)) {
				test(`Ensure '${readablePath}/readme.md' is valid`, () => {
					this.fileExists('readme.md', directoryPath);
				});
			}

			if (!ignore.includes(SECURITY)) {
				test(`Ensure '${readablePath}/security.md' is valid`, () => {
					this.fileExists('security.md', directoryPath);
					this.fileIsMatrix('security.md', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(SUPPORT)) {
				test(`Ensure '${readablePath}/support.md' is valid`, () => {
					this.fileExists('support.md', directoryPath);
					this.fileIsMatrix('support.md', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(DISTRIBUTION)) {
				test(`Ensure '${readablePath}/dist/*' is valid`, () => {
					this.fileExists('dist', directoryPath);
				});
			}

			if (!ignore.includes(DOCUMENTATION)) {
				test(`Ensure '${readablePath}/docs/*' is valid`, () => {
					this.fileExists('docs/index.html', directoryPath);
					this.fileExists('docs/api/index.html', directoryPath);
				});
			}

			if (!ignore.includes(SOURCE)) {
				test(`Ensure '${readablePath}/src/*' is valid`, () => {
					this.fileExists('src/index.js', directoryPath);
					this.fileExists('src/.eslintrc.yaml', directoryPath);

					// TODO [>=3.1.0]: Verify order and that 2nd config is node or browser
					this.fileContainsMatrix('src/.eslintrc.yaml', { directoryPath, groupType });
				});
			}

			if (!ignore.includes(TEST)) {
				test(`Ensure '${readablePath}/test/*' is valid`, () => {
					this.fileExists('test/index.js', directoryPath);
					this.fileExists('test/.eslintrc.yaml', directoryPath);
					this.fileContainsMatrix('test/.eslintrc.yaml', { directoryPath, groupType });
				});
			}
		});
	}

}


export default new ArborescenceHelper();
