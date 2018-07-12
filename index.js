//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
/* eslint-disable class-methods-use-this */
'use strict';

const linters    = require('./lib/linters');
const npmPackage = require('./lib/npm-package');
const patterns   = require('./lib/patterns');






class Tester {

	//-- All patterns
	get all() {
		return patterns;
	}

	//-- Linters
	get lint() {
		return linters;
	}

	//-- npm package
	get npmPackage() {
		return npmPackage;
	}

}


module.exports = new Tester();
