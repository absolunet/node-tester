//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
import environment from '../helpers/environment';
import runner      from '../helpers/runner';


const runners = [];
const { repositoryType, packageType, scope, customization } = JSON.parse(process.env[environment.JEST_CLI_KEY]);  // eslint-disable-line node/no-process-env
runner.config.globals = { repositoryType, packageType, customization };


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






//-- Scope
switch (scope) {

	case environment.TEST_ALL:
		runners.push(...STANDARDS, ...UNIT, ...FEATURE, ...INTEGRATION, ...ENDTOEND);
		break;

	case environment.TEST_TYPE.standards:
		runners.push(...STANDARDS);
		break;

	case environment.TEST_TYPE.unit:
		if (packageType !== environment.PACKAGE_TYPE.ioc) {
			runners.push(...UNIT);
		}
		break;

	case environment.TEST_TYPE.feature:
		if (packageType !== environment.PACKAGE_TYPE.ioc) {
			runners.push(...FEATURE);
		}
		break;

	case environment.TEST_TYPE.integration:
		if (packageType !== environment.PACKAGE_TYPE.ioc) {
			runners.push(...INTEGRATION);
		}
		break;

	case environment.TEST_TYPE.endtoend:
		if (packageType !== environment.PACKAGE_TYPE.ioc) {
			runners.push(...ENDTOEND);
		}
		break;

	default:
		throw new Error('No scope defined');

}


export { runners as projects };
