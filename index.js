//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
'use strict';

const ava = require('ava');

const linters    = require('./lib/linters');
const npmPackage = require('./lib/npm-package');
const patterns   = require('./lib/patterns');






class Tester {

	//-- Expose ava
	get ava() {
		return ava;
	}


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
