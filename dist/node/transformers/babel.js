"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _babelJest = _interopRequireDefault(require("babel-jest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Babel transformer
//--------------------------------------------------------
var _default = _babelJest.default.createTransformer({
  presets: [[require.resolve('@babel/preset-env'), {
    targets: {
      node: 'current'
    }
  }]]
});

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;