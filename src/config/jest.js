//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
import env    from '../helpers/environment';
import runner from '../helpers/runner';


const runners = [];
const { repositoryType, packageType, scope, customization } = JSON.parse(process.env[env.JEST_CLI_KEY]);  // eslint-disable-line no-process-env
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

	case env.TEST_ALL:
		runners.push(...STANDARDS, ...UNIT, ...FEATURE, ...INTEGRATION, ...ENDTOEND);
		break;

	case env.TEST_TYPE.standards:
		runners.push(...STANDARDS);
		break;

	case env.TEST_TYPE.unit:
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...UNIT);
		}
		break;

	case env.TEST_TYPE.feature:
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...FEATURE);
		}
		break;

	case env.TEST_TYPE.integration:
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...INTEGRATION);
		}
		break;

	case env.TEST_TYPE.endtoend:
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...ENDTOEND);
		}
		break;

	default:
		throw new Error('No scope defined');

}


export { runners as projects };
