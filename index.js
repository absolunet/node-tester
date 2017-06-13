//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
'use strict';

const { CLIEngine } = require('eslint');
const { exec }      = require('child_process');
const fs            = require('fs');
const globAll       = require('glob-all');
const indentString  = require('indent-string');
const replaceAll    = require('replaceall');

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
		/* eslint-disable prefer-arrow-callback */
		const cli = new CLIEngine({});

		describe('eslint', function() {
			globAll.sync(patterns, { nodir:true }).forEach((file) => {
				it(`should have no errors in ${file}`, function(done) {
					const report    = cli.executeOnFiles([file]);
					const formatter = cli.getFormatter();

					if (report) {
						if (report.errorCount > 0 || report.warningCount > 0) {
							done(new Error(indentString(`\n${replaceAll(`${process.cwd()}/`, '', formatter(report.results))}`, 6)));
						} else {
							done();
						}
					}
				});
			});
		});

		/* eslint-enable prefer-arrow-callback */
	}

	//-- Lint via 'bash -n'
	//-- ex: tester.lintBash([...tester.ALL_BASH, '**bin/*']);
	static lintBash(patterns = this.ALL_BASH) {
		/* eslint-disable prefer-arrow-callback */

		describe('bash', function() {
			globAll.sync(patterns, { nodir:true }).forEach((file) => {
				it(`should have no errors in ${file}`, function(done) {
					exec(`bash -n ${fs.realpathSync(`./${file}`)}`, {}, function(err/* , stdout, stderr */) {
						done(err);
					});
				});
			});
		});

		/* eslint-enable prefer-arrow-callback */
	}

};
