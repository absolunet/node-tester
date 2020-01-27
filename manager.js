//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const nodejsLatest = require('nodejs-latest');
const semver       = require('semver');
const fss          = require('@absolunet/fss');
const { manager }  = require('@absolunet/manager');
const paths        = require('./dist/node/helpers/paths');


manager.init({
	repositoryType: 'single-package',
	dist: {
		node: true
	},
	tasks: {
		prepare: {
			postRun: async ({ terminal }) => {
				terminal.print(`Update Node version in package.json / .travis.yml / bitbucket-pipelines.yml`).spacer();

				const latest = await nodejsLatest.latest();
				const { version } = semver.coerce(semver.major(latest.version));

				const packageFile = `${paths.root}/package.json`;
				const packageData = fss.readJson(packageFile);
				packageData.engines.node = `>= ${version}`;
				fss.writeJson(packageFile, packageData, { space: 2 });

				const travisFile = `${paths.root}/.travis.yml`;
				const travisData = fss.readYaml(travisFile);
				travisData.node_js[1] = version;
				fss.writeYaml(travisFile, travisData);

				const pipelinesFile = `${paths.root}/bitbucket-pipelines.yml`;
				const pipelinesData = fss.readYaml(pipelinesFile);
				pipelinesData.pipelines.default[0].parallel[1].step.image = `node:${version}`;
				fss.writeYaml(pipelinesFile, pipelinesData);



				terminal.print(`Update year in license`).spacer();
				const licenseFile = `${paths.root}/license`;
				let licenseData = fss.readFile(licenseFile, 'utf8');
				licenseData = licenseData.replace(/Copyright \(c\) 2011-\d{4}/u, `Copyright (c) 2011-${new Date().getFullYear()}`);
				fss.writeFile(licenseFile, licenseData);
			}
		}
	}
});
