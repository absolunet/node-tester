//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
'use strict';

const fs       = require('fs');
const { exec } = require('child_process');
const eslint   = require('mocha-eslint');
const globAll  = require('glob-all');


/* eslint-env mocha */
module.exports = class Tester {

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
		eslint(patterns, { strict:true });
	}

	//-- Lint via 'bash -n'
	//-- ex: tester.lintBash([...tester.ALL_BASH, '**bin/*']);
	static lintBash(patterns = this.ALL_BASH) {
		/* eslint-disable prefer-arrow-callback */

		describe('bash', function() {
			globAll.sync(patterns).forEach((file) => {
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
