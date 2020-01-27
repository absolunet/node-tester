"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eslint = _interopRequireDefault(require("../../helpers/eslint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Lint JS runner - Run
//--------------------------------------------------------
var _default = ({
  testPath
}) => {
  return _eslint.default.run(testPath);
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;