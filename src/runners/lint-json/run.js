//--------------------------------------------------------
//-- Lint JSON runner - Run
//--------------------------------------------------------
import eslint from '../../helpers/eslint';


export default ({ testPath }) => {
	return eslint.run(testPath, {
		plugins: ['json'],
		extensions: ['.json'],
		useEslintrc: false
	});
};
