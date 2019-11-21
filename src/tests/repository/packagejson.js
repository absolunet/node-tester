//--------------------------------------------------------
//-- Multi package - package.json tests
//--------------------------------------------------------
import env         from '../../helpers/environment';
import packagejson from '../../helpers/packagejson';


export default () => {

	//-- Multi package
	if (env.repositoryType === env.REPOSITORY_TYPE.multiPackage) {
		packagejson.validateMulti();

	//-- Rest
	} else {
		packagejson.validatePackage();
	}

};
