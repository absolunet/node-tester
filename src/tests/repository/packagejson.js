//--------------------------------------------------------
//-- Multi package - package.json tests
//--------------------------------------------------------
import env         from '../../helpers/environment';
import packagejson from '../../helpers/packagejson';


export default () => {

		//-- Single package
	if (env.repositoryType === env.REPOSITORY_TYPE.singlePackage) {

		packagejson.validatePackage();


	//-- Multi package
	} else if (env.repositoryType === env.REPOSITORY_TYPE.multiPackage) {

		packagejson.validateMulti();

		//-- For every package
		Object.values(env.projectSubpackages).forEach((subpackageRoot) => {
			packagejson.validatePackage({ directoryPath: subpackageRoot });
		});
	}

};
