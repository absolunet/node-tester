//--------------------------------------------------------
//-- Project configuration helper
//--------------------------------------------------------
import fss from '@absolunet/fss';


const __ = {};

/**
 * xyz
 */
class Config {

	/**
	 * xyz
	 */
	constructor() {
		__.config = fss.readYaml('./test/config.yaml');
	}

	/**
	 * xyz
	 */
	get repositoryType() {
		return __.config.repositoryType;
	}

}

export default new Config();
