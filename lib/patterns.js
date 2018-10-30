//--------------------------------------------------------
//-- Patterns
//--------------------------------------------------------
'use strict';


class Patterns {

	//-- All JS files
	get js() {
		return  ['**/*.js', '!node_modules/**/*'];
	}

	//-- All JSON files
	get json() {
		return  ['**/*.json', '!node_modules/**/*', '!package-lock.json'];
	}

	//-- All YAML files
	get yaml() {
		return  ['**/*.{yaml,yml}', '!node_modules/**/*'];
	}

	//-- All SCSS files
	get scss() {
		return  ['**/*.scss', '!node_modules/**/*'];
	}

	//-- All BASH files
	get bash() {
		return  ['**/*.sh', '!node_modules/**/*'];
	}

	//-- All EditorConfig files
	get editorconfig() {
		return  ['**!(node_modules)/*', '!.git/*', '*', '!package-lock.json', '!readme.md'];
	}

}


module.exports = new Patterns();
