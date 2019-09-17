"use strict";

var _semver = _interopRequireDefault(require("semver"));

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _arborescence = _interopRequireDefault(require("../../helpers/arborescence"));

var _environment = _interopRequireDefault(require("../../helpers/environment"));

var _paths = _interopRequireDefault(require("../../helpers/paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Repository - lerna.json tests
//--------------------------------------------------------
//-- Multi package
if (_environment.default.repositoryType === _environment.default.REPOSITORY_TYPE.multiPackage) {
  const FILE = 'lerna.json';
  describe(`Validate ${_environment.default.getReadablePath(_paths.default.project.root)}/${FILE}`, () => {
    test(`Ensure '${FILE}' is valid`, () => {
      _arborescence.default.fileExists(FILE, _paths.default.project.root);

      const config = _fss.default.readJson(`${_paths.default.project.root}/${FILE}`);

      expect(config.version, 'Version must be valid').toBe(_semver.default.valid(config.version));
      expect(config.packages, 'Packages must must be valid').toStrictEqual(['packages/*']);
    });
  });
} else {
  describe.skip();
}