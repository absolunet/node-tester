"use strict";

exports.default = void 0;

var _joi = _interopRequireWildcard(require("@hapi/joi"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//--------------------------------------------------------
//-- Data validation
//--------------------------------------------------------

/**
 * Data validation helper.
 *
 * @hideconstructor
 */
class DataValidationHelper {
  /**
   * Absolute path {@link https://hapi.dev/family/joi/ Joi schema}.
   *
   * @type {Joi.StringSchema}
   */
  get absolutePath() {
    return _joi.default.string().pattern(/^\//u, 'absolute path');
  }
  /**
   * Variable name {@link https://hapi.dev/family/joi/ Joi schema}.
   *
   * @type {Joi.StringSchema}
   */


  get variableName() {
    return _joi.default.string().pattern(/^[a-z]\w+$/ui, 'variable name');
  }
  /**
   * Validate method argument.
   *
   * @param {string} label - Name of the argument.
   * @param {*} value - Value of the argument.
   * @param {Joi.Schema} schema - {@link https://hapi.dev/family/joi/ Joi schema}.
   */


  argument(label, value, schema) {
    const {
      error
    } = _joi.default.object({
      [label]: schema
    }).validate({
      [label]: value
    });

    if (error) {
      throw new _joi.ValidationError(error.annotate(), error.details, error._original);
    }
  }

}

var _default = new DataValidationHelper();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;