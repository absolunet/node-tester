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
		cwd:          cwd,
		group:        group,
		path:         cwd,
		readablePath: cwd.startsWith(process.cwd()) ? cwd.substring(process.cwd().length + 1) : cwd,
		pkg:          fss.readJson(`${cwd}/package.json`),
		scope:        scope,
		ignore:       ignore
	};
};


const parseConf = (filename) => {
	return fss.readFile(filename, 'utf8').split(`\n`).filter(Boolean);
};


const matrix = (filename, scope) => {
	const root       = `${__dirname}/..`;
	const cleaned    = filename.replace(/^(([\w./-])+\/)?\.([\w./-]+)/u, `$1$3`);  // eslint-disable-line unicorn/no-unsafe-regex
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
	t.regex(config.homepage, /^https:\/\/(github.com\/absolunet\/|absolunet.github.io\/).+/u, `Homepage is not valid`);
	t.deepEqual(config.license, 'MIT', `License is not valid`);

	if (Object.keys(config).includes('repository')) {
		t.is(config.repository.type, 'git', `Repository type is not valid`);
		t.regex(config.repository.url, /git:\/\/github.com\/absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*\.git/u, `Repository url is not valid`);  // eslint-disable-line unicorn/no-unsafe-regex
	} else {
		t.fail(`Repository must be defined`);
	}

	if (Object.keys(config).includes('bugs')) {
		t.false(Object.keys(config.bugs).includes('email'), `Bugs must not contain email`);
		t.regex(config.bugs.url, /https:\/\/github.com\/absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*\/issues/u, `Bugs url is not valid`);  // eslint-disable-line unicorn/no-unsafe-regex
	} else {
		t.fail(`Bugs must be defined`);
	}

	t.truthy(config.main, `Main must be defined`);
	t.true(Array.isArray(config.keywords), `Keywords must be defined`);
	t.false(Object.keys(config).includes('private'), `Private must not be defined`);
};


const validatePackageJsonIntegrity = (t, { path, pkg }) => {
	return new Promise((resolve) => {

		// Parse via npm's parser
		readJson(`${path}/package.json`, readJson.log, true, (error, config) => {

			// If valid
			if (!error) {

				// Verify parsed config is identical to raw config
				Object.keys(pkg).forEach((key) => {
					t.deepEqual(config[key], pkg[key], `Parsed config must be identical to raw config for '${key}'`);
				});
				resolve({ success:true });

			} else {
				t.fail(`package.json is not valid (${error})`);
				resolve({ success:false });
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
		const entries = parseConf(`${path}/${filename}`);
		parseConf(matrix(filename, scope)).forEach((entry) => {
			t.true(entries.includes(entry), `Must contain '${entry}'`);
		});
	});
};


const testPackageJson = ({ path, readablePath, group, pkg, ignore = [] }) => {
	test(util.formatTitle(`Check that '${readablePath}/package.json' is valid and contains minimum information`, group), (t) => {
		return validatePackageJsonIntegrity(t, { path, pkg }).then(({ success }) => {
			if (success) {

				// Validate fields
				configJsonTests(pkg, t);

				t.regex(pkg.name, /^@absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*$/u, `Name must be valid`);  // eslint-disable-line unicorn/no-unsafe-regex
				t.truthy(pkg.version, `Version must not be empty`);
				t.deepEqual(pkg.author, { name:'Absolunet', url:'https://absolunet.com' }, `Author is not valid`);

				if (Object.keys(pkg).includes('engines')) {
					t.true(Object.keys(pkg.engines).includes('node'), `Engines must contain node`);
					t.truthy(pkg.engines.node, `Engines > Node must not be empty`);
				} else {
					t.fail(`Engines must be defined`);
				}

				if (!ignore.includes(TEST)) {
					if (Object.keys(pkg).includes('scripts')) {
						t.true(Object.keys(pkg.scripts).includes('test'), `Scripts must contain test`);
						t.true(pkg.scripts.test.startsWith('ava test'), `Scripts > Test must be 'ava test'`);
					} else {
						t.fail(`Scripts must be defined`);
					}
				}

				t.false(Object.keys(pkg).includes('files'), `Files must not be defined`);
				t.false(Object.keys(pkg).includes('config'), `Config must not be defined`);
			}
		});
	});
};


const testBowerJson = (filename, { path, readablePath, group, pkg }) => {
	const config = fss.readJson(`${path}/${filename}`);

	test(util.formatTitle(`Check that '${readablePath}/${filename}' is valid and contains minimum information`, group), (t) => {

		// Validate fields
		configJsonTests(config, t);
		t.truthy(config.name, `Name must not be empty`);
		t.deepEqual(config.authors, [{ name:'Absolunet', url:'https://absolunet.com' }], `Authors is not valid`);
		t.deepEqual(config.moduleType, 'globals', `Module type is not valid`);
		t.deepEqual(config.ignore, [
			'ressources',
			'src',
			'test',
			'.editorconfig',
			'.eslintignore',
			'.eslintrc.yaml',
			'.gitignore',
			'.npmignore',
			'.travis.yml',
			'package.json',
			'webpack.config.json'
		], `Module type is not valid`);

		t.false(Object.keys(config).includes('version'), `Version must not be defined`);
		t.false(Object.keys(config).includes('resolutions'), `Resolutions must not be defined`);

		// Sync with package.json
		t.deepEqual(`@absolunet/${config.name}`, pkg.name, `Name must be identical to package.json`);

	});


	test(util.formatTitle(`Check that '${readablePath}/${filename}' is in sync with 'package.json'`, group), (t) => {

		t.deepEqual(`@absolunet/${config.name}`, pkg.name, `Name must be identical`);
		t.deepEqual(config.description, pkg.description, `Description must be identical`);
		t.deepEqual(config.homepage, pkg.homepage, `Homepage must be identical`);
		t.deepEqual(config.keywords, pkg.keywords, `Keywords must be identical`);
		t.deepEqual(config.repository, pkg.repository, `Repository must be identical`);
		t.deepEqual(config.bugs, pkg.bugs, `Bugs must be identical`);
		t.deepEqual(config.main, pkg.browser, `Main/Browser must be identical`);

	});
};






class NpmPackage {

	//-- Get all packages path in a multi-packages project
	get multiPackagesPaths() {
		return globAll.sync(['packages/*/'], { realpath:true });
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
				if ((/--verbose/u).test(options.pkg.scripts.test)) {
					console.log(`\n  ----|  DON'T FORGET TO REMOVE THE --verbose FLAG  |----`);  // eslint-disable-line no-console
				}
			});
		}
	}


	//-- Validate a multi-packages project
	validateMulti({ cwd = process.cwd(), group = 'MAIN', js = patterns.js, json = patterns.json, yaml = patterns.yaml, bash = patterns.bash, editorconfig = patterns.editorconfig, scss } = {}) {
		const packagesPath = 'packages';

		const options = getOptions({
			group:  group,
			cwd:    cwd,
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
					t.regex(options.pkg.name, /^([a-z][a-z0-9]+)(-[a-z0-9]+)*$/u, `Name must be valid`);  // eslint-disable-line unicorn/no-unsafe-regex

					// Private
					t.true(Object.keys(options.pkg).includes('private'), `Private must be defined`);
					t.is(options.pkg.private, true, `Private must be true`);

					// Test
					if (Object.keys(options.pkg).includes('scripts')) {
						t.true(Object.keys(options.pkg.scripts).includes('test'), `Scripts must contain test`);
						t.truthy(options.pkg.scripts.test, `Scripts > Test must not be empty`);
					} else {
						t.fail(`Scripts must be defined`);
					}

					// lerna
					if (Object.keys(options.pkg).includes('devDependencies')) {
						t.true(Object.keys(options.pkg.devDependencies).includes('lerna'), `devDependencies must contain lerna`);
					} else {
						t.fail(`devDependencies must be defined`);
					}

					t.false(Object.keys(options.pkg).includes('version'), `Version must not be defined`);
					t.false(Object.keys(options.pkg).includes('author'), 'Author must not be defined');
					t.false(Object.keys(options.pkg).includes('dependencies'), `Dependencies must not be defined`);
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
			t.true(hasRules || hasParserOptions, 'Does not contain rules or parser options');
		});


		// Extra validation on package.json
		test(util.formatTitle(`ESLintConfig: Check that '${options.readablePath}/package.json' is valid`, group), (t) => {

			t.regex(options.pkg.name, /^@absolunet\/eslint-config-([a-z][a-z0-9]*)(-[a-z0-9]+)*$/u, `Name must be valid`);  // eslint-disable-line unicorn/no-unsafe-regex

			if (Array.isArray(options.pkg.keywords)) {
				['eslint', 'eslintconfig', 'eslint-config'].forEach((keywords) => {
					t.true(options.pkg.keywords.includes(keywords), `Keywords must contain '${keywords}'`);
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

			t.regex(options.pkg.name, /^@absolunet\/stylelint-config-([a-z][a-z0-9]*)(-[a-z0-9]+)*$/u, `Name must be valid`);  // eslint-disable-line unicorn/no-unsafe-regex

			if (Array.isArray(options.pkg.keywords)) {
				['stylelint', 'stylelintconfig', 'stylelint-config'].forEach((keywords) => {
					t.true(options.pkg.keywords.includes(keywords), `Keywords must contain '${keywords}'`);
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
			`!node_modules/**/*.js`,
			`!bower_components/**/*.js`,
			`!vendor/*.js`,
			`!dist/*.js`
		];

		options.editorconfig = patterns.editorconfig.concat([
			`!bower_components/**/*.js`,
			`!vendor/*.js`,
			`!dist/*.js`
		]);



		// Package validation
		this.validate(options);

		// Structure
		testExists('dist', options);
		testExists('src', options);
		testExists('src/lib', options);
		testExists('src/wrapper', options);
		testExists('src/index.js', options);
		testExists('webpack.config.js', options);

		testExists('src/.eslintrc.yaml', options);
		testMatrix('src/.eslintrc.yaml', options);

		testExists('.eslintignore', options);
		testContainsMatrix('.eslintignore', options);

		testExists('bower.json', options);
		testBowerJson('bower.json', options);


		// Extra validation on package.json
		test(util.formatTitle(`Library: Check that '${options.readablePath}/package.json' is valid`, group), (t) => {
			t.truthy(options.pkg.browser, `Browser must be defined`);

			if (Object.keys(options.pkg).includes('scripts')) {
				t.true(Object.keys(options.pkg.scripts).includes('build'), `Scripts must contain build`);
				t.deepEqual(options.pkg.scripts.build, 'node node_modules/@absolunet/library-builder/bin/build.js', `Build script is not valid`);
			} else {
				t.fail(`Scripts must be defined`);
			}

			if (Object.keys(options.pkg).includes('devDependencies')) {
				t.true(Object.keys(options.pkg.devDependencies).includes('@absolunet/library-builder'), `devDependencies must contain @absolunet/library-builder`);
			} else {
				t.fail(`devDependencies must be defined`);
			}

		});
	}

}


module.exports = new NpmPackage();
