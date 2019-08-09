//--------------------------------------------------------
//-- Jest config
//--------------------------------------------------------
import config from './helpers/config';
import runner from './helpers/runner';


const runners = [
	runner.config.lintJS,
	runner.config.lintJSON,
	runner.config.lintYAML,
	runner.config.lintBash,
	runner.config.lintSCSS,
	runner.config.lintFileStyles,
	runner.config.projectFeatureTests,
	runner.config.projectUnitTests
];


if (config.repositoryType === 'single-package') {

	runners.push(...[
		runner.config.validateSinglePackage
	]);

} else {
	throw new Error('No config found');
}


export { runners as projects };
