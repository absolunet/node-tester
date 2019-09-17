//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
import env    from '../helpers/environment';
import runner from '../helpers/runner';


const runners = [];
const { repositoryType, packageType, scope, customization } = JSON.parse(process.env[env.JEST_CLI_KEY]);  // eslint-disable-line no-process-env
runner.config.globals = { repositoryType, packageType, customization };


const STANDARD = [
	runner.config.lintJS,
	runner.config.lintJSON,
	runner.config.lintYAML,
	runner.config.lintBash,
	runner.config.lintSCSS,
	runner.config.lintFileStyles,
	runner.config.validateRepository,
	runner.config.projectStandardTests
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

	case 'all':
		runners.push(...STANDARD, ...UNIT, ...FEATURE, ...INTEGRATION, ...ENDTOEND);
		break;

	case 'standard':
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...STANDARD);
		}
		break;

	case 'unit':
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...UNIT);
		}
		break;

	case 'feature':
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...FEATURE);
		}
		break;

	case 'integration':
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...INTEGRATION);
		}
		break;

	case 'endtoend':
		if (packageType !== env.PACKAGE_TYPE.ioc) {
			runners.push(...ENDTOEND);
		}
		break;

	default:
		throw new Error('No scope defined');

}


export { runners as projects };
