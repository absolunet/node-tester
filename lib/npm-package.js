//--------------------------------------------------------
//-- npm package
//--------------------------------------------------------
'use strict';

const ava      = require('ava');
const fs       = require('fs');
const readJson = require('read-package-json');
const linters  = require('./linters');


const parseConf = (filename) => {
	return fs.readFileSync(filename, 'utf8').split(`\n`).filter(Boolean);
};






let CWD;
let PACKAGE;
const MATRIX = fs.realpathSync(`${__dirname}/..`);


const testExists = (filename) => {
	ava.test(`Check that '${filename}' exists`, (t) => {
		t.true(fs.existsSync(`${CWD}/${filename}`), `Must exists`);
	});
};


const testMatrix = (filename) => {
	ava.test(`Check that '${filename}' is identical to matrix`, (t) => {
		t.is(fs.readFileSync(`${CWD}/${filename}`, 'utf8'), fs.readFileSync(`${MATRIX}/${filename}`, 'utf8'), `Must be identical to matrix`);
	});
};


const testContainsMatrix = (filename) => {
	ava.test(`Check that '${filename}' contains at least matrix`, (t) => {
		const entries = parseConf(`${CWD}/${filename}`);
		parseConf(`${MATRIX}/${filename}`).forEach((entry) => {
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
				t.regex(PACKAGE.name, /^@absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*$/, `Name must be valid`);  // eslint-disable-line unicorn/no-unsafe-regex
				t.truthy(PACKAGE.version, `Version must not be empty`);
				t.truthy(PACKAGE.description, `Description must not be empty`);
				t.regex(PACKAGE.homepage, /^https:\/\/(github.com\/absolunet\/|absolunet.github.io\/).+/, `Homepage is not valid`);
				t.deepEqual(PACKAGE.author, { name:'Absolunet', url:'https://absolunet.com' }, `Author is not valid`);
				t.deepEqual(PACKAGE.license, 'MIT', `License is not valid`);

				if (Object.keys(PACKAGE).includes('repository')) {
					t.is(PACKAGE.repository.type, 'git', `Repository type is not valid`);
					t.regex(PACKAGE.repository.url, /git:\/\/github.com\/absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*\.git/, `Repository url is not valid`);  // eslint-disable-line unicorn/no-unsafe-regex
				} else {
					t.fail(`Repository must be defined`);
				}

				if (Object.keys(PACKAGE).includes('bugs')) {
					t.false(Object.keys(PACKAGE.bugs).includes('email'), `Bugs must not contain email`);
					t.regex(PACKAGE.bugs.url, /https:\/\/github.com\/absolunet\/([a-z][a-z0-9]*)(-[a-z0-9]+)*\/issues/, `Bugs url is not valid`);  // eslint-disable-line unicorn/no-unsafe-regex
				} else {
					t.fail(`Bugs must be defined`);
				}

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

				t.truthy(PACKAGE.main, `Main must be defined`);

				t.false(Object.keys(PACKAGE).includes('files'), `Files must not be defined`);
				t.false(Object.keys(PACKAGE).includes('config'), `Config must not be defined`);

			} else {
				t.fail(`${filename} is not valid (${error})`);
			}

			t.end();
		});
	});
};






class NpmPackage {

	//-- Validate
	validate({ cwd = process.cwd() } = {}) {
		CWD     = cwd;
		PACKAGE = require(`${CWD}/package`);  // eslint-disable-line global-require

		// Linters
		linters.js();
		linters.json();
		linters.yaml();
		linters.bash();
		linters.editorconfig();


		// Tests
		testExists('.editorconfig');

		testExists('.eslintrc.yaml');
		testMatrix('.eslintrc.yaml');

		testExists('.gitignore');
		testContainsMatrix('.gitignore');

		testExists('.npmignore');
		testContainsMatrix('.npmignore');

		testExists('.travis.yml');
		testMatrix('.travis.yml');

		testExists('license');
		testMatrix('license');

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

}


module.exports = new NpmPackage();
