//--------------------------------------------------------
//-- Multi package - package.json tests
//--------------------------------------------------------
import environment from '../../helpers/environment';
import packagejson from '../../helpers/packagejson';


export default () => {

	//-- Multi package
	if (environment.repositoryType === environment.REPOSITORY_TYPE.multiPackage) {
		packagejson.validateMulti();

	//-- Rest
	} else {
		packagejson.validatePackage();
	}

};
