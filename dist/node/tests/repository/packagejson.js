"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _environment = _interopRequireDefault(require("../../helpers/environment"));

var _packagejson = _interopRequireDefault(require("../../helpers/packagejson"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Multi package - package.json tests
//--------------------------------------------------------
var _default = () => {
  //-- Multi package
  if (_environment.default.repositoryType === _environment.default.REPOSITORY_TYPE.multiPackage) {
    _packagejson.default.validateMulti(); //-- Rest

  } else {
    _packagejson.default.validatePackage();
  }
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;