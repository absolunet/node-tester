//--------------------------------------------------------
//-- Patterns
//--------------------------------------------------------
'use strict';


class Patterns {

	//-- All JS files
	get js() {
		return  ['**!(node_modules)/*.js', '*.js'];
	}

	//-- All JSON files
	get json() {
		return  ['**!(node_modules)/*.json', '*.json', '!package-lock.json'];
	}

	//-- All YAML files
	get yaml() {
		return  ['**!(node_modules)/*.{yaml,yml}', '*.{yaml,yml}'];
	}

	//-- All SCSS files
	get scss() {
		return  ['**!(node_modules)/*.scss', '*.scss'];
	}

	//-- All BASH files
	get bash() {
		return  ['**!(node_modules)/*.sh', '*.sh'];
	}

	//-- All EditorConfig files
	get editorconfig() {
		return  ['**!(node_modules)/*', '!.git/*', '*', '!package-lock.json'];
	}

}


module.exports = new Patterns();
