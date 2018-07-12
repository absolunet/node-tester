//--------------------------------------------------------
//-- Linters
//--------------------------------------------------------
/* eslint-disable class-methods-use-this */
'use strict';

const ava           = require('ava');
const { exec }      = require('child_process');
const { CLIEngine } = require('eslint');
const fs            = require('fs');
const globAll       = require('glob-all');
const replaceAll    = require('replaceall');
const yamlLint      = require('yaml-lint');
const patterns      = require('./patterns');






class Linters {

	//-- Lint via ESLint
	//-- ex: tester.lintJs([...tester.ALL_JS, '**!(vendor)/*.js']);
	js(paths = patterns.js, { cwd = process.cwd(), configFile, configPreset } = {}) {
		const cli = new CLIEngine({ configFile:configFile || configPreset || undefined });

		globAll.sync(paths, { nodir:true, cwd:cwd }).forEach((file) => {
			ava.test(`ESLint on ${file}`, (t) => {
				const report = cli.executeOnFiles([`${cwd}/${file}`]);

				if (report.errorCount > 0 || report.warningCount > 0) {
					const output = replaceAll(`${process.cwd()}/`, '', cli.getFormatter()(report.results));

					t.fail(output);

				} else {
					t.pass();
				}
			});
		});
	}


	//-- Lint via ESLint - JSON
	//-- ex: tester.lintJson([...tester.ALL_JSON, '**!(vendor)/*.json']);
	json(paths = patterns.json, { cwd = process.cwd() } = {}) {
		const cli = new CLIEngine({ plugins:['json'], extensions:['.json'], useEslintrc:false });

		globAll.sync(paths, { nodir:true, dot:true, cwd:cwd }).forEach((file) => {
			ava.test(`ESLint (JSON) on ${file}`, (t) => {
				const report = cli.executeOnFiles([`${cwd}/${file}`]);

				if (report.errorCount > 0 || report.warningCount > 0) {
					const output = replaceAll(`${process.cwd()}/`, '', cli.getFormatter()(report.results));

					t.fail(output);

				} else {
					t.pass();
				}
			});
		});
	}


	//-- Lint via YAML Lint
	//-- ex: tester.lintYaml([...tester.ALL_YAML, '**!(vendor)/*.yaml']);
	yaml(paths = patterns.yaml, { cwd = process.cwd() } = {}) {

		globAll.sync(paths, { nodir:true, dot:true, cwd:cwd }).forEach((file) => {
			ava.test(`YAML Lint on ${file}`, (t) => {
				return yamlLint.lintFile(`${cwd}/${file}`)
					.then(() => {
						t.pass();
					})
					.catch((e) => {
						t.fail(e);
					})
				;
			});
		});

	}


	//-- Lint via stylelint
	//-- ex: tester.lintScss([...tester.ALL_SCSS, '**!(vendor)/*.scss'], './.stylelintrc.yaml');
	scss(paths = patterns.scss, { cwd = process.cwd(), configFile, configPreset } = {}) {
		const stylelint = require('stylelint'); // eslint-disable-line global-require

		globAll.sync(paths, { nodir:true, cwd:cwd }).forEach((file) => {
			ava.test(`stylelint on ${file}`, (t) => {
				return stylelint.lint({
					files:      `${cwd}/${file}`,
					configFile: configFile,
					config:     configPreset ? { 'extends':configPreset } : undefined,
					syntax:     'scss',
					formatter:  'string'
				})
					.then((data) => {
						const [results] = data.results;

						if (results.warnings.length || results.deprecations.length || results.invalidOptionWarnings.length) {

							t.fail(data.output);

						} else {
							t.pass();
						}
					})
					.catch((err) => {
						t.fail(err.stack);
					})
				;
			});
		});
	}


	//-- Lint via 'bash -n'
	//-- ex: tester.lintBash([...tester.ALL_BASH, '**bin/*']);
	bash(paths = patterns.bash, { cwd = process.cwd() } = {}) {

		globAll.sync(paths, { nodir:true, cwd:cwd }).forEach((file) => {
			ava.test(`Bash syntax check on ${file}`, (t) => {
				return new Promise((resolve) => {
					exec(`bash -n ${fs.realpathSync(`./${file}`)}`, {}, (err/* , stdout, stderr */) => {
						resolve(err);
					});
				}).then((err) => {
					if (err) {

						t.fail(err);

					} else {
						t.pass();
					}
				});
			});
		});
	}

}


module.exports = new Linters();
