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
 * xyz
 */
class Arborescence {

	/**
	 * xyz
	 */
	fileExists(filename, { path, readablePath }) {
		const exists = fss.exists(`${path}/${filename}`);
		expect(exists, `'${readablePath}/${filename}' must exists`).toBeTrue();
	}


	/**
	 * xyz
	 */
	fileIsMatrix(filename, { path, readablePath, type }) {
		const content       = fss.readFile(`${path}/${filename}`, 'utf8');
		const matrixContent = fss.readFile(matrix(filename, type), 'utf8');
		expect(content, `'${readablePath}/${filename}' must be identical to matrix`).toBe(matrixContent);
	}


	/**
	 * xyz
	 */
	fileContainsMatrix(filename, { path, readablePath, type }) {
		const entries       = extractEntries(`${path}/${filename}`);
		const matrixEntries = extractEntries(matrix(filename, type));
		expect(entries, `'${readablePath}/${filename}' must contain matrix`).toIncludeAllMembers(matrixEntries);
	}


	/**
	 * xyz
	 */
	validate({ root, ignore = [], type }) {
		describe(`Validate arborescence`, () => {



			const selfTest = true;




			const currentRoot = fss.realpath(root);
			const options = {
				type,
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


export default new Arborescence();
