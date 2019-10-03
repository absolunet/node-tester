//--------------------------------------------------------
//-- Repository - Arborescence tests
//--------------------------------------------------------
import arborescence from '../../helpers/arborescence';
import env          from '../../helpers/environment';


export default () => {

	//-- Single and multi package
	arborescence.validate();


	//-- Multi package
	if (env.repositoryType === env.REPOSITORY_TYPE.multiPackage) {

		//-- For every package
		Object.values(env.projectSubpackages).forEach((subpackageRoot) => {
			arborescence.validate({ root: subpackageRoot, subpackage: true });
		});
	}

};
