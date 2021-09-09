//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
import fss         from '@absolunet/fss';
import environment from '../helpers/environment.js';
import runner      from '../helpers/runner/index.js';


const runners = [];
const { repositoryType, packageType, nodeType, scope, customization } = JSON.parse(process.env[environment.JEST_CLI_KEY]);  // eslint-disable-line node/no-process-env
runner.config.globals = { repositoryType, packageType, nodeType, customization };


const STANDARDS = [
	runner.config.lintJS,
	runner.config.lintJSON,
	runner.config.lintYAML,
	runner.config.lintBash,
	runner.config.lintSCSS,
	runner.config.lintFileStyles(repositoryType),
	runner.config.genericTests,
	runner.config.projectStandardsTests
];

const UNIT = [
	runner.config.projectUnitTests
];

const FEATURE = [
	runner.config.projectFeatureTests
];

const INTEGRATION = [
	runner.config.projectIntegrationTests
];

const ENDTOEND = [
	runner.config.projectEndtoendTests
];


const addRunners = (...configs) => {
	runners.push(configs.filter(({ rootDir }) => {
		return fss.existsCase(rootDir);
	}));
};






//-- Scope
switch (scope) {

	case environment.TEST_ALL:
		addRunners(...STANDARDS, ...UNIT, ...FEATURE, ...INTEGRATION, ...ENDTOEND);
		break;

	case environment.TEST_TYPE.standards:
		addRunners(...STANDARDS);
		break;

	case environment.TEST_TYPE.unit:
		if (packageType !== environment.PACKAGE_TYPE.ioc) {
			addRunners(...UNIT);
		}
		break;

	case environment.TEST_TYPE.feature:
		if (packageType !== environment.PACKAGE_TYPE.ioc) {
			addRunners(...FEATURE);
		}
		break;

	case environment.TEST_TYPE.integration:
		if (packageType !== environment.PACKAGE_TYPE.ioc) {
			addRunners(...INTEGRATION);
		}
		break;

	case environment.TEST_TYPE.endtoend:
		if (packageType !== environment.PACKAGE_TYPE.ioc) {
			addRunners(...ENDTOEND);
		}
		break;

	default:
		throw new Error('No scope defined');

}


export default { projects: runners };
