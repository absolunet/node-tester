//--------------------------------------------------------
//-- Tester
//--------------------------------------------------------
"use strict"; // eslint-disable-line strict

const { tester } = require("@absolunet/tester-fixed");

tester.init({
	repositoryType: "single-package",
	packageType: "simple",
	nodeType: "commonjs",
});
