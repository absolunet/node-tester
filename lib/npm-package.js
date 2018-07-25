//--------------------------------------------------------
//-- npm package
//--------------------------------------------------------
'use strict';

const ava      = require('ava');
const fs       = require('fs');
const readJson = require('read-package-json');
const linters  = require('./linters');
const patterns = require('./patterns');


const parseConf = (filename) => {
	return fs.readFileSync(filename, 'utf8').split(`\n`).filter(Boolean);
};


const matrix = (filename, scope) => {
	const root       = `${__dirname}/..`;
	const cleaned    = filename.replace(/^(([\w-./])+\/)?\.([\w-./]+)/, `$1$3`);  // eslint-disable-line unicorn/no-unsafe-regex
	const rootPath   = `${root}/${filename}`;
	const matrixPath = `${root}/matrix/${cleaned}`;
	const scopePath  = `${root}/matrix/${scope}/${cleaned}`;

	if (fs.existsSync(scopePath)) {
		return fs.realpathSync(scopePath);
	} else if (fs.existsSync(matrixPath)) {
		return fs.realpathSync(matrixPath);
	}

	return fs.realpathSync(rootPath);
};


const configJsonTests = (config, t) => {
	t.truthy(config.description, `Description must not be empty`);
	t.regex(config.homepage, /^https:\/\/(github.com\/absolunet\/|absolunet.github.io\/).+/, `Homepage is not valid`);
	t.deepEqual(config.license, 'MIT', `License is not valid`);

	if (Object.keys(config).includes('repository')) {
		t.is(config.repository.type, 'git', `Repository type is not valid`);
		t.regex(config.repository.url, /git:\/\/github.com\/absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*\.git/, `Repository url is not valid`);  // eslint-disable-line unicorn/no-unsafe-regex
	} else {
		t.fail(`Repository must be defined`);
	}

	if (Object.keys(config).includes('bugs')) {
		t.false(Object.keys(config.bugs).includes('email'), `Bugs must not contain email`);
		t.regex(config.bugs.url, /https:\/\/github.com\/absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*\/issues/, `Bugs url is not valid`);  // eslint-disable-line unicorn/no-unsafe-regex
	} else {
		t.fail(`Bugs must be defined`);
	}

	t.truthy(config.main, `Main must be defined`);
	t.true(Array.isArray(config.keywords), `Keywords must be defined`);
};






let CWD;
let PACKAGE;


const testExists = (filename) => {
	ava.test(`Check that '${filename}' exists`, (t) => {
		t.true(fs.existsSync(`${CWD}/${filename}`), `Must exists`);
	});
};


const testMatrix = (filename, scope) => {
	ava.test(`Check that '${filename}' is identical to matrix`, (t) => {
		t.is(fs.readFileSync(`${CWD}/${filename}`, 'utf8'), fs.readFileSync(matrix(filename, scope), 'utf8'), `Must be identical to matrix`);
	});
};


const testContainsMatrix = (filename, scope) => {
	ava.test(`Check that '${filename}' contains at least matrix`, (t) => {
		const entries = parseConf(`${CWD}/${filename}`);
		parseConf(matrix(filename, scope)).forEach((entry) => {
			t.true(entries.includes(entry), `Must contain '${entry}'`);
		});
	});
};


const testPackageJson = (filename) => {
	ava.test.cb(`Check that '${filename}' is valid and contains minimum information`, (t) => {

		// Parse via npm's parser
		readJson(`${CWD}/${filename}`, readJson.log, true, (error, config) => {

			// If valid
			if (!error) {

				// Verify parsed config is identical to raw config
				Object.keys(PACKAGE).forEach((key) => {
					t.deepEqual(config[key], PACKAGE[key], `Parsed config must be identical to raw config for '${key}'`);
				});

				// Validate fields
				configJsonTests(PACKAGE, t);

				t.regex(PACKAGE.name, /^@absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*$/, `Name must be valid`);  // eslint-disable-line unicorn/no-unsafe-regex
				t.truthy(PACKAGE.version, `Version must not be empty`);
				t.deepEqual(PACKAGE.author, { name:'Absolunet', url:'https://absolunet.com' }, `Author is not valid`);

				if (Object.keys(PACKAGE).includes('engines')) {
					t.true(Object.keys(PACKAGE.engines).includes('node'), `Engines must contain node`);
					t.truthy(PACKAGE.engines.node, `Engines > Node must not be empty`);
				} else {
					t.fail(`Engines must be defined`);
				}

				if (Object.keys(PACKAGE).includes('scripts')) {
					t.true(Object.keys(PACKAGE.scripts).includes('test'), `Scripts must contain test`);
					t.truthy(PACKAGE.scripts.test, `Scripts > Test must not be empty`);
				} else {
					t.fail(`Scripts must be defined`);
				}

				t.false(Object.keys(PACKAGE).includes('files'), `Files must not be defined`);
				t.false(Object.keys(PACKAGE).includes('config'), `Config must not be defined`);

			} else {
				t.fail(`${filename} is not valid (${error})`);
			}

			t.end();
		});
	});
};


const testBowerJson = (filename) => {
	const config = require(`${CWD}/${filename}`);  // eslint-disable-line global-require

	ava.test(`Check that '${filename}' is valid and contains minimum information`, (t) => {

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
		t.false(Object.keys(config).includes('private'), `Private must not be defined`);

		// Sync with package.json
		t.deepEqual(`@absolunet/${config.name}`, PACKAGE.name, `Name must be identical to package.json`);

	});


	ava.test(`Check that '${filename}' is in sync with 'package.json'`, (t) => {

		t.deepEqual(`@absolunet/${config.name}`, PACKAGE.name, `Name must be identical`);
		t.deepEqual(config.description, PACKAGE.description, `Description must be identical`);
		t.deepEqual(config.homepage, PACKAGE.homepage, `Homepage must be identical`);
		t.deepEqual(config.keywords, PACKAGE.keywords, `Keywords must be identical`);
		t.deepEqual(config.repository, PACKAGE.repository, `Repository must be identical`);
		t.deepEqual(config.bugs, PACKAGE.bugs, `Bugs must be identical`);
		t.deepEqual(config.main, PACKAGE.browser, `Main/Browser must be identical`);

	});
};






class NpmPackage {

	//-- Validate
	validate({ cwd = process.cwd(), scope, js, json, yaml, bash, editorconfig } = {}) {
		const selfTest = fs.realpathSync(cwd) === fs.realpathSync(`${__dirname}/..`);

		CWD     = cwd;
		PACKAGE = require(`${CWD}/package`);  // eslint-disable-line global-require

		// Linters
		linters.js(js);
		linters.json(json);
		linters.yaml(yaml);
		linters.bash(bash);
		linters.editorconfig(editorconfig);


		// Tests
		testExists('.editorconfig');

		testExists('.eslintrc.yaml');
		testMatrix('.eslintrc.yaml', scope);

		testExists('.gitignore');
		testContainsMatrix('.gitignore', scope);

		testExists('.npmignore');
		if (!selfTest) {
			testContainsMatrix('.npmignore', scope);
		}

		testExists('.travis.yml');
		testMatrix('.travis.yml', scope);

		testExists('license');
		testMatrix('license', scope);

		testExists('package.json');
		testPackageJson('package.json');

		testExists('readme.md');

		testExists('test/index.js');


		// --verbose warning
		ava.test.after('Check for verbose', () => {
			if ((/--verbose/).test(PACKAGE.scripts.test)) {
				console.log(`\n  ----|  DON'T FORGET TO REMOVE THE --verbose FLAG  |----`);  // eslint-disable-line no-console
			}
		});
	}


	//-- Validate ESLint config package
	validateEslintConfig({ cwd = process.cwd() } = {}) {
		this.validate({
			scope: 'eslintconfig',
			cwd:   cwd
		});

		// Validate config
		ava.test('ESLintConfig: Check that config is valid', (t) => {
			const data = require(CWD);  // eslint-disable-line global-require
			t.deepEqual(typeof data, 'object', 'YAML is not parsable');

			const hasRules         = typeof data.rules === 'object';
			const hasParserOptions = typeof data.parserOptions === 'object';
			t.true(hasRules || hasParserOptions, 'Does not contain rules or parser options');
		});


		// Extra validation on package.json
		ava.test('ESLintConfig: Check that package.json is valid', (t) => {

			t.regex(PACKAGE.name, /^@absolunet\/eslint-config-([a-z][a-z0-9]*)(-[a-z0-9]+)*$/, `Name must be valid`);  // eslint-disable-line unicorn/no-unsafe-regex

			if (Array.isArray(PACKAGE.keywords)) {
				['eslint', 'eslintconfig', 'eslint-config'].forEach((keywords) => {
					t.true(PACKAGE.keywords.includes(keywords), `Keywords must contain '${keywords}'`);
				});
			} else {
				t.fail(`Keywords must be defined`);
			}

		});
	}


	//-- Validate library package
	validateLibrary({ cwd = process.cwd() } = {}) {

		// Package validation
		this.validate({
			scope: 'library',
			cwd:    cwd,
			js: [
				`*.js`,
				`**/*.js`,
				`!node_modules/**/*.js`,
				`!bower_components/**/*.js`,
				`!vendor/*.js`,
				`!dist/*.js`
			],
			editorconfig: patterns.editorconfig.concat([
				`!bower_components/**/*.js`,
				`!vendor/*.js`,
				`!dist/*.js`
			])
		});


		// Structure
		testExists('dist');
		testExists('src');
		testExists('src/lib');
		testExists('src/wrapper');
		testExists('src/index.js');
		testExists('webpack.config.js');

		testExists('src/.eslintrc.yaml');
		testMatrix('src/.eslintrc.yaml', 'library');

		testExists('.eslintignore');
		testContainsMatrix('.eslintignore', 'library');

		testExists('bower.json');
		testBowerJson('bower.json');


		// Extra validation on package.json
		ava.test('Library: Check that package.json is valid', (t) => {
			t.truthy(PACKAGE.browser, `Browser must be defined`);

			if (Object.keys(PACKAGE).includes('scripts')) {
				t.true(Object.keys(PACKAGE.scripts).includes('build'), `Scripts must contain build`);
				t.deepEqual(PACKAGE.scripts.build, 'node node_modules/@absolunet/library-builder/bin/build.js', `Build script is not valid`);
			} else {
				t.fail(`Scripts must be defined`);
			}

			if (Object.keys(PACKAGE).includes('devDependencies')) {
				t.true(Object.keys(PACKAGE.devDependencies).includes('@absolunet/library-builder'), `devDependencies must contain @absolunet/library-builder`);
			} else {
				t.fail(`devDependencies must be defined`);
			}

		});
	}

}


module.exports = new NpmPackage();
