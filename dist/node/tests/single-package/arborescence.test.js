"use strict";

var _arborescence = _interopRequireDefault(require("../../helpers/arborescence"));

var _paths = _interopRequireDefault(require("../../helpers/paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Single package - Arborescence tests
//--------------------------------------------------------
_arborescence.default.validate({
  root: _paths.default.project.root
});