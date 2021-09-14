//--------------------------------------------------------
//-- Check Prettier runner - Run
//--------------------------------------------------------
import prettier from "../../helpers/prettier.js";

const checkPrettierRunner = ({ testPath }) => {
	return prettier.run(testPath);
};

export default checkPrettierRunner;
