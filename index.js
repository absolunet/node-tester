//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
'use strict';

const { CLIEngine } = require('eslint');
const { exec }      = require('child_process');
const fs            = require('fs');
const globAll       = require('glob-all');
const replaceAll    = require('replaceall');
const ava           = require('ava');

/* eslint-env mocha */
module.exports = class {

	//-- All js files
	static get ALL_JS() {
		return  ['**!(node_modules)/*.js', '*.js'];
	}

	//-- All bash files
	static get ALL_BASH() {
		return  ['**!(node_modules)/*.sh', '*.sh'];
	}


	//-- Lint via ESLint
	//-- ex: tester.lintJs([...tester.ALLJS, '**!(vendor)/*.js']);
	static lintJs(patterns = this.ALL_JS) {
		const cli = new CLIEngine({});

		globAll.sync(patterns, { nodir:true }).forEach((file) => {
			ava.test(`ESLint on ${file}`, (t) => {
				const report = cli.executeOnFiles([file]);

				if (report.errorCount > 0 || report.warningCount > 0) {
					const output = replaceAll(`${process.cwd()}/`, '', cli.getFormatter()(report.results));

					t.fail(output);

				} else {
					t.pass();
				}
			});
		});
	}


	//-- Lint via 'bash -n'
	//-- ex: tester.lintBash([...tester.ALL_BASH, '**bin/*']);
	static lintBash(patterns = this.ALL_BASH) {

		globAll.sync(patterns, { nodir:true }).forEach((file) => {
			ava.test(`Bash syntax check on ${file}`, (t) => {
				exec(`bash -n ${fs.realpathSync(`./${file}`)}`, {}, (err/* , stdout, stderr */) => {
					if (err) {

						t.fail(err);

					} else {
						t.pass();
					}
				});
			});
		});
	}

};
