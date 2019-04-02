//--------------------------------------------------------
//-- npm package
//--------------------------------------------------------
'use strict';

const test     = require('ava');
const globAll  = require('glob-all');
const readJson = require('read-package-json');
const fss      = require('@absolunet/fss');

const linters  = require('./linters');
const patterns = require('./patterns');
const util     = require('./helpers/util');


const EDITORCONFIG = Symbol('editorconfig');
const ESLINTRC     = Symbol('eslintrc');
const GITIGNORE    = Symbol('gitignore');
const NPMIGNORE    = Symbol('npmignore');
const PACKAGE      = Symbol('package');
const TRAVIS       = Symbol('travis');
const TEST         = Symbol('test');


const getOptions = ({ cwd, group, scope, ignore = [] }) => {
	return {
		cwd:           cwd,
		group:         group,
		path:          cwd,
		readablePath:  cwd.startsWith(process.cwd()) ? cwd.substring(process.cwd().length + 1) : cwd,
		packageConfig: fss.readJson(`${cwd}/package.json`),
		scope:         scope,
		ignore:        ignore
	};
};


const parseConfig = (filename) => {
	return fss.readFile(filename, 'utf8').split(`\n`).filter(Boolean);
};


const matrix = (filename, scope) => {
	const root       = `${__dirname}/..`;
	const cleaned    = filename.replace(/^(?<prefix>(?<remove>[\w./-])+\/)?\.(?<filename>[\w./-]+)/u, `$<prefix>$<filename>`);
	const rootPath   = `${root}/${filename}`;
	const matrixPath = `${root}/matrix/${cleaned}`;
	const scopePath  = `${root}/matrix/${scope}/${cleaned}`;

	if (fss.exists(scopePath)) {
		return fss.realpath(scopePath);
	} else if (fss.exists(matrixPath)) {
		return fss.realpath(matrixPath);
	}

	return fss.realpath(rootPath);
};


const configJsonTests = (config, t) => {
	t.truthy(config.description, `Description must not be empty`);
	t.regex(config.homepage, /^https:\/\/(?<domain>github.com\/absolunet\/|absolunet.github.io\/).+/u, `Homepage is not valid`);
	t.deepEqual(config.license, 'MIT', `License is not valid`);

	if (Object.keys(config).includes('repository')) {
		t.is(config.repository.type, 'git', `Repository type is not valid`);
		t.regex(config.repository.url, /git:\/\/github.com\/absolunet\/(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*\.git/u, `Repository url is not valid`);
	} else {
		t.fail(`Repository must be defined`);
	}

	if (Object.keys(config).includes('bugs')) {
		t.false(Object.keys(config.bugs).includes('email'), `Bugs must not contain email`);
		t.regex(config.bugs.url, /https:\/\/github.com\/absolunet\/(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*\/issues/u, `Bugs url is not valid`);
	} else {
		t.fail(`Bugs must be defined`);
	}

	t.truthy(config.main, `Main must be defined`);
	t.true(Array.isArray(config.keywords), `Keywords must be defined`);
	t.false(Object.keys(config).includes('private'), `Private must not be defined`);
};


const validatePackageJsonIntegrity = (t, { path, packageConfig }) => {
	return new Promise((resolve) => {

		// Parse via npm's parser
		readJson(`${path}/package.json`, readJson.log, true, (error, config) => {

			// If valid
			if (!error) {

				// Verify parsed config is identical to raw config
				Object.keys(packageConfig).forEach((key) => {
					t.deepEqual(config[key], packageConfig[key], `Parsed config must be identical to raw config for '${key}'`);
				});
				resolve({ success: true });

			} else {
				t.fail(`package.json is not valid (${error})`);
				resolve({ success: false });
			}
		});
	});
};






const testExists = (filename, { path, readablePath, group }) => {
	test(util.formatTitle(`Check that '${readablePath}/${filename}' exists`, group), (t) => {
		t.true(fss.exists(`${path}/${filename}`), `Must exists`);
	});
};


const testMatrix = (filename, { path, readablePath, group, scope }) => {
	test(util.formatTitle(`Check that '${readablePath}/${filename}' is identical to matrix`, group), (t) => {
		t.is(fss.readFile(`${path}/${filename}`, 'utf8'), fss.readFile(matrix(filename, scope), 'utf8'), `Must be identical to matrix`);
	});
};


const testContainsMatrix = (filename, { path, readablePath, group, scope }) => {
	test(util.formatTitle(`Check that '${readablePath}/${filename}' contains at least matrix`, group), (t) => {
		const entries = parseConfig(`${path}/${filename}`);
		parseConfig(matrix(filename, scope)).forEach((entry) => {
			t.true(entries.includes(entry), `Must contain '${entry}'`);
		});
	});
};


const testPackageJson = ({ path, readablePath, group, packageConfig, ignore = [] }) => {
	test(util.formatTitle(`Check that '${readablePath}/package.json' is valid and contains minimum information`, group), (t) => {
		return validatePackageJsonIntegrity(t, { path, packageConfig }).then(({ success }) => {
			if (success) {

				// Validate fields
				configJsonTests(packageConfig, t);

				t.regex(packageConfig.name, /^@absolunet\/(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u, `Name must be valid`);
				t.truthy(packageConfig.version, `Version must not be empty`);
				t.deepEqual(packageConfig.author, { name: 'Absolunet', url: 'https://absolunet.com' }, `Author is not valid`);

				if (Object.keys(packageConfig).includes('engines')) {
					t.true(Object.keys(packageConfig.engines).includes('node'), `Engines must contain node`);
					t.truthy(packageConfig.engines.node, `Engines > Node must not be empty`);
				} else {
					t.fail(`Engines must be defined`);
				}

				if (!ignore.includes(TEST)) {
					if (Object.keys(packageConfig).includes('scripts')) {
						t.true(Object.keys(packageConfig.scripts).includes('test'), `Scripts must contain test`);
						t.true(packageConfig.scripts.test.startsWith('ava test'), `Scripts > Test must be 'ava test'`);
					} else {
						t.fail(`Scripts must be defined`);
					}
				}

				t.false(Object.keys(packageConfig).includes('files'), `Files must not be defined`);
				t.false(Object.keys(packageConfig).includes('config'), `Config must not be defined`);
			}
		});
	});
};






class NpmPackage {

	//-- Get all packages path in a multi-packages project
	get multiPackagesPaths() {
		return globAll.sync(['packages/*/'], { realpath: true });
	}


	//-- Validate
	validate({ cwd = process.cwd(), group, scope, js, json, yaml, bash, editorconfig, scss, ignore = [] } = {}) {
		const selfTest = fss.realpath(cwd) === fss.realpath(`${__dirname}/..`);

		const options = getOptions({ cwd, group, scope, ignore });

		// Linters
		linters.js(js, { cwd, group });
		linters.json(json, { cwd, group });
		linters.yaml(yaml, { cwd, group });
		linters.bash(bash, { cwd, group });
		linters.editorconfig(editorconfig, { cwd, group });

		if (scss) {
			linters.scss(scss, { cwd, group });
		}


		// Tests
		if (!ignore.includes(EDITORCONFIG)) {
			testExists('.editorconfig', options);
		}

		if (!ignore.includes(ESLINTRC)) {
			testExists('.eslintrc.yaml', options);
			testMatrix('.eslintrc.yaml', options);
		}

		if (!ignore.includes(GITIGNORE)) {
			testExists('.gitignore', options);
			testContainsMatrix('.gitignore', options);
		}

		if (!ignore.includes(NPMIGNORE)) {
			testExists('.npmignore', options);
			if (!selfTest) {
				testContainsMatrix('.npmignore', options);
			}
		}

		if (!ignore.includes(TRAVIS)) {
			testExists('.travis.yml', options);
			testMatrix('.travis.yml', options);
		}

		testExists('license', options);
		testMatrix('license', options);

		if (!ignore.includes(PACKAGE)) {
			testExists('package.json', options);
			testPackageJson(options);
		}

		testExists('readme.md', options);

		if (!ignore.includes(TEST)) {
			testExists('test/index.js', options);
		}


		// --verbose warning
		if (!ignore.includes(TEST)) {
			test.after(`Check for verbose in '${options.readablePath}/package.json'`, () => {
				if ((/--verbose/u).test(options.packageConfig.scripts.test)) {
					console.log(`\n  ----|  DON'T FORGET TO REMOVE THE --verbose FLAG  |----`);  // eslint-disable-line no-console
				}
			});
		}
	}


	//-- Validate a multi-packages project
	validateMulti({ cwd = process.cwd(), group = 'MAIN', js = patterns.js, json = patterns.json, yaml = patterns.yaml, bash = patterns.bash, editorconfig = patterns.editorconfig, scss } = {}) {
		const packagesPath = 'packages';

		const options = getOptions({
			cwd:    cwd,
			group:  group,
			scope:  'multi',
			ignore: [NPMIGNORE, PACKAGE]
		});

		options.js           = js.concat([`!${packagesPath}/**`]);
		options.json         = json.concat([`!${packagesPath}/**`]);
		options.yaml         = yaml.concat([`!${packagesPath}/**`]);
		options.bash         = bash.concat([`!${packagesPath}/**`]);
		options.editorconfig = editorconfig.concat([`!${packagesPath}/**`]);

		if (scss) {
			options.scss = scss.concat([`!${packagesPath}/**`]);
		}

		this.validate(options);

		// Validate package.json
		testExists('package.json', options);

		test(util.formatTitle(`Multi: Check that '${options.readablePath}/package.json' is valid`, group), (t) => {
			return validatePackageJsonIntegrity(t, options).then(({ success }) => {
				if (success) {

					// Name
					t.regex(options.packageConfig.name, /^(?<kebab1>[a-z][a-z0-9]+)(?<kebab2>-[a-z0-9]+)*$/u, `Name must be valid`);

					// Private
					t.true(Object.keys(options.packageConfig).includes('private'), `Private must be defined`);
					t.is(options.packageConfig.private, true, `Private must be true`);

					// Test
					if (Object.keys(options.packageConfig).includes('scripts')) {
						t.true(Object.keys(options.packageConfig.scripts).includes('test'), `Scripts must contain test`);
						t.truthy(options.packageConfig.scripts.test, `Scripts > Test must not be empty`);
					} else {
						t.fail(`Scripts must be defined`);
					}

					// lerna
					if (Object.keys(options.packageConfig).includes('devDependencies')) {
						t.true(Object.keys(options.packageConfig.devDependencies).includes('lerna'), `devDependencies must contain lerna`);
					} else {
						t.fail(`devDependencies must be defined`);
					}

					t.false(Object.keys(options.packageConfig).includes('version'), `Version must not be defined`);
					t.false(Object.keys(options.packageConfig).includes('author'), 'Author must not be defined');
					t.false(Object.keys(options.packageConfig).includes('dependencies'), `Dependencies must not be defined`);
				}
			});
		});

		// Validate lerna.json
		testExists('lerna.json', options);
		test(util.formatTitle(`Multi: Check that '${options.readablePath}/lerna.json' is valid`, group), (t) => {
			const config = fss.readJson(`${options.cwd}/lerna.json`);
			t.true(Object.keys(config).includes('version'), `Version must be defined`);
			t.true(Object.keys(config).includes('packages'), `Packages must be defined`);
			t.deepEqual(config.packages, ['packages/*'], `Packages is not valid`);
		});
	}


	//-- Validate a single package inside a multi-packages project
	validateSub({ cwd = process.cwd(), group, js, json, yaml, bash, editorconfig, scss } = {}) {
		const options = getOptions({
			cwd:    cwd,
			group:  group,
			ignore: [EDITORCONFIG, ESLINTRC, GITIGNORE, NPMIGNORE, TRAVIS, TEST]
		});

		options.js           = js;
		options.json         = json;
		options.yaml         = yaml;
		options.bash         = bash;
		options.editorconfig = editorconfig;

		if (scss) {
			options.scss = scss;
		}

		this.validate(options);
	}


	//-- Validate ESLint config package
	validateEslintConfig({ cwd = process.cwd(), group } = {}) {
		const options = getOptions({
			cwd:    cwd,
			group:  group,
			scope:  'eslintconfig',
			ignore: [EDITORCONFIG, ESLINTRC, GITIGNORE, NPMIGNORE, TRAVIS, TEST]
		});

		this.validate(options);


		// Validate config
		test(util.formatTitle(`ESLintConfig: Check that config is valid for '${options.readablePath}'`, group), (t) => {
			const data = require(cwd);  // eslint-disable-line global-require
			t.deepEqual(typeof data, 'object', 'YAML is not parsable');

			const hasRules         = typeof data.rules === 'object';
			const hasParserOptions = typeof data.parserOptions === 'object';
			const globals          = typeof data.globals === 'object';
			t.true(hasRules || hasParserOptions || globals, 'Does not contain rules, parser options or globals');
		});


		// Extra validation on package.json
		test(util.formatTitle(`ESLintConfig: Check that '${options.readablePath}/package.json' is valid`, group), (t) => {

			t.regex(options.packageConfig.name, /^@absolunet\/eslint-config-(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u, `Name must be valid`);

			if (Array.isArray(options.packageConfig.keywords)) {
				['eslint', 'eslintconfig', 'eslint-config'].forEach((keywords) => {
					t.true(options.packageConfig.keywords.includes(keywords), `Keywords must contain '${keywords}'`);
				});
			} else {
				t.fail(`Keywords must be defined`);
			}

		});
	}


	//-- Validate stylelint config package
	validateStylelintConfig({ cwd = process.cwd(), group } = {}) {
		const options = getOptions({
			cwd:    cwd,
			group:  group,
			scope:  'stylelintconfig',
			ignore: [EDITORCONFIG, ESLINTRC, GITIGNORE, NPMIGNORE, TRAVIS, TEST]
		});


		this.validate(options);

		// Validate config
		test(util.formatTitle(`StylelintConfig: Check that config is valid for '${options.readablePath}'`, group), (t) => {
			const data = require(cwd);  // eslint-disable-line global-require
			t.deepEqual(typeof data, 'object', 'YAML is not parsable');

			const hasRules = typeof data.rules === 'object';
			t.true(hasRules, 'Does not contain rules');
		});


		// Extra validation on package.json
		test(util.formatTitle(`StylelintConfig: Check that '${options.readablePath}/package.json' is valid`, group), (t) => {

			t.regex(options.packageConfig.name, /^@absolunet\/stylelint-config-(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u, `Name must be valid`);

			if (Array.isArray(options.packageConfig.keywords)) {
				['stylelint', 'stylelintconfig', 'stylelint-config'].forEach((keywords) => {
					t.true(options.packageConfig.keywords.includes(keywords), `Keywords must contain '${keywords}'`);
				});
			} else {
				t.fail(`Keywords must be defined`);
			}

		});
	}


	//-- Validate library package
	validateLibrary({ cwd = process.cwd(), group } = {}) {
		const options = getOptions({
			cwd:    cwd,
			group:  group,
			scope:  'library',
			ignore: [EDITORCONFIG, ESLINTRC, GITIGNORE, NPMIGNORE, TRAVIS, TEST]
		});

		options.js = [
			`*.js`,
			`**/*.js`,
			`!dist/*.js`,
			`!node_modules/**/*.js`
		];

		options.editorconfig = patterns.editorconfig.concat([
			`!dist/*.js`
		]);



		// Package validation
		this.validate(options);

		// Structure
		testExists('dist', options);
		testExists('lib', options);
		testExists('index.js', options);
		testExists('webpack.config.js', options);

		testExists('.eslintrc.yaml', options);
		testMatrix('.eslintrc.yaml', options);

		testExists('.eslintignore', options);
		testContainsMatrix('.eslintignore', options);


		// Extra validation on package.json
		test(util.formatTitle(`Library: Check that '${options.readablePath}/package.json' is valid`, group), (t) => {
			t.truthy(options.packageConfig.browser, `Browser must be defined`);

			if (Object.keys(options.packageConfig).includes('scripts')) {
				t.true(Object.keys(options.packageConfig.scripts).includes('build'), `Scripts must contain build`);
				t.deepEqual(options.packageConfig.scripts.build, 'node node_modules/@absolunet/library-builder/bin/build.js', `Build script is not valid`);
			} else {
				t.fail(`Scripts must be defined`);
			}

			if (Object.keys(options.packageConfig).includes('devDependencies')) {
				t.true(Object.keys(options.packageConfig.devDependencies).includes('@absolunet/library-builder'), `devDependencies must contain @absolunet/library-builder`);
			} else {
				t.fail(`devDependencies must be defined`);
			}

		});
	}

}


module.exports = new NpmPackage();
