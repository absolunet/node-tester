//--------------------------------------------------------
//-- Lint JS runner - Run
//--------------------------------------------------------
import eslint from "../../helpers/eslint.js";

const lintJSRunner = ({ testPath }) => {
	return eslint.run(testPath);
};

export default lintJSRunner;
