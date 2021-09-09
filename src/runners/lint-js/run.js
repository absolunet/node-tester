//--------------------------------------------------------
//-- Lint JS runner - Run
//--------------------------------------------------------
import eslint from '../../helpers/eslint.js';


export default ({ testPath }) => {
	return eslint.run(testPath);
};
