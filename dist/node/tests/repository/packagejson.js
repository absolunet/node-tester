"use strict";

exports.default = void 0;

var _environment = _interopRequireDefault(require("../../helpers/environment"));

var _packagejson = _interopRequireDefault(require("../../helpers/packagejson"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Multi package - package.json tests
//--------------------------------------------------------
var _default = () => {
  //-- Single package
  if (_environment.default.repositoryType === _environment.default.REPOSITORY_TYPE.singlePackage) {
    _packagejson.default.validatePackage(); //-- Multi package

  } else if (_environment.default.repositoryType === _environment.default.REPOSITORY_TYPE.multiPackage) {
    _packagejson.default.validateMulti(); //-- For every package


    Object.values(_environment.default.projectSubpackages).forEach(subpackageRoot => {
      _packagejson.default.validatePackage({
        directoryPath: subpackageRoot
      });
    });
  }
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;