//--------------------------------------------------------
//-- Lint JSON runner - Run
//--------------------------------------------------------
import eslint from '../../helpers/eslint';

const JSON_CONFIG = require.resolve('@absolunet/eslint-config-json');


export default ({ testPath }) => {
	return eslint.run(testPath, {
		baseConfig:               { 'extends': JSON_CONFIG },
		resolvePluginsRelativeTo: JSON_CONFIG,
		extensions:               ['.json'],
		useEslintrc:              false
	});
};
