//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const ltsSchedule  = require('lts-schedule');
const fss          = require('@absolunet/fss');
const { manager }  = require('@absolunet/manager');


const getPipelineStep = (name, version) => {
	return {
		step: {
			name:   `Test ${name} Node.js version`,
			image:  `node:${version}`,
			caches: ['node'],
			script: ['npm install-ci-test --unsafe-perm']
		}
	};
};


manager.init({
	repositoryType: 'single-package',
	dist: {
		node: true
	},
	tasks: {
		prepare: {
			postRun: ({ terminal }) => {
				terminal.print(`Update Node version in package.json / .travis.yml / bitbucket-pipelines.yml`).spacer();

				const paths = require('./dist/node/helpers/paths');  // eslint-disable-line node/global-require

				const lts = Object.keys(ltsSchedule.json).sort().reverse()
					.filter((version) => {
						return new Date(ltsSchedule.json[version].lts) <= Date.now() && new Date(ltsSchedule.json[version].end) >= Date.now();
					})
					.map((version) => {
						return Number(version.slice(1));
					})
				;

				//-- package.json
				const packageFile = `${paths.root}/package.json`;
				const packageData = fss.readJson(packageFile);
				packageData.engines.node = `>= ${lts[lts.length - 1]}`;
				fss.writeJson(packageFile, packageData, { space: 2 });


				//-- .travis.yml
				const travisFile = `${paths.root}/.travis.yml`;
				const travisData = fss.readYaml(travisFile);
				travisData.node_js = ['node', ...lts];  // eslint-disable-line camelcase
				fss.writeYaml(travisFile, travisData);


				//-- bitbucket-pipelines.yml
				const pipelinesFile = `${paths.root}/bitbucket-pipelines.yml`;
				const pipelinesData = fss.readYaml(pipelinesFile);
				pipelinesData.pipelines.default[0].parallel = [
					getPipelineStep('latest', 'latest'),
					...lts.map((version) => {
						return getPipelineStep(`LTS ${version}`, version);
					})
				];

				fss.writeYaml(pipelinesFile, pipelinesData);


				//-- license
				terminal.print(`Update year in license`).spacer();
				const licenseFile = `${paths.root}/license`;
				let licenseData = fss.readFile(licenseFile, 'utf8');
				licenseData = licenseData.replace(/Copyright \(c\) 2011-\d{4}/u, `Copyright (c) 2011-${new Date().getFullYear()}`);
				fss.writeFile(licenseFile, licenseData);
			}
		}
	}
});
