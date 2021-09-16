//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
import { createRequire } from "node:module";
import fss from "@absolunet/fss";
import { manager } from "@absolunet/manager"; // eslint-disable-line import/no-unresolved
import ltsSchedule from "lts-schedule";

const getPipelineStep = (name, version) => {
	return {
		step: {
			name: `Test ${name} Node.js version`,
			image: `node:${version}`,
			caches: ["node"],
			script: ["npm ci --unsafe-perm", "npm run manager:build", "npm test"],
		},
	};
};

manager.init({
	repositoryType: "single-package",
	dist: {
		node: true,
	},
	tasks: {
		prepare: {
			postRun: ({ terminal }) => {
				terminal
					.print(`Update Node version in package.json / bitbucket-pipelines.yml / .github/workflows/tests.yaml`)
					.spacer();

				const require = createRequire(import.meta.url);
				const environment = require("./dist/node/helpers/environment.js").default;
				const paths = require("./dist/node/helpers/paths.js").default;
				const today = Date.now();

				const lts = Object.entries(ltsSchedule.json)
					.filter(([, { lts: start, end }]) => {
						return today >= new Date(start) && today <= new Date(end);
					})
					.map(([version]) => {
						return Number(version.slice(1));
					})
					.sort()
					.reverse();
				//-- package.json
				const packageFile = `${paths.root}/package.json`;
				const packageData = fss.readJson(packageFile);
				packageData.engines.node = `>= ${environment.LTS_VERSIONS[lts[lts.length - 1]]}`;
				fss.writeJson(packageFile, packageData, { space: 2 });

				//-- .github/workflows/tests.yaml
				const githubActionsFile = `${paths.root}/.github/workflows/tests.yaml`;
				const githubActionsData = fss.readYaml(githubActionsFile);
				githubActionsData.jobs.build.strategy.matrix.node_version = [...lts]; // eslint-disable-line camelcase
				fss.writeYaml(githubActionsFile, githubActionsData);

				//-- bitbucket-pipelines.yml
				const pipelinesFile = `${paths.root}/bitbucket-pipelines.yml`;
				const pipelinesData = fss.readYaml(pipelinesFile);
				pipelinesData.pipelines.default[0].parallel = [
					getPipelineStep("latest", "latest"),
					...lts.map((version) => {
						return getPipelineStep(`LTS ${version}`, version);
					}),
				];

				fss.writeYaml(pipelinesFile, pipelinesData);

				//-- LICENSE
				terminal.print(`Update year in LICENSE`).spacer();
				const licenseFile = `${paths.root}/LICENSE`;
				let licenseData = fss.readFile(licenseFile, "utf8");
				licenseData = licenseData.replace(
					/Copyright \(c\) 2011-\d{4}/u,
					`Copyright (c) 2011-${new Date().getFullYear()}`
				);
				fss.writeFile(licenseFile, licenseData);
			},
		},
	},
});
