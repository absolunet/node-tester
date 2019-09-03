//--------------------------------------------------------
//-- Arborescence helper
//--------------------------------------------------------
import fss   from '@absolunet/fss';
import paths from './paths';


const EDITORCONFIG = Symbol('editorconfig');
const ESLINTRC     = Symbol('eslintrc');
const GITIGNORE    = Symbol('gitignore');
const NPMIGNORE    = Symbol('npmignore');
const MANAGER      = Symbol('manager');
const PACKAGE      = Symbol('package');
const TRAVIS       = Symbol('travis');
const TEST         = Symbol('test');


const extractEntries = (filename) => {
	return fss.readFile(filename, 'utf8').split(`\n`).filter(Boolean);
};


const matrix = (filename, type) => {
	const cleaned    = filename.replace(/^(?<prefix>(?<remove>[\w./-])+\/)?\.(?<filename>[\w./-]+)/u, `$<prefix>$<filename>`);
	const rootPath   = `${paths.root}/${filename}`;
	const matrixPath = `${paths.matrix}/${cleaned}`;
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
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.path - Absolute directory path to the file.
	 * @param {string} parameters.readablePath - Readable directory path to the file (for logging purposes).
	 */
	fileExists(filename, { path, readablePath }) {
		const exists = fss.exists(`${path}/${filename}`);
		expect(exists, `'${readablePath}/${filename}' must exists`).toBeTrue();
	}


	/**
	 * Validates if file is identical to a defined matrix.
	 *
	 * @param {string} filename - Name of the file.
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.path - Absolute directory path to the file.
	 * @param {string} parameters.readablePath - Readable directory path to the file (for logging purposes).
	 * @param {PackageType} parameters.packageType - Type of package.
	 */
	fileIsMatrix(filename, { path, readablePath, packageType }) {
		const content       = fss.readFile(`${path}/${filename}`, 'utf8');
		const matrixContent = fss.readFile(matrix(filename, packageType), 'utf8');
		expect(content, `'${readablePath}/${filename}' must be identical to matrix`).toBe(matrixContent);
	}


	/**
	 * Validates if file contains all entries in a defined matrix.
	 *
	 * @param {string} filename - Name of the file.
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.path - Absolute directory path to the file.
	 * @param {string} parameters.readablePath - Readable directory path to the file (for logging purposes).
	 * @param {PackageType} parameters.packageType - Type of package.
	 */
	fileContainsMatrix(filename, { path, readablePath, packageType }) {
		const entries       = extractEntries(`${path}/${filename}`);
		const matrixEntries = extractEntries(matrix(filename, packageType));
		expect(entries, `'${readablePath}/${filename}' must contain matrix`).toIncludeAllMembers(matrixEntries);
	}


	/**
	 * Validates that the project's arborescence respect Absolunet's standards.
	 *
	 * @param {object} parameters - Parameters.
	 * @param {string} parameters.root - Absolute directory path to the file.
	 * @param {string} parameters.ignore - Readable directory path to the file (for logging purposes).
	 * @param {PackageType} parameters.packageType - Type of package.
	 */
	validate({ root, ignore = [], packageType }) {
		describe(`Validate arborescence`, () => {



			const selfTest = true;




			const currentRoot = fss.realpath(root);
			const options = {
				packageType,
				path:         currentRoot,
				readablePath: currentRoot.startsWith(paths.project.root) ? currentRoot.substring(paths.project.root.length + 1) : currentRoot
			};

			if (!ignore.includes(EDITORCONFIG)) {
				test(`Ensure '.editorconfig' is valid`, () => {
					this.fileExists('.editorconfig', options);
				});
			}

			if (!ignore.includes(ESLINTRC)) {
				test(`Ensure '.eslintrc.yaml' is valid`, () => {
					this.fileExists('.eslintrc.yaml', options);
					this.fileContainsMatrix('.eslintrc.yaml', options);
				});
			}

			if (!ignore.includes(GITIGNORE)) {
				test(`Ensure '.gitignore' is valid`, () => {
					this.fileExists('.gitignore', options);
					this.fileContainsMatrix('.gitignore', options);
				});
			}

			if (!ignore.includes(NPMIGNORE)) {
				test(`Ensure '.npmignore' is valid`, () => {
					this.fileExists('.npmignore', options);

					if (!selfTest) {
						this.fileContainsMatrix('.npmignore', options);
					}
				});
			}

			if (!ignore.includes(TRAVIS)) {
				test(`Ensure '.travis.yml' is valid`, () => {
					this.fileExists('.travis.yml', options);
					this.fileIsMatrix('.travis.yml', options);
				});
			}

			test(`Ensure 'license' is valid`, () => {
				this.fileExists('license', options);
				this.fileIsMatrix('license', options);
			});

			if (!ignore.includes(MANAGER)) {
				test(`Ensure 'manager.js' is valid`, () => {
					this.fileExists('manager.js', options);
				});
			}

			if (!ignore.includes(PACKAGE)) {
				test(`Ensure 'package.json' is valid`, () => {
					this.fileExists('package.json', options);
				});
			}

			test(`Ensure 'readme.md' is valid`, () => {
				this.fileExists('readme.md', options);
			});

			if (!ignore.includes(TEST)) {
				test(`Ensure 'test' is valid`, () => {
					this.fileExists('test', options);
				});
			}
		});
	}

}


export default new ArborescenceHelper();
