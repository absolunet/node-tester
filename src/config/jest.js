//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
import env    from '../helpers/environment';
import runner from '../helpers/runner';


/**
 * Types of repositories: 'single-package', 'multi-package'.
 *
 * @typedef {string} RepositoryType
 */
const REPOSITORY_TYPE = {
	singlePackage: 'single-package'
};


/**
 * Types of package: 'common'.
 *
 * @typedef {string} PackageType
 */
const PACKAGE_TYPE = {
	common: 'common'
};




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





/**
 * Options to customize the testing process.
 *
 * @typedef {object} TesterOptions
 * @property {RepositoryType} repositoryType - Type of repository.
 * @property {PackageType} packageType - Type of package.
 */
const runners = [];
const { repositoryType, packageType, scope } = JSON.parse(process.env[env.jestConfigVariable]);  // eslint-disable-line no-process-env


//-- Repository type
switch (repositoryType) {

	case REPOSITORY_TYPE.singlePackage:
		STANDARD.push(...[
			runner.config.validateSinglePackage
		]);
		break;

	default:
		throw new Error('No repositoryType defined');

}


//-- Package type
switch (packageType) {

	case PACKAGE_TYPE.common:
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
