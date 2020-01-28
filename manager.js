//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const nodejsLatest = require('nodejs-latest');
const semver       = require('semver');
const fss          = require('@absolunet/fss');
const { manager }  = require('@absolunet/manager');
const paths        = require('./dist/node/helpers/paths');


const getPipelineStep = (name, version) => {
	return {
		step: {
			name:   `Test ${name} Node.js version`,
			image:  `node:${version}`,
			caches: ['node'],
			script: ['npm install', 'npm test']
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
			postRun: async ({ terminal }) => {
				terminal.print(`Update Node version in package.json / .travis.yml / bitbucket-pipelines.yml`).spacer();

				const latest              = await nodejsLatest.latest();
				const latestMajor         = semver.major(latest.version);
				const currentStableMajor  = latestMajor - (latestMajor % 2 === 0 ? 0 : 1);
				const previousStableMajor = latestMajor ===	currentStableMajor ? currentStableMajor - 2 : currentStableMajor;


				//-- package.json
				const packageFile = `${paths.root}/package.json`;
				const packageData = fss.readJson(packageFile);
				packageData.engines.node = `>= ${currentStableMajor}`;
				fss.writeJson(packageFile, packageData, { space: 2 });


				//-- .travis.yml
				const travisFile = `${paths.root}/.travis.yml`;
				const travisData = fss.readYaml(travisFile);
				travisData.node_js = ['node', currentStableMajor];  // eslint-disable-line camelcase

				if (previousStableMajor !== currentStableMajor) {
					travisData.node_js.push(previousStableMajor);
				}

				fss.writeYaml(travisFile, travisData);


				//-- bitbucket-pipelines.yml
				const pipelinesFile = `${paths.root}/bitbucket-pipelines.yml`;
				const pipelinesData = fss.readYaml(pipelinesFile);
				pipelinesData.pipelines.default[0].parallel = [getPipelineStep('latest', 'latest'), getPipelineStep('latest stable', currentStableMajor)];

				if (previousStableMajor !== currentStableMajor) {
					pipelinesData.pipelines.default[0].parallel.push(getPipelineStep('latest stable', previousStableMajor));
				}

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
