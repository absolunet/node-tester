"use strict";

exports.default = void 0;

var _eslint = _interopRequireDefault(require("../../helpers/eslint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Lint JSON runner - Run
//--------------------------------------------------------
const JSON_CONFIG = require.resolve('@absolunet/eslint-config-json');

var _default = ({
  testPath
}) => {
  return _eslint.default.run(testPath, {
    baseConfig: {
      'extends': JSON_CONFIG
    },
    resolvePluginsRelativeTo: JSON_CONFIG,
    extensions: ['.json'],
    useEslintrc: false
  });
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;