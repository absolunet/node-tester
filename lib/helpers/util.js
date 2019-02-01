//--------------------------------------------------------
//-- Util
//--------------------------------------------------------
'use strict';


class Util {

	formatTitle(title, id) {
		return `${id ? `[${id}] ` : ''}${title}`;
	}

}


module.exports = new Util();
