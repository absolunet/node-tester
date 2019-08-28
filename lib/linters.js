//--------------------------------------------------------
//-- Linters
//--------------------------------------------------------
'use strict';

const test          = require('ava');
const { exec }      = require('child_process');
const eclint        = require('eclint');
const { CLIEngine } = require('eslint');
const fs            = require('fs');
const globAll       = require('glob-all');
const reporter      = require('gulp-reporter');
const replaceAll    = require('replaceall');
const vfs           = require('vinyl-fs');
const yamlLint      = require('yaml-lint');

const patterns = require('./patterns');
const util     = require('./helpers/util');


class Linters {

	//-- Lint via ESLint
	//-- ex: tester.lintJs([...tester.all.js, '**!(vendor)/*.js']);
	js(paths = patterns.js, { cwd = process.cwd(), group, configFile, configPreset } = {}) {
		const cli = new CLIEngine({ configFile: configFile || configPreset || undefined });

		globAll.sync(paths, { nodir: true, cwd: cwd }).forEach((file) => {
			if (cli.isPathIgnored(file)) {
				return;
			}

			test(util.formatTitle(`ESLint on ${file}`, group), (t) => {
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
	//-- ex: tester.lintJson([...tester.all.json, '**!(vendor)/*.json']);
	json(paths = patterns.json, { cwd = process.cwd(), group } = {}) {
		const cli = new CLIEngine({ plugins: ['json'], extensions: ['.json'], useEslintrc: false });

		globAll.sync(paths, { nodir: true, dot: true, cwd: cwd }).forEach((file) => {
			test(util.formatTitle(`ESLint (JSON) on ${file}`, group), (t) => {
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
	//-- ex: tester.lintYaml([...tester.all.yaml, '**!(vendor)/*.yaml']);
	yaml(paths = patterns.yaml, { cwd = process.cwd(), group } = {}) {

		globAll.sync(paths, { nodir: true, dot: true, cwd: cwd }).forEach((file) => {
			test(util.formatTitle(`YAML Lint on ${file}`, group), (t) => {
				return yamlLint.lintFile(`${cwd}/${file}`)
					.then(() => {
						t.pass();
					})
					.catch((error) => {
						t.fail(error);
					})
				;
			});
		});

	}


	//-- Lint via stylelint
	//-- ex: tester.lintScss([...tester.all.scss, '**!(vendor)/*.scss'], './.stylelintrc.yaml');
	scss(paths = patterns.scss, { cwd = process.cwd(), group, configFile, configPreset } = {}) {
		const stylelint = require('stylelint'); // eslint-disable-line global-require

		globAll.sync(paths, { nodir: true, cwd: cwd }).forEach((file) => {
			test(util.formatTitle(`stylelint on ${file}`, group), (t) => {
				return stylelint.lint({
					files:      `${cwd}/${file}`,
					configFile: configFile,
					config:     configPreset ? { 'extends': configPreset } : undefined,
					syntax:     'scss',
					formatter:  'string'
				})
					.then((data) => {
						const [results] = data.results;

						if (results.warnings.length !== 0 || results.deprecations.length !== 0 || results.invalidOptionWarnings.length !== 0) {

							t.fail(data.output);

						} else {
							t.pass();
						}
					})
					.catch((error) => {
						t.fail(error.stack);
					})
				;
			});
		});
	}


	//-- Lint via 'bash -n'
	//-- ex: tester.lintBash([...tester.all.bash, '**bin/*']);
	bash(paths = patterns.bash, { cwd = process.cwd(), group } = {}) {

		globAll.sync(paths, { nodir: true, cwd: cwd }).forEach((file) => {
			test(util.formatTitle(`Bash syntax check on ${file}`, group), (t) => {
				return new Promise((resolve) => {
					exec(`bash -n ${fs.realpathSync(`${cwd}/${file}`)}`, {}, (error/* , stdout, stderr */) => {
						resolve(error);
					});
				}).then((error) => {
					if (error) {

						t.fail(error);

					} else {
						t.pass();
					}
				});
			});
		});
	}


	//-- Lint via ECLint
	//-- ex: tester.editorconfig([...tester.all.editorconfig, '**bin/*']);
	editorconfig(paths = patterns.editorconfig, { cwd = process.cwd(), group } = {}) {

		globAll.sync(paths, { nodir: true, cwd: cwd, dot: true }).forEach((file) => {
			test.cb(util.formatTitle(`EditorConfig check on ${file}`, group), (t) => {
				vfs.src(`${cwd}/${file}`)
					.pipe(eclint.check())
					.pipe(reporter({
						blame: false,
						fail: false,
						output: (output) => {
							t.fail(output);
							t.end();
						}
					}))
					.on('finish', () => {
						t.pass();
						t.end();
					})
				;
			});
		});
	}

}


module.exports = new Linters();
