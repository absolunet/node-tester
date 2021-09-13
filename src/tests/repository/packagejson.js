//--------------------------------------------------------
//-- Multi package - package.json tests
//--------------------------------------------------------
import environment from "../../helpers/environment.js";
import packagejson from "../../helpers/packagejson.js";

const packagejsonTests = () => {
	//-- Multi package
	if (environment.repositoryType === environment.REPOSITORY_TYPE.multiPackage) {
		packagejson.validateMulti();

		//-- Rest
	} else {
		packagejson.validatePackage();
	}
};

export default packagejsonTests;
