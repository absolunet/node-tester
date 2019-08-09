//--------------------------------------------------------
//-- Lint JS runner - Run
//--------------------------------------------------------
import eslint from '../../helpers/eslint';


export default ({ testPath }) => {
	return eslint.run(testPath);
};
