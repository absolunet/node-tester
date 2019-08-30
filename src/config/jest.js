//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
import env    from '../helpers/environment';
import runner from '../helpers/runner';


const STANDARD = [
	runner.config.lintJS,
	runner.config.lintJSON,
	runner.config.lintYAML,
	runner.config.lintBash,
	runner.config.lintSCSS,
	runner.config.lintFileStyles
];

const FEATURE = [
	runner.config.projectFeatureTests
];

const UNIT = [
	runner.config.projectUnitTests
];






const runners = [];
const { repositoryType, packageType, scope } = JSON.parse(process.env[env.jestConfigVariable]);  // eslint-disable-line no-process-env


//-- Repository type
switch (repositoryType) {

	case 'single-package':
		STANDARD.push(...[
			runner.config.validateSinglePackage
		]);
		break;

	default:
		throw new Error('No repositoryType defined');

}


//-- Package type
switch (packageType) {

	case 'common':
		break;

	default:
		throw new Error('No packageType defined');

}


//-- Scope
switch (scope) {

	case 'all':
		runners.push(...STANDARD, ...FEATURE, ...UNIT);
		break;

	case 'standard':
		runners.push(...STANDARD);
		break;

	case 'feature':
		runners.push(...FEATURE);
		break;

	case 'unit':
		runners.push(...UNIT);
		break;

	default:
		throw new Error('No scope defined');

}


export { runners as projects };
