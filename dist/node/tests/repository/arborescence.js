"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _arborescence = _interopRequireDefault(require("../../helpers/arborescence"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Repository - Arborescence tests
//--------------------------------------------------------
var _default = options => {
  _arborescence.default.validate(options);
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;