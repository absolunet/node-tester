"use strict";

var _arborescence = _interopRequireDefault(require("../../helpers/arborescence"));

var _environment = _interopRequireDefault(require("../../helpers/environment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Repository - Arborescence tests
//--------------------------------------------------------
//-- Single and multi package
_arborescence.default.validate(); //-- Multi package


if (_environment.default.repositoryType === _environment.default.REPOSITORY_TYPE.multiPackage) {
  //-- For every package
  Object.values(_environment.default.projectSubpackages).forEach(subpackageRoot => {
    _arborescence.default.validate({
      root: subpackageRoot,
      subpackage: true
    });
  });
}